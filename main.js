const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const user = {
    x: 15,
    y: canvas.height / 2 - 100 / 2,
    width: 15,
    height: 100,
    color: "white",
    speed: 10,
    score: 0
}

const com = {
    x: canvas.width - 10 - 15,
    y: canvas.height / 2 - 100 / 2,
    width: 15,
    height: 100,
    color: "white",
    score: 0
}

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "white"
}

let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";


function drawRect(x,y,w,h,color){
    ctx.fillStyle = color
    ctx.fillRect(x,y,w,h)
}

function drawCircle(x,y,r,color){
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()
}

function drawText(text, x, y, color){
    ctx.fillStyle = color
    ctx.font = "45px fantasy"
    ctx.fillText(text, x, y)
}

const net = {
    x: canvas.width / 2,
    y: 0,
    width: 2,
    height: 10,
    color: "white"
}

function drawNet(){
    for(let i = 0; i < canvas.height; i += 15){
        drawRect(net.x, net.y + i , net.width, net.height, "white")
    }
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetBall(){
    ball.speed = 5
    ball.velocityX = -ball.velocityX
    ball.x = canvas.width / 2
    ball.y = canvas.height / 2
}

window.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect()

    if((e.clientY - rect.top + user.height / 2) > canvas.height){
        user.y = canvas.height - user.height
    } else if((e.clientY - rect.top - user.height / 2) < 0){
        user.y = 0
    } else {
        user.y = e.clientY - rect.top - user.height / 2
    }
})


function render(){
    drawRect(0, 0, canvas.width, canvas.height, "black")
    drawNet()
    drawCircle(ball.x, ball.y, ball.radius, ball.color)
    drawRect(user.x, user.y, user.width, user.height, "white")
    drawRect(com.x, com.y, com.width, com.height, "white")
    drawText(user.score, 1 * canvas.width/5, 1 * canvas.height/5, "white")
    drawText(com.score, 4 * canvas.width/5, 1 * canvas.height/5, "white")
}

function update(){
    ball.x += ball.velocityX
    ball.y += ball.velocityY

    let comSpeed = 0.1
    com.y += (ball.y - (com.y + com.height/2)) * comSpeed

    if(ball.y +ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY *= -1
        wall.play()
    }

    let player = (ball.x < canvas.width/2) ? user : com

    if(collision(ball, player)){
        hit.play()

        ball.velocityX *= -1

        let collidePoint = ball.y - (player.y + player.height/2)

        collidePoint = collidePoint/(player.height/2)

        let angleRad = collidePoint * Math.PI/4

        let direction = (ball.x < canvas.width / 2) ? 1 : -1

        ball.velocityX = direction * ball.speed * Math.cos(angleRad)
        ball.velocityY = ball.speed * Math.sin(angleRad)

        ball.speed += 0.5
    }

    if(ball.x - ball.radius < 0){
        com.score++
        
        comScore.play()
        
        resetBall()
    } else if (ball.x + ball.radius > canvas.width){
        user.score++

        userScore.play()

        resetBall()
    }
}


function game (){
    update()
    render()
}

const fps = 60

setInterval(game, 1000/fps)