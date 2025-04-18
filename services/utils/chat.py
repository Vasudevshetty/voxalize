from fastapi import HTTPException
from langchain_groq import ChatGroq
from utils.db import configure_db, extract_sql_query, is_valid_sql
from langchain_community.agent_toolkits.sql.base import create_sql_agent, SQLDatabaseToolkit
from langchain.agents.agent_types import AgentType
from sqlalchemy import text
import json
from dotenv import load_dotenv
import os
load_dotenv()

groq_api_key_1= os.getenv("GROQ_API_KEY")

def chat_db(db_name, host, user, password, database, query):
    if db_name == "postgresql":
        try:
            llm = ChatGroq(
                groq_api_key=groq_api_key_1,
                model_name="llama-3.3-70b-versatile",
                streaming=False
            )

            db, engine = configure_db(db_name, host, user, password, database)

            toolkit = SQLDatabaseToolkit(db=db, llm=llm)
            agent = create_sql_agent(
                llm=llm,
                toolkit=toolkit,
                verbose=True,
                agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION
            )

            sql_generation_prompt = f"""
            For the following question, generate a valid SQL query to answer it.
            Question: "{query}"

            You must return a valid SQL query that would run in PostgreSQL.
            The query should only start with SELECT means only read operation.
            If you Cannot find the answer, return "I don't know".
            DO NOT include explanations, markdown formatting, or anything else - ONLY the SQL query itself.
            """

            agent_response = agent.run(sql_generation_prompt)

            try:
                sql_query = extract_sql_query(agent_response)
                if not is_valid_sql(sql_query):
                    raise ValueError(f"The generated query doesn't appear to be valid SQL: {sql_query}")
            except ValueError as e:
                retry_prompt = f"""
                The previous response didn't contain a valid SQL query. 
                Please generate a valid SQL query (starting with SELECT, INSERT, etc.) for this question: 
                "{query}"
                Return ONLY the SQL query itself, no explanations.
                """
                agent_response = agent.run(retry_prompt)
                sql_query = extract_sql_query(agent_response)
                if not is_valid_sql(sql_query):
                    raise ValueError(f"Failed to generate valid SQL after retry: {sql_query}")

            sql_result_list = []
            with engine.connect() as connection:
                result = connection.execute(text(sql_query))
                if result.returns_rows:
                    columns = result.keys()
                    for row in result:
                        row_dict = {col: value for col, value in zip(columns, row)}
                        for key, value in row_dict.items():
                            if not isinstance(value, (str, int, float, bool, type(None))):
                                row_dict[key] = str(value)
                        sql_result_list.append(row_dict)
                    sql_result_str = json.dumps(sql_result_list)
                else:
                    sql_result_str = "Query executed successfully. No rows returned."

            summary_prompt = f"""
            Question: {query}
            SQL Query: {sql_query}
            SQL Result: {sql_result_str}

            Please provide a clear, concise summary of these results in natural language.
            """

            summary = llm.invoke(summary_prompt).content

            return {
                "user_query": query,
                "sql_query": sql_query,
                "sql_result": sql_result_list if result.returns_rows else "Query executed successfully. No rows returned.",
                "summary": summary
            }

        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}\n{error_details}")
    elif db_name=="mysql":
        try:
            llm = ChatGroq(
                groq_api_key=groq_api_key_1,
                model_name="llama-3.3-70b-versatile",
                streaming=False
            )
            

            db, engine = configure_db(db_name, host, user, password, database)
            
    
            toolkit = SQLDatabaseToolkit(db=db, llm=llm)
            agent = create_sql_agent(
                llm=llm,
                toolkit=toolkit,
                verbose=True,
                agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION
            )
            
    
            sql_generation_prompt = f"""
            For the following question, generate a valid SQL query to answer it.
            Question: "{query}"
            
            You must return a valid SQL query that would run in MySQL.
            The query should only start with SELECT means only read operation.
            If you Cannot find the answer, return "I don't know".
            DO NOT include explanations, markdown formatting, or anything else - ONLY the SQL query itself.
            """
            agent_response = agent.run(sql_generation_prompt)
            
            try:
                sql_query = extract_sql_query(agent_response)
                if not is_valid_sql(sql_query):
                    raise ValueError(f"The generated query doesn't appear to be valid SQL: {sql_query}")
            except ValueError as e:
               
                retry_prompt = """
                The previous response didn't contain a valid SQL query. 
                Please generate a valid SQL query (starting with SELECT, INSERT, etc.) for this question: 
                "{query_request.query}"
                
                Return ONLY the SQL query itself, no explanations.
                """
                agent_response = agent.run(retry_prompt)
                sql_query = extract_sql_query(agent_response)
                if not is_valid_sql(sql_query):
                    raise ValueError(f"Failed to generate valid SQL after retry: {sql_query}")
        
            sql_result_list = []
            with engine.connect() as connection:
                result = connection.execute(text(sql_query))
                if result.returns_rows:
                    columns = result.keys()
                    for row in result:
                        row_dict = {col: value for col, value in zip(columns, row)}
                        for key, value in row_dict.items():
                            if not isinstance(value, (str, int, float, bool, type(None))):
                                row_dict[key] = str(value)
                        sql_result_list.append(row_dict)
                    sql_result_str = json.dumps(sql_result_list)
                else:
                    sql_result_str = "Query executed successfully. No rows returned."
            
            summary_prompt = f"""
            Question: {query}
            SQL Query: {sql_query}
            SQL Result: {sql_result_str}
            
            Please provide a clear, concise summary of these results in natural language.
            """
            
            summary = llm.invoke(summary_prompt).content
            
            return {
                "user_query": query,
                "sql_query": sql_query,
                "sql_result": sql_result_list if result.returns_rows else "Query executed successfully. No rows returned.",
                "summary": summary
            }
            
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}\n{error_details}")