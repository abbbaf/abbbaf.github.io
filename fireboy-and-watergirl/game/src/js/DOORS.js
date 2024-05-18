class Doors {
  constructor({ position, width, height, element }) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = "/fireboy-and-watergirl/spritesheet/doors/doors.png";
    this.element = element;
    this.open = false;
    this.boundingBox = {
      position: {
        x: this.position.x + 15,
        y: this.position.y,
      },
      width: 66,
      height: this.height,
    };
    this.frameCounter = 0;
  }

  isOpen(character) {
    if (detectCollision({ object1: character, object2: this.boundingBox })) {
      if (this.element == character.element) this.open = true;
    } else if (this.element == character.element) this.open = false;
  }

  drawDoors() {
    if (gameWon && !gameOver) {
      door.play();
      if (this.element == "fire") {
        this.image.src = "/fireboy-and-watergirl/spritesheet/doors/fbDoor.png";
        this.fbDoorAnimation();
      } else {
        this.image.src = "/fireboy-and-watergirl/spritesheet/doors/wgDoor.png";
        this.wgDoorAnimation();
      }
    } else {
      this.element == "fire"
        ? setCropboxAttributes({
            position: {
              x: 7,
              y: 10,
            },
            width: 100,
            height: 100,
          })
        : setCropboxAttributes({
            position: {
              x: 115,
              y: 10,
            },
            width: 100,
            height: 100,
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

  fbDoorAnimation() {
    setCropboxAttributes(fbDoorAnimationFrames[currentFbDoor]);
    this.frameCounter = (this.frameCounter + 1) % framesPerUpdate;

    if (this.frameCounter === 0) {
      if (currentFbDoor >= fbDoorAnimationFrames.length - 1) {
        currentFbDoor = fbDoorAnimationFrames.length - 1;
        gameWon = true;
        gameOver = true;
      } else currentFbDoor++;
    }
  }

  wgDoorAnimation() {
    if (currentWgDoor <= wgDoorAnimationFrames.length - 1) {
      setCropboxAttributes(wgDoorAnimationFrames[currentWgDoor]);
      this.frameCounter = (this.frameCounter + 1) % 15;

      if (this.frameCounter === 0) {
        if (currentWgDoor >= wgDoorAnimationFrames.length - 1) {
          currentWgDoor = wgDoorAnimationFrames.length - 1;
          return;
        } else currentWgDoor++;
      }
    }
  }
}

let doorArray = [];
