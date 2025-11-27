import pandas as pd
import numpy as np
from datetime import timedelta
import matplotlib.pyplot as plt

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

DMA_LIST = [25, 50, 75, 100, 150, 200]

# ================================
# LOAD DATA
# ================================
df = pd.read_csv("nhpc.csv")
df["Date"] = pd.to_datetime(df["Date"])
df = df.sort_values("Date")
df.set_index("Date", inplace=True)

# Precalculate all DMAs
for dma in DMA_LIST:
    df[f"DMA{dma}"] = df["Close"].rolling(dma).mean()


# ================================
# PLOT STRATEGY
# ================================
def plot_strategy(dma, deviation):
    deviation = deviation / 100
    df_plot = df.copy()

    df_plot["BuyLevel"] = df_plot[f"DMA{dma}"] * (1 - deviation)
    df_plot["SellLevel"] = df_plot[f"DMA{dma}"] * (1 + deviation)

    buys, sells = [], []
    position = 0

    for date, row in df_plot.iterrows():
        price = row["Close"]
        b = row["BuyLevel"]
        s = row["SellLevel"]

        if np.isnan(b) or np.isnan(s):
            continue

        if position == 0 and price < b:
            buys.append((date, price))
            position = 1

        elif position == 1 and price > s:
            sells.append((date, price))
            position = 0

    plt.figure(figsize=(16, 8))

    plt.plot(df_plot.index, df_plot["Close"], label="Close Price", linewidth=1)
    plt.plot(df_plot.index, df_plot[f"DMA{dma}"], label=f"{dma} DMA", linewidth=2)

    plt.plot(df_plot.index, df_plot["BuyLevel"], label="Buy Level", linestyle="--")
    plt.plot(df_plot.index, df_plot["SellLevel"], label="Sell Level", linestyle="--")

    if buys:
        plt.scatter([x[0] for x in buys], [x[1] for x in buys],
                    marker="^", color="green", s=120, label="Buy")

    if sells:
        plt.scatter([x[0] for x in sells], [x[1] for x in sells],
                    marker="v", color="red", s=120, label="Sell")

    plt.title(f"NHPC Strategy — DMA {dma}, Deviation {deviation*100:.0f}%")
    plt.xlabel("Date")
    plt.ylabel("Price")
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.show()


# ================================
# FINANCIAL YEAR
# ================================
def get_financial_year(date):
    return f"{date.year}-{str(date.year+1)[-2:]}" if date.month >= 4 else f"{date.year-1}-{str(date.year)[-2:]}"


# ================================
# BACKTEST
# ================================
def run_backtest(dma, deviation):
    equity = INITIAL_CAPITAL
    position = 0
    buy_price = 0
    buy_date = None
    units = 0

    trades = []

    df["BuyLevel"] = df[f"DMA{dma}"] * (1 - deviation)
    df["SellLevel"] = df[f"DMA{dma}"] * (1 + deviation)

    for date, row in df.iterrows():
        price = row["Close"]
        bl = row["BuyLevel"]
        sl = row["SellLevel"]

        if np.isnan(bl) or np.isnan(sl):
            continue

        if position == 0 and price < bl:
            units = int(equity // price)
            gross = units * price

            tx = gross * (BROKERAGE + EXCHANGE_CHARGES)
            gst = tx * GST

            total_buy = gross + tx + gst
            equity -= total_buy

            position = 1
            buy_price = price
            buy_date = date

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

            position = 0
            units = 0

    # FORCE EXIT
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
        net = profit - tax

        equity += total - tax
        trades.append({"date": date, "net": net})

    # FY SPLIT
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
        "Final Equity": equity,
        "ROI %": roi,
        "FINANCIAL YEAR": fy_summary
    }


# ================================
# RUN ALL DMAS + DEVIATIONS
# ================================
results = []

for dma in DMA_LIST:
    for d in range(1, 11):
        results.append(run_backtest(dma, d / 100))

results_df = pd.DataFrame(results)
print("\n================ FULL STRATEGY RESULTS ================\n")
print(results_df.to_string(index=False))

# BEST STRATEGY
best = results_df.loc[results_df["Net Profit"].idxmax()]
print("\n================ BEST STRATEGY FOUND ================\n")
print(best)

# PLOT BEST
plot_strategy(best["DMA"], best["Deviation %"])
