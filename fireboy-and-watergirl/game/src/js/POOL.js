class Pool {
  constructor({ position, width, height, type }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.type = type;
    this.image = new Image();
    switch (this.type) {
      case "water":
        this.image.src =
          "/fireboy-and-watergirl/spritesheet/pools/waterpool.svg";
        break;
      case "fire":
        this.image.src =
          "/fireboy-and-watergirl/spritesheet/pools/lavapool.svg";
        break;
      case "goo":
        this.image.src = "/fireboy-and-watergirl/spritesheet/pools/goo.svg";
        break;
    }
    // this.boundingPlatform = new Platform({
    //   position: {
    //     x: this.position.x - 10,
    //     y: this.position.y,
    //   },
    //   width: this.width + 20,
    //   height: 25,
    // });
    // platformArray.push(this.boundingPlatform);
  }

  drawPool() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

let poolArray = [];
