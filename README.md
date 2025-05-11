# Binance API & WebSocket Testing

## Prerequisite
- Node v18.20.0 or higher
- Npm v10.8.2 or higher
- Make
- Binance API Key

## Setup
1. Install the dependencies
```bash
make setup
```
This will install the dependencies and create a `.env` file

2. If you don't have a Binance API Key, please follow the steps below to generate one

## Generate Keys
**Note:** This step is only required if you don't have a Binance API Key
1. Generate private and public keys
```bash
make generate_key
```
2. Public key and private key will be generated and located in the root folder
3. Copy the public key and register it on [Testnet Binance](https://testnet.binance.vision/)
4. Copy the API key that generated after you register the public key into `.env` file

## Run the Test

#### Module

| Test Suite | Description | Command |
|:--|:-|:-|
| All test suite | Run all the test | `npm test` |
| End-to-End Test (REST) | Complate user journey | `npm test e2e.test.js` |
| Regression Test (REST) | Regress all the REST endpoint | `npm test /http` |
| Regression Test (WS) | Regress all the WS endpoint | `npm test /ws` |

#### Spot Trading API (REST)

| Test Suite | Endpoint | Command |
|:--|:-|:-|
| Order Book | `/api/v3/depth` | `npm test orderBook.test.js` |
| Limit Order | `/api/v3/order` | `npm test limitOrder.test.js` |
| Open Orders | `/api/v3/openOrders` | `npm test openOrders.test.js` |
| Trade History | `/api/v3/myTrades` | `npm test tradeHistory.test.js` |
| Account Balance | `/api/v3/account` | `npm test accountBalance.test.js` |

#### Market Data & Order Updates (Websocket)

| Test Suite | Endpoint | Command |
|:--|:-|:-|
| Order Book Stream | `/ws/btcusdt@depth` | `npm test orderBookStream.test.js` |
| Trade Stream | `/ws/btcusdt@trade` | `npm test tradeStream.test.js` |
| User Stream | `/ws` | `npm test userStream.test.js` |

## File Structure
```bash
binance-e2e
├── config/
│   └── config.yaml         (you can set the binance testnet or mainnet host in this file)
├── out/
│   ├── test-report.html    (generated after test is complate)
│   └── test.log            (your log information)
├── tests/                  (test collection)
│   ├── http/               (rest endpoint)
│   │   └── **.test.js      (test suite collection)
│   └── ws/                 (websocket endpoint)
│       └── **.test.js      (test suite collection)
├── utils/                  (the helper function)
└── .env                    (place of your binance api key)
```

## Log & Report
- The log file is located in the `out` folder, you can debug the test by looking at the log or at the console output
- The report file is located in the `out` folder also as a html file, you can view the report by opening the `test-report.html` file or by running the command below
```bash
make report
```
- You can clean the log and report file by running the command below
```bash
make clean
```

## Test Cases
You can see all the test cases in the [📗 Spreadsheet here](https://docs.google.com/spreadsheets/d/1p87PeAzyiTDa2yGU8nvIMQxk_wVkr87xL2BBdh3RsPc/edit?gid=0#gid=0)
