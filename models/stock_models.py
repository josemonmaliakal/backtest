from sqlalchemy import (
    Column, String, Date, Numeric, BigInteger, Integer, 
    ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from .base import Base # Import Base from the local package

class StockDetails(Base):
    __tablename__ = 'stock_details'

    # Primary Key
    isin = Column(String(20), primary_key=True, unique=True)
    symbol = Column(String(20), unique=True, index=True, nullable=False)
    company_name = Column(String(100), nullable=False)
    instrument = Column(String(10)) 
    exchange = Column(String(10))

    history = relationship("StockHistory", back_populates="stock")

    def __repr__(self):
        return f"<StockDetails(isin='{self.isin}', symbol='{self.symbol}')>"

class StockHistory(Base):
    __tablename__ = 'stock_history'

    id = Column(BigInteger, primary_key=True,autoincrement=True) 
    stock_isin = Column(String(20), ForeignKey('stock_details.isin'), index=True, nullable=False)
    date = Column(Date, index=True, nullable=False)

    __table_args__ = (
        UniqueConstraint('stock_isin', 'date', name='uix_stock_date'),
    )
    
    series = Column(String(10))
    open = Column(Numeric(10, 2))
    high = Column(Numeric(10, 2))
    low = Column(Numeric(10, 2))
    prev_close = Column(Numeric(10, 2))
    ltp = Column(Numeric(10, 2))
    close = Column(Numeric(10, 2))
    vwap = Column(Numeric(10, 2))
    high_52w = Column(Numeric(10, 2))
    low_52w = Column(Numeric(10, 2))
    volume = Column(BigInteger)
    value = Column(Numeric(18, 2))
    no_of_trades = Column(Integer)
    
    stock = relationship("StockDetails", back_populates="history")

    def __repr__(self):
        return f"<StockHistory(isin='{self.stock_isin}', date='{self.date}')>"