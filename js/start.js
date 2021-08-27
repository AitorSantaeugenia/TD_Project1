class StartGame {
	constructor(context) {
		this.context = context;
		this.intervalId = null;
		this.path = [ [ 0, 350 ], [ 1200, 350 ] ];
		this.waves = [];
		this.waveIndex = 0;
		this.waveEnemies = 0;
		this.audio1 = document.getElementById('backgroundMusic');
		this.audio2 = document.getElementById('victoryMusic');
		this.audio3 = document.getElementById('defeatMusic');
		this.audio4 = document.getElementById('jobDone');
		this.audio5 = document.getElementById('liveLessMusic');
		//Path
		this.board = new Canvas(this.context, this.path, 30);
		this.enemies = [];
		this.towers = [];
		this.framesCounter = 0;
		this.userHP = 100;
		this.userGold = 500;
		this.loser = new Image();
		this.loser.src = 'https://aitorsantaeugenia.github.io/TD_Project1/images/defeat.png';
		this.winner = new Image();
		this.winner.src = 'https://aitorsantaeugenia.github.io/TD_Project1/images/victory.png';
		this.htmlBG = document.getElementById('htmlID');

		this.towerCosts = {
			sand: 70,
			slow: 200
		};
	}

	run() {
		//this.htmlBG.src = 'https://aitorsantaeugenia.github.io/TD_Project1/images/loadingScreen1.png';
		this.intervalId = requestAnimationFrame(() => this.run());
		this.audio1.volume = 0.1;
		this.audio1.play();
		this.audio1.loop = true;
		this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		this.waves = new Wave(this.context, this.path);
		this.enemyInfo();
		this.playerHP();
		this.draw();
		this.enemyInRange();
		this.enemyEnding();
		this.playerGold();
		this.clearEnemyEnding();
		this.removeEnemy();
	}

	draw() {
		//console.log(this.checkGameContinue());
		if (this.checkGameContinue()) {
			this.board.draw();
			this.move();

			this.enemies.forEach((enemy) => enemy.draw());
			this.towers.forEach((turret) => turret.draw());
			this.framesCounter++;
			//console.log(this.checkGameContinue());
			if (this.framesCounter % 50 === 0) {
				this.framesCounter = 0;
				this.addEnemy();
			}
		} else {
			this.framesCounter = 0;
		}
	}

	move() {
		this.enemies.forEach((enemy) => enemy.move());
		this.towers.forEach((turret) => turret.move());
	}

	addEnemy() {
		//Pintamos enemigos mientras sea más pequeño que el array de enemigos (20)
		//console.log(this.waveIndex);
		if (this.waveEnemies < this.waves.wave[this.waveIndex].length) {
			//console.log(this.waves.wave[this.waveIndex].length);
			this.enemies.push(this.waves.wave[this.waveIndex][this.waveEnemies]);
			this.waveEnemies += 1;
		} else {
			//Si hay siguiente wave
			if (this.waveIndex < this.waves.wave.length - 1 && this.enemies.length === 0) {
				//5 segundos, next
				setTimeout((this.enemies = []), (this.waveEnemies = 0), (this.waveIndex += 1), 5000);
				//Sinó acabamos
			} else if (this.waveIndex === this.waves.wave.length - 1 && this.enemies.length === 0) {
				// Has ganado
				this.gameWin();
			}
		}
	}

	enemyInfo() {
		//console.log(this.context);
		let numberWave = this.waveIndex + 1;
		let wavesOf = this.waves.wave.length;
		let numberEnemiesInWave = this.enemies.length;
		this.context.font = '30px Play';
		this.context.fillStyle = 'red';
		this.context.fillText(`Wave ${numberWave} of ${wavesOf}`, 50, 50);
		this.context.fillText(`Enemies: ${numberEnemiesInWave}`, 995, 50);
	}
	// removeEnemyFromArray() {
	// 	return this.enemies.;
	// }

	goldFromEnemy() {
		this.enemies.forEach((enemy) => {
			if (enemy.isDead()) {
				this.userGold += enemy.returningGold();
			}
		});
	}

	clearEnemyEnding() {
		this.enemies = this.enemies.filter((enemy) => {
			return enemy.x + enemy.w / 2 <= this.context.canvas.width;
		});
	}

	enemyEnding() {
		this.enemies.forEach((enemy) => {
			if (enemy.endingObjective()) {
				this.userHP -= 1;
				this.audio5.volume = 0.1;
				this.audio5.play();
			}
		});
	}

	removeEnemy() {
		this.goldFromEnemy();
		this.enemies = this.enemies.filter((enemy) => {
			return enemy.getHP() > 0;
		});
	}

	// Turrets
	enemyInRange() {
		this.towers.forEach((turret) => {
			this.enemies.forEach((enemy) => {
				if (!turret.isHitting()) {
					if (turret.enemyInRange(enemy)) {
						if (turret.type === 'slow' && enemy.slow === false) {
							enemy.reduceSpeed(turret.slow);
						}
						enemy.receiveDamage(turret.recieveDmg());
					}
				}
			});
		});
	}

	createTurret(pos, type) {
		if (pos.click === 0) {
			let turret = null;
			let towerCost = 0;
			if (!this.positionTower(pos)) {
				if (type === 'sand') {
					turret = new Turret(this.context, pos.x, pos.y);
					towerCost = turret.returnPrice();
					if (this.userGold >= towerCost) {
						if (!turret.drawCanvas(this.path, pos, 30)) {
							this.towers.push(turret);
							this.userGold -= towerCost;
							this.audio4.volume = 0.1;
							this.audio4.play();
						}
					}
				} else if (type === 'slow') {
					turret = new SlowTurret(this.context, pos.x, pos.y);
					towerCost = turret.returnPrice();
					if (this.userGold >= towerCost) {
						if (!turret.drawCanvas(this.path, pos, 30)) {
							this.towers.push(turret);
							this.userGold -= towerCost;
							this.audio4.volume = 0.1;
							this.audio4.play();
						}
					}
				} else if (type === 'flame') {
					turret = new FlameTurret(this.context, pos.x, pos.y);
					towerCost = turret.returnPrice();
					if (this.userGold >= towerCost) {
						if (!turret.drawCanvas(this.path, pos, 30)) {
							this.towers.push(turret);
							this.userGold -= towerCost;
							this.audio4.volume = 0.1;
							this.audio4.play();
						}
					}
				} else if (type === 'catapult') {
					turret = new CatapultTurret(this.context, pos.x, pos.y);
					towerCost = turret.returnPrice();
					if (this.userGold >= towerCost) {
						if (!turret.drawCanvas(this.path, pos, 30)) {
							this.towers.push(turret);
							this.userGold -= towerCost;
							this.audio4.volume = 0.1;
							this.audio4.play();
						}
					}
				}
			}
		}
	}

	positionTower(pos) {
		for (let i = 0; i <= this.towers.length - 1; i++) {
			if (
				Math.sqrt(Math.pow(this.towers[i].x - pos.x, 2) + Math.pow(this.towers[i].y - pos.y, 2)) <=
				this.towers[i].w
			) {
				return true;
			}
		}
		return false;
	}

	// Player
	playerHP() {
		const HP = document.getElementById('hpPlayer');
		HP.innerText = this.userHP;
		if (this.userHP === 0) {
			//Paramos juego
			window.cancelAnimationFrame(this.intervalId);
			//Limpiamos mapa
			this.context.clearRect(0, 0, 1200, 800);
			//Pintamos logo
			this.context.drawImage(this.loser, 300, 150, 600, 300);
			this.audio1.pause();
			this.audio3.volume = 0.1;
			this.audio3.play();
			//2 seconds, refresh
			setTimeout(() => {
				this.restart();
			}, 6000);
		}
	}

	playerGold() {
		const gold = document.getElementById('goldPlayer');
		gold.innerText = '$' + this.userGold;
	}

	//Utils and game winner
	checkTurretSelected(turret) {
		let turretSelected = turret;

		//console.log(turretSelected);
		const sandTurret = document.getElementById('sandTurret');
		const cataTurret = document.getElementById('cataTurret');
		const slowTurret = document.getElementById('slowTurret');
		const flameTurret = document.getElementById('flameTurret');
		if (turretSelected == 'sand') {
			sandTurret.classList.add('turretSelectedBorder');
			cataTurret.classList.remove('turretSelectedBorder');
			slowTurret.classList.remove('turretSelectedBorder');
			flameTurret.classList.remove('turretSelectedBorder');
		} else if (turretSelected == 'catapult') {
			sandTurret.classList.remove('turretSelectedBorder');
			cataTurret.classList.add('turretSelectedBorder');
			slowTurret.classList.remove('turretSelectedBorder');
			flameTurret.classList.remove('turretSelectedBorder');
		} else if (turretSelected == 'slow') {
			sandTurret.classList.remove('turretSelectedBorder');
			cataTurret.classList.remove('turretSelectedBorder');
			slowTurret.classList.add('turretSelectedBorder');
			flameTurret.classList.remove('turretSelectedBorder');
		} else if (turretSelected == 'flame') {
			sandTurret.classList.remove('turretSelectedBorder');
			cataTurret.classList.remove('turretSelectedBorder');
			slowTurret.classList.remove('turretSelectedBorder');
			flameTurret.classList.add('turretSelectedBorder');
		}
	}
	gameWin() {
		//Paramos juego
		window.cancelAnimationFrame(this.intervalId);
		//alert('Estamos aqui');
		this.audio1.pause();
		this.audio2.volume = 0.1;
		this.audio2.play();
		//Limpiamos mapa
		this.context.clearRect(0, 0, 1200, 800);
		//Pintamos logo
		this.context.drawImage(this.winner, 150, 50, 950, 420);

		//6 seconds, refresh
		setTimeout(() => {
			this.restart();
		}, 6000);
	}
	gameLost() {
		window.cancelAnimationFrame(this.intervalId);
		//Limpiamos mapa
		this.context.clearRect(0, 0, 1200, 800);
		//Pintamos logo
		this.context.drawImage(this.loser, 300, 150, 600, 300);
		this.audio1.pause();
		this.audio3.volume = 0.1;
		this.audio3.play();
		//6 seconds, refresh
		setTimeout(() => {
			this.restart();
		}, 6000);
	}
	restart() {
		location.reload();
	}
	checkGameContinue() {
		return this.userHP <= 0 ? false : true;
	}
	cheatCodeGold() {
		this.userGold += 200;
		this.playerGold();
	}
	cheatCodeGoldToTheMoon() {
		this.userGold += 1000;
		this.playerGold();
	}
	cheatUnlockedTurret() {
		this.context.font = '30px Play';
		this.context.fillStyle = 'red';
		this.context.fillText('You have unlocked the OP turret', 500, 500);
	}
}
