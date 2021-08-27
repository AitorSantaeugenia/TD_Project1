//Vikingos - https://github.com/AitorSantaeugenia/lab-javascript-vikings
// Class Enemy
class Enemy {
	constructor(context, path) {
		//Setters
		this.context = context;
		this.path = path;
	}
	//Getters
	setHP(value) {
		this.minionHp = value;
	}

	receiveDamage(value) {
		this.minionHp -= value;
	}

	getHP() {
		return this.minionHp;
	}
}

//Enemy 1 - redDemon
class SmallDemon extends Enemy {
	constructor(context, path) {
		//Setters
		super(context, path);
		this.x = this.path[0][0];
		this.y = this.path[0][1];
		this.posInicialX = this.x;
		this.wHPBar = 35;
		this.pathIndex = 0;
		this.slow = false;
		// Stats enemigo
		this.gold = 15;
		this.minionHp = 300;
		this.speed = 1.4;
		// Imagen enemigo red.png
		this.randomImage = Math.trunc(Math.random() * 8);
		this.img = new Image();
		this.img.src = `../images/enemies/enemy${this.randomImage}.png`;

		//tring out spritesheets
		this.w = 50;
		this.h = 50;
		//https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3
		//Work in progress
		//1- pillar posicion imagen
		//2- pintar imagen (acordarse del random de arriba)
		//3- animar con frames
		// this.scale = 2;
		// this.scaledWidth = this.scale * this.w;
		// this.scaledHeight = this.scale * this.h;
		// this.cycleLoop = [ 0, 1, 2 ];
		// this.currentLoopIndex = 0;
		// this.frameCount = 0;
	}

	draw() {
		this.context.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		this.paintHpBar();
		// this.context.ctx.drawImage(
		// 	this.img,
		// 	this.frameX * this.w,
		// 	this.frameY * this.h,
		// 	this.w,
		// 	this.h,
		// 	this.canvasX,
		// 	this.canvasY,
		// 	this.scaledWidth,
		// 	this.scaledHeight
		// );
	}

	move() {
		// this.frameCount++;
		// if (this.frameCount < 15) {
		// 	window.requestAnimationFrame(step);
		// 	return;
		// }
		// this.frameCount = 0;
		// this.ctx.clearRect(0, 0, this.canvas.w, this.canvas.h);
		// drawFrame(this.cycleLoop[this.currentLoopIndex], 0, 0, 0);
		// this.currentLoopIndex++;
		// if (this.currentLoopIndex >= this.cycleLoop.length) {
		// 	this.currentLoopIndex = 0;
		// }
		// window.requestAnimationFrame(step);

		this.directionPath();
	}

	directionPath() {
		if (this.path[this.pathIndex][0] - this.posInicialX > 0) {
			this.direction = 1;
			this.x +=
				this.speed *
				(Math.abs(this.path[this.pathIndex][0] - this.posInicialX) /
					(Math.abs(this.path[this.pathIndex][0] - this.posInicialX) +
						Math.abs(this.path[this.pathIndex][1])));
		}

		if (this.x + 1 >= this.path[this.pathIndex][0] && this.x - 1 <= this.path[this.pathIndex][0]) {
			this.posInicialX = this.path[this.pathIndex][0];
			this.pathIndex += 1;
		}
	}

	paintHpBar() {
		new HPbar(
			this.context,
			this.x - this.w / 2,
			this.y - this.h / 2 - 5,
			this.wHPBar * this.minionHp / 250,
			8
		).draw();
	}

	endingObjective() {
		return this.x + this.w / 2 > this.context.canvas.width;
	}

	isDead() {
		return this.minionHp <= 0;
	}

	returningGold() {
		return this.gold;
	}

	reduceSpeed(rate) {
		const minionSpeed = this.speed;
		this.speed *= rate;
		this.slow = true;

		// 1 sec slow
		setTimeout(() => {
			this.speed = minionSpeed;
			this.slow = false;
		}, 1000);
	}
}

class HPbar {
	constructor(context, posx, posy, width, height, color) {
		this.context = context;
		this.posx = posx;
		this.posy = posy;
		this.width = width;
		this.height = height;
		this.color = color;
	}

	draw() {
		this.context.fillStyle = this.color;
		this.img = new Image();
		this.img.src = 'https://aitorsantaeugenia.github.io/TD_Project1/images/hbar.png';
		this.context.drawImage(this.img, this.posx, this.posy, this.width, this.height);
	}
}
