var canvas = document.getElementById('canvas'),
    content = canvas.getContext('2d'),
    WIDTH,
    HEIGHT,
    round = [],
    initRoundPopulation = 80,
    para = {
        num: 100,
        color: false, // 颜色 如果是false 则是随机渐变颜色 
        r: 0.9, // 圆每次增加的半径 
        o: 0.09, // 判断圆消失的条件，数值越大，消失的越快 
        a: 1
    },
    color,
    color2,
    round_arr = [];
WIDTH = canvas.width = document.documentElement.clientWidth;
HEIGHT = canvas.height = document.documentElement.clientHeight;

// 判断参数中是否设置了 color，如果设置了 color，就使用该值、 
// 如果参数中的 color 为 false，那么就使用随机的颜色 
if (para.color) {
    color2 = para.color;
} else {
    color = Math.random() * 360;
}

function Round_item(index, x, y) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.r = Math.random() * 2 + 1;
    var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
    this.color = "rgba(255,255,255," + alpha + ")";
}

Round_item.prototype.draw = function () {
    content.fillStyle = this.color;
    content.shadowBlur = this.r * 2;
    content.beginPath();
    content.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    content.closePath();
    content.fill();
};

Round_item.prototype.move = function () {
    this.y += 1.5;
    if (this.y >= HEIGHT + 10) {
        this.y = -10;
    }
    this.draw();
};

window.onmousemove = function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    round_arr.push({
        mouseX: mouseX,
        mouseY: mouseY,
        r: para.r, // 设置半径每次增大的数值 
        o: 1, // 判断圆消失的条件，数值越大，消失的越快 
    })
};

function animate() {
    content.clearRect(0, 0, WIDTH, HEIGHT);
    for (var i in round) {
        round[i].move();
    }

    if (!para.color) {
        color += .1;
        color2 = 'hsl(' + color + ',100%,80%)';
    }
    for (var i = 0; i < round_arr.length; i++) {
        content.fillStyle = color2;
        content.beginPath();
        content.arc(round_arr[i].mouseX, round_arr[i].mouseY, round_arr[i].r, 0, Math.PI * 2);
        content.closePath();
        content.fill();
        round_arr[i].r += para.r;
        round_arr[i].o -= para.o;
        if (round_arr[i].o <= 0) {
            round_arr.splice(i, 1); i--;
        }
    }

    window.requestAnimationFrame(animate)
}


function init() {
    for (var i = 0; i < initRoundPopulation; i++) {
        round[i] = new Round_item(i, Math.random() * WIDTH, Math.random() * HEIGHT);
        round[i].draw();
    }
    animate();
}

document.getElementById('back').addEventListener('click', function () {
    window.history.back();
});

init();