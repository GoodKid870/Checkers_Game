function Board(){
    let board
    let game = Draughts()
    let socket
    let color
    let onDragStart = (source, piece, position, orientation) => {
        if(game.gameOver()){
            let confirm = window.confirm("Вы проиграли, начнем сначала?")
            if(confirm){
                board.start()
                 socket.requestNewGame()
                }
            } if (game.turn() != color || game.gameOver() || (game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1)){
            return false
        }
    }


    let onDrop =  (source, target) => {
        let turn = game.turn()
        let move = game.move({
            from: source,
            to: target,
        })
        updateStatus()
        if (move === null) return 'snapback'
       else {
           socket.sendMove(turn ,move.from, move.to)
        }
    }

    let updateStatus = () => {
        let status = ""
        let moveColor = "White"
        if(game.turn()=='b'){
            moveColor = "Black"
        }
        if (game.gameOver()){
            status = "Вы победили, у " + moveColor + " не осталось пешек";
            window.alert(status)
        }
    }

    function onSnapEnd() {
        board.position(game.fen())
    }

    const config = {
        showErrors: true,
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'unicode'
    }
    board = DraughtsBoard('board', config)
    return {
        makeMove: (source, target, promo ) => {
            game.move({from:source,to:target,promotion:promo})
        },
        setSocket: (newSocket) => {
            socket = newSocket
        },
        setFenPosition: () => {
            board.position(game.fen())
        },
        setOrientation: (playerColor) => {
            color = playerColor.charAt(0).toLowerCase()
            if(color=='w' || color=='b')
                board.orientation(playerColor)
        }
    }
}