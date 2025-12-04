import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import timedelta

# ================================
# CONFIGS
# ================================
BROKERAGE = 0.0003
STT_SELL = 0.001
EXCHANGE_CHARGES = 0.0000345
GST = 0.18
DEMAT_CHARGE = 20
LTCG_TAX = 0.20
STCG_TAX = 0.15
LTCG_HOLDING_DAYS = 365

INITIAL_CAPITAL = 100000
DATA_DIR = "data"
DMA_LIST = [25, 50, 75, 100, 150, 200]
DEVIATIONS = list(range(1, 11))  # 1% to 10%


# ================================
# FINANCIAL YEAR
# ================================
def get_financial_year(date):
    return f"{date.year}-{str(date.year+1)[-2:]}" if date.month >= 4 else f"{date.year-1}-{str(date.year)[-2:]}"


# ================================
# BACKTEST (reusable for any stock)
# ================================
def run_backtest(df, dma, deviation):
    equity = INITIAL_CAPITAL
    deviation = deviation / 100
    position = 0
    buy_date = None
    buy_price = 0
    units = 0

    trades = []
    trade_events = []

    df["BuyLevel"] = df[f"DMA{dma}"] * (1 - deviation)
    df["SellLevel"] = df[f"DMA{dma}"] * (1 + deviation)

    # LOOP
    for date, row in df.iterrows():
        price = row["Close"]
        bl, sl = row["BuyLevel"], row["SellLevel"]

        if np.isnan(bl) or np.isnan(sl):
            continue

        # BUY
        if position == 0 and price < bl:
            units = int(equity // price)
            if units == 0:
                continue

            gross = units * price
            tx = gross * (BROKERAGE + EXCHANGE_CHARGES)
            gst = tx * GST
            total_buy = gross + tx + gst

            equity -= total_buy
            position = 1
            buy_date = date
            buy_price = price

            trade_events.append({"date": date, "price": price, "type": "BUY"})

        # SELL
        elif position == 1 and price > sl:
            gross = units * price
            tx = gross * (BROKERAGE + EXCHANGE_CHARGES)
            gst = tx * GST
            stt = gross * STT_SELL

            total = gross - tx - gst - stt - DEMAT_CHARGE
            holding_days = (date - buy_date).days
            profit = total - (units * buy_price)

            tax = profit * (LTCG_TAX if holding_days > LTCG_HOLDING_DAYS else STCG_TAX)
            net = profit - tax

            equity += total - tax
            trades.append({"date": date, "net": net})
            trade_events.append({"date": date, "price": price, "type": "SELL"})

            position = 0
            units = 0

    # FINAL EXIT
    if position == 1:
        date = df.index[-1]
        price = df["Close"].iloc[-1]

        gross = units * price
        tx = gross * (BROKERAGE + EXCHANGE_CHARGES)
        gst = tx * GST
        stt = gross * STT_SELL

        total = gross - tx - gst - stt - DEMAT_CHARGE
        holding_days = (date - buy_date).days
        profit = total - (units * buy_price)
        tax = profit * (LTCG_TAX if holding_days > LTCG_HOLDING_DAYS else STCG_TAX)

        equity += total - tax
        trades.append({"date": date, "net": profit - tax})

    # FINANCIAL YEAR SPLIT
    if trades:
        tdf = pd.DataFrame(trades)
        tdf["FY"] = tdf["date"].apply(get_financial_year)
        fy_summary = tdf.groupby("FY")["net"].sum().to_dict()
    else:
        fy_summary = {}

    total_profit = sum(t["net"] for t in trades)
    roi = (equity - INITIAL_CAPITAL) / INITIAL_CAPITAL * 100

    return {
        "DMA": dma,
        "Deviation %": deviation * 100,
        "Net Profit": total_profit,
        "ROI %": roi,
        "Equity": equity,
        "FY Summary": fy_summary,
        "Trades": trade_events
    }


# ================================
# PLOTTER
# ================================
# def plot_strategy(df, dma, deviation, title):
#     deviation = deviation / 100
#     df_plot = df.copy()

#     df_plot["BuyLevel"] = df_plot[f"DMA{dma}"] * (1 - deviation)
#     df_plot["SellLevel"] = df_plot[f"DMA{dma}"] * (1 + deviation)

#     buys, sells = [], []
#     position = 0

#     for date, row in df_plot.iterrows():
#         price = row["Close"]
#         b = row["BuyLevel"]
#         s = row["SellLevel"]

#         if np.isnan(b) or np.isnan(s):
#             continue

#         if position == 0 and price < b:
#             buys.append((date, price))
#             position = 1

#         elif position == 1 and price > s:
#             sells.append((date, price))
#             position = 0

#     plt.figure(figsize=(16, 8))

#     plt.plot(df_plot.index, df_plot["Close"], label="Close Price", linewidth=1)
#     plt.plot(df_plot.index, df_plot[f"DMA{dma}"], label=f"{dma} DMA", linewidth=2)

#     plt.plot(df_plot.index, df_plot["BuyLevel"], label="Buy Level", linestyle="--")
#     plt.plot(df_plot.index, df_plot["SellLevel"], label="Sell Level", linestyle="--")

#     if buys:
#         plt.scatter([x[0] for x in buys], [x[1] for x in buys],
#                     marker="^", color="green", s=120, label="Buy")

#     if sells:
#         plt.scatter([x[0] for x in sells], [x[1] for x in sells],
#                     marker="v", color="red", s=120, label="Sell")

#     plt.title(f"{stock} Strategy — DMA {dma}, Deviation {deviation*100:.0f}%")
#     plt.xlabel("Date")
#     plt.ylabel("Price")
#     plt.grid(True, alpha=0.3)
#     plt.legend()
#     plt.tight_layout()
#     plt.show()



def export_strategy_to_csv(df, dma, deviation, output_csv):
    deviation_pct = deviation / 100
    dma_col = f"DMA{dma}"

    df_out = df.copy()
    df_out["DMA"] = df_out[dma_col]
    # Calculate levels
    df_out["BuyLevel"] = df_out[dma_col] * (1 - deviation_pct)
    df_out["SellLevel"] = df_out[dma_col] * (1 + deviation_pct)

    # Create columns for signals
    df_out["BuySignal"] = 0
    df_out["SellSignal"] = 0
    df_out["BuyPrice"] = np.nan
    df_out["SellPrice"] = np.nan

    position = 0

    for idx, row in df_out.iterrows():
        price = row["Close"]
        b = row["BuyLevel"]
        s = row["SellLevel"]

        if np.isnan(b) or np.isnan(s):
            continue

        # Buy
        if position == 0 and price < b:
            df_out.at[idx, "BuySignal"] = 1
            df_out.at[idx, "BuyPrice"] = price
            position = 1

        # Sell
        elif position == 1 and price > s:
            df_out.at[idx, "SellSignal"] = 1
            df_out.at[idx, "SellPrice"] = price
            position = 0

    # Choose only the columns you want
    columns_needed = ["Close",'DMA','DMA25','DMA50','BuyLevel','SellLevel','BuySignal','BuyPrice','SellSignal','SellPrice']  # <-- change as needed    
    df_out_selected = df_out[columns_needed].round(2)
    # Save to CSV
    df_out_selected.to_csv(output_csv, index=True)
   

    print(f"CSV generated: {output_csv}")


# ================================
# RUN FOR MULTIPLE STOCKS
# ================================
all_results = []

for file in os.listdir(DATA_DIR):
    if not file.endswith(".csv"):
        continue

    stock = file.replace(".csv", "")
    df = pd.read_csv(os.path.join(DATA_DIR, file))
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")
    df.set_index("Date", inplace=True)

    # PRECOMPUTE ALL DMAs
    for dma in DMA_LIST:
        df[f"DMA{dma}"] = df["Close"].rolling(dma).mean()

    print(f"\n\n========== Running Backtests for {stock} ==========\n")

    stock_results = []
   
    for dma in DMA_LIST:
        for d in DEVIATIONS:
            r = run_backtest(df.copy(), dma, d)
            r["Stock"] = stock
            stock_results.append(r)
            all_results.append(r)

    stock_df = pd.DataFrame(stock_results)
    best = stock_df.loc[stock_df["Net Profit"].idxmax()]

    print(f"\nBEST STRATEGY FOR {stock}:")
    print(best)
   
    # Plot best
    #plot_strategy(df.copy(), best["DMA"], int(best["Deviation %"]), stock)
   
   

    export_strategy_to_csv(
        df.copy(),dma=best["DMA"],
    deviation=int(best["Deviation %"]),
    output_csv=f"{stock}-out.csv"
   
    )


# FINAL AGGREGATED RESULTS
final_df = pd.DataFrame(all_results)
print("\n========= MASTER RESULT TABLE =========")
print(final_df)

