const path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin  = require('clean-webpack-plugin');
const webpack = require('webpack');
const targetPath = '../public/css/';



module.exports = {
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: true // set to true if you want JS source maps
			}),
			new OptimizeCSSAssetsPlugin({})
		]
	},
	plugins: [
		new CleanWebpackPlugin(['company'],{
			root: __dirname + '/' + targetPath
		}),
		new MiniCssExtractPlugin({
			filename: "../css/admin.css",
			chunkFilename: "admin.[chunkhash:7].css"
		})
	],
	resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css', '.scss'],
  },
	devtool: 'source-map',
	entry: './resources/company/js/ui.js',
	output: {
		filename: 'ui.js',
		path: path.resolve(__dirname, 'public/js/company/js/')
		
	},
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: [/node_modules/],
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
					{ loader: 'sass-loader', options: { sourceMap: true } },
				]
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			}
		]
	},

};
