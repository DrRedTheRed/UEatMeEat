const WebSocket = require('ws');
const { handleRound, Player } = require('./gameLogic'); // 引入游戏逻辑

const wss = new WebSocket.Server({ port: 8080 });

let players = [];

wss.on('connection', (ws) => {
    console.log('一个新玩家连接了');

    if (players.length < 2) {
        players.push({ ws: ws, move: null });
    } else {
        ws.send('房间已满');
        ws.close();
    }

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        const currentPlayer = players.find(p => p.ws === ws);
        currentPlayer.move = data.action;

        if (data.type === 'setName') {
            currentPlayer.player = new Player(data.name);
            console.log(`玩家设置了名字：${data.name}`);
        } else {
            console.log(`玩家${currentPlayer.player.name}动作：${data.action}`);
        }
        

        // 检查是否两个人都出招了
        if (players[0].move && players[1].move) {
            const result = handleRound(
                players[0].move,
                players[1].move,
                players[0].player,
                players[1].player
            );

            // 广播给两边
            players.forEach((p, index) => {
                const playerResult = {
                    ...result,
                    yourName: players[index].player.name,   // 当前玩家的名字
                    enemyName: players[1 - index].player.name // 对手的名字
                };
                p.ws.send(JSON.stringify(playerResult));
            });

            // 重置出招
            players[0].move = null;
            players[1].move = null;

            // 如果有人赢了，断开连接
            if (result.winner || result.loser) {
                players.forEach(p => p.ws.close());
                players = [];
            }
        }
    });

    ws.on('close', () => {
        console.log('一个玩家离开了');
        players = players.filter(p => p.ws !== ws);
    });
});
