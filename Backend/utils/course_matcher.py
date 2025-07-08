# somewhere central (e.g. a utils module)
import unicodedata, re, torch
from transformers import DistilBertTokenizer, DistilBertModel
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict




# init once
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
model     = DistilBertModel.from_pretrained('distilbert-base-uncased').eval()
device    = 'cuda' if torch.cuda.is_available() else 'cpu'
model.to(device)

def clean_text(text: str) -> str:
    text = unicodedata.normalize('NFKD', text or "").encode('ASCII','ignore').decode('ASCII')
    return re.sub(r'\s+',' ', text).strip().lower()

def get_embedding(text: str):
    text = clean_text(text)
    if not text: return None
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=64)
    inputs = {k:v.to(device) for k,v in inputs.items()}
    with torch.no_grad():
        out = model(**inputs)
    return out.last_hidden_state.mean(dim=1).squeeze().cpu().numpy()


# Optional: cache course embeddings in memory or on disk
_course_embedding_cache: Dict[int, List[float]] = {}

def find_relevant_courses(
    missing_skills: List[str],
    courses: List[Dict],
    top_n: int = 10
) -> List[Dict]:
    """
    - missing_skills: your list of unique missing‐skill strings
    - courses: list of dicts, each with keys including "id_Courses" and "Skills" (semicolon‐separated)
    """
    # 1) embed your missing skills and average them
    skill_embs = [get_embedding(s) for s in missing_skills]
    skill_embs = [e for e in skill_embs if e is not None]
    if not skill_embs:
        return []
    import numpy as np
    query_emb = np.mean(skill_embs, axis=0)

    # 2) for each course, get (or compute) its embedding
    scored = []
    for course in courses:
        cid    = course["id_Courses"]
        skills = course.get("Skills","")\
                       .strip().strip(";")\
                       .replace(";", " ")
        # cache lookup
        if cid in _course_embedding_cache:
            course_emb = _course_embedding_cache[cid]
        else:
            course_emb = get_embedding(skills)
            _course_embedding_cache[cid] = course_emb

        if course_emb is None:
            continue

        # 3) cosine similarity
        sim = float(cosine_similarity([query_emb], [course_emb])[0][0])
        scored.append({**course, "match_score": round(sim,4)})

    # 4) sort & return top_n
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    return scored[:top_n]