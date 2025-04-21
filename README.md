# Voxalize (Haskfest Hackathon)

A voice‑driven database chat platform that lets you connect to a SQL database, ask questions by voice or text, and get back answers, SQL queries, result tables, summaries and even a short title—all powered by llama LLM, LangChain and a modern React/Redux + Node.js/Express + MongoDB stack.

🏆 Winner of the Haskfest 36‑hour Hackathon at Nitte NMAM Institute

## 🚀 Features

- **Voice & Text Input**  
  – Real‑time speech‑to‑text with language selection  
  – Debounced completions & suggestions as you type  
- **Chat Interface**  
  – Animated chat messages with Framer‑Motion  
  – Auto‑scroll to latest message  
- **SQL Generation & Execution**  
  – ChatGroq LLM + LangChain agent generates `SELECT` queries  
  – Runs against your PostgreSQL/MySQL instance via SQLAlchemy  
  – Returns rows as JSON and displays in a table  
- **Natural‑Language Summaries**  
  – LLM‑generated concise summaries and 5–8 word titles  
  – Captured “thought process” logs for transparency  
- **Session History**  
  – Sidebar of past chat sessions with quick navigation  
- **Database Management**  
  – Create, update, delete DB connections in Dashboard  
- **Auth & Profile**  
  – Sign up, log in, reset password flows  
  – Profile image upload with progress indicator  

## 📦 Tech Stack

- Frontend  
  React 19 · Vite · Tailwind · Redux Toolkit · React Router · Framer‑Motion  
- Backend  
  Node.js · Express · MongoDB · Mongoose · JWT · Multer · Nodemailer  
- Chat Service  
  Python · FastAPI · LangChain · ChatGroq · SQLAlchemy  
- Dev Tools  
  ESLint · Prettier · nodemon · dotenv  

## 🔧 Prerequisites

- Node.js ≥ 16 & npm  
- Python ≥ 3.8 (for the Groq/LLM microservice)  
- MongoDB instance  
- `.env` values (in `/server`, `/client`, and `/services`):