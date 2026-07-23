const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')

const publicDirectory = path.resolve(__dirname, '../public')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        plugins:
        [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [
                    path.resolve(publicDirectory, '**/*')
                ],
                dangerouslyAllowCleanPatternsOutsideProject: true,
                dry: false
            })
        ]
    }
)
