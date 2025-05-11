const client = require("../../utils/client");

describe("limit order", () => {
  const symbol = "BTCUSDT";
  const quantity = "0.001";
  const price = "110000";

  it("should handle missing some required parameter on limit type error [TC010]", async () => {
    const orderData = {
      symbol,
      side: "BUY",
      type: "LIMIT",
      // No mandatory timeInForce
      // timeInForce: "GTC",
      quantity,
      price,
    };

    const response = await client.post(client.endpoints.order, orderData, {
      isNeedSignature: true,
      isNegativeCase: true
    });

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(-1102);
    expect(response.data.msg).toBe("Mandatory parameter 'timeInForce' was not sent, was empty/null, or malformed.");
  });

  it("should handle 0 quantity error [TC011]", async () => {
    const orderData = {
      symbol,
      side: "BUY",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: 0,
      price,
    };

    const response = await client.post(client.endpoints.order, orderData, {
      isNeedSignature: true,
      isNegativeCase: true
    });

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(-1013);
    expect(response.data.msg).toBe("Invalid quantity.");
  });

  it("should handle high quantity error [TC012]", async () => {
    const orderData = {
      symbol,
      side: "BUY",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: 1000000000,
      price,
    };

    const response = await client.post(client.endpoints.order, orderData, {
      isNeedSignature: true,
      isNegativeCase: true
    });

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(-1013);
    expect(response.data.msg).toBe("QTY is over the symbol's maximum QTY.");
  });

  it("should handle 0 price error [TC013]", async () => {
    const orderData = {
      symbol,
      side: "BUY",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity,
      price: 0,
    };

    const response = await client.post(client.endpoints.order, orderData, {
      isNeedSignature: true,
      isNegativeCase: true
    });

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(-1013);
    expect(response.data.msg).toBe("Invalid price.");
  });

  it("should handle no signature error [TC014]", async () => {
    const orderData = {
      symbol,
      side: "BUY",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity,
      price,
    };

    const response = await client.post(client.endpoints.order, orderData, {
      isNegativeCase: true
    });

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(-1102);
    expect(response.data.msg).toBe(
      "Mandatory parameter 'signature' was not sent, was empty/null, or malformed."
    );
  });
});
