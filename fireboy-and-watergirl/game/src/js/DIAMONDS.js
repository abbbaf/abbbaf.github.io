class Diamonds {
  constructor({ position, type }) {
    this.position = position;
    this.type = type;
    this.originalY = this.position.y;
    this.vy = 0.5;
    this.image = new Image();
    this.image.src = "/fireboy-and-watergirl/spritesheet/diamonds.svg";
    this.width = 32;
    this.height = 32;
  }

  collisionWithCharacter(character, i) {
    // console.log(this);
    // console.log(character);
    if (
      detectCollision({ object1: this, object2: character }) &&
      this.type == character.element
    ) {
      this.width = this.height = 0;
      coinCollected.play();
      const diamondIndex = diamondsArray.indexOf(this);
      if (diamondIndex !== -1) {
        diamondsArray.splice(diamondIndex, 1);
      }
    }
  }

  update() {
    this.position.y += this.vy;
    this.draw();
    if (this.position.y <= this.originalY) this.vy = 0.1;
    if (this.position.y >= this.originalY + 5) this.vy = -0.1;
  }

  draw() {
    if (this.type == "fire") {
      setCropboxAttributes({
        position: {
          x: 10,
          y: 20,
        },
        width: 85,
        height: 90,
      });
    } else {
      setCropboxAttributes({
        position: {
          x: 105,
          y: 20,
        },
        width: 90,
        height: 90,
      });
    }

    ctx.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

let diamondsArray = [];
let diasNumber = diamondsArray.length;
