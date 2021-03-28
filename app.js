const http = require('http')
const fs = require('fs')
const template = require('art-template')
const querystring = require('querystring')
let comments = []
http.createServer((request, response) => {
    let url = request.url
    console.log('url', url)
    if(url.indexOf('/api/') === -1){
        if (url === '/' || url === '/index.html') {
            url = './view/index.html'
            // 处理静态文件
        } else if (url.indexOf('/public/') === 0 || url.indexOf('/node_modules/') === 0) {
            url = '.' + url
        } else if (url === '/comment') {
            url = './view/comment.html'
        } else {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            })
            return response.end('404 NOT FOUND')
        }
        fs.readFile(url, (err, data) => {
            if (err) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                })
                return response.end('404 NOT FOUND')
            } else {
                if (url === './view/index.html') {
                    let commentHtml = template.render(data.toString(), {comments})
                    response.end(commentHtml)
                } else {
                    response.end(data)
                }
            }
        })
        // 只有一个接口，懒得处理了
    } else if (url.indexOf('/api/') === 0) {
        let stringUrl = request.url.split('?')
        const params = querystring.parse(stringUrl[1])
        params.dateTime = new Date().toLocaleString()
        comments.unshift(params)
        response.writeHead(302, {
            'Location': '/'
        })
        response.end()
    }
}).listen(4396, () => {
    console.log('server run..')
})