class MovingPlatforms {
  constructor({ position, width, trigger, color, movement }) {
    this.position = position;
    this.trigger = trigger;
    this.color = color;
    this.movement = movement;
    this.width = width;
    this.height = 30;
    this.originalX = this.position.x;
    this.originalY = this.position.y;
    this.maxDisplacement = 96;
    this.image = new Image();
    this.image.src =
      this.trigger == "pusher"
        ? "/fireboy-and-watergirl/spritesheet/mechanisms/purplePlatform.png"
        : "/fireboy-and-watergirl/spritesheet/mechanisms/yellowPlatform.png";
    this.active = false;
  }

  /**
   * always move the platform towards the original position
   */
  updatePlatform() {
    switch (this.movement) {
      case "horizontalRight":
        this.x;
        break;
      case "horizontalLeft":
        break;
      case "verticalDown":
        break;
      case "verticalUp":
    }
  }

  movePlatform(isPushed) {
    this.active = isPushed;
    switch (this.movement) {
      case "horizontalRight":
        if (isPushed) {
          if (this.position.x < this.originalX + this.maxDisplacement) {
            platform.play();
            this.position.x += 0.4;
          } else platform.pause();
        } else {
          if (this.position.x >= this.originalX) {
            this.position.x -= 0.4;
            platform.play();
          } else platform.pause();
        }
        break;
      case "horizontalLeft":
        if (isPushed) {
          if (this.position.x >= this.originalX - this.maxDisplacement) {
            this.position.x -= 0.4;
            platform.play();
          } else platform.pause();
        } else {
          if (this.position.x + this.width < this.originalX) {
            this.position.x += 0.4;
            platform.play();
          } else platform.pause();
        }

        break;
      case "verticalDown":
        if (isPushed) {
          if (this.position.y < this.originalY + this.maxDisplacement) {
            this.position.y += 0.4;
            platform.play();
          } else platform.pause();
        } else {
          if (this.position.y > this.originalY) {
            this.position.y -= 0.4;
            platform.play();
          } else platform.pause();
        }

        break;
      case "verticalUp":
        if (isPushed) {
          if (this.position.y >= this.originalY - this.maxDisplacement) {
            this.position.y -= 0.4;
            platform.play();
          } else platform.pause();
        } else {
          if (this.position.y <= this.originalY) {
            this.position.y += 0.4;
            platform.play();
          } else platform.pause();
        }
        break;
    }
  }

  drawPlatform() {
    if (this.active) {
      setCropboxAttributes({
        position: {
          x: 0,
          y: 3,
        },
        width: 163,
        height: 30,
      });
    } else {
      setCropboxAttributes({
        position: {
          x: 187,
          y: 3,
        },
        width: 163,
        height: 30,
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

let movingPlatformsArray = [];
