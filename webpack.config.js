const path = require('path');                                    //a builtin node package to access absolute path
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],                                 //entry point is where webpack will start bundling(the main js file importing all other js files)
    output: {                                                   //tell webpack exactly where to save our bundled file
        path: path.resolve(__dirname, './dist'),               //the output folder where the bundled JS file and the injected html would be in
        filename: 'js/bundle.js'                          //create a folder(js) in the output folder that would contain the bundled JS file named bunde.js
    },   
    devServer: {
        contentBase: './dist'                              //where we want webpack to serve our files(as per its want we will ship to client)
    }, 
    plugins: [
        new HtmlWebpackPlugin({                             //we also want to send a copy of the index html from src folder to the dist folder(specified up there in the output property) where the bundled js will be automatically linked to it
            filename: 'index.html',                         //html output filename (what the name of the injected html file would be in the dist output folder)
            template: './src/indexSrc.html'                 //entry/starting html file(basically the src html file we wish to inject i.e indexSrc.html in src folder)
        }) 
    ],
    module: {                                              //babel loaders allow us to import or to load dif files and also process them(covert ES6 to ES5)
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }                                                
};