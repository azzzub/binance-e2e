const Socket = require("../../utils/socket");

describe("trade stream", () => {
  const symbol = "btcusdt";
  const socket = new Socket(`/${symbol}@trade`);

  afterAll(() => {
    socket.ws.close();
  });

  it("should receive valid trade stream data [TC028]", (done) => {
    let messageReceived = false;

    socket.ws.on("message", (data) => {
      if (!messageReceived) {
        const trade = JSON.parse(data.toString());

        expect(trade).toHaveProperty("e", "trade");
        expect(trade).toHaveProperty("E");
        expect(trade).toHaveProperty("s", symbol.toUpperCase());
        expect(trade).toHaveProperty("t");
        expect(trade).toHaveProperty("p");
        expect(trade).toHaveProperty("q");
        expect(trade).toHaveProperty("T");
        expect(trade).toHaveProperty("m");
        expect(trade).toHaveProperty("M");

        messageReceived = true;
        done();
      }
    });
  }, 10000);
});
