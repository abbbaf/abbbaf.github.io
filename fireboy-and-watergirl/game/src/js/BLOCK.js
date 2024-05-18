class Block {
  constructor({ position }) {
    this.position = position;
    this.width = 50;
    this.height = 50;
    this.vx = 3;
    this.vy = 0;
    this.image = new Image();
    this.image.src = "/fireboy-and-watergirl/spritesheet/block.svg";
  }

  update() {
    this.horizontalCollisionWithPlatforms();
    this.applyGravity();
    this.verticalCollisionWithPlatforms();
    this.drawBlock();
  }

  applyGravity() {
    this.position.y += this.vy;
    this.vy += GRAVITY;
  }

  horizontalCollisionWithPlatforms() {
    for (let i = 0; i < platformArray.length; i++) {
      let platform = platformArray[i];
      if (detectCollision({ object1: this, object2: platform })) {
        if (this.vx < 0) {
          this.vx = 0;
          this.position.x = platform.position.x + platform.width + 0.01;
        }
        if (this.vx > 0) {
          this.vx = 0;
          this.position.x = platform.position.x - this.width - 0.01;
        }
      }
    }
  }

  verticalCollisionWithPlatforms() {
    for (let i = 0; i < platformArray.length; i++) {
      let platform = platformArray[i];
      if (detectCollision({ object1: this, object2: platform })) {
        if (this.vy < 0) {
          this.vy = 0;
          this.position.y = platform.position.y + platform.height + 0.01;
        }
        if (this.vy > 0) {
          this.vy = 0;
          this.position.y = platform.position.y - this.height - 0.01;
        }
        // fire.isGrounded = true;
      }
    }
  }

  drawBlock() {
    setCropboxAttributes({
      position: {
        x: 1,
        y: 1,
      },
      width: 97,
      height: 94,
    });
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
    // ctx.fillStyle = "gray";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

let blockArray = [];
