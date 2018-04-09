const path = require("path");
const webpack = require("webpack");
const glob = require("glob");
const HTMLPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');//代码分离

let entriesObj = getView('./src/js/*.js');
let pages = Object.keys(getView('./src/*html'));

let config = {
    entry:entriesObj,
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'[name]/[name].min.js',
        chunkFilename:'[name].chunk.js'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/\.(gif|png|jpeg|jpg)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:1024,
                            name:'[name]-lizn.[ext]'
                        }
                    }
                ]
            }

        ]
    },
    plugins:[
        new ExtractTextPlugin('[name].css',{
            allChunks:true
        })
    ]
};

function getView(globPath, pathDir) {//entry入口文件配置
    var files = glob.sync(globPath);
    var entries = {},
        entry, 
        dirname, 
        basename, 
        pathname, 
        extname;
        files.forEach(item=>{
            entry = item;
            dirname = path.dirname(entry);//当前目录
            extname = path.extname(entry);//输出文件名后缀
            basename = path.basename(entry,extname);//输出的是不含后缀的文件名
            pathname = path.join(dirname,basename);//文件路径
            if(extname === '.html'){
                entries[pathname] = './' + entry
            }else{
                entries[basename] = entry
            }
        })
    return entries;
};

pages.forEach(pathname=>{
    let htmlname = pathname.split('src\\')[1];
    let conf = {
        filename:`${htmlname}.html`,
        template:`${pathname}.html`,
        hash:true,
        chunks:[htmlname],
        minify:{
            removeAttributeQuotes:true,
            removeComments: true,
            collapseWhitespace: true,
            removeScriptTypeAttributes:true,
            removeStyleLinkTypeAttributes:true
        }
    }
    config.plugins.push(new HTMLPlugin(conf))
});


config.devServer = {
    port : 8080,
    host : '0,0,0,0',
    overlay:{
        errors:true,
    },
    hot:true
};
config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
)
module.exports = config