from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from urllib.parse import quote_plus

password = "tndpwd123@A"
encoded_password = quote_plus(password)

DATABASE_URL = f"postgresql://postgres:{encoded_password}@localhost:5432/backtest"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
