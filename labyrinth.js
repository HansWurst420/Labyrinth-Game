//access canvas
const canvas = document.getElementById("myCanvas")
const context = canvas.getContext('2d')

//canvas fills browser window
canvas.width = Math.min(innerWidth, innerHeight) - 5
canvas.height = Math.min(innerWidth, innerHeight) - 5

/**
 * tiles of the game-board.
 * Use the draw method, to draw a tile at the given position.
 */
class Boundary {
    static width = canvas.width / 14
    static height = Boundary.width
    constructor({ position, image, type }) {
        this.position = position
        this.image = image
        this.type = type
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y, Boundary.width, Boundary.height)
    }
}

class Player {
    static radius = Boundary.width / (40 / 15)
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, Player.radius, 0, 2 * Math.PI)
        context.fillStyle = 'white'
        context.fill()
        context.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Hole {
    static radius = Boundary.width / (40 / 19)
    constructor({ position, type }) {
        this.position = position
        this.type = type
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, Hole.radius, 0, 2 * Math.PI)
        if (this.type == 'l ') {
            context.fillStyle = 'black'
            context.fill()
        } else {
            var x = this.position.x - Boundary.width * 0.25
            var y = this.position.y + Boundary.height * 0.25
            var fontsize = Boundary.width / (40 / 30)
            context.font = fontsize + 'px Ariel'
            context.fillText("G", x, y);
            context.stroke()
        }
        context.closePath()
    }
}

var hasMotionSensor = false
const acceleration = {
    ax: 0,
    ay: 0
}

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

//player definitions
const player = new Player({
    position: {
        x: Boundary.width * 12.5,
        y: Boundary.width * 1.5
    },
    velocity: {
        x: 0,
        y: 0
    }
})

var running = false

/**
 * defines the map of the game
 */
const map = [
    ['c0', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'c1'],
    ['v ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', 'v '],
    ['v ', '  ', 'c0', 'h ', 'h ', 'h ', 'h ', 'e2', 'h ', 'h ', 'h ', 'h ', 'h ', 'e3'],
    ['v ', '  ', 'v ', 'l ', '  ', '  ', 'w ', 'v ', '  ', '  ', '  ', '  ', '  ', 'v '],
    ['v ', '  ', 'v ', '  ', '  ', '  ', 't3', 'c3', '  ', '  ', '  ', 't0', '  ', 'v '],
    ['v ', '  ', 'v ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', 'v ', 'l ', 'v '],
    ['v ', '  ', 'v ', '  ', '  ', 't3', 't1', '  ', 'l ', 't0', '  ', 'c2', 'h ', 'e3'],
    ['v ', '  ', 'c2', 't1', 'l ', '  ', '  ', 'l ', '  ', 't2', '  ', '  ', '  ', 'v '],
    ['v ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', 'v '],
    ['v ', '  ', '  ', '  ', 'c0', 'h ', 't1', '  ', '  ', 'l ', '  ', '  ', '  ', 'v '],
    ['e1', 't1', '  ', '  ', 't2', '  ', '  ', '  ', '  ', '  ', 't3', 't1', '  ', 'v '],
    ['v ', '  ', 'l ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', 'v '],
    ['v ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', 't0', '  ', '  ', '  ', 'v '],
    ['c2', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'h ', 'e0', 'h ', 'h ', 'h ', 'c3']
]

const boundaries = []
const holes = []
function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}
map.forEach((row, i) => {
    row.forEach((element, j) => {
        if (element != '  ') {
            switch (element) {
                case 'c0':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/c0.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'c1':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/c1.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'c2':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/c2.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'c3':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/c3.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'e0':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/e0.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'e1':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/e1.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'e2':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/e2.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'e3':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/e3.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'h ':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/h.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'k0':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/k0.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'k1':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/k1.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'k2':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/k2.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'k3':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/k3.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 't0':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/t0.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 't1':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/t1.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 't2':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/t2.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 't3':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/t3.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                case 'v ':
                    var hole = new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('graphiken/Version2/v.png'),
                        type: element
                    })
                    boundaries.push(hole)
                    break
                //holes
                case 'l ':
                    var hole = new Hole({
                        position: {
                            x: Boundary.width * j + (Boundary.height * 0.5),
                            y: Boundary.height * i + (Boundary.height * 0.5)
                        },
                        type: element
                    })
                    holes.push(hole)
                    break
                case 'w ':
                    var hole = new Hole({
                        position: {
                            x: Boundary.width * j + (Boundary.height * 0.5),
                            y: Boundary.height * i + (Boundary.height * 0.5)
                        },
                        type: element
                    })
                    holes.push(hole)
                    break

            }

        }
    })
})

//----------------------------action listners--------------------------------

if (window.DeviceMotionEvent) {
    window.ondevicemotion = function (event) {
        acceleration.ax = event.accelerationIncludingGravity.x
        acceleration.ay = event.accelerationIncludingGravity.y
        if (acceleration.ax != 0 || acceleration.ay != 0 || acceleration.ay != 0) {
            hasMotionSensor = true
            
        }
    }
}
 

// listen to keybord
window.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 's':
            keys.s.pressed = true
            break
        case 'd':
            keys.d.pressed = true
            break
    }
})

window.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})

//-----------------------------------------------------------------------------------------------------------





//funktion that runs the game
function gameLoop() {
    requestAnimationFrame(gameLoop)
    context.clearRect(0, 0, canvas.width, canvas.height)

    var collisions = []
    var collisionAbove = false
    var collisionBelow = false
    var collisionLeft = false
    var collisionRight = false
    boundaries.forEach(boundary => {
        boundary.draw()
        collisions = circleCollidesWithRectangle(player, boundary)
        if (collisions[0]) {
            collisionAbove = collisions[0]
        }
        if (collisions[1]) {
            collisionBelow = collisions[1]
        }
        if (collisions[2]) {
            collisionLeft = collisions[2]
        }
        if (collisions[3]) {
            collisionRight = collisions[3]
        }
    })
    holes.forEach(hole => {
        hole.draw()
        var fall = playerFallsInHole(player, hole)
        if (fall && hole.type == 'w ') {
            running = false
            player.velocity.y = 0
            player.velocity.x = 0
            alert('Congratulations, you won')
            player.position.x = Boundary.width * 12.5
            player.position.y = Boundary.width * 1.5
        } else if (fall) {
            start()
        }
    })

    if (running) {
        //Keybord
        player.velocity.y = 0
        player.velocity.x = 0

        if (keys.w.pressed && !collisionBelow) {
            player.velocity.y += -(Boundary.width / (40 / 3))
        }
        if (keys.a.pressed && !collisionRight) {
            player.velocity.x += -(Boundary.width / (40 / 3))
        }
        if (keys.s.pressed && !collisionAbove) {
            player.velocity.y += (Boundary.width / (40 / 3))
        }
        if (keys.d.pressed && !collisionLeft) {
            player.velocity.x += (Boundary.width / (40 / 3))
        }

    } else if (running && hasMotionSensor) {
        player.velocity.x += -acceleration.ax * (Boundary.width / 500)
        player.velocity.y += acceleration.ay * (Boundary.height / 500)
        if (player.velocity.x > 0 && collisionLeft) {
            player.velocity.x = 0
        }

        if (player.velocity.x < 0 && collisionRight) {
            player.velocity.x = 0
        }

        if (player.velocity.y < 0 && collisionBelow) {
            player.velocity.y = 0
        }

        if (player.velocity.y > 0 && collisionAbove) {
            player.velocity.y = 0
        }
    }



    player.update()

}

gameLoop()

function circleCollidesWithRectangle(player, boundary) {
    var boundaryType = boundary.type
    var xp = player.position.x
    var yp = player.position.y
    var xb = boundary.position.x
    var yb = boundary.position.y
    var horizontalBelow = false
    var horizontalAbove = false
    var verticalLeft = false
    var verticalRight = false
    var xIntersectLeft = -1
    var xIntersectRight = -1
    var yIntersectAbove = -1
    var yIntersectBelow = -1
    //top line
    if (Math.pow(yb - yp, 2) <= Math.pow(Player.radius, 2)) {
        xIntersectLeft = -Math.sqrt(Math.pow(Player.radius, 2) - Math.pow(yb - yp, 2)) + xp
        xIntersectRight = Math.sqrt(Math.pow(Player.radius, 2) - Math.pow(yb - yp, 2)) + xp
        horizontalAbove = true

    }

    //bottom line
    if (Math.pow((yb + Boundary.height) - yp, 2) <= Math.pow(Player.radius, 2)) {
        xIntersectLeft = -Math.sqrt(Math.pow(Player.radius, 2) - Math.pow((yb + Boundary.height) - yp, 2)) + xp
        xIntersectRight = Math.sqrt(Math.pow(Player.radius, 2) - Math.pow((yb + Boundary.height) - yp, 2)) + xp
        horizontalBelow = true
    }

    //left line
    if (Math.pow(xb - xp, 2) <= Math.pow(Player.radius, 2)) {
        yIntersectAbove = -Math.sqrt(Math.pow(Player.radius, 2) - Math.pow(xb - xp, 2)) + yp
        yIntersectBelow = Math.sqrt(Math.pow(Player.radius, 2) - Math.pow(xb - xp, 2)) + yp
        verticalLeft = true
    }

    //right line
    if (Math.pow((xb + Boundary.width) - xp, 2) <= Math.pow(Player.radius, 2)) {
        yIntersectAbove = -Math.sqrt(Math.pow(Player.radius, 2) - Math.pow((xb + Boundary.width) - xp, 2)) + yp
        yIntersectBelow = Math.sqrt(Math.pow(Player.radius, 2) - Math.pow((xb + Boundary.width) - xp, 2)) + yp
        verticalRight = true
    }

    var collisionAbove =
        horizontalAbove
        && ((xb <= xIntersectLeft && xIntersectLeft <= xb + Boundary.width)
            || (xb <= xIntersectRight && xIntersectRight <= xb + Boundary.width))
        && (boundaryType == 'c0'
            || boundaryType == 'c1'
            || boundaryType == 'e2'
            || boundaryType == 'h '
            || boundaryType == 'k0'
            || boundaryType == 'k1'
            || boundaryType == 't0'
            || boundaryType == 't1'
            || boundaryType == 't3'
        )

    var collisionBelow =
        horizontalBelow
        && ((xb <= xIntersectLeft && xIntersectLeft <= xb + Boundary.width)
            || (xb <= xIntersectRight && xIntersectRight <= xb + Boundary.width))
        && (boundaryType == 'c2'
            || boundaryType == 'c3'
            || boundaryType == 'e0'
            || boundaryType == 'h '
            || boundaryType == 'k2'
            || boundaryType == 'k3'
            || boundaryType == 't1'
            || boundaryType == 't2'
            || boundaryType == 't3'
        )

    var collisionLeft =
        verticalLeft
        && ((yb <= yIntersectAbove && yIntersectAbove <= yb + Boundary.height)
            || (yb <= yIntersectBelow && yIntersectBelow <= yb + Boundary.height))
        && (boundaryType == 'c0'
            || boundaryType == 'c2'
            || boundaryType == 'e1'
            || boundaryType == 'k0'
            || boundaryType == 'k2'
            || boundaryType == 't0'
            || boundaryType == 't2'
            || boundaryType == 't3'
            || boundaryType == 'v '
        )

    var collisionRight =
        verticalRight
        && ((yb <= yIntersectAbove && yIntersectAbove <= yb + Boundary.height)
            || (yb <= yIntersectBelow && yIntersectBelow <= yb + Boundary.height))
        && (boundaryType == 'c1'
            || boundaryType == 'c3'
            || boundaryType == 'e3'
            || boundaryType == 'k1'
            || boundaryType == 'k3'
            || boundaryType == 't0'
            || boundaryType == 't1'
            || boundaryType == 't2'
            || boundaryType == 'v '
        )

    return [collisionAbove, collisionBelow, collisionLeft, collisionRight]
}

function playerFallsInHole(player, hole) {
    const xp = player.position.x
    const yp = player.position.y
    const xh = hole.position.x
    const yh = hole.position.y
    if (hole.type == 'l ') {
        return Math.pow(xp - xh, 2) + Math.pow(yp - yh, 2) <= Math.pow(Player.radius + Hole.radius, 2) / 3
    }
    return Math.pow(xp - xh, 2) + Math.pow(yp - yh, 2) <= Math.pow(Player.radius + Hole.radius, 2) / 10

}

function start() {
    running = true
    player.position.x = Boundary.width * 12.5
    player.position.y = Boundary.width * 1.5
    player.velocity.x = 0
    player.velocity.y = 0
}




