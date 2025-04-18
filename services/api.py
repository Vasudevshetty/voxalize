from fastapi import FastAPI

api = FastAPI()

@api.get("/")  
def read_root():   
    return {"Hello": "World"}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(api, port = 1111)