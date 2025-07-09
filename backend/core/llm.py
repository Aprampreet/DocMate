import os
import json
import re
import requests

# Load Groq credentials from environment
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


def clean_llm_json(text: str) -> dict:
    """
    Extract and parse JSON from Groq's LLM response safely.
    """
    # Remove markdown/code block markers
    text = re.sub(r"```(?:json)?", "", text).replace("```", "").strip()

    # Try to extract JSON block
    match = re.search(r"{.*}", text, re.DOTALL)
    if not match:
        raise Exception("❌ Could not extract valid JSON from LLM response.")

    try:
        raw = json.loads(match.group())

        return {
            "report_test_name": raw.get("report_test_name") or "Unknown",
            "symptoms": ", ".join(raw.get("symptoms", [])) if isinstance(raw.get("symptoms"), list) else (raw.get("symptoms") or "No symptoms found."),
            "precautions": ", ".join(raw.get("precautions", [])) if isinstance(raw.get("precautions"), list) else (raw.get("precautions") or "No precautions provided."),
            "emergency": raw.get("emergency") or "No",
            "doctor_specialization": raw.get("doctor_specialization") if isinstance(raw.get("doctor_specialization"), str) else (raw.get("doctor_specialization")[0] if raw.get("doctor_specialization") else "General Physician")
        }

    except json.JSONDecodeError as e:
        raise Exception(f"❌ Error parsing Groq JSON: {e}")


def get_report_info(extracted_text: str) -> dict:
    """
    Sends extracted OCR text to Groq LLM and receives structured medical data.
    """
    prompt = f"""
You are a professional medical assistant AI.

From the following OCR medical report, extract and return ONLY pure valid JSON without any extra explanation or markdown.

JSON structure to return (exactly):

{{
  "report_test_name": string,
  "symptoms": [list of symptoms like "Fatigue", "Fever"],   cannot be empty
  "precautions": [list of precautions like "Drink water", "Avoid alcohol"],  cannot be empty
  "emergency": "Yes" or "No",
  "doctor_specialization": string (only one specialization like "Cardiologist")
}}

OCR Report:
\"\"\"
{extracted_text}
\"\"\"
"""

    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct",
        "messages": [{"role": "user", "content": prompt}]
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=payload)
    if not response.ok:
        raise Exception("❌ Groq API request failed: " + response.text)

    try:
        content = response.json()["choices"][0]["message"]["content"]
        return clean_llm_json(content)
    except Exception as e:
        print("📦 Raw Groq Response:\n", response.text)
        raise Exception(f"❌ Error parsing Groq response: {e}")
