class Player {
    constructor(name) {
        this.name = name;
        this.hp = 0;
    }

    applyDamage(delta) {
        this.hp += delta;
    }

    isWinner() {
        return this.hp >= 5;
    }

    isLoser() {
        return this.hp <= -5;
    }
}

function damage(move) {
    if (move === '💩') {
        return -1;
    } else if (move === '🍔') {
        return +1;
    } else {
        return 0;
    }
}

function handleRound(playerMove, enemyMove, player, enemy) {
    let totalDelta = 0;
    totalDelta += damage(playerMove);
    totalDelta += damage(enemyMove);

    if (playerMove === '我' ||  enemyMove === '你'){
        player.applyDamage(totalDelta);
    } else if (playerMove === '你' || enemyMove === '我'){
        enemy.applyDamage(totalDelta);
    }

    let result = {
        yourMove: playerMove,
        enemyMove: enemyMove,
        yourHP: player.hp,
        enemyHP: enemy.hp,
        winner: null,
        loser: null,
        yourName: player.name,  // 当前玩家的名字
        enemyName: enemy.name   // 对手的名字
    };

    if (player.isWinner()) result.winner = player.name;
    if (enemy.isWinner()) result.winner = enemy.name;
    if (player.isLoser()) result.loser = player.name;
    if (enemy.isLoser()) result.loser = enemy.name;

    return result;
}

module.exports = { Player, handleRound };
