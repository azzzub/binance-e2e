const client = require("../../utils/client");

describe("order book", () => {
  const symbol = "BTCUSDT";

  it("should successfully fetch with limit param [TC001]", async () => {
    const limit = 5;

    const response = await client.get(client.endpoints.depth, {
      symbol,
      limit,
    });

    expect(response.status).toBe(200);
    expect(response.data.bids.length).toBeLessThanOrEqual(limit);
  });

  it("should successfully fetch with more than maximum limit param [TC002]", async () => {
    const limit = 6000;
    const expectedLimit = 5000; // Maximum limit for Binance API

    const response = await client.get(client.endpoints.depth, {
      symbol,
      limit,
    });

    expect(response.status).toBe(200);
    expect(response.data.bids.length).toBeLessThanOrEqual(expectedLimit);
  });

  it("should handle invalid symbol error [TC003]", async () => {
    const invalidSymbol = "INVALID";

    const response = await client.get(
      client.endpoints.depth,
      {
        symbol: invalidSymbol,
      },
      {
        isNegativeCase: true,
      }
    );

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(-1121);
    expect(response.data.msg).toBe("Invalid symbol.");
  });

  it("should handle fetch with invalid limit param error [TC005]", async () => {
    const response = await client.get(
      client.endpoints.depth,
      {
        symbol,
        limit: -5,
      },
      {
        isNegativeCase: true,
      }
    );

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(-1100);
    expect(response.data.msg).toBe(
      "Illegal characters found in parameter 'limit'; legal range is '^[0-9]{1,20}$'."
    );
  });

  it("should handle lowercase symbol error [TC006]", async () => {
    const invalidSymbol = "btcusdt";

    const response = await client.get(
      client.endpoints.depth,
      {
        symbol: invalidSymbol,
      },
      {
        isNegativeCase: true,
      }
    );

    expect(response.status).toBe(400);
    expect(response.data.code).toBe(-1100);
    expect(response.data.msg).toBe(
      "Illegal characters found in parameter 'symbol'; legal range is '^[A-Z0-9-_.]{1,20}$'."
    );
  });

  it("should successfully fetch with empty api key [TC007]", async () => {
    // Set empty API key
    client.setApiKey("");

    const response = await client.get(client.endpoints.depth, {
      symbol,
    });

    client.restoreApiKey();

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("bids");
    expect(response.data).toHaveProperty("asks");
  });
});
