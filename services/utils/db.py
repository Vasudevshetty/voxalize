import re
from fastapi import HTTPException
from sqlalchemy import create_engine, inspect
from langchain_community.utilities import SQLDatabase


def configure_db(db_name, host, user, password, database):
    if db_name == "mysql": 
        try:
            conn_string = f"mysql+mysqlconnector://{user}:{password}@{host}/{database}"
            engine = create_engine(conn_string)
            return SQLDatabase(engine), engine
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")
    elif db_name == "postgresql":
        try:
            conn_string = f"postgresql+psycopg2://{user}:{password}@{host}/{database}"
            engine = create_engine(conn_string, connect_args={"options": "-c default_transaction_read_only=on"})
            return SQLDatabase(engine), engine
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")  
        
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported database type: {db_name}. Choose 'mysql' or 'postgresql'.")
    
def get_database_schema(engine):
    inspector = inspect(engine)
    schema = {}

    tables = inspector.get_table_names()
    for table in tables:
        columns = inspector.get_columns(table)
        schema[table] = [col['name'] for col in columns]
    
    return schema
    
def extract_sql_query(agent_response):
    if re.match(r'^[\d.]+$', agent_response.strip()):
        raise ValueError(f"Agent returned a numeric value instead of SQL: {agent_response}")

    sql_match = re.search(r'```sql\s*(.*?)\s*```', agent_response, re.DOTALL)
    if sql_match:
        return sql_match.group(1).strip()

    sql_match = re.search(r'`(.*?)`', agent_response, re.DOTALL)
    if sql_match:
        return sql_match.group(1).strip()

    sql_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'SHOW']
    for keyword in sql_keywords:
        sql_match = re.search(f'{keyword}\\s+.*', agent_response, re.IGNORECASE | re.DOTALL)
        if sql_match:
            return sql_match.group(0).strip()

    if any(keyword in agent_response.upper() for keyword in sql_keywords):
        return agent_response.strip()

    raise ValueError(f"Could not identify SQL query in agent response: {agent_response}")
    
def is_valid_sql(query):
    if re.match(r'^[\d.]+$', query.strip()):
        return False

    if not query.upper().strip().startswith('SELECT'):
        return False

    select_keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT']
    return any(keyword.upper() in query.upper() for keyword in select_keywords)


def generate_natural_language_queries(schema):
    """Generate a list of possible natural language queries based on the schema."""
    queries = []
    
    for table, columns in schema.items():
        
        queries.append(f"What are the details of all records in the '{table}' table?")
        queries.append(f"Show me all {', '.join(columns)} from the '{table}' table.")
        
        for column in columns:
            queries.append(f"Give me the {column} from the '{table}' table.")
            
        if len(columns) > 1:
            queries.append(f"What is the average {columns[0]} in the '{table}' table?")
            queries.append(f"How many records are there in the '{table}' table?")
        
    return queries

