const Socket = require("../../utils/socket");

describe("user stream", () => {
  const symbol = "btcusdt";
  const socket = new Socket("");

  afterAll(() => {
    socket.ws.close();
  });

  it("should receive valid user stream data [TC029]", (done) => {
    socket.ws.on("open", () => {
      socket.ws.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: [`${symbol}@trade`],
          id: 1,
        })
      );
    });

    socket.ws.on("message", (data) => {
      const msg = JSON.parse(data.toString());

      if (msg.result !== null) {
        expect(msg).toHaveProperty("e", "trade");
        expect(msg).toHaveProperty("E");
        expect(msg).toHaveProperty("s", symbol.toUpperCase());
        expect(msg).toHaveProperty("t");
        expect(msg).toHaveProperty("p");
        expect(msg).toHaveProperty("q");
        expect(msg).toHaveProperty("T");
        expect(msg).toHaveProperty("m");
        expect(msg).toHaveProperty("M");
        done();
      }
    });
  }, 10000);
});
