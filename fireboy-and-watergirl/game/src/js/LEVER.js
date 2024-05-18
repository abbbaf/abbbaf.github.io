class Lever {
  constructor({ position, color, trigger }) {
    this.position = position;
    this.color = color;
    this.isActive = false;
    this.image = new Image();
    this.image.src = "/fireboy-and-watergirl/spritesheet/mechanisms/lever.png";
    this.trigger = trigger;
    this.width = 50;
    this.height = 32;
    this.handleX = {
      position: {
        x:
          this.trigger == "rightToLeft"
            ? this.position.x + this.width
            : this.position.x,
        y: this.position.y,
      },
      width: 5,
      height: this.height,
    };
  }

  checkOverlapWithCharacter(character) {
    if (detectCollision({ object1: character, object2: this.handleX })) {
      character.isPushingBlock = true;
      if (
        character.vx > 0 &&
        this.handleX.position.x + this.handleX.width <=
          this.position.x + this.width
      )
        this.handleX.position.x = character.position.x + character.width + 0.01;
      else if (character.vx < 0 && this.handleX.position.x >= this.position.x)
        this.handleX.position.x =
          character.position.x - this.handleX.width - 0.01;
    } else {
      character.isPushingBlock = false;
      this.soundDisabled = false;
    }

    if (this.trigger == "rightToLeft") {
      if (this.handleX.position.x <= this.position.x + this.width / 2) {
        if (!this.isActive) {
          this.isActive = true;
          lever.play();
        }
      } else {
        if (this.isActive) {
          lever.play();
          this.isActive = false;
        }
      }
    } else {
      if (this.handleX.position.x >= this.position.x + this.width / 2) {
        if (!this.isActive) {
          this.isActive = true;
          lever.play();
        }
      } else {
        if (this.isActive) {
          lever.play();
          this.isActive = false;
        }
      }
    }
  }

  update() {
    if (this.trigger == "leftToRight") {
      if (this.handleX.position.x <= this.position.x + this.width * 0.2) {
        setCropboxAttributes({
          position: {
            x: 775,
            y: 0,
          },
          width: 70,
          height: 140,
        });
      } else if (
        this.handleX.position.x <=
        this.position.x + this.width * 0.4
      ) {
        setCropboxAttributes({
          position: {
            x: 690,
            y: 0,
          },
          width: 70,
          height: 140,
        });
      } else if (
        this.handleX.position.x <=
        this.position.x + this.width * 0.6
      ) {
        setCropboxAttributes({
          position: {
            x: 600,
            y: 0,
          },
          width: 70,
          height: 140,
        });
      } else if (
        this.handleX.position.x <=
        this.position.x + this.width * 0.8
      ) {
        setCropboxAttributes({
          position: {
            x: 510,
            y: 0,
          },
          width: 70,
          height: 140,
        });
      } else {
        setCropboxAttributes({
          position: {
            x: 425,
            y: 0,
          },
          width: 70,
          height: 140,
        });
      }
    } else {
      if (this.handleX.position.x > this.position.x + this.width * 0.8) {
        setCropboxAttributes({
          position: {
            x: 0,
            y: 0,
          },
          width: 70,
          height: 140,
        });
      } else if (this.handleX.position.x > this.position.x + this.width * 0.6) {
        setCropboxAttributes({
          position: {
            x: 90,
            y: 0,
          },
          width: 70,
          height: 140,
        });
      } else if (
        this.handleX.position.x >=
        this.position.x + this.width * 0.4
      ) {
        setCropboxAttributes({
          position: {
            x: 175,
            y: 0,
          },
          width: 70,
          height: 140,
        });
      } else if (
        this.handleX.position.x >=
        this.position.x + this.width * 0.2
      ) {
        setCropboxAttributes({
          position: {
            x: 260,
            y: 0,
          },
          width: 70,
          height: 130,
        });
      } else {
        setCropboxAttributes({
          position: {
            x: 345,
            y: 0,
          },
          width: 70,
          height: 130,
        });
      }
    }
    this.drawLever();
  }

  drawLever() {
    // ctx.fillStyle = "yellow";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    // ctx.fillStyle = "black";
    // ctx.fillRect(this.handleX.position.x, this.position.y, 5, this.height);
    ctx.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      64,
      64
    );
  }
}

let leverArray = [];
