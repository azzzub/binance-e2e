const client = require("../../utils/client");

describe("trade history", () => {
  const symbol = "BTCUSDT";

  it("should successfully fetch with no startTime and endTime param [TC019]", async () => {
    const response = await client.get(
      client.endpoints.myTrades,
      {
        symbol,
      },
      {
        isNeedSignature: true,
      }
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });

  it("should successfully fetch with no trade history [TC020]", async () => {
    const response = await client.get(
      client.endpoints.myTrades,
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

  it("should handle no signature error [TC022]", async () => {
    const response = await client.get(
      client.endpoints.myTrades,
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
