import json
import re
from typing import Optional, List, Dict

try:
    import google.generativeai as genai
    from app.config.settings import GEMINI_API_KEY
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")
    _HAS_GENAI = True
except Exception:
    model = None
    _HAS_GENAI = False


def _extract_first_regex(pattern: str, text: str) -> Optional[str]:
    m = re.search(pattern, text, re.IGNORECASE)
    return m.group(1).strip() if m else None


def _extract_all_regex(pattern: str, text: str) -> List[str]:
    return [m.strip() for m in re.findall(pattern, text, re.IGNORECASE)]


def parse_basic_resume(resume_text: str, job_required_skills: Optional[str] = None) -> Dict:
    # Emails
    emails = _extract_all_regex(r"[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}", resume_text)
    email = emails[0] if emails else None

    # Phones
    phones = _extract_all_regex(r"(\+?\d[\d\-\s]{7,}\d)", resume_text)
    phone = phones[0] if phones else None

    # Name detection: try several heuristics
    lines = [l.strip() for l in resume_text.splitlines() if l.strip()]
    name = None
    if lines:
        candidate = lines[0]
        # If first line contains email/phone, try to extract name before the email
        if '@' in candidate:
            # prefer a leading name segment before the email address
            email_name_match = re.match(
                r"^([A-Za-z][A-Za-z'’\.\-]+(?:\s+[A-Za-z][A-Za-z'’\.\-]+){1,3})\s+[\w\.-]+@[\w\.-]+\.[A-Za-z]{2,}",
                candidate,
            )
            if email_name_match:
                name = email_name_match.group(1).strip()
            else:
                part = candidate.split('@')[0]
                part = re.split(r"[|\-–—]", part)[0].strip()
                tokens = [t for t in part.split() if re.match(r"^[A-Za-z][A-Za-z'’\.\-]+$", t)]
                if len(tokens) >= 2:
                    name = " ".join(tokens[:3])
        elif 2 <= len(candidate.split()) <= 4 and any(c.isalpha() for c in candidate):
            name = candidate

    # fallback: look for first line with two capitalized words
    if not name:
        for l in lines[:20]:
            if re.match(r"^[A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+", l):
                name = l
                break

    # Skills: look for 'Skills' section
    skills = []
    skills_section = re.search(r"skills[:\n\r]+([\s\S]{0,500})", resume_text, re.IGNORECASE)
    if skills_section:
        block = skills_section.group(1)
        skills = re.split(r"[,;\n\r\|]+", block)
        skills = [s.strip() for s in skills if s.strip()]

    # fallback: extract capitalized tokens of known techs
    if not skills:
        common = [
            "python","java","javascript","typescript","react","node","django","flask",
            "sql","postgres","mysql","aws","azure","gcp","docker","kubernetes","tensorflow","scikit-learn"
        ]
        for kw in common:
            if re.search(rf"\b{re.escape(kw)}\b", resume_text, re.IGNORECASE):
                skills.append(kw)
        skills = list(dict.fromkeys(skills))

    # Experience years
    years = None
    y = _extract_first_regex(r"(\d+)\+?\s+years", resume_text)
    if y:
        try:
            years = int(y)
        except Exception:
            years = None

    # Education summary (improved patterns)
    edu_matches = _extract_all_regex(r"(B\.E|BE|B\.Tech|BTech|Bachelor|B\.Sc|BSc|Master|M\.Sc|MSc|MBA|PhD|Doctor)[^\n\r]{0,120}", resume_text)
    education = ", ".join(dict.fromkeys(edu_matches)) if edu_matches else None
    # Specific degree fallback: look for degree abbreviations like B.E, B.Tech explicitly
    if not education:
        m = re.search(r"(B\.?E|B\.?Tech|Bachelor)[^\n\r]{0,80}", resume_text, re.IGNORECASE)
        if m:
            education = m.group(0).strip()

    # Certifications / Projects
    certs = _extract_all_regex(r"(Certified[^\n\r]+|Certificate[^\n\r]+)", resume_text)
    projects = _extract_all_regex(r"(Project[s]?:[^\n\r]+)", resume_text)

    # Location
    location = _extract_first_regex(r"Location[:\s]+([^\n\r,]+)", resume_text) or None

    # Skill matching vs job
    matched_skills = []
    job_skills = []
    if job_required_skills:
        job_skills = [s.strip().lower() for s in re.split(r"[,;]+", job_required_skills) if s.strip()]
        for s in skills:
            if s and any(js in s.lower() or s.lower() in js for js in job_skills):
                matched_skills.append(s)

    return {
        "name": name,
        "email": email,
        "phone": phone,
        "skills": skills,
        "matched_skills": matched_skills,
        "education": education,
        "experience_years": years,
        "certifications": certs,
        "projects": projects,
        "location": location,
        "job_skills": job_skills,
    }


def compute_score(parsed: Dict) -> Dict:
    # Weights
    weights = {"skills": 0.55, "experience": 0.2, "education": 0.15, "extras": 0.1}

    # Skills score
    skill_score = 0.0
    if parsed.get("job_skills"):
        req = len(parsed["job_skills"]) or 1
        matched = len(parsed.get("matched_skills", []))
        skill_score = matched / req
    else:
        detected = len(parsed.get("skills", []))
        skill_score = min(1.0, detected / 8)

    # Experience score
    years = parsed.get("experience_years") or 0
    exp_score = min(1.0, years / 10)

    # Education score
    edu = parsed.get("education") or ""
    edu_score = 0.0
    if re.search(r"phd|doctor", edu, re.IGNORECASE):
        edu_score = 1.0
    elif re.search(r"master|m\.|mba", edu, re.IGNORECASE):
        edu_score = 0.9
    elif re.search(r"bachelor|b\.sc|b\.|bs", edu, re.IGNORECASE):
        edu_score = 0.7

    # Extras: certifications/projects
    extras = 0.0
    if parsed.get("certifications"):
        extras += 0.5
    if parsed.get("projects"):
        extras += 0.5

    total = (
        skill_score * weights["skills"] +
        exp_score * weights["experience"] +
        edu_score * weights["education"] +
        extras * weights["extras"]
    )

    score = int(round(total * 100))

    # Job fit % roughly same as skills match scaled
    job_fit_pct = int(round(skill_score * 100))

    # Recommendation rules
    if score >= 85 and job_fit_pct >= 80:
        rec = "Highly Recommended"
    elif score >= 70 and job_fit_pct >= 60:
        rec = "Recommended"
    elif score >= 50:
        rec = "Consider"
    else:
        rec = "Not Recommended"

    return {"score": score, "job_fit": job_fit_pct, "recommendation": rec}


def analyze_resume(resume_text: str, job: object = None):
    """
    Robust resume analysis: tries AI model if available, otherwise uses local heuristics.
    Always returns a complete structured dict with fallbacks.
    """
    model_text = None
    ai_parsed = {}

    # Attempt to call AI model if configured
    if _HAS_GENAI and model is not None:
        try:
            job_block = ""
            if job is not None:
                job_block = f"Job Title: {job.title}\nJob Description: {job.description}\nRequired Skills: {job.required_skills}\n"

            prompt = f"You are an AI recruiter. Extract structured JSON from the resume. Resume:\n{resume_text}\nReturn JSON with fields name,email,phone,skills,education,experience_years,certifications,projects,location,reason"
            resp = model.generate_content(prompt, temperature=0.0, max_output_tokens=800)
            model_text = resp.text
            # try to extract JSON
            match = re.search(r"\{[\s\S]*\}", model_text)
            if match:
                try:
                    ai_parsed = json.loads(match.group(0))
                except Exception:
                    ai_parsed = {}
        except Exception:
            model_text = None

    # Local parsing
    job_skills = job.required_skills if job is not None and getattr(job, "required_skills", None) else None
    parsed = parse_basic_resume(resume_text, job_required_skills=job_skills)

    # Merge AI parsed values when present
    merged_skills = ai_parsed.get("skills") or parsed.get("skills") or []
    merged_job_skills = parsed.get("job_skills", [])
    merged_matched_skills = ai_parsed.get("matched_skills") or [
        s for s in merged_skills
        if s and any(js in s.lower() or s.lower() in js for js in merged_job_skills)
    ]

    merged = {
        "name": ai_parsed.get("name") or parsed.get("name") or "Unknown Candidate",
        "email": ai_parsed.get("email") or parsed.get("email"),
        "phone": ai_parsed.get("phone") or parsed.get("phone"),
        "skills": merged_skills,
        "matched_skills": merged_matched_skills,
        "education": ai_parsed.get("education") or parsed.get("education"),
        "experience_years": ai_parsed.get("experience_years") or parsed.get("experience_years"),
        "certifications": ai_parsed.get("certifications") or parsed.get("certifications"),
        "projects": ai_parsed.get("projects") or parsed.get("projects"),
        "location": ai_parsed.get("location") or parsed.get("location"),
    }

    scores = compute_score({**parsed, **{"job_skills": job_skills, "matched_skills": merged_matched_skills}})

    fallback_analysis = (
        f"Parsed {len(merged['skills'])} skills; matched {len(merged['matched_skills'])} of {len(parsed.get('job_skills', []))} job-required skills. "
        f"Estimated fit is {scores['job_fit']}%."
    )

    result = {
        "name": merged["name"],
        "email": merged["email"],
        "phone": merged["phone"],
        "skills": merged["skills"],
        "matched_skills": merged["matched_skills"],
        "job_skills": parsed.get("job_skills", []),
        "education": merged["education"],
        "experience_years": merged["experience_years"],
        "certifications": merged["certifications"],
        "projects": merged["projects"],
        "location": merged["location"],
        "score": scores["score"],
        "job_fit": scores["job_fit"],
        "recommendation": scores["recommendation"],
        "analysis": model_text or fallback_analysis,
    }

    return result
