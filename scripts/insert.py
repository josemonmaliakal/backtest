POSTGRES_DATABASE_URL = "postgresql+psycopg2://dbuser:dbuserTHWQ@localhost:5432/backtest"

import os
import sys
import csv
import datetime
import random
import string

from sqlalchemy import (
    create_engine, Column, String, Date, Numeric,
    BigInteger, Integer, ForeignKey, UniqueConstraint, text
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker, Session
from sqlalchemy.engine import Engine

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from models.stock_models import StockHistory, StockDetails
from models.base import Base


# -------------------------------
# Helper Functions
# -------------------------------

def clean_numeric(val):
    if not val:
        return None
    v = val.strip().replace('"', '').replace(',', '')
    return v if v else None


def backup_table(engine: Engine, table_name: str, session: Session) -> str:
    """Create a full backup copy of a table in PostgreSQL."""
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    suffix = ''.join(random.choices(string.ascii_lowercase, k=4))
    backup_name = f"{table_name}_backup_{timestamp}_{suffix}"

    print(f"\n[BACKUP] Creating backup table: {backup_name}")

    sql = text(f"""
        CREATE TABLE {backup_name} AS
        SELECT * FROM {table_name};
    """)

    try:
        session.execute(sql)
        session.commit()
        print(f"[BACKUP] ✅ Backup created: {backup_name}")
        return backup_name
    except Exception as e:
        session.rollback()
        print(f"[BACKUP] ❌ Failed: {e}")
        return ""


def process_and_insert_history(csv_file_path: str, session: Session):
    base_name = os.path.basename(csv_file_path)

    # Extract symbol from filename
    try:
        symbol = base_name.split('-')[2].upper()
    except IndexError:
        print(f"❌ Cannot extract symbol from filename: {base_name}")
        return

    # Fetch StockDetails
    stock_detail = session.query(StockDetails).filter_by(symbol=symbol).first()

    if not stock_detail:
        print(f"\n⚠ NEW STOCK: {symbol}")
        user_isin = input(f"Enter ISIN for {symbol}: ").strip().upper()
        if not user_isin:
            print("❌ ISIN missing. Skipping.")
            return

        if session.query(StockDetails).filter_by(isin=user_isin).first():
            print("❌ ISIN conflict. Skipping.")
            return

        user_name = input(f"Enter full company name: ").strip()

        try:
            new_stock = StockDetails(
                isin=user_isin,
                symbol=symbol,
                company_name=user_name,
                instrument="EQ",
                exchange="NSE"
            )
            session.add(new_stock)
            session.flush()
            session.commit()
            print(f"✅ Inserted StockDetails for {symbol}")
            stock_isin = user_isin
        except Exception as e:
            session.rollback()
            print(f"❌ Failed to insert new stock: {e}")
            return

    else:
        stock_isin = stock_detail.isin

    print(f"[PROCESS] Processing: {base_name}")

    records = []
    try:
        with open(csv_file_path, "r") as f:
            reader = csv.DictReader(f)

            for row in reader:
                d_pfx = '\ufeff'

                date_obj = datetime.datetime.strptime(
                    clean_numeric(row[d_pfx + 'DATE']),
                    "%d-%b-%Y"
                ).date()

                rec = StockHistory(
                    stock_isin=stock_isin,
                    date=date_obj,
                    series=clean_numeric(row['SERIES']),
                    open=clean_numeric(row['OPEN']),
                    high=clean_numeric(row['HIGH']),
                    low=clean_numeric(row['LOW']),
                    prev_close=clean_numeric(row['PREV. CLOSE']),
                    ltp=clean_numeric(row['LTP']),
                    close=clean_numeric(row['CLOSE']),
                    vwap=clean_numeric(row['VWAP']),
                    high_52w=clean_numeric(row['52W H']),
                    low_52w=clean_numeric(row['52W L']),
                    volume=clean_numeric(row['VOLUME']),
                    value=clean_numeric(row['VALUE']),
                    no_of_trades=clean_numeric(row['NO. OF  TRADES'])
                )
                records.append(rec)

        session.add_all(records)
        session.commit()

        print(f"[PROCESS] ✅ Inserted {len(records)} records.")

        os.remove(csv_file_path)
        print(f"[CLEANUP] Deleted: {csv_file_path}")

    except Exception as e:
        session.rollback()
        print(f"❌ Error: {e}. File retained.")


# -------------------------------
# Database Setup (POSTGRES)
# -------------------------------

engine = create_engine(POSTGRES_DATABASE_URL)
Base.metadata.create_all(bind=engine, checkfirst=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

print("--- PostgreSQL Database Setup Complete ---")

UNPROCESSED_FOLDER = "unprocessed"
os.makedirs(UNPROCESSED_FOLDER, exist_ok=True)

session = SessionLocal()

processed_files = 0
total_files = 0

try:
    backup_name = backup_table(engine, "stock_history", session)

    if backup_name:
        print("\n--- Importing CSV Files ---")

        for filename in os.listdir(UNPROCESSED_FOLDER):
            if filename.lower().endswith(".csv"):
                total_files += 1
                file_path = os.path.join(UNPROCESSED_FOLDER, filename)
                process_and_insert_history(file_path, session)

                if not os.path.exists(file_path):
                    processed_files += 1

except Exception as e:
    print(f"Unexpected error: {e}")

finally:
    count = session.query(StockHistory).count()
    print("\n--- SUMMARY ---")
    print("Total CSV files:", total_files)
    print("Processed & deleted:", processed_files)
    print("Total stock_history records:", count)

    session.close()
