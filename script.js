const apple = document.querySelector(".apple");
const board = document.querySelector(".board");
const gameOverText = document.querySelector(".gameOver");
const score = document.querySelector(".score");
const playButton = document.querySelector(".playButton");

const appleCoords = {
    x: 0,
    y: 0,
    newCoords() {
        this.x = Math.floor(Math.random()*15);
        this.y = Math.floor(Math.random()*15);
    }
}

const directions = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
}

function newApple(snake) {
    const oldX = appleCoords.x;
    const oldY = appleCoords.y;
    while ((appleCoords.x === oldX && appleCoords.y === oldY) || ([appleCoords.x, appleCoords.y] in snake.body)) {
        appleCoords.newCoords();
        console.log("old :" + oldX + "," + oldY + " ; new :" + appleCoords.x + "," + appleCoords.y); 
    } 
    apple.style.left = appleCoords.x*32 + "px";
    apple.style.top = appleCoords.y*32 + "px";
}

function newSerpentPiece(coords, direction) {
    let piece = document.createElement("div");
    board.appendChild(piece);
    piece.setAttribute("class", "serpentPiece");
    piece.style.left = coords[0]*32 + "px";
    piece.style.top = coords[1]*32 + "px";
    switch (direction) {
        case directions.up:
            piece.style.borderLeftColor = "#FFFFFF";
            piece.style.borderRightColor = "#FFFFFF";
            break;
        case directions.right:
            piece.style.borderTopColor = "#FFFFFF";
            piece.style.borderBottomColor = "#FFFFFF";
            break;
        case directions.down:
            piece.style.borderLeftColor = "#FFFFFF";
            piece.style.borderRightColor = "#FFFFFF";
            break;
        case directions.left:
            piece.style.borderTopColor = "#FFFFFF";
            piece.style.borderBottomColor = "#FFFFFF";
            break;
    }
    return piece
}

function play() {

    const snake = {
        body: [[4,7]],
        pieces: [newSerpentPiece([4,7])],
        head: [4,7],
        direction: [],
        nextDirection: directions.right,
        length: 3,
        move() {
            if (this.direction.length != 0) {
                this.nextDirection = this.direction.shift();
            }
            switch (this.nextDirection) {
                case directions.up:
                    this.head = [this.head[0], this.head[1]-1];
                    this.body.push(this.head);
                    break;
                case directions.right:
                    this.head = [this.head[0]+1, this.head[1]];
                    this.body.push(this.head);
                    break;
                case directions.down:
                    this.head = [this.head[0], this.head[1]+1];
                    this.body.push(this.head);
                    break;
                case directions.left:
                    this.head = [this.head[0]-1, this.head[1]];
                    this.body.push(this.head);
                    break;
            }
            this.pieces.push(newSerpentPiece(this.head, this.nextDirection));
            if (this.body.length > this.length) {
                this.pieces.shift().remove();
                this.body.shift();
            }
        },
        isDead() {
            if (this.head[0] > 15 || this.head[0] < 0 || this.head[1] > 15 || this.head[1] < 0) {
                return true;
            }
            for (let i = 0; i < this.body.length-1; i++) {
                if (this.body[i][0] === this.head[0] && this.body[i][1] === this.head[1]) {
                    return true;
                }
            }
            return false;
        }
    };

    gameOverText.innerHTML = "";
    score.innerHTML = "";
    newApple(snake)
    document.querySelectorAll('.serpentPiece').forEach(e => e.remove());
    playButton.style.visibility = "hidden";
    apple.style.visibility = "visible";

    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case "w":
                if (snake.direction.length != 0 && snake.direction[snake.direction.length-1] != directions.down && snake.direction[snake.direction.length-1] != directions.up 
                    || snake.direction.length == 0 && snake.nextDirection != directions.down) {
                    snake.direction.push(directions.up);
                }
                break;
            case "a":
                if (snake.direction.length != 0 && snake.direction[snake.direction.length-1] != directions.right && snake.direction[snake.direction.length-1] != directions.left
                    || snake.direction.length == 0 && snake.nextDirection != directions.right) {
                    snake.direction.push(directions.left);
                }
                break;
            case "s":
                if (snake.direction.length != 0 && snake.direction[snake.direction.length-1] != directions.up && snake.direction[snake.direction.length-1] != directions.down
                    || snake.direction.length == 0 && snake.nextDirection != directions.up) {
                    snake.direction.push(directions.down);
                }
                break;
            case "d":
                if (snake.direction.length != 0 && snake.direction[snake.direction.length-1] != directions.left && snake.direction[snake.direction.length-1] != directions.right
                    || snake.direction.length == 0 && snake.nextDirection != directions.left) {
                    snake.direction.push(directions.right);
                }
                break;
        }
    }, false);

    let interval = setInterval(() => {
        snake.move();
        if (snake.isDead()) {
            gameOverText.innerHTML = "Game Over";
            score.innerHTML = "Score: "+snake.length;
            playButton.style.top = "70%";
            playButton.innerHTML = "Try again";
            playButton.style.visibility = "visible";
            clearInterval(interval);
        }
        if (snake.head[0] === appleCoords.x && snake.head[1] === appleCoords.y) {
            snake.length++;
            newApple(snake);
        }
    }, 200);
    
    return snake;
}

apple.style.visibility = "hidden";