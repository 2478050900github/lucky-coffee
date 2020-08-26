module.exports = {
    publicPath: './',
    devServer: {
        proxy: {
            '/api': {
                //路径指向本地主机地址及端口号
                // target: 'http://localhost:8080', 
                target: 'http://192.168.54.92:8080',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/data' //路径转发代理
                }
            }
        }
    }
}