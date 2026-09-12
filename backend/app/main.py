from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import risk, portfolio

app = FastAPI(
    title="MochaShield Risk API",
    description="Pre-trade portfolio risk intelligence engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(risk.router)
app.include_router(portfolio.router)

@app.get("/")
async def root():
    return {"message": "MochaShield Risk Engine is running"}
