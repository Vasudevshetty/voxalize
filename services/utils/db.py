import re
from fastapi import HTTPException
from sqlalchemy import create_engine, inspect
from langchain_community.utilities import SQLDatabase


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

    sql_keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'JOIN', 'GROUP BY', 'ORDER BY']
    return any(keyword.upper() in query.upper() for keyword in sql_keywords)