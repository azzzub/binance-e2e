const client = require("../../utils/client");

describe("account balance", () => {
  it("successfully fetch with omitZeroBalance param [TC024]", async () => {
    const response = await client.get(
      client.endpoints.account,
      {
        omitZeroBalances: true,
      },
      {
        isNeedSignature: true,
      }
    );

    expect(response.status).toBe(200);
    for (const balance of response.data.balances) {
      expect(parseFloat(balance.free)).toBeGreaterThan(0);
    }
  });

  it("should handle invalid api key error [TC025]", async () => {
    client.setApiKey("invalid_key");
    const response = await client.get(
      client.endpoints.account,
      {},
      {
        isNeedSignature: true,
        isNegativeCase: true,
      }
    );
    client.restoreApiKey();
    expect(response.status).toBe(401);
    expect(response.data.code).toBe(-2014);
    expect(response.data.msg).toBe("API-key format invalid.");
  });

  it("should handle no signature error [TC026]", async () => {
    const response = await client.get(
      client.endpoints.account,
      {},
      {
        isNeedSignature: false,
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
