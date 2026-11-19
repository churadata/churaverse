const path = require('node:path')
const nodeExternals = require('webpack-node-externals')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    server: './src/server.ts',
  },
  target: 'node',
  node: {
    // expressを使うときにはこの設定をしないと失敗します
    // 参考：https://medium.com/@binyamin/creating-a-node-express-webpack-app-with-dev-and-prod-builds-a4962ce51334
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            allowTsInNodeModules: true,
          },
        },
        exclude: /node_modules\/(?!@churaverse)/, // @churaverseパッケージは除外しない
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: 'json-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      // dataディレクトリ全体をエイリアス
      './data': path.resolve(__dirname, 'node_modules/@churaverse/map-plugin-server/data'),
    },
  },
  externals: [
    nodeExternals({
      // Churaverseの全パッケージをバンドルに含める場合
      allowlist: [/^@churaverse\//, /\.json$/],
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    // 動的importのコンテキストを正しく設定
    new webpack.ContextReplacementPlugin(
      // './data/' で始まる動的importを対象
      /\.\/data$/,
      path.resolve(__dirname, 'node_modules/@churaverse/map-plugin-server/data'),
      true, // すべてのファイルを含める
      /\.json$/ // JSONファイルのみ
    ),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'node_modules/@churaverse/map-plugin-server/data'),
          to: path.resolve(__dirname, 'dist/data'),
        },
      ],
    }),
  ],
}
