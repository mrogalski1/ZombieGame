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
bgImage.src = "images/background.jpg";

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
monsterImage.src = "images/monster_right_step_0.png";

// Game objects
var hero = {
	speed: 128 // movement in pixels per second
};
function monsterObject(x, y, id) {
	var speed = 24; // movment in pixels per second (zombies are sloooow)
	var positionX = x;
	var positionY = y;
	var monsterId = id;
	var previousX = 0;
	var previousY = 0;
	var animationMonsterThen = Date.now();
	var monsterImage = new Image();
	var monsterPreviousDirection;
	var monsterStepsInOneDirection = 0;
	var hasBeenHit = false;
	monsterImage.src = "images/monster.png";
	
	this.getMonsterId = function() { return monsterId; }
	this.setMonsterId = function(value) { monsterId = value; }
	this.getSpeed = function() { return speed; }
	this.getX = function() { return positionX; }
	this.setX = function(value) { positionX = value; }
	this.getY = function() { return positionY; }
	this.setY = function(value) { positionY = value; }
	this.setMonsterImage = function(value) { monsterImage.src = value; }
	this.getMonsterImage = function(value) { return monsterImage; }
	this.setAnimationMonsterTimer = function(value) { animationMonsterThen = value; }
	this.getAnimationMonsterTimer = function(value) { return animationMonsterThen; }
	this.setPreviousDirection = function(value) { monsterPreviousDirection = value; }
	this.getPreviousDirection = function(value) { return monsterPreviousDirection; }
	this.setStepsInOneDirection = function(value) { monsterStepsInOneDirection = value; }
	this.getStepsInOneDirection = function(value) { return monsterStepsInOneDirection; }
	this.setPreviousX = function(value) { previousX = value; }
	this.getPreviousX = function(value) { return previousX; }
	this.setPreviousY = function(value) { previousY = value; }
	this.getPreviousY = function(value) { return previousY; }
	this.setHasBeenHit = function(value) { hasBeenHit = value; }
	this.getHasBeenHit = function(value) { return hasBeenHit; }
};

// Game rules
var isArcadeGameActive = false;
var isSurvivalGameActive = false;
var currentGameLevel = 0;
var then;
var animationHeroThen;
var levelGame = [];
levelGame[0] = 5;

function initializeArcadeMode() {
	isArcadeGameActive = true;
	isSurvivalGameActive = false;

	levelGame[1] = 10;
	levelGame[2] = 15;
	levelGame[3] = 20;
	levelGame[4] = 25;
	levelGame[5] = 35;
	levelGame[6] = 50;
	levelGame[7] = 65;
	levelGame[8] = 80;
	levelGame[9] = 100;
	then = Date.now();
	animationHeroThen = Date.now();
	
	// Arcade Initialized, Start the Game
	reset(true);
	inteGame = setInterval(main, 1);
}

var monsterReSpawnerCounter;
var monstersDeadCounter;
var newHordCommingCounter;
var inteSurvival;
function initializeSurvivalMode()
{
	isArcadeGameActive = false;
	isSurvivalGameActive = true;
	then = Date.now();
	animationHeroThen = Date.now();

	// Surival Initialized, Start the Game
	reset(true);
	inteGame = setInterval(main, 1);

	inteSurvival = setInterval(function()
	{
		// First, replace the killed monsters with a new one
		for (monsterReSpawnerCounter=0; monsterReSpawnerCounter<monstersCollection.length; monsterReSpawnerCounter++)
		{
			if (monstersCollection[monsterReSpawnerCounter] == null)
				monstersCollection[monsterReSpawnerCounter] = createMonster(monsterReSpawnerCounter);
		}

		// Secondly, add some new monsters to a canvas (a new hord is comming)
		monstersDeadCounter = monstersCollection.length;
		for (newHordCommingCounter=monstersDeadCounter; newHordCommingCounter<monstersDeadCounter + 1; newHordCommingCounter++)
			monstersCollection[newHordCommingCounter] = createMonster(newHordCommingCounter);
	},2000);
}

var tempX;
function createMonster(i) {
	tempX = (32 + (Math.random() * (canvas.width - 64)));
	
	return new monsterObject(
			tempX,
			tempX <= 50 || tempX >= canvas.width - 50 ? 
				(32 + (Math.random() * (canvas.height - 64))) :
				(32 + (Math.random() <= 0.5 ? getRandomArbitary(0, 50) : getRandomArbitary(canvas.height - 50, canvas.height))),
			i
		);
}
				
// Monsters collection
var monstersCollection = [];
var monstersKilled = 0;

// Handle keyboard controls
var keysDown = {};
var inte;
var inteGame;

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var iClickElem;
canvas.addEventListener("click", function(event) {
	var x = new Number();
    var y = new Number();
  
	if (event.x != undefined && event.y != undefined)
       {
          x = event.x;
          y = event.y;
       }
       else // Firefox method to get the position
       {
         x = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
         y = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
       }

       x -= canvas.offsetLeft;
       y -= canvas.offsetTop;
	   
	   var monster;
	   var monsterPosX;
	   var monsterPosY;

	   if (monsterReady) {
			for (iClickElem=0; iClickElem<monstersCollection.length;iClickElem++)
			{
				monster = monstersCollection[iClickElem];
				// If monster has been hit, omit him
				if (monster == null || monster.getHasBeenHit())
					continue;
			
				monsterPosX = monster.getX() + 22;
				monsterPosY = monster.getY() + 10;

				// Check if monster has been hit
				if (
					x >= monsterPosX
					&& x <= (monsterPosX + 26)
					&& y >= monsterPosY
					&& y <= (monsterPosY + 24)
				)
				{
					monstersKilled++;
					monster.setHasBeenHit(true);
					monster.setStepsInOneDirection(0);

					inte = setInterval(function() {
						monsterDeath();
					},120);

					// Prevent to multiple kill with one shot - break the loop
					break;
				}
			}
		}
}, false);

var anyHit;
var iMonElem;
var xMonElem;
var jMonElem;
function monsterDeath()
{
	anyHit = false;
				for(var iMonElem=0; iMonElem<monstersCollection.length; iMonElem++)
				{
					if (monstersCollection[iMonElem] != null && monstersCollection[iMonElem].getHasBeenHit())
					{
						anyHit = true;
						var monster = monstersCollection[iMonElem];
						monster.setMonsterImage("images/monster_crash/monster_crash_" + "down" + "_" + monster.getStepsInOneDirection() + ".png");
						ctx.drawImage(monster.getMonsterImage(), monster.getX(), monster.getY());

						monster.setStepsInOneDirection(monster.getStepsInOneDirection() + 1);

						if (monster.getStepsInOneDirection() == 9) {
							var monstersCollectionTemp = [];
							for(xMonElem=0; xMonElem<monstersCollection.length; xMonElem++)
								monstersCollectionTemp[xMonElem] = monstersCollection[xMonElem];

							for(jMonElem=monster.getMonsterId(); jMonElem<monstersCollection.length; jMonElem++)
							{
								if (monstersCollectionTemp[jMonElem + 1])
								{
									monstersCollectionTemp[jMonElem] = monstersCollectionTemp[jMonElem + 1];
									monstersCollectionTemp[jMonElem].setMonsterId(jMonElem);
									monstersCollectionTemp[jMonElem + 1] = null;
								}
								else if (monstersCollectionTemp.length == 1)
									monstersCollectionTemp = [];
								else
									monstersCollectionTemp[jMonElem] = null;
							}
							monstersCollection = monstersCollectionTemp;
						}
					}
				}
				
				if (!anyHit)
					clearInterval(inte);
}
function getRandomArbitary (min, max) {
    return Math.random() * (max - min) + min;
}

// Reset the game when the player catches a monster
var reset = function (resetMonsterKilledCounter) {

	if (resetMonsterKilledCounter)
		monstersKilled = 0;

	gameOver = false;
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	for (var i=0; i<levelGame[currentGameLevel]; i++)
	{
		// Throw the monster somewhere on the screen randomly
		monstersCollection[i] = createMonster(i);
	}
};

var monsterChoosen;
var iUpdateCounter;
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

	for (iUpdateCounter=0; iUpdateCounter<monstersCollection.length;iUpdateCounter++)
	{
		monsterChoosen = monstersCollection[iUpdateCounter];
		// No monsters - Game Over
		if (monsterChoosen == null)
			return;
		// If monster has been hit, omit him
		if (monsterChoosen.getHasBeenHit())
			continue;
		// Are they touching?
		if (
			hero.x <= (monsterChoosen.getX() + 32)
			&& monsterChoosen.getX() <= (hero.x + 32)
			&& hero.y <= (monsterChoosen.getY() + 32)
			&& monsterChoosen.getY() <= (hero.y + 32)
		) {
			gameOver = true;
			// Game Over - Clear Interval Game, reset the Game Level and show the Game Summary
			clearInterval(inteGame);
			
			if (isSurvivalGameActive)
				clearInterval(inteSurvival);

			//isSurvivalGameActive = isArcadeGameActive = false;
			gameOverSummary(ctx);
			monstersCollection = [];
			currentGameLevel = 0;
			break;
		}

		moveMonster(modifier, monsterChoosen);
	}
};

var dir;
var animationNow;
var animationDelta;
var deltaX;
var deltaY;

// Updates the monster animation base on the new coordinates
function updateMonsterAnimation(monster) {

	animationNow = Date.now();
	animationDelta = animationNow - monster.getAnimationMonsterTimer();
	
	deltaX = monster.getX() - monster.getPreviousX();
	deltaY = monster.getY() - monster.getPreviousY();
	
	if (animationDelta > 120)
	{
		if (monster.getPreviousDirection() != null && (((deltaX < 1 && deltaX > 0) && (deltaY < 1 && deltaY > 0)) || ((deltaX > -1 && deltaX < 0) && (deltaY > -1 && deltaY < 0))))
			dir = monster.getPreviousDirection();
		else
		{
			//var num=0.55;
			if ((deltaX < 0 && deltaY > 0) || (deltaX == 0 && deltaY > 0))
				dir = "down";
			else if ((deltaX > 0 && deltaY > 0) || (deltaX > 0 && deltaY == 0))
				dir = "right";
			else if ((deltaX > 0 && deltaY < 0) || (deltaX == 0 && deltaY < 0))
				dir = "up";
			else if ((deltaX < 0 && deltaY < 0) || (deltaX < 0 && deltaY == 0))
				dir = "left";
			}
			
			if (dir != monster.getPreviousDirection() || monster.getStepsInOneDirection() >= 7)
				monster.setStepsInOneDirection(0);
			else if (dir == monster.getPreviousDirection())
				monster.setStepsInOneDirection(monster.getStepsInOneDirection() + 1);

			monster.setMonsterImage("images/monster_" + dir + "_step_" + monster.getStepsInOneDirection() + ".png");

			monster.setPreviousDirection(dir);
			monster.setAnimationMonsterTimer(Date.now());
			monster.setPreviousX(monster.getX());
			monster.setPreviousY(monster.getY());
		}
}
// Calculates next step of the monster
function moveMonster(modifier, monster)
{
	if (monster.getY() < hero.y)
		monster.setY(monster.getY() + (monster.getSpeed() * modifier));
	else
		monster.setY(monster.getY() - (monster.getSpeed() * modifier));
	
	if (monster.getX() < hero.x)
		monster.setX(monster.getX() + (monster.getSpeed() * modifier));
	else
		monster.setX(monster.getX() - (monster.getSpeed() * modifier));

	updateMonsterAnimation(monster);

	if (monsterReady) {
		ctx.drawImage(monster.getMonsterImage(), monster.getX(), monster.getY());
	}
}

var animationHeroNow;
var animationHeroDelta;

function moveHero(dir)
{
	animationHeroNow = Date.now();
	animationHeroDelta = animationHeroNow - animationHeroThen;
	
	if (animationHeroDelta > 80)
	{
		if (dir != heroPreviousDirection || heroStepsInOneDirection >= 7)
			heroStepsInOneDirection = 0;
		else if (dir == heroPreviousDirection)
			++heroStepsInOneDirection;

		heroImage.src = "images/hero_" + dir + "_step_" + heroStepsInOneDirection + ".png";
		
		heroPreviousDirection = dir;
		animationHeroThen = Date.now();
	}
	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}	
}

var monster;
var nullCounter;
var gameOver = false;
var renderIterator;

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (monsterReady) {
		nullCounter = 0;

		for (renderIterator=0; renderIterator<monstersCollection.length;renderIterator++)
		{
			monster = monstersCollection[renderIterator];

			if (monster == null)
			{
				nullCounter++;
				continue;
			}

			ctx.drawImage(monster.getMonsterImage(), monster.getX(), monster.getY());
		}
		
		// For Arcade Game - check if all monsters has been killed, if so - go to next level
		if (isArcadeGameActive && nullCounter == monstersCollection.length && !gameOver)
		{
			// All monsters has been killed - The End
			gameOver = true;
			showLevelCompleteMessage(ctx, (currentGameLevel + 1));
			currentGameLevel++;
		}
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
		
	// Update current Score
	showScore(ctx);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};