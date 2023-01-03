let socket
let board
let init = function(){
    socket = SocketClient()
    board = Board()
    board.setSocket(socket)
    socket.setBoard(board)
    board.setOrientation("w")
}

