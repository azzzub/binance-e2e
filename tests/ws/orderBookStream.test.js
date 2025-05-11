const Socket = require("../../utils/socket");

describe("order book stream", () => {
  const symbol = "btcusdt";
  const socket = new Socket(`/${symbol}@depth`);

  afterAll(() => {
    socket.ws.close();
  });

  it("should receive valid depth stream data [TC027]", (done) => {
    let messageReceived = false;

    socket.ws.on("message", (data) => {
      if (!messageReceived) {
        const depthUpdate = JSON.parse(data.toString());

        expect(depthUpdate).toHaveProperty("e", "depthUpdate");
        expect(depthUpdate).toHaveProperty("E");
        expect(depthUpdate).toHaveProperty("s", symbol.toUpperCase());
        expect(depthUpdate).toHaveProperty("U");
        expect(depthUpdate).toHaveProperty("u");
        expect(depthUpdate).toHaveProperty("b");
        expect(depthUpdate).toHaveProperty("a");
        expect(Array.isArray(depthUpdate.b)).toBe(true);
        expect(Array.isArray(depthUpdate.a)).toBe(true);
        expect(depthUpdate.b.length).toBeGreaterThan(0);
        expect(depthUpdate.a.length).toBeGreaterThan(0);

        for (const bid of depthUpdate.b) {
          expect(bid).toHaveLength(2);
          for (const price of bid) {
            expect(parseFloat(price)).not.toBeNaN();
          }
        }

        messageReceived = true;
        done();
      }
    });
  }, 10000);
});
