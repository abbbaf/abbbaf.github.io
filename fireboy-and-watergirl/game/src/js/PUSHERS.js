class Pusher {
  constructor({ position, color }) {
    this.position = position;
    this.width = 20;
    this.height = 20;
    this.color = color;
    this.originalY = this.position.y;
    this.isPushed = false;
    this.velocityY = 0;
    this.image = new Image();
    this.image.src =
      "/fireboy-and-watergirl/spritesheet/mechanisms/purplePusher.svg";
    this.pusherSoundDisabled = false;
  }

  drawPusher() {
    setCropboxAttributes({
      position: {
        x: 1,
        y: 1,
      },
      width: 120,
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
      32,
      64
    );
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  pusherPushed() {
    // this.velocityY = 0.5;'
    this.position.y += 0.5;
    // console.log(this.isPushed);
    // movingPlatformsArray.forEach((platform) => {
    //   if (platform.color === this.color) {
    //     this.isPushed = true;
    //     platform.movePlatform(this.isPushed);
    //   }
    // });
    this.isPushed = true;

    if (!this.pusherSoundDisabled) {
      pusher.play();
      this.pusherSoundDisabled = true;
    }
  }

  pusherNotPushed() {
    this.isPushed = false;
    this.pusherSoundDisabled = true;
    if (this.position.y > this.originalY) {
      // this.velocityY -= 0.5;
      this.position.y -= 0.5;
      // movingPlatformsArray.forEach((platform) => {
      //   if (
      //     platform.color === this.color &&
      //     this.position.y < this.originalY + 19.5
      //   ) {
      //     this.isPushed = false;
      //     platform.movePlatform(this.isPushed);
      //   }
      // });
      if (this.position.y > this.originalY + 19) this.isPushed = true;
    } else {
      this.pushed = false;
    }
  }
}

let pushersArray = [];
