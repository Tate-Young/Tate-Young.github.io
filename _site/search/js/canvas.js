function Line(t) {
    this.flag = t,
    this.a = {},
    this.b = {},
    "v" == t ? (
        this.a.y = 0,
        this.b.y = ch,
        this.a.x = randomIntFromInterval(0, ch),
        this.b.x = randomIntFromInterval(0, ch)
    ) : "h" == t && (
        this.a.x = 0,
        this.b.x = cw,
        this.a.y = randomIntFromInterval(0, cw),
        this.b.y = randomIntFromInterval(0, cw)
    ),
    this.va = randomIntFromInterval(25, 100) / 150,
    this.vb = randomIntFromInterval(25, 100) / 150,
    this.draw = function () {
        ctx.strokeStyle = "#eef2f3",
        ctx.beginPath(),
        ctx.moveTo(this.a.x, this.a.y),
        ctx.lineTo(this.b.x, this.b.y),
        ctx.stroke();
    },
    this.update = function () {
        "v" == this.flag ? (
            this.a.x += this.va,
            this.b.x += this.vb) : "h" == t && (this.a.y += this.va, this.b.y += this.vb), this.edges()
    },
    this.edges = function () {
        "v" == this.flag ? (
            (this.a.x < 0 || this.a.x > cw) && (this.va *= -1), 
            (this.b.x < 0 || this.b.x > cw) && (this.vb *= -1)
        ) : "h" == t && ((this.a.y < 0 || this.a.y > ch) && (this.va *= -1), 
            (this.b.y < 0 || this.b.y > ch) && (this.vb *= -1));
    }
}

function Draw() {
    requestId = window.requestAnimationFrame(Draw),
    ctx.clearRect(0, 0, cw, ch);
    for (var t = 0; t < linesRy.length; t++) {
        var i = linesRy[t];
        i.draw(), i.update()
    }
    for (var t = 0; t < linesRy.length; t++)
        for (var i = linesRy[t], n = t + 1; n < linesRy.length; n++) {
            var e = linesRy[n];
            Intersect2lines(i, e)
        }
}

function Init() {
    linesRy.length = 0;
    for (var t = 0; t < linesNum; t++) {
        var i = t % 2 == 0 ? "h" : "v",
            n = new Line(i);
        linesRy.push(n);
    }
    requestId && (window.cancelAnimationFrame(requestId), requestId = null);
    cw = canvas.width = window.innerWidth;
    cx = cw / 2;
    ch = canvas.height = window.innerHeight;
    cy = ch / 2;
    Draw();
}

function Intersect2lines(t, i) {
    var n = t.a,
        e = t.b,
        a = i.a,
        s = i.b,
        h = (s.y - a.y) * (e.x - n.x) - (s.x - a.x) * (e.y - n.y),
        r = ((s.x - a.x) * (n.y - a.y) - (s.y - a.y) * (n.x - a.x)) / h,
        c = ((e.x - n.x) * (n.y - a.y) - (e.y - n.y) * (n.x - a.x)) / h,
        l = n.x + r * (e.x - n.x),
        o = n.y + r * (e.y - n.y);
    r > 0 && c > 0 && markPoint({
        x: l,
        y: o
    })
}

function markPoint(t) {
    ctx.beginPath();
    ctx.arc(t.x, t.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#8e9eab";
    ctx.fill();
}

function randomIntFromInterval(t, i) {
    return ~~(Math.random() * (i - t + 1) + t);
}
var canvas = document.getElementById("canvas");

if (canvas) {
    ctx = canvas.getContext("2d"),
    cw = canvas.width = window.innerWidth,
    cx = cw / 2,
    ch = canvas.height = window.innerHeight,
    cy = ch / 2;
    ctx.fillStyle = "#ECE9E6";
}

for (var linesNum = 12, linesRy = [], requestId = null, i = 0; i < linesNum; i++) {
    var flag = i % 2 == 0 ? "h" : "v",
        l = new Line(flag);
    linesRy.push(l);
}
// setTimeout(function () {
//     Init(), addEventListener("resize", Init, !1);
// }, 15);
// addEventListener("resize", Init, !1);
Init();