const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const sass = require('node-sass');

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		// see below for an explanation
		mainFields: ['svelte', 'browser', 'module', 'main'],
		extensions: ['.mjs', '.js', '.svelte']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
						style: ({ content, attributes }) => {
							if (attributes.type !== 'text/scss') return;

							return new Promise((fulfil, reject) => {
								sass.render({
									data: content,
									includePaths: ['src'],
									sourceMap: true,
									outFile: 'x' // this is necessary, but is ignored
								}, (err, result) => {
									if (err) return reject(err);

									fulfil({
										code: result.css.toString(),
										map: result.map.toString()
									});
								});
							});
						}
					}
				}
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader", // creates style nodes from JS strings
					"css-loader", // translates CSS into CommonJS
					"sass-loader" // compiles Sass to CSS
				]
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {},
					},
				],
			}
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
	],
	devtool: prod ? false: 'source-map'
};