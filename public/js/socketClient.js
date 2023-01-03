function SocketClient(){
    let socket = io.connect()
    let nameForm = $('#nameForm')
    let nameInput = $('#nameInput')
    let name = $("#name")
    let joinGame = $('#joinGame')
    let hostName = $('#hostName')
    let room
    let board

    nameForm.submit( () => {
        socket.emit("sendName",nameInput.val())
        name.text(nameInput.val())
        nameInput.val('')
        nameForm.hide()
        return false
    })


    joinGame.submit( () => {
        if(room)
            socket.emit("joinRequestTo",hostName.val())
        else{
            alert("Вы не ввели имя =(")
        }
        hostName.val('')
        return false
    })

    socket.on("joinRequestFrom", (socketId) => {
        console.log("join request from " + socketId)
        let confirm = window.confirm("К вам хотят присоедениться для игры, принять?")
        if(confirm){
                socket.emit("joinRequestAnswer","yes",socketId)
                socket.emit(board)
            } else {
            socket.emit("joinRequestAnswer","no",socketId)
        }
    })


    socket.on('move', (moveData) => {
        let from, to
        to = moveData.to
        from = moveData.from
        board.makeMove(from, to)
        board.setFenPosition()
    })

    socket.on('roomId', (roomId) => {
        room = roomId
    })

    socket.on("joinRoom", (newRoom,host) => {
        window.alert("Вы присоединились к игроку " + host)
        room = newRoom
        socket.emit("joinRoom",room)
        board.setOrientation('black')
    });
    socket.on("nameError", (message) => {
        window.alert(message)
        name.text("Unknown")
        nameForm.show()
    })

    socket.on('greetings', (msg) => {
        console.log(msg)
    });

    socket.on('opponentDisconnect', () => {
        alert("Соперник вышел из комнаты")
        board.setOrientation("white")
        board.clear()
        console.log("disconnect")
    })

    return {
        setBoard: (newBoard) => {
            board = newBoard
        },
        sendMove: (turn,source,target,promo) => {
            socket.emit("move",room,{color:turn, from:source,to:target,promotion:promo||''})
        },
        requestNewGame: () => {
            socket.emit("newGameRequest",room)
        }
    }
}
