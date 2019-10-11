const game = $("#game");
const ui = $("#ui");
const player = $("#player");

// Game parameters

var gameConfig = {
    cellSize: 20,
    unmovableAreas: ["water", "lava"]
}
renderGraphics()

var mapConfig = {
    mapWidth: 20,
    mapHeight: 20,
    areas: {
        water: 25,
        desert: 0,
        grass: 0,
        rock: 0,
        marsh: 0,
        lava: 25
    }
}
generateMap()

// Player parameters

var inventory = {
    sand: 0,
    shit: 0,
    oil: 0
}
var weapons = [
    "showel", "bucket"
]
var selected_weapon = 0
// var xPos = random(0,mapConfig.mapWidth-1)
// var yPos = random(0,mapConfig.mapHeight-1)
var xPos = 0
var yPos = 0

refreshPlayerPosition()

function generateMap()
{
    for (var i = 0; i < mapConfig.mapWidth; i++) {
        for (var j = 0; j < mapConfig.mapHeight; j++) {
            if (chance(mapConfig.areas.water)) {
                game.append($('<div class="cell water" id="' + j + '_' + i + '"></div>'))
            } else if (chance(mapConfig.areas.desert)) {
                game.append($('<div class="cell desert" id="' + j + '_' + i + '"></div>'))
            } else if (chance(mapConfig.areas.grass)) {
                game.append($('<div class="cell grass" id="' + j + '_' + i + '"></div>'))
            } else if (chance(mapConfig.areas.rock)) {
                game.append($('<div class="cell rock" id="' + j + '_' + i + '"></div>'))
            } else if (chance(mapConfig.areas.marsh)) {
                game.append($('<div class="cell marsh" id="' + j + '_' + i + '"></div>'))
            } else if (chance(mapConfig.areas.lava)) {
                game.append($('<div class="cell lava" id="' + j + '_' + i + '"></div>'))
            } else {
                game.append($('<div class="cell oil" id="' + j + '_' + i + '"></div>'))
            }
        }
        game.append($('<br>'))
    }
}

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38') { // up arrow
        if( isCellExist(xPos, yPos-1) && isCellMovable(xPos, yPos-1) ) yPos--
    } else if (e.keyCode == '40') { // down arrow
        if( isCellExist(xPos, yPos+1) && isCellMovable(xPos, yPos+1) ) yPos++
    } else if (e.keyCode == '37') { // left arrow
        if( isCellExist(xPos-1, yPos) && isCellMovable(xPos-1, yPos) ) xPos--
    } else if (e.keyCode == '39') { // right arrow
        if( isCellExist(xPos+1, yPos) && isCellMovable(xPos+1, yPos) ) xPos++
    } else if (e.keyCode == '81') { // Q, change weapon
        if (selected_weapon == weapons.length - 1) {
            selected_weapon = 0
        } else {
            selected_weapon++
        }
    } else if (e.keyCode == '69') { // E; action
        let cell = $(".cell#" + xPos + "_" + yPos)

        if (weapons[selected_weapon] == "showel" && cell.hasClass("desert")) {
            inventory.sand += 0.1;
            if (chance(15)) {
                cell.removeClass("desert")
                cell.addClass("rock")
            }
        }
        if (weapons[selected_weapon] == "showel" && cell.hasClass("grass")) {
            cell.removeClass("grass")
            cell.addClass("desert")
            if (chance(20)) {
                inventory.shit += 1.0;
            }
        }
        if (weapons[selected_weapon] == "bucket" && cell.hasClass("oil")) {
            inventory.oil += 0.1;
            if (chance(15)) {
                cell.removeClass("oil")
                cell.addClass("marsh")
            }
        }
    }
    refreshPlayerPosition()
    refreshUI()
}

function isCellExist(x,y) {
    if (x < 0 || x > mapConfig.mapWidth-1) return false
    if (y < 0 || y > mapConfig.mapHeight-1) return false
    return true
}

function isCellMovable(x,y) {
    let cell = $(".cell#" + x + "_" + y)
    if( cell.is(gameConfig.unmovableAreas.map((area) => {return "."+area} ).join(",")) ) return false

    // if( cell.hasClass("water") ) return false
    return true
}

function chance(percent) {
    let min = 0
    let max = 100
    let bones = min - 0.5 + Math.random() * (max - min + 1)
    bones = Math.round(bones)

    // console.log(bones)
    return (bones < percent) ? true : false;
}

function random(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function renderGraphics() {
    $( document ).ready(function() {
        $(".cell").css("width", gameConfig.cellSize+"px")
        $(".cell").css("height", gameConfig.cellSize+"px")
        $("#player").css("height", gameConfig.cellSize+"px")
        $("#player").css("width", gameConfig.cellSize+"px")
    });
}

function refreshPlayerPosition() {
    player.css("left", (xPos * gameConfig.cellSize) + "px")
    player.css("top", (yPos * gameConfig.cellSize) + "px")

    // $('body').animate({
    //     scrollTop: $("#player").offset().top
    // }, 2000);
}

function refreshUI() {
    ui.find("#inventory #shit span").html(inventory.shit)
    ui.find("#inventory #sand span").html(inventory.sand.toFixed(2))
    ui.find("#inventory #oil span").html(inventory.oil.toFixed(2))
    ui.find("#inventory #weapon span").html(weapons[selected_weapon])
}
