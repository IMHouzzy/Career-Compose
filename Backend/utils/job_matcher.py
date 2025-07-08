import torch
from transformers import DistilBertTokenizer, DistilBertModel
from sklearn.metrics.pairwise import cosine_similarity
import mysql.connector
from mysql.connector import Error
import pickle
import os
import unicodedata
import re
from collections import Counter

# Initialize DistilBERT model and tokenizer once
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
model = DistilBertModel.from_pretrained('distilbert-base-uncased').eval()
model.to('cuda' if torch.cuda.is_available() else 'cpu')

# Cache file for job title embeddings
JOB_TITLE_CACHE = "job_title_embeddings.pkl"

def clean_text(text):
    """Clean and normalize text for embedding, handling Lithuanian diacritics."""
    if not text or not isinstance(text, str):
        return ""
    # Normalize Unicode characters to ASCII
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('ASCII')
    text = ' '.join(text.strip().split())  # Normalize whitespace
    text = text.lower()
    return text

def get_embedding(text):
    """Generate DistilBERT embedding for text."""
    text = clean_text(text)
    if not text:
        return None
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=64)
    inputs = {k: v.to(model.device) for k, v in inputs.items()}
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().cpu().numpy()

def extract_level(title):
    """Extract job level from title in English or Lithuanian, default to Mid."""
    title = clean_text(title)
    level_patterns = [
        (r'\binternship\b|\bpraktika\b|\bpraktikantas\b|\bpraktikantė\b', 'Internship'),
        (r'\bjunior\b|\bjaunesnysis\b|\bjaunesnioji\b|\bjaun.\b', 'Junior'),
        (r'\bmid\b|\bmid-level\b|\bvidurinis\b|\bvidurinioji\b|\bvid.\b', 'Mid'),
        (r'\bsenior\b|\bvyresnysis\b|\bvyresnioji\b|\bvyr.\b', 'Senior')
    ]
    for pattern, level in level_patterns:
        if re.search(pattern, title, re.IGNORECASE):
            return level
    return 'Mid'  # Default to Mid if no level specified

def get_lower_level(level):
    """Return the level one step below the given level."""
    level_hierarchy = {
        'Senior': 'Mid',
        'Mid': 'Junior',
        'Junior': 'Internship',
        'Internship': None  # No level below Internship
    }
    return level_hierarchy.get(level)

def get_primary_level(recommendations):
    """Determine the primary level by taking the mode of recommended levels."""
    if not recommendations:
        return 'Mid'  # Default if no recommendations
    levels = [rec.get('level', 'Mid').capitalize() for rec in recommendations
              if rec.get('level', 'Mid').capitalize() in ['Internship', 'Junior', 'Mid', 'Senior']]
    if not levels:
        return 'Mid'
    # Use Counter to find the most common level
    level_counts = Counter(levels)
    most_common = level_counts.most_common(1)[0][0]
    return most_common

def load_job_title_embeddings():
    """Load cached job title embeddings."""
    if os.path.exists(JOB_TITLE_CACHE):
        with open(JOB_TITLE_CACHE, 'rb') as f:
            return pickle.load(f)
    return {}

def save_job_title_embeddings(embeddings):
    """Save job title embeddings to file."""
    with open(JOB_TITLE_CACHE, 'wb') as f:
        pickle.dump(embeddings, f)

def find_relevant_jobs(job_recommendations, top_n=10):
    """Match job titles with level filtering (English or Lithuanian), including one level lower."""
    try:
        # Connect to database
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="pvp"
        )
        cursor = mydb.cursor(dictionary=True)
        cursor.execute("SELECT id_Jobs, title, description, company, city, salary, image FROM jobs")
        jobs = cursor.fetchall()

        if not job_recommendations or not isinstance(job_recommendations, list):
            print("No valid job recommendations provided.")
            return []

        # Determine primary level from recommendations
        primary_level = get_primary_level(job_recommendations)
        lower_level = get_lower_level(primary_level)
        allowed_levels = [primary_level]
        if lower_level:
            allowed_levels.append(lower_level)
        print(f"Primary level: {primary_level}, Allowed levels: {allowed_levels}")

        # Load cached job title embeddings
        cached_embeddings = load_job_title_embeddings()
        job_embeddings = []

        # Preprocess job titles, extract levels, and cache embeddings
        for job in jobs:
            job_id = job["id_Jobs"]
            job_title = clean_text(job.get("title", ""))
            if not job_title:
                continue

            job_level = extract_level(job_title)
            if job_level not in allowed_levels:
                continue  # Skip jobs not in allowed levels

            cache_key = f"{job_id}:{job_title[:50]}"
            if cache_key in cached_embeddings:
                title_emb = cached_embeddings[cache_key]
            else:
                title_emb = get_embedding(job_title)
                if title_emb is not None:
                    cached_embeddings[cache_key] = title_emb

            job_embeddings.append({"job": job, "title_emb": title_emb, "level": job_level})

        # Save updated embeddings
        save_job_title_embeddings(cached_embeddings)

        # Generate embeddings for recommended job titles
        rec_embeddings = []
        for rec in job_recommendations:
            rec_title = clean_text(rec.get("title", ""))
            rec_level = rec.get("level", "Mid").capitalize()
            if not rec_title or rec_level not in allowed_levels:
                continue
            rec_emb = get_embedding(rec_title)
            if rec_emb is not None:
                rec_embeddings.append({"embedding": rec_emb, "title": rec_title, "level": rec_level})

        if not rec_embeddings:
            print("No valid title embeddings generated from job recommendations.")
            return []

        # Track jobs with their highest similarity score
        job_scores = {}

        # Match jobs against recommendations
        for rec in rec_embeddings:
            for job_emb in job_embeddings:
                if job_emb["title_emb"] is None or job_emb["level"] not in allowed_levels:
                    continue

                job_id = job_emb["job"]["id_Jobs"]
                similarity = cosine_similarity([rec["embedding"]], [job_emb["title_emb"]])[0][0]
                similarity = float(similarity)  # Convert to Python float

                # Update job with highest similarity score
                if job_id not in job_scores or similarity > job_scores[job_id]["similarity"]:
                    job_scores[job_id] = {
                        "job": job_emb["job"],
                        "similarity": round(similarity, 4)
                    }

        # Convert to list and sort
        relevant = []
        for item in job_scores.values():
            job = item["job"].copy()  # Create a copy to avoid modifying original
            job["similarity"] = item["similarity"]  # Add similarity to job dict
            relevant.append(job)

        if not relevant:
            print("No matching jobs found for the specified levels.")
            return []

        relevant.sort(key=lambda x: x["similarity"], reverse=True)
        print(f"Found {len(relevant)} relevant jobs.")
        return relevant[:top_n]

    except Error as e:
        print(f"DB error: {e}")
        return []

    finally:
        if 'mydb' in locals() and mydb.is_connected():
            mydb.close()