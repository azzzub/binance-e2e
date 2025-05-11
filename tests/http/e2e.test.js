const client = require("../../utils/client");

describe("e2e http", () => {
  const symbol = "BTCUSDT";
  const quantity = "0.001";

  let orderBookResponse;
  let limitOrderResponse;
  let accountBalanceResponse;

  let startTime;

  beforeAll(async () => {
    startTime = Date.now();
  });

  it("check account balance success [TC023]", async () => {
    const response = await client.get(
      client.endpoints.account,
      {},
      { isNeedSignature: true }
    );

    expect(response.status).toBe(200);
    accountBalanceResponse = response.data;
  });

  it("order book success [TC004]", async () => {
    const response = await client.get(client.endpoints.depth, {
      symbol,
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("lastUpdateId");
    expect(response.data).toHaveProperty("bids");
    expect(response.data).toHaveProperty("asks");
    expect(Array.isArray(response.data.bids)).toBe(true);
    expect(Array.isArray(response.data.asks)).toBe(true);

    orderBookResponse = response.data;
  });

  it("limit order buy success [TC008]", async () => {
    const side = "BUY";
    const price = orderBookResponse.bids[0][0];
    const type = "LIMIT";
    const timeInForce = "GTC";

    const orderData = {
      symbol,
      side,
      type,
      timeInForce,
      quantity: quantity,
      price,
    };

    const response = await client.post(client.endpoints.order, orderData, {
      isNeedSignature: true,
    });

    limitOrderResponse = response.data;

    expect(response.status).toBe(200);
    expect(response.data.symbol).toBe(symbol);
    expect(response.data.price).toBe(price);
    expect(response.data.timeInForce).toBe(timeInForce);
    expect(response.data.side).toBe(side);
    expect(response.data.type).toBe(type);
  });

  it("open orders success [TC015]", async () => {
    const price = orderBookResponse.bids[0][0];

    const response = await client.get(
      client.endpoints.openOrders,
      {
        symbol,
      },
      {
        isNeedSignature: true,
      }
    );

    lastIndex = response.data.length - 1;

    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThanOrEqual(1);
    response.data.forEach((order) => {
      expect(order).toHaveProperty("orderId");
      expect(order).toHaveProperty("symbol");
      expect(order).toHaveProperty("status");
      expect(order).toHaveProperty("type");
      expect(order).toHaveProperty("side");
    });
    expect(response.data[lastIndex].symbol).toBe(symbol);
    expect(response.data[lastIndex].price).toBe(price);
    expect(response.data[lastIndex].orderId).toBe(limitOrderResponse.orderId);
    expect(response.data[lastIndex].clientOrderId).toBe(
      limitOrderResponse.clientOrderId
    );
  });

  it("trade history success [TC021]", async () => {
    await new Promise((resolve) => setTimeout(resolve, 20000));
    const response = await client.get(
      client.endpoints.myTrades,
      {
        symbol,
        startTime,
        endTime: Date.now(),
      },
      {
        isNeedSignature: true,
      }
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThanOrEqual(1);
    expect(response.data[0].orderId).toBe(limitOrderResponse.orderId);
    expect(response.data[0].price).toBe(limitOrderResponse.price);
  });

  it("recheck balance after buy", async () => {
    const lastUsdtBalance = accountBalanceResponse.balances.find(
      (balance) => balance.asset === "USDT"
    ).free;
    const lastBtcBalance = accountBalanceResponse.balances.find(
      (balance) => balance.asset === "BTC"
    ).free;

    const response = await client.get(
      client.endpoints.account,
      {},
      { isNeedSignature: true }
    );

    const latestUsdtBalance = response.data.balances.find(
      (balance) => balance.asset === "USDT"
    ).free;
    const latestBtcBalance = response.data.balances.find(
      (balance) => balance.asset === "BTC"
    ).free;

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("canWithdraw");
    expect(response.data).toHaveProperty("canDeposit");
    expect(response.data).toHaveProperty("canTrade");
    expect(response.data).toHaveProperty("balances");
    expect(Array.isArray(response.data.balances)).toBe(true);

    response.data.balances.forEach((balance) => {
      expect(balance).toHaveProperty("asset");
      expect(balance).toHaveProperty("free");
      expect(balance).toHaveProperty("locked");

      expect(parseFloat(balance.free)).not.toBeNaN();
      expect(parseFloat(balance.locked)).not.toBeNaN();
    });

    // Check the USDT balance decrement after buying BTC
    expect(
      parseFloat(
        parseFloat(lastUsdtBalance) - parseFloat(latestUsdtBalance)
      ).toFixed(6)
    ).toBe(
      parseFloat(
        parseFloat(limitOrderResponse.price) * parseFloat(quantity)
      ).toFixed(6)
    );

    // Check the BTC balance after buying BTC
    expect(
      parseFloat(
        parseFloat(latestBtcBalance) - parseFloat(lastBtcBalance)
      ).toFixed(6)
    ).toBe(parseFloat(quantity).toFixed(6));

    // Update the balance
    accountBalanceResponse = response.data;
  });

  it("limit order sell success [TC009]", async () => {
    startTime = Date.now();

    // Get latest lowest price
    const orderBook = await client.get(client.endpoints.depth, {
      symbol,
    });

    const side = "SELL";
    const price = orderBook.data.bids[0][0]; 
    const type = "LIMIT";
    const timeInForce = "GTC";

    const orderData = {
      symbol,
      side,
      type,
      timeInForce,
      quantity: quantity,
      price,
    };

    const response = await client.post(client.endpoints.order, orderData, {
      isNeedSignature: true,
    });

    limitOrderResponse = response.data;

    expect(response.status).toBe(200);
    expect(response.data.symbol).toBe(symbol);
    expect(response.data.price).toBe(price);
    expect(response.data.timeInForce).toBe(timeInForce);
    expect(response.data.side).toBe(side);
    expect(response.data.type).toBe(type);
  });

  it("trade history sell success", async () => {
    await new Promise((resolve) => setTimeout(resolve, 20000));
    const response = await client.get(
      client.endpoints.myTrades,
      {
        symbol,
        startTime,
        endTime: Date.now(),
      },
      {
        isNeedSignature: true,
      }
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThanOrEqual(1);
    expect(response.data[0].orderId).toBe(limitOrderResponse.orderId);
    expect(response.data[0].price).toBe(limitOrderResponse.price);
  });

  it("recheck balance after sell", async () => {
    const lastUsdtBalance = accountBalanceResponse.balances.find(
      (balance) => balance.asset === "USDT"
    ).free;
    const lastBtcBalance = accountBalanceResponse.balances.find(
      (balance) => balance.asset === "BTC"
    ).free;
  
    const response = await client.get(
      client.endpoints.account,
      {},
      { isNeedSignature: true }
    );
  
    const latestUsdtBalance = response.data.balances.find(
      (balance) => balance.asset === "USDT"
    ).free;
    const latestBtcBalance = response.data.balances.find(
      (balance) => balance.asset === "BTC"
    ).free;
  
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.balances)).toBe(true);
  
    // Check the USDT balance increment after selling BTC
    expect(
      parseFloat(
        parseFloat(latestUsdtBalance) - parseFloat(lastUsdtBalance)
      ).toFixed(6)
    ).toBe(
      parseFloat(
        parseFloat(limitOrderResponse.price) * parseFloat(quantity)
      ).toFixed(6)
    );
    
    // Check the BTC balance after selling BTC
    expect(
      parseFloat(
        parseFloat(lastBtcBalance) - parseFloat(latestBtcBalance)
      ).toFixed(6)
    ).toBe(parseFloat(quantity).toFixed(6));
  });
});
