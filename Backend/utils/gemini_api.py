import google.generativeai as genai
import os
import json
from dotenv import load_dotenv


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def analyze_text_with_gemini(text, language, selected_jobs):
    model = genai.GenerativeModel("gemini-2.0-flash")
    selected_jobs_prompt = f"and relevance to the targeted roles: {selected_jobs}" if selected_jobs else ""
    
    if language not in ["lt", "en"]:
        language = "en"  
        
    language_name = "Lithuanian" if language == "lt" else "English"

   
    selected_jobs_prompt1 = f"*ONLY* include skills that are relevant for the following roles: {selected_jobs}. Do not include irrelevant skills." if selected_jobs else ""


    prompt_skills = (
        "You are an expert in CV analysis, tasked with extracting all technical skills from a candidate's CV for job-matching purposes, including their proficiency levels.\n\n"

        "Analyze the following CV and extract a comprehensive list of all relevant technical skills. Include:\n"
        "- Programming languages (e.g., Python, Java, C++, JavaScript, PHP).\n"
        "- Tools and platforms (e.g., Docker, AWS, Excel, Tableau).\n"
        "- Frameworks and libraries (e.g., React, TensorFlow).\n"
        "- Databases (e.g., SQL, NoSQL).\n"
        "- Other technical skills (e.g., DevOps, cybersecurity, QA testing).\n"
        "- {selected_jobs_prompt1}\n"
        "- Be thorough—look for technical skills mentioned explicitly or implied through experience and achievements.\n"
        "- Exclude soft skills (e.g., communication, teamwork) and other non-technical skills (e.g., project management, Agile methodologies) from the 'skills' list.\n"
        f"- YOU MUST WRITE YOUR RESPONSE IN {language_name.upper()} LANGUAGE. This is extremely important.\n"
        "Format your response as *valid JSON*. The object must include exactly the following key:\n\n"

        "{{\n"
        "  \"skills\": [\n"
        "    {{\"skill\": \"Technical skill one\"}},\n"
        "    {{\"skill\": \"Technical skill two\"}},\n"
        "    {{\"skill\": \"Technical skill three\"}}\n"
        "  ]\n"
        "}}\n\n"

        "Here is the CV content:\n{text}"
    )

    response_skills = model.generate_content(prompt_skills.format(text=text, selected_jobs_prompt1=selected_jobs_prompt1))
    try:
        cleaned = response_skills.text.strip("```json").strip("```").strip()
        skills_result = json.loads(cleaned)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response for skills as JSON"}
    prompt_is_it = (
        "You are an expert in IT industry recruitment and CV analysis. Your task is to determine if the following CV "
        "belongs to an IT professional or someone with significant IT background.\n\n"
        
        "An IT professional would have skills, experiences, education, or certifications related to:\n"
        "- Programming languages (e.g., Python, Java, C++, JavaScript, PHP, etc.)\n"
        "- Software development (web, mobile, desktop applications)\n"
        "- Database management (SQL, NoSQL)\n"
        "- System administration or DevOps\n"
        "- Networking or cloud infrastructure\n"
        "- Cybersecurity\n"
        "- Data science, machine learning, or AI\n"
        "- IT support or technical support\n"
        "- QA testing or test automation\n"
        "- UI/UX design for digital products\n"
        "- Game development\n"
        "- IT project management\n\n"
        
        "Carefully analyze the CV and determine if it belongs to an IT professional or someone transitioning to IT. "
        "Make your determination based on:\n"
        "- Technical skills mentioned\n"
        "- Job titles and descriptions\n"
        "- Education or training in IT/Computer Science\n"
        "- IT certifications\n"
        "- Projects or achievements in technology\n\n"

        "- Only add the skill if it applies only for IT industry related jobs\n\n"

        "Format your response as *valid JSON* with the following structure:\n"
        "{{\n"
        "  \"is_IT\": true/false,\n"
        "}}\n\n"
        
        "Set is_IT to true ONLY if the person clearly has IT background or is qualified for entry-level IT positions. "
        "Set it to false for all other professions or if you're uncertain.\n\n"
        
        "Here is the CV content:\n{text}"
    )
    
    response_is_it = model.generate_content(prompt_is_it.format(text=text))
    try:
        cleaned = response_is_it.text.strip("```json").strip("```").strip()
        is_it_result = json.loads(cleaned)
        if "is_IT" not in is_it_result:
            is_it_result = {"is_IT": False, "explanation": "Could not determine IT status"}
    except json.JSONDecodeError:
        is_it_result = {"is_IT": False, "explanation": "Failed to parse AI response for IT field determination"}

    prompt_job_recommendations = (
        "You are an expert in job-matching and career advising, tasked with recommending the top five job roles that best match the candidate's skills.\n\n"

        "Analyze the following list of technical skills extracted from the candidate's CV and recommend five job roles that align with their capabilities. For each job, specify:\n"
        "- The job title.\n"
        "- The experience level (internship, junior, mid, or senior), based on the depth and breadth of the technical skills provided.\n"
        "- A match percentage (out of 100), reflecting how well the candidate's technical skills align with the job requirements. Use a realistic scale of 0-100, considering skill overlap and job demands.\n"
        "- A brief description (2-3 sentences) explaining why this job is a good match, referencing specific technical skills from the provided list and how they apply to the role. Write like you are talking to the user.\n"
        "- A list of technical skills from the CV that match the job requirements (from the 'skills' list).\n"
        "- A list of all technical skills from the CV that are relevant but missing for the job requirements, based on typical industry standards for the job title and level.\n"
        "- If the candidate's skills suggest an IT background, prioritize IT-related roles; otherwise, recommend roles from relevant industries.\n"
        "- Ensure the jobs are specific (e.g., 'Frontend Developer' instead of 'Developer') and feasible for the candidate's skill level.\n"
        f"- YOU MUST WRITE YOUR RESPONSE IN {language_name.upper()} LANGUAGE. This is extremely important.\n"
        "Format your response as *valid JSON*. The object must include exactly the following key:\n\n"

        "{{\n"
        "  \"job_recommendations\": [\n"
        "    {{\"title\": \"Job title\", \"level\": \"junior/mid/senior/internship\", \"match_percentage\": number, "
        "\"description\": \"Why this job is a good match\", \"matched_skills\": [\"Technical skill one\", \"Technical skill two\"], "
        "\"missing_skills\": [\"Missing technical skill one from CV\", \"Missing technical skill two from CV\"]}},\n"
        "    {{\"title\": \"Job title\", \"level\": \"junior/mid/senior/internship\", \"match_percentage\": number, "
        "\"description\": \"Why this job is a good match\", \"matched_skills\": [\"Technical skill one\", \"Technical skill two\"], "
        "\"missing_skills\": [\"Missing technical skill one from CV\", \"Missing technical skill two from CV\"]}}\n"
        "  ]\n"
        "}}\n\n"

        "Here is the list of technical skills:\n{skills}\n\n"
        "Here is the CV content for additional context:\n{text}"
    )


    response_job_recommendations = model.generate_content(
        prompt_job_recommendations.format(skills=json.dumps([s["skill"] for s in skills_result["skills"]]), text=text)
    )
    try:
        cleaned = response_job_recommendations.text.strip("```json").strip("```").strip()
        job_recommendations_result = json.loads(cleaned)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response for job recommendations as JSON"}


   
    prompt_career_path = (
        "You are an expert in career planning and development, tasked with providing long-term career path recommendations based on the candidate's CV.\n\n"

        "Analyze the following CV and recommend three potential career paths the candidate could pursue over the next 5-10 years. For each path, provide:\n"
        "- A career path title (e.g., 'Transition to Data Science').\n"
        "- A description (3-4 sentences) explaining why this path suits the candidate, referencing their skills, experience, and {selected_jobs_prompt}. Write like you are talking to the user.\n"
        "- A list of 3-5 specific steps to achieve this career path, including education, certifications, or experience needed.\n"
        f"- YOU MUST WRITE YOUR RESPONSE IN {language_name.upper()} LANGUAGE. This is extremely important.\n"
        "Format your response as *valid JSON*. The object must include exactly the following key:\n\n"

        "{{\n"
        "  \"career_paths\": [\n"
        "    {{\"path\": \"Career path one\", \"description\": \"Why this path suits the candidate\", \"steps\": [\"Step one\", \"Step two\", \"Step three\"]}},\n"
        "    {{\"path\": \"Career path two\", \"description\": \"Why this path suits the candidate\", \"steps\": [\"Step one\", \"Step two\", \"Step three\"]}},\n"
        "    {{\"path\": \"Career path three\", \"description\": \"Why this path suits the candidate\", \"steps\": [\"Step one\", \"Step two\", \"Step three\"]}}\n"
        "    {{\"path\": \"Career path four\", \"description\": \"Why this path suits the candidate\", \"steps\": [\"Step one\", \"Step two\", \"Step three\"]}}\n"
        "  ]\n"
        "}}\n\n"

        "Here is the CV content:\n{text}"
    )

    response_career_path = model.generate_content(prompt_career_path.format(text=text, selected_jobs_prompt=selected_jobs_prompt))
    try:
        cleaned = response_career_path.text.strip("```json").strip("```").strip()
        career_path_result = json.loads(cleaned)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response for career path recommendations as JSON"}

    prompt_soft_skills = (
        "You are an expert in soft skills assessment and CV analysis, tasked with evaluating the candidate-s soft skills and providing feedback on how they are presented.\n\n"

        "Analyze the following CV and identify up to 5 soft skills demonstrated through the candidate's experience, achievements, or descriptions. For each skill, provide:\n"
        "- The soft skill (e.g., 'communication', 'leadership').\n"
        "- Evidence from the CV that supports this skill (quote or paraphrase specific parts).\n"
        "- Feedback (3-4 sentences) on how well the skill is presented and how to improve its presentation to make it more compelling to employers.\n"
        f"- YOU MUST WRITE YOUR RESPONSE IN {language_name.upper()} LANGUAGE. This is extremely important.\n"
        "Format your response as *valid JSON*. The object must include exactly the following key:\n\n"

        "{{\n"
        "  \"soft_skills\": [\n"
        "    {{\"skill\": \"Soft skill one\", \"evidence\": \"Evidence from CV\", \"feedback\": \"Feedback on presentation\"}},\n"
        "    {{\"skill\": \"Soft skill two\", \"evidence\": \"Evidence from CV\", \"feedback\": \"Feedback on presentation\"}}\n"
        "  ]\n"
        "}}\n\n"

        "Here is the CV content:\n{text}"
    )

    response_soft_skills = model.generate_content(prompt_soft_skills.format(text=text))
    try:
        cleaned = response_soft_skills.text.strip("```json").strip("```").strip()
        soft_skills_result = json.loads(cleaned)
    except json.JSONDecodeError:
        return {"error": "Failed to parse AI response for soft skills analysis as JSON"}


    
    final_result = {
        "skills": skills_result["skills"],
        "is_IT": is_it_result["is_IT"],
        "job_recommendations": job_recommendations_result["job_recommendations"],
        "career_paths": career_path_result["career_paths"],
        "soft_skills": soft_skills_result["soft_skills"],
    }

    return final_result
def cv_analyze_for_job_text_with_gemini(text, jobDescription, language):

    model = genai.GenerativeModel("gemini-2.0-flash")

    
    if language not in ["lt", "en"]:
        language = "en"  
        
    language_name = "Lithuanian" if language == "lt" else "English"

    prompt_cv_tips = (
        "You are the world's leading expert in CV analysis, job fit evaluation, and professional development coaching. "
        "Your job is to analyze a CV against a specific job description and deliver brutal, actionable, and honest feedback.\n\n"
        "Speak directly to the candidate who wrote this CV—do NOT speak about them in third person. Use a professional, no-nonsense tone focused on clarity, results, and value.\n\n"
        "You must:\n"
        f"- Evaluate the CV structure, clarity, formatting, keyword alignment, and content quality.\n"
        "- Focus specifically on how well this CV aligns with the provided job description.\n"
        "- Identify 6 non-generic, actionable improvement tips, each with a clear explanation.\n"
        "- Provide detailed reasoning per tip (3-4 sentences minimum).\n"
        "- Avoid vague BS like 'improve layout'. Be concrete. E.g., 'Add metrics like X% increase in Y to prove impact'.\n\n"
        "In addition to the tips, you must also provide:\n"
        "- A field called \"match_level\": one of \"high\", \"medium\", or \"low\", indicating the overall chance the candidate has based on this CV. Be very routhless and accurate dont respond vith gereric BS.\n"
        "- A field called \"summary_analysis\": a concise (3-4 sentence) evaluation explaining what's strong in the CV, what's lacking, and what needs to improve to land this job.\n\n"
        f"- YOU MUST WRITE YOUR RESPONSE IN {language_name.upper()}.\n\n"
        "Format the entire output as *ONLY VALID JSON* with exactly this structure:\n"
        "{\n"
        "  \"cv_tips\": [\n"
        "    {\"tip\": \"Tip one\", \"description\": \"Long description for tip one\"},\n"
        "    {\"tip\": \"Tip two\", \"description\": \"Long description for tip two\"},\n"
        "    {\"tip\": \"Tip three\", \"description\": \"Long description for tip three\"},\n"
        "    {\"tip\": \"Tip four\", \"description\": \"Long description for tip four\"},\n"
        "    {\"tip\": \"Tip five\", \"description\": \"Long description for tip five\"},\n"
        "    {\"tip\": \"Tip six\", \"description\": \"Long description for tip six\"}\n"
        "  ],\n"
        "  \"match_level\": \"high\" | \"medium\" | \"low\",\n"
        "  \"summary_analysis\": \"Short 3-4 sentence summary explaining why this match level was chosen, what's strong and what must improve.\"\n"
        "}\n\n"
        f"Here is the CV content:\n{text}\n"
        f"Here is the job description:\n{jobDescription}"
    )

    try:
        response_cv_tips = model.generate_content(prompt_cv_tips)
        print(f"Raw Gemini response: {response_cv_tips.text}")
        
        import re
        json_match = re.search(r'{.*}', response_cv_tips.text, re.DOTALL)

        if not json_match:
            print(f"Error: Could not extract JSON from Gemini response: {response_cv_tips.text}")
            return {"error": "Gemini response did not contain valid JSON."}

        cleaned = json_match.group(0)
        cv_tips_result = json.loads(cleaned)

        if not all(k in cv_tips_result for k in ["cv_tips", "match_level", "summary_analysis"]):
            print(f"Error: Missing required keys in Gemini response: {cv_tips_result}")
            return {"error": f"Missing expected fields in AI response: {cv_tips_result}"}

        if not isinstance(cv_tips_result["cv_tips"], list) or len(cv_tips_result["cv_tips"]) != 6:
            print(f"Error: Invalid cv_tips structure or length: {cv_tips_result['cv_tips']}")
            return {"error": "Invalid cv_tips structure or incorrect number of tips"}

        for tip in cv_tips_result["cv_tips"]:
            if not all(k in tip for k in ["tip", "description"]):
                print(f"Error: Invalid tip structure: {tip}")
                return {"error": f"Invalid tip structure: {tip}"}

        return cv_tips_result

    except json.JSONDecodeError as e:
        print(f"Error parsing Gemini response as JSON: {str(e)}, Response: {response_cv_tips.text}")
        return {"error": f"Failed to parse AI response as JSON: {str(e)}"}
    except Exception as e:
        print(f"Error in Gemini API call: {str(e)}")
        return {"error": f"Failed to analyze CV: {str(e)}"}
