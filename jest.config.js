module.exports = {
  testEnvironment: 'node',
  verbose: true,
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Binance Test Report',
      outputPath: './out/test-report.html',
      includeFailureMsg: true,
      includeConsoleLog: true
    }]
  ],
  setupFiles: ['dotenv/config'],
  testTimeout: 30000,
  testMatch: ['**/tests/**/*.test.js'],
}