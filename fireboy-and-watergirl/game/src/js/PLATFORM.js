class Platform {
  constructor({ position, width, height }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.image = new Image();
    const blockNum = randomNumGenerator(1, 8);
    this.image.src = `/fireboy-and-watergirl/spritesheet/groundBlocks/block${blockNum}.svg`;
  }
  drawPlatform() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}

let platformArray = [];
