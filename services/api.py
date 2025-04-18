from fastapi import FastAPI, HTTPException, UploadFile, Form
from pydantic import BaseModel
from utils.db import configure_db, get_database_schema, generate_natural_language_queries
from utils.chat import chat_db
from groq import Groq
from googletrans import Translator
import os
from dotenv import load_dotenv
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
        # If there's an error processing the query, it might not be database-related
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
        
        # Extract and parse the recommended queries from the LLM response
        llm_response = response.choices[0].message.content
        import json
        try:
            # First try to parse directly if the response is already JSON
            recommended_queries = json.loads(llm_response)
        except json.JSONDecodeError:
            # If not JSON, try to extract JSON part from text
            import re
            json_match = re.search(r'\[.*\]', llm_response, re.DOTALL)
            if json_match:
                recommended_queries = json.loads(json_match.group(0))
            else:
                # Fallback: split by newlines and clean up
                recommended_queries = [q.strip().strip('"').strip("'") for q in llm_response.split('\n') if q.strip()]
        
        return {
            "recommended_queries": recommended_queries
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Error processing recommendation: {str(e)}\n{error_details}")



if __name__ == "__main__":
    import uvicorn

    uvicorn.run(api, port=1111)