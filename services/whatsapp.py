import os
import requests
from fastapi import FastAPI, Form
from fastapi.responses import PlainTextResponse
from twilio.twiml.messaging_response import MessagingResponse
from dotenv import load_dotenv
import uvicorn

load_dotenv()
URL = "https://studysyncs.xyz/services/chat"
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")  # e.g. "whatsapp:+1234567890"

app = FastAPI()

@app.post("/webhook", response_class=PlainTextResponse)
async def whatsapp_webhook(From: str = Form(...), Body: str = Form(...)):
    payload = {"message": Body}
    try:
        resp = requests.post(URL, json=payload, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        reply_text = data.get("reply") if isinstance(data, dict) else resp.text
    except Exception:
        reply_text = "Sorry, I couldn't process your message right now."

    twiml = MessagingResponse()
    msg = twiml.message()
    msg.body(reply_text)
    msg.from_(TWILIO_WHATSAPP_NUMBER)
    msg.to(From)
    return str(twiml)

if __name__ == "__main__":
    # run with: python whatsapp.py
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))