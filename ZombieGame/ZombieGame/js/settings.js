// Initialize Modal Popups
var modalWindow = '<div id="openModal" class="modalDialog"><div><div id="labelClose" title="Close" class="close">X</div>{MESSAGE}</div></div>';
var startGameMessage = '<h2>Zombie Game</h2><div><div class="gameType"><img id="imgArcade" src="images/game_level.png">Arcade</div><div class="gameType"><img id="imgSurvival" src="images/game_survival.png">Survival</div></div><p>Choose game mode and click the image to begin</p><p style="font-size: 14px; font-weight: bold;">TIP: {TIP}</p>';
var endGameMessage = '<h2>Game Over</h2><p>You killed {ZOMBIES_KILLED} zombies</p><p>You must practice as long as you have the possibility to save the world and proove that you are the best.</p><p id="tryAgain" class="actionLink">Try again!</p>'
var levelEndMessage = '<h2>Congratulations!</h2><p>You have successfully complete the <b>Level {LEVEL}</b><br>Click the button below to begin the <b>Level {NEXT_LEVEL}</b></p><p id="nextLevel" class="actionLink">Go to Next Level!</p>'

window.onload = function() {
	// Show Game Menu
	gameMainMenu();
}
function gameMainMenu() {
	var tip;
	var ranNum = Math.random();

	// Show some random tooltip
	if (ranNum <= 0.3)
		tip = 'Aim zombies for the head!'
	else if (ranNum > 0.3 && ranNum <= 0.6)
		tip = 'Use arrows to move the Soldier!';
	else
		tip = 'Click the zombie to kill!';

	document.getElementById('divGameSettings').innerHTML = modalWindow.replace("{MESSAGE}", startGameMessage.replace("{TIP}", tip));
	document.getElementById('labelClose').style.display = 'none';
	document.getElementById('imgArcade').onclick = function() {
		document.getElementById('openModal').style.opacity = '0'
		document.getElementById('openModal').style.pointerEvents = 'none';
		initializeArcadeMode(); // Arcade Game Start
	};

	document.getElementById('imgSurvival').onclick = function() {
		document.getElementById('openModal').style.opacity = '0'
		document.getElementById('openModal').style.pointerEvents = 'none';
		initializeSurvivalMode(); // Survival Game Start
	};

	document.getElementById('openModal').style.opacity = '1';
	document.getElementById('openModal').style.pointerEvents = 'auto';
}
function initializeCloseHandle(initializeTryAgainButton) {
	document.getElementById('labelClose').style.display = 'block';
	if (initializeTryAgainButton)
	{
		// Initialize the "Try Again" button handle
		document.getElementById('tryAgain').onclick = function () {
			document.getElementById('openModal').style.opacity = '0'
			document.getElementById('openModal').style.pointerEvents = 'none';

			if (isSurvivalGameActive)
				initializeSurvivalMode(); // Survival Game Start
			else
				initializeArcadeMode(); // Arcade Game Start
		}
	}
	// Initialize the "Close" button handle
	document.getElementById('labelClose').onclick = function() {
		document.getElementById('openModal').style.opacity = '0'
		document.getElementById('openModal').style.pointerEvents = 'none';

		// Show Game Menu
		gameMainMenu();
	};
}
function gameOverSummary(ctx) {
	ctx.fillStyle = "rgb(250, 0, 0)";
	ctx.font = "42px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";

	document.getElementById('divGameSettings').innerHTML = modalWindow.replace("{MESSAGE}", endGameMessage.replace("{ZOMBIES_KILLED}", monstersKilled));
	document.getElementById('openModal').style.opacity = '1';
	document.getElementById('openModal').style.pointerEvents = 'auto';
	
	initializeCloseHandle(true);
}
function showLevelCompleteMessage(ctx, level) {
	ctx.fillStyle = "rgb(250, 0, 0)";
	ctx.font = "42px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	
	document.getElementById('divGameSettings').innerHTML = modalWindow.replace("{MESSAGE}", levelEndMessage.replace("{LEVEL}", level).replace("{NEXT_LEVEL}", level + 1));
	document.getElementById('openModal').style.opacity = '1';
	document.getElementById('openModal').style.pointerEvents = 'auto';
	
	// Initialize the "Next Level" button handle
	document.getElementById('nextLevel').onclick = function () {
		document.getElementById('openModal').style.opacity = '0'
		document.getElementById('openModal').style.pointerEvents = 'none';
		reset(false);
	}
	
	initializeCloseHandle(false);
}
function showScore(ctx) {
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Zombies killed: " + monstersKilled, 32, 32);
}