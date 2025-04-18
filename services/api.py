from fastapi import FastAPI, HTTPException, UploadFile, Form
from pydantic import BaseModel
from utils.db import configure_db, get_database_schema, generate_natural_language_queries
from utils.chat import chat_db
from groq import Groq
from googletrans import Translator
import os
from dotenv import load_dotenv
load_dotenv()

groq_api_key_2= os.getenv("GROQ_API_KEY")

api = FastAPI()

client = Groq(api_key="groq_api_key_2")

class DatabaseConfig(BaseModel):
    dbname : str
    host: str
    user: str
    password: str
    database: str
    
class QueryRequest(BaseModel):
    query: str

@api.get("/")  
def read_root():   
    return {"Hello": "World"}


@api.post("/chat")
async def chat_with_db(request_data: dict):
    
    if "database_config" not in request_data or "query_request" not in request_data:
        raise HTTPException(status_code=400, detail="Request must include mysql_config and query_request")
    
    db_config_data = request_data["database_config"]
    query_request_data = request_data["query_request"]
    
    try:
        db_config = DatabaseConfig(**db_config_data)    
        query_request = QueryRequest(**query_request_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid request format: {str(e)}")
    
    if not query_request.api_key:
        raise HTTPException(status_code=400, detail="API key is required.")
    
    return chat_db(
        db_config.dbname, db_config.host, db_config.user, db_config.password, db_config.database , query_request.query
    )
















if __name__ == "__main__":
    import uvicorn

    uvicorn.run(api, port = 1111)