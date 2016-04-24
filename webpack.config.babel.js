import webpack from 'webpack'; // eslint-disable-line no-unused-vars
import yargs from 'yargs';

const { optimizeMinimize } = yargs.alias('p', 'optimize-minimize').argv;
const nodeEnv = optimizeMinimize ? 'production' : 'development';

export default {
    entry: {
        'HashDog': './src/HashDog.js'
    },
    target: 'node',
    output: {
        path: './build',
        filename: '[name].js',
        library: 'HashDog',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ }
        ]
    },
    externals: [],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { 'NODE_ENV': JSON.stringify(nodeEnv) }
        })
    ],
    devtool: optimizeMinimize ? 'source-map' : null
};