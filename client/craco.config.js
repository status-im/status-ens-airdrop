module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: require.resolve('crypto-browserify'),
          buffer: require.resolve('buffer'),
          process: require.resolve('process/browser'),
        }
      }
    }
  },
}
