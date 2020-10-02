'use strict';

const autoprefixer = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
	return path.resolve(appDirectory, relativePath);
}

const PATHS = {
	appSrc: resolveApp('src'),
	appBuild: resolveApp('dist'),
	appMainJs: resolveApp('src/js/main.js'),
	appNodeModules: resolveApp('node_modules'),
};

const DEV = process.env.NODE_ENV;

module.exports = {
	bail: !DEV,
	mode: DEV ? 'development' : 'production',
	target: 'web',
	devtool: DEV ? 'cheap-eval-source-map' : 'source-map',
	entry: {
		main: [
			'idempotent-babel-polyfill',
			resolveApp('src/js/polyfill/for-each.js'),
			PATHS.appMainJs,
		],
	},
	output: {
		path: PATHS.appBuild,
		filename: '[name].js',
	},
	module: {
		rules: [
			{parser: {requireEnsure: false}},
			{
				test: /\.m?js$/,
				include: PATHS.appSrc,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								ident: 'postcss',
								plugins: [autoprefixer()],
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.(jpg|png|woff|woff2|eot|ttf|otf|svg)$/,
				use: ['url-loader?limit=100000'],
			},
		],
	},
	optimization: {
		minimize: !DEV,
		minimizer: [
			new OptimizeCSSAssetsPlugin({
				cssProcessorOptions: {
					map: {
						inline: false,
						annotation: true,
					},
				},
			}),
			new TerserPlugin({
				terserOptions: {
					compress: {
						warnings: false,
					},
					output: {
						comments: false,
					},
				},
				sourceMap: true,
			}),
		],
	},
	plugins: [
		!DEV &&
			new CleanWebpackPlugin({
				cleanAfterEveryBuildPatterns: ['dist'],
			}),
		new MiniCssExtractPlugin({
			filename: 'main.css',
		}),
		DEV &&
			new FriendlyErrorsPlugin({
				clearConsole: false,
			}),
	].filter(Boolean),
};
