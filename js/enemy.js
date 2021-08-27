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
		this.w = 50;
		this.h = 50;
		this.wHPBar = 35;
		this.pathIndex = 0;
		this.slow = false;
		// Stats enemigo
		this.gold = 15;
		this.minionHp = 250;
		this.speed = 1.7;
		// Imagen enemigo red.png
		this.img = new Image();
		this.img.src = 'https://aitorsantaeugenia.github.io/TD_Project1/images/enemies/red.png';
	}

	draw() {
		this.context.drawImage(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
		this.paintHpBar();
	}

	move() {
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
		//this.context.fillRect(this.posx, this.posy, this.width, this.height);
		this.context.drawImage(this.img, this.posx, this.posy, this.width, this.height);
	}
}
