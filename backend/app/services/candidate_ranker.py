import google.generativeai as genai
from app.config.settings import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def rank_candidates(job_description: str, candidates: list):
    """
    candidates = [
        {"name": "A", "resume": "..."},
        {"name": "B", "resume": "..."}
    ]
    """

    results = []

    for candidate in candidates:

        prompt = f"""
        You are an ATS (Applicant Tracking System).

        Compare this candidate with the job description.

        Return ONLY in this format:

        Name: {candidate['name']}
        Score: (0-100)
        Skills Match: [...]
        Missing Skills: [...]
        Recommendation: (Hire / Maybe / Reject)

        JOB DESCRIPTION:
        {job_description}

        CANDIDATE RESUME:
        {candidate['resume']}
        """

        response = model.generate_content(prompt)

        results.append({
            "name": candidate["name"],
            "analysis": response.text
        })

    return sorted(results, key=lambda x: x["analysis"], reverse=True)