const client = require("../../utils/client");

describe("open orders", () => {
  const symbol = "BTCUSDT";

  it("should successfully without symbol [TC016]", async () => {
    const response = await client.get(
      client.endpoints.openOrders,
      {},
      {
        isNeedSignature: true,
      }
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("should successfully with no order placed [TC017]", async () => {
    const response = await client.get(
      client.endpoints.openOrders,
      {
        symbol: "ETHUSDT",
      },
      {
        isNeedSignature: true,
      }
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(0);
  });

  it("should handle no signature error [TC018]", async () => {
    const response = await client.get(
      client.endpoints.openOrders,
      {
        symbol,
      },
      {
        isNegativeCase: true,
      }
    );

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(-1102);
    expect(response.data.msg).toBe(
      "Mandatory parameter 'signature' was not sent, was empty/null, or malformed."
    );
  });
});
