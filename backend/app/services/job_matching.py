import google.generativeai as genai
from app.config.settings import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def match_resume_job(resume_text: str, job_description: str):

    prompt = f"""
    You are an AI HR assistant.

    Compare Resume and Job Description.

    Return STRICT JSON only:

    {{
      "score": number (0-100),
      "matching_skills": [],
      "missing_skills": [],
      "recommendation": "Hire / Maybe / Reject",
      "reason": "short explanation"
    }}

    RESUME:
    {resume_text}

    JOB DESCRIPTION:
    {job_description}
    """

    response = model.generate_content(prompt)

    return response.text