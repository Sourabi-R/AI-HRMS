SKILLS_DB = [
    "python",
    "fastapi",
    "machine learning",
    "deep learning",
    "sql",
    "pandas",
    "numpy",
    "nlp",
    "ai",
    "tensorflow",
    "pytorch"
]

def analyze_resume(text: str):
    text = text.lower()

    found_skills = []
    score = 0

    for skill in SKILLS_DB:
        if skill in text:
            found_skills.append(skill)
            score += 10

    score = min(score, 100)

    if score >= 80:
        recommendation = "Hire"
        reason = "Strong AI/ML skill match"
    elif score >= 50:
        recommendation = "Consider"
        reason = "Moderate skill match"
    else:
        recommendation = "Reject"
        reason = "Insufficient relevant skills"

    return {
        "score": score,
        "skills": found_skills,
        "recommendation": recommendation,
        "reason": reason
    }