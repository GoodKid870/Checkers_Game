let users = []
function generateRoomId() {
    let result = ""
    let length = 16
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-@"

    for (let i = 0; i < length; i++)
        result += possible.charAt(Math.floor(Math.random() * possible.length))

    return result

}


exports = module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected')
        io.emit("greetings","Добро пожаловать в шашки онлайн =)")

        socket.on('sendName',sendName)

        socket.on("joinRequestTo",joinRequestTo)

        socket.on('joinRequestAnswer',joinRequestAnswer)

        socket.on("joinRoom",joinRoom)

        socket.on('move', broadcastMove)

        socket.on('newGameRequest',newGameRequest)

        socket.on('disconnect',disconnect)


        function joinRequestTo(name){
            console.log('sendRequest to ' + name)
            for (let i=0;i<users.length;i++){
                if(users[i].name===name){
                    socket.broadcast.to(users[i].room).emit("joinRequestFrom",socket.id);
                    break
                }
            }
        }
        function newGameRequest(room){
            if(room)
                socket.broadcast.to(room).emit("newGameRequest");
        }

        function joinRoom(room){
            console.log("joined room" + room)
            socket.broadcast.to(room).emit("sendMessage","SERVER : a user just joined")
            if(room){
                socket.join(room);
                users.filter(user=>user.id == socket.id)[0].room = room;
            }
        }

        function sendName(name){
            let isNameValid = true
            for (let i=0;i<users.length;i++){
                if (users[i].name===name){
                    isNameValid = false
                    socket.emit('nameError','Такое имя уже есть =(')
                    return;
                }
            }
            if (isNameValid){
                let room = generateRoomId()
                users.push({id:socket.id, name:name, room:room});
                socket.join(room);
                socket.emit("roomId",room)
            }
        }

        function joinRequestAnswer(answer,socketId){
            let user = users.filter(user=>user.id == socket.id)[0]

            if (answer=="yes"){
                socket.to(socketId).emit("joinRoom",user.room, user.name)
            }
        }

        function broadcastMove(room, moveData){
            socket.broadcast.to(room).emit("move", moveData)
        }



        function disconnect(){
            for(let i =0;i<users.length;i++){
                if(users[i].id == socket.id){
                    socket.broadcast.to(users[i].room).emit("opponentDisconnect")
                    users.splice(i,1)
                    break;
                }
            }

        }
    })

}
