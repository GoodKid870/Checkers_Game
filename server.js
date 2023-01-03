const express = require('express')
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const socketServer = require("./server/socketServer")
const { startPage, publicFiles } = require('./route')

app.get('/', (req, res) => {
    startPage(req, res);
})
app.get(/\.(css|js|jpeg|jpg|png|svg|ico)/, (req, res) => {
    publicFiles(req, res);
})

socketServer(io)

server.listen(1337, console.log('Сервер работает, порт: 1337'))
















