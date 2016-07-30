// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
var heroPreviousDirection;
var heroStepsInOneDirection = 0;

heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero_right_step_0.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 128 // movement in pixels per second
};
var monster = {
	speed: 32 // movment in pixels per second (zombies are sloooow)
};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		moveHero("up");
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		moveHero("down");
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		moveHero("left");
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		moveHero("right");
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}

	moveMonster(modifier);
};

function moveMonster(modifier)
{
	if (monster.x < hero.x)
		monster.x += monster.speed * modifier;
	else
		monster.x -= monster.speed * modifier;
	
	if (monster.y < hero.y)
		monster.y += monster.speed * modifier;
	else
		monster.y -= monster.speed * modifier;

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}
}
function moveHero(dir)
{
	var animationNow = Date.now();
	var animationDelta = animationNow - animationThen;
	
	if (animationDelta > 80)
	{
	if (dir != heroPreviousDirection || heroStepsInOneDirection >= 7)
		heroStepsInOneDirection = 0;
	else if (dir == heroPreviousDirection)
		++heroStepsInOneDirection;

	 heroImage.src = "images/hero_" + dir + "_step_" + heroStepsInOneDirection + ".png";
	
	heroPreviousDirection = dir;
	animationThen = Date.now();
	}
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}	
}
// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
		
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
var animationThen = Date.now();
setInterval(main, 1); // Execute as fast as possible
