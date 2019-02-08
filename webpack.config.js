const path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin  = require('clean-webpack-plugin');
const webpack = require('webpack');
const targetPath = '../public/css/';



module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
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
			filename: "admin.css",
			chunkFilename: "admin.[hash].css"
		})
	],
	devtool: 'source-map',
	entry: ['./company/sass/admin.scss'],
	output: {
		path: path.resolve('../public/css/company/')
	},
	module: {
		rules: [
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
					{ loader: 'sass-loader', options: { sourceMap: true } },
				]
			}
		]
	},

};
