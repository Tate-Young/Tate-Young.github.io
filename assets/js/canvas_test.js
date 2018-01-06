var Nodes = {
    WIDTH: document.documentElement.clientWidth,
    HEIGHT: document.documentElement.clientHeight,
    round: [],
    initRoundPopulation: 80,
    para: {
        num: 100,
        color: false, // 颜色 如果是false 则是随机渐变颜色 
        r: 0.9, // 圆每次增加的半径 
        o: 0.09, // 判断圆消失的条件，数值越大，消失的越快 
        a: 1
    },
    color: null,
    color2: null,
    round_arr: [],
    canvas: null,
    context: null,
    init: function() {
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        if (this.para.color) {
            this.color2 = this.para.color;
        } else {
            this.color = Math.random() * 360;
        }

        for (var i = 0; i < this.initRoundPopulation; i++) {
            this.round[i] = this.getPoints(i, Math.random() * this.WIDTH, Math.random() * this.HEIGHT);
            this.draw(this.round[i]);
        }
        this.animate();
    },
    getPoints: function(index, x , y) {
        var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
        var point = {
            index: index,
            x: x,
            y: y,
            r: Math.random() * 2 + 1,
            color: "rgba(255,255,255," + alpha + ")"
        };
        return point;
    },
    draw: function(params) {
        this.context.fillStyle = params.color;
        this.context.shadowBlur = params.r * 2;
        this.context.beginPath();
        this.context.arc(params.x, params.y, params.r, 0, 2 * Math.PI, false);
        this.context.closePath();
        this.context.fill();
    },
    move: function(params) {
        params.y += 1.5;
        if (params.y >= this.HEIGHT + 10) {
            params.y = -10;
        }
        this.draw(params);
    },
    animate: function() {
         this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
         for (var i in this.round) {
             this.move(this.round[i]);
         }

         if (!this.para.color) {
             this.color += 0.1;
             this.color2 = 'hsl(' + this.color + ',100%,80%)';
         }
         for (var i = 0; i < this.round_arr.length; i++) {
             this.context.fillStyle = this.color2;
             this.context.beginPath();
             this.context.arc(this.round_arr[i].mouseX, this.round_arr[i].mouseY, this.round_arr[i].r, 0, Math.PI * 2);
             this.context.closePath();
             this.context.fill();
             this.round_arr[i].r += this.para.r;
             this.round_arr[i].o -= this.para.o;
             if (this.round_arr[i].o <= 0) {
                 this.round_arr.splice(i, 1);
                 i--;
             }
         }

         requestAnimationFrame(function() {
             Nodes.animate();
         });
    }
};

// var canvas = document.getElementById('canvas'),
//     context = canvas.getContext('2d'),
//     WIDTH,
//     HEIGHT,
//     round = [],
//     initRoundPopulation = 80,
//     para = {
//         num: 100,
//         color: false, // 颜色 如果是false 则是随机渐变颜色 
//         r: 0.9, // 圆每次增加的半径 
//         o: 0.09, // 判断圆消失的条件，数值越大，消失的越快 
//         a: 1
//     },
//     color,
//     color2,
//     round_arr = [];
// WIDTH = canvas.width = document.documentElement.clientWidth;
// HEIGHT = canvas.height = document.documentElement.clientHeight;

// // 判断参数中是否设置了 color，如果设置了 color，就使用该值、 
// // 如果参数中的 color 为 false，那么就使用随机的颜色 
// if (para.color) {
//     color2 = para.color;
// } else {
//     color = Math.random() * 360;
// }

// function Round_item(index, x, y) {
//     this.index = index;
//     this.x = x;
//     this.y = y;
//     this.r = Math.random() * 2 + 1;
//     var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
//     this.color = "rgba(255,255,255," + alpha + ")";
// }

// Round_item.prototype.draw = function () {
//     context.fillStyle = this.color;
//     context.shadowBlur = this.r * 2;
//     context.beginPath();
//     context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
//     context.closePath();
//     context.fill();
// };

// Round_item.prototype.move = function () {
//     this.y += 1.5;
//     if (this.y >= HEIGHT + 10) {
//         this.y = -10;
//     }
//     this.draw();
// };

window.onmousemove = function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    Nodes.round_arr.push({
        mouseX: mouseX,
        mouseY: mouseY,
        r: Nodes.para.r, // 设置半径每次增大的数值 
        o: 1, // 判断圆消失的条件，数值越大，消失的越快 
    });
};

// function animate() {
//     context.clearRect(0, 0, WIDTH, HEIGHT);
//     for (var i in round) {
//         round[i].move();
//     }

//     if (!para.color) {
//         color += .1;
//         color2 = 'hsl(' + color + ',100%,80%)';
//     }
//     for (var i = 0; i < round_arr.length; i++) {
//         context.fillStyle = color2;
//         context.beginPath();
//         context.arc(round_arr[i].mouseX, round_arr[i].mouseY, round_arr[i].r, 0, Math.PI * 2);
//         context.closePath();
//         context.fill();
//         round_arr[i].r += para.r;
//         round_arr[i].o -= para.o;
//         if (round_arr[i].o <= 0) {
//             round_arr.splice(i, 1); i--;
//         }
//     }

//     window.requestAnimationFrame(animate);
// }


// function init() {
//     for (var i = 0; i < initRoundPopulation; i++) {
//         round[i] = new Round_item(i, Math.random() * WIDTH, Math.random() * HEIGHT);
//         round[i].draw();
//     }
//     animate();
// }

document.getElementById('back').addEventListener('click', function () {
    window.history.back();
});

// init();
Nodes.init();