import os 
import sys 
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
#from .database import Base, engine
#from .routers import stocks
from models.stock_models import StockDetails
#Base.metadata.create_all(bind=engine)
load_dotenv()

app = FastAPI(title="DMA Strategy API")

#app.include_router(stocks.router)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "DMA Strategy API Running"}

@app.get("/stocks")
def list_stocks(db: Session = Depends(get_db)):
    stocks = db.query(StockDetails).all()
    return stocks

@app.get("/backtest")
def list_stocks(db: Session = Depends(get_db)):
    stocks = db.query(StockDetails).all()
    for item in stocks :
        print(item)