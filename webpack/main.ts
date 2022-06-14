import TsPaths from 'tsconfig-paths-webpack-plugin'
import { Configuration } from 'webpack'

import Entries from './config/entries'
import { APP_DIR, DIST_DIR, resolve } from './config/path'

// plugins
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
// new BundleAnalyzerPlugin({ openAnalyzer: false })

const Main: Configuration = {
    entry: Entries,
    output: {
        path: DIST_DIR,
        clean: true,
        filename: '[name].[contenthash].js',
        sourceMapFilename: 'source_maps/[file].map',
        assetModuleFilename: 'assets/[hash][ext][query]',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    devtool: 'source-map',
    plugins: [],
    resolve: {
        extensions: ['.mjs', '.tsx', '.ts', '.js'],
        plugins: [
            new TsPaths({ configFile: resolve(APP_DIR, 'tsconfig.json') }),
        ],
    },
}

export default Main
