from fastapi import FastAPI, HTTPException, UploadFile, Form
from pydantic import BaseModel
from utils.db import configure_db, get_database_schema, generate_natural_language_queries
from utils.chat import chat_db
from groq import Groq
from googletrans import Translator
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from fastapi.responses import FileResponse
load_dotenv()

groq_api_key_2 = os.getenv("GROQ_API_KEY_2")

api = FastAPI()

client = Groq(api_key=groq_api_key_2)

class DatabaseConfig(BaseModel):
    dbname: str
    host: str
    user: str
    password: str
    database: str
    
class QueryRequest(BaseModel):
    query: str

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
            db_config.dbname, db_config.host, db_config.user, 
            db_config.password, db_config.database
        )
    
        result = chat_db(
            db_config.dbname, db_config.host, db_config.user, 
            db_config.password, db_config.database, query_request.query
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
        _, engine = configure_db(db_config.dbname, db_config.host, db_config.user, db_config.password, db_config.database)
        
        schema = get_database_schema(engine)
        
        prompt = f"""
        Given the following database schema:
        {schema}
        
        Generate 5 natural language queries that a business user might ask about this database.
        Return them as a JSON array of strings. Each query should be clear and answerable using SQL.
        """
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a database expert that helps generate natural language queries."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile", 
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
    """
    Converts text to speech using Groq's API and returns the audio file.
    """
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

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(api, port=1111)