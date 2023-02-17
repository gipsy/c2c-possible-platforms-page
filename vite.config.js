const path = require('path')

export default {
  root: path.resolve(__dirname, 'src'),
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
      '~components': path.resolve(__dirname, 'src/scss/components'),
    }
  },
  server: {
    port: 8080,
    hot: true
  }
}
