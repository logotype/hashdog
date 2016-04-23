import webpack from 'webpack'; // eslint-disable-line no-unused-vars
import yargs from 'yargs';

const { optimizeMinimize } = yargs.alias('p', 'optimize-minimize').argv;
const nodeEnv = optimizeMinimize ? 'production' : 'development';

export default {
    entry: {
        'HashDog': './src/HashDog.js',
        'MD5': ['./src/hash/MD5.js'],
        'SHA1': ['./src/hash/SHA1.js'],
        'SHA256': ['./src/hash/SHA256.js'],
        'SHA512': ['./src/hash/SHA512.js'],
        'Util': ['./src/util/Util.js']

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