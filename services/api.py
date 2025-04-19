from fastapi import FastAPI, HTTPException, UploadFile, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from utils.db import configure_db, get_database_schema
from utils.chat import chat_db
from groq import Groq
from googletrans import Translator
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from fastapi.responses import FileResponse
from typing import Optional, List, Dict, Any
import json
import re
import traceback
import requests
from twilio.twiml.messaging_response import MessagingResponse

load_dotenv()


groq_api_key_2 = os.getenv("GROQ_API_KEY_2")


api = FastAPI()
client = Groq(api_key=groq_api_key_2)

# Add CORS middleware
api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://studysyncs.xyz"],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = Groq(api_key=groq_api_key_2)

class DatabaseConfig(BaseModel):
    dbtype: str
    host: str
    user: str
    password: str
    dbname: str
    
class QueryRequest(BaseModel):
    query: str

class SearchCompletionsRequest(BaseModel):
    term: str = Field(..., description="The partial search term to find completions for")
    limit: int = Field(10, description="Maximum number of completions to return")
    database_config: Optional[DatabaseConfig] = None

class GraphRecommendationRequest(BaseModel):
    sql_result_json: List[Dict[str, Any]] = Field(..., description="The result of the SQL query in JSON format (list of dictionaries)")

async def translate_to_english(text: str) -> str:
    translator = Translator()
    translated = await translator.translate(text, dest='en')
    return translated.text

@api.get("/")  
def read_root():   
    return {"Hello": "World"}


@api.post("/chat")
async def chat_with_db(request_data: dict):
    
    if "database_config" not in request_data or "query_request" not in request_data:
        raise HTTPException(status_code=400, detail="Request must include database_config and query_request")
    
    db_config_data = request_data["database_config"]
    query_request_data = request_data["query_request"]
    
    try:
        db_config = DatabaseConfig(**db_config_data)    
        query_request = QueryRequest(**query_request_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request format: {str(e)}")
    
    try:
        db, engine = configure_db(
            db_config.dbtype, db_config.host, db_config.user, 
            db_config.password, db_config.dbname
        )
    
        result = chat_db(
            db_config.dbtype, db_config.host, db_config.user, 
            db_config.password, db_config.dbname, query_request.query
        )
        
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        return {
            "user_query": query_request.query,
            "error": "This query doesn't appear to be related to the database. Please try again with a database-related question.",
            "details": str(e)
        }

@api.post("/recommend")
async def recommend_queries(request_data: dict):
    if "database_config" not in request_data:
        raise HTTPException(status_code=400, detail="Request must include database_config")
    
    data_config_data = request_data["database_config"]
    try:
        db_config = DatabaseConfig(**data_config_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request format: {str(e)}")
    
    try:
        _, engine = configure_db(db_config.dbtype, db_config.host, db_config.user, db_config.password, db_config.dbname)
        
        schema = get_database_schema(engine)
        
        prompt = f"""
        Given the following database schema:
        {schema}
        
        Generate 10 natural language queries that a business user might ask about this database.
        Each query should be a single sentence and should be relevant to the schema provided.
        Avoid complex queries or technical jargon. The query should be simple and understandable.
        the query should be start with select when coverted to sql query.
        Return them as a JSON array of strings. Each query should be clear and answerable using SQL.
        """
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a database expert that helps generate natural language queries."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.1-8b-instant", 
            temperature=0.7,
            max_tokens=1024
        )
        
        llm_response = response.choices[0].message.content
        import json
        try:

            recommended_queries = json.loads(llm_response)
        except json.JSONDecodeError:
        
            import re
            json_match = re.search(r'\[.*\]', llm_response, re.DOTALL)
            if json_match:
                recommended_queries = json.loads(json_match.group(0))
            else:
            
                recommended_queries = [q.strip().strip('"').strip("'") for q in llm_response.split('\n') if q.strip()]
        
        return {
            "recommended_queries": recommended_queries
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Error processing recommendation: {str(e)}\n{error_details}")


@api.post("/speech-to-text")
async def speech_to_text(file: UploadFile,language: str = Form("en")):
    try:
        temp_filename = f"temp_{file.filename}"
        with open(temp_filename, "wb") as temp_file:
            temp_file.write(await file.read())

        with open(temp_filename, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                file=(temp_filename, audio_file.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
                language=language
            )

        os.remove(temp_filename)

        return {
            "transcription": transcription.text,
            "detected_language": transcription.language if hasattr(transcription, "language") else language
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio file: {str(e)}")

@api.post("/translate")
async def translate(text: str):
    try:
        translated_text = await translate_to_english(text)
        return {"original_text": text, "translated_text": translated_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error translating text: {str(e)}")
    
@api.post("/text-to-speech")
async def text_to_speech(text: str, voice: str = Form("Aaliyah-PlayAI")):
    try:
        unique_id = str(uuid.uuid4())
        output_dir = Path("speech_output")
        output_dir.mkdir(exist_ok=True) 
        
        speech_file_path = output_dir / f"{unique_id}.wav"
     
        response = client.audio.speech.create(
            model="playai-tts",  
            voice=voice,        
            response_format="wav", 
            input=text         
        )
        
   
        try:
            with open(speech_file_path, "wb") as f:
                response.write_to_file(speech_file_path)

        except AttributeError:
            try:
                response.stream_to_file(speech_file_path)
            except AttributeError as e:
                raise AttributeError(f"Groq response object does not have expected methods ('write_to_file' or 'stream_to_file'). Error: {e}")

        finally:
            if speech_file_path.exists():
                os.remove(speech_file_path)

        return FileResponse(
            path=speech_file_path,
            media_type="audio/wav",
            filename=f"speech_{unique_id}.wav" 
        )
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating speech: {str(e)}\n{error_details}") 
        raise HTTPException(status_code=500, detail=f"Error generating speech: {str(e)}")
    
    
@api.post("/search-completions")
async def search_completions(request: SearchCompletionsRequest):
    term, limit, config = request.term, request.limit, request.database_config
    completions, schema = [], None

    
    if config:
        try:
            _, engine = configure_db(
                config.dbtype, config.host, config.user, config.password, config.dbname
            )
            schema = get_database_schema(engine)
        except Exception as e:
            print(f"[Warning] Failed to load DB schema: {e}")

    
    if schema:
        prompt = (
            f"Given the following database schema:\n{schema}\n\n"
            f"Generate relevant search suggestions or autocompletions for a user.\n"
            f"The user has typed the partial term: \"{term}\"\n"
            f"Provide up to {limit} suggestions related to the schema.\n"
            f"Output as a JSON list of strings."
        )
    else:
        prompt = (
            f"Generate general database-related autocompletions.\n"
            f"The user has typed the partial term: \"{term}\"\n"
            f"Suggest up to {limit} completions with SQL keywords or query phrases.\n"
            f"Output as a JSON list of strings."
        )

    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            temperature=0.2,
            max_tokens=256,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You are an assistant providing database query autocompletions."},
                {"role": "user", "content": prompt}
            ]
        )

        content = response.choices[0].message.content

        try:
            parsed = json.loads(content)
            completions = parsed.get("suggestions") if isinstance(parsed, dict) else parsed
        except json.JSONDecodeError:
            print(f"[Warning] Invalid JSON from LLM: {content}")
            completions = re.findall(r'"(.*?)"', content) or []

    except Exception as e:
        print(f"[Error] LLM failure for term '{term}': {e}\n{traceback.format_exc()}")
        completions = [f"Error generating suggestions for '{term}'"]

    return {"completions": completions[:limit]}



@api.post("/graphrecommender")
async def recommend_graph(request: GraphRecommendationRequest) -> Dict[str, List[str]]:
    data = request.sql_result_json

    
    if not data or not isinstance(data, list) or not all(isinstance(item, dict) for item in data):
        raise HTTPException(status_code=400, detail="Invalid input: Expected a list of dictionaries.")

    
    try:
        data_preview = json.dumps(data[:5], indent=2)
        total_json_size = len(json.dumps(data))
        if total_json_size > 1500 and len(data_preview) > 1000:
            data_preview = data_preview[:1000] + "\n... (data truncated)"
        elif len(data) > 5:
            data_preview += "\n... (more rows exist)"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process input data preview: {e}")

    
    column_names = list(data[0].keys()) if data else []
    prompt = (
        f"Data Preview:\n"
        f"```json\n{data_preview}\n```\n\n"
        f"Columns: {column_names}\n\n"
        f"Based on this dataset, recommend the best graph type for visualization.\n"
        f"First, provide your primary recommendation as \"Primary: [graph type]\".\n"
        f"Then, list 2-3 DIFFERENT alternative graph types as \"Alternative: [graph type]\".\n"
        f"Choose only from these exact graph types (do not modify or combine them): bar, line, pie, area, scatter, heatmap.\n"
        f"Respond ONLY with the Primary and Alternative recommendations in the specified format." 
    )

    try:
        
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            temperature=0.2, 
            max_tokens=100, 
            
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert data visualization assistant. Recommend graph types based on provided data, following the specific output format."
                },
                {"role": "user", "content": prompt}
            ]
        )

        content = response.choices[0].message.content
        
        
        
        

        recommended_graphs: List[str] = [] 

        
        primary_match = re.search(r"Primary:\s*\[?\"?(\w+)\"?\]?", content)
        alternative_match = re.search(r"Alternative:\s*\[?\"?([\w,\s\"]+)\"?\]?", content)

        if primary_match:
            primary_graph = primary_match.group(1)
            recommended_graphs.append(primary_graph)
            if alternative_match:
                alternatives_str = alternative_match.group(1)
                
                alternatives = [alt.strip().strip('"') for alt in alternatives_str.split(',')]
                recommended_graphs.extend(alternatives)

        if not recommended_graphs:
             print(f"[Warning] Could not parse recommendations from LLM response: {content}")
             recommended_graphs = ["table"] 


        


        
        recommended_graphs = [str(g) for g in recommended_graphs if isinstance(g, (str, int, float))]
        if not recommended_graphs:
            print("[Info] No valid graph recommendations parsed. Defaulting to ['table'].")
            recommended_graphs = ["table"]


    except Exception as e:
        print(f"[Error] LLM failure: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error generating graph recommendations.")

    return {"recommended_graphs": recommended_graphs}

load_dotenv()

TWILIO_NUMBER = os.getenv("TWILLIO_NUMBER")  
ACCOUNT_SID    = os.getenv("ACCOUNT_SID")
AUTH_TOKEN    = os.getenv("AUTH_TOKEN")

CHAT_API_URL  = "https://studysyncs.xyz/services/chat"   

@api.post("/whatsapp")
async def whatsapp_webhook(From: str = Form(...), Body: str = Form(...)):
    """
    Twilio will POST here on incoming WhatsApp messages.
    Expect Body to be a JSON string:
    {
      "database_config": { dbtype, host, user, password, dbname },
      "query_request":   { query }
    }
    """
    resp = MessagingResponse()

    try:
        payload = json.loads(Body.strip())
        assert "database_config" in payload and "query_request" in payload
    except Exception:
        resp.message(
            "⚠️ Please send a valid JSON with 'database_config' and 'query_request'.\n"
            "Example:\n"
            "{\n"
            '  "database_config": {"dbtype":"postgresql","host":"...","user":"...","password":"...","dbname":"..."},\n'
            '  "query_request": {"query":"count users"}\n'
            "}"
        )
        return Response(content=str(resp), media_type="application/xml")

    try:
        r = requests.post(CHAT_API_URL, json=payload, timeout=30)
        r.raise_for_status()
        result = r.json()
    except Exception as e:
        resp.message(f"❌ Error calling chat API:\n{e}")
        return Response(content=str(resp), media_type="application/xml")

    # format and send back
    sql      = result.get("sql_query", "<none>")
    summary  = result.get("summary", "<none>")
    title    = result.get("title", "")
    rows     = result.get("sql_result")
    # truncate very long results
    rows_str = json.dumps(rows, indent=2)
    if len(rows_str) > 800:
        rows_str = rows_str[:800] + "\n…(truncated)"

    msg = (
        f"✅ *Query OK*\n\n"
        f"*SQL:*```{sql}```\n\n"
        f"*Title:* {title}\n\n"
        f"*Summary:* {summary}\n\n"
        f"*Rows:*```json\n{rows_str}\n```"
    )
    resp.message(msg)

    return Response(content=str(resp), media_type="application/xml")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(api, port=1111)

