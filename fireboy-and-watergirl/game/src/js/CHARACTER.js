class Character {
  constructor({ position, element }) {
    this.position = position;
    this.width = 50;
    this.height = 50;
    this.element = element;
    this.initialVelocity = -5;
    this.image = new Image();
    this.image.src =
      this.element == "fire"
        ? "/fireboy-and-watergirl/spritesheet/characters/fb.png"
        : "/fireboy-and-watergirl/spritesheet/characters/wg.png";
    this.color = this.element == "fire" ? "red" : "blue";
    this.vx = SPEEDX;
    this.vy = SPEEDY;
    this.isPushingBlock = false;
    fireboyMovement.isGrounded = watergirlMovement.isGrounded = false;
    this.frame = 0;
    this.totalFrames = 7;
    this.isDead = false;
  }

  update() {
    /**
     * x-axis movement
     */
    if (this.element == "fire") {
      console.log(this.isPushingBlock);
      if (!fireboyMovement.right && !fireboyMovement.left) fireBoy.vx = 0;
      if (fireboyMovement.right)
        this.isPushingBlock ? (fireBoy.vx = 2) : (fireBoy.vx = SPEEDX);
      if (fireboyMovement.left)
        this.isPushingBlock ? (fireBoy.vx = -2) : (fireBoy.vx = -SPEEDX);
      this.position.x += this.vx;
      this.horizontalCollisionWithPlatforms();
      this.horizontalCollisionWithMovingPlatforms();
      this.horizontalCollisionWithBlock();
      this.horizontalCollisionWithPool();
      this.applyGravity();
      this.verticalCollisionWithPlatforms();
      this.verticalCollisionWithMovingPlatforms();
      this.verticalCollisionWithBlock();
      this.verticalCollisionWithPool();
    } else {
      if (!watergirlMovement.right && !watergirlMovement.left) waterGirl.vx = 0;
      if (watergirlMovement.right)
        this.isPushingBlock ? (waterGirl.vx = 2) : (waterGirl.vx = SPEEDX);
      if (watergirlMovement.left)
        this.isPushingBlock ? (waterGirl.vx = -2) : (waterGirl.vx = -SPEEDX);
      this.position.x += this.vx;
      this.horizontalCollisionWithPlatforms();
      this.horizontalCollisionWithMovingPlatforms();
      this.horizontalCollisionWithBlock();
      this.horizontalCollisionWithPool();
      this.applyGravity();
      this.verticalCollisionWithPlatforms();
      this.verticalCollisionWithMovingPlatforms();
      this.verticalCollisionWithBlock();
      this.verticalCollisionWithPool();
    }
  }
  /**
   * check if the character is grounded or not and set vy to a fixed value if it is grounded when user triggers the jump mechanism
   */
  jump() {
    if (this.element == "fire") {
      fireboyMovement.isGrounded = false;
      this.vy = -10;
      fbJump.play();
    } else {
      watergirlMovement.isGrounded = false;
      this.vy = -10;
      wgJump.play();
    }
  }

  /**
   * add gravity to the character after it jumps to make it fall after it reaches a certain height
   */
  applyGravity() {
    this.position.y += this.vy;
    this.vy += GRAVITY;
  }

  horizontalCollisionWithPlatforms() {
    for (let i = 0; i < platformArray.length; i++) {
      let platform = platformArray[i];
      platform.drawPlatform();
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
          this.element == "fire"
            ? (fireboyMovement.isGrounded = true)
            : (watergirlMovement.isGrounded = true);
        }
      }
    }
  }

  horizontalCollisionWithMovingPlatforms() {
    for (let i = 0; i < movingPlatformsArray.length; i++) {
      let platform = movingPlatformsArray[i];
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

  verticalCollisionWithMovingPlatforms() {
    for (let i = 0; i < movingPlatformsArray.length; i++) {
      let platform = movingPlatformsArray[i];
      if (detectCollision({ object1: this, object2: platform })) {
        if (this.vy < 0) {
          this.vy = 0;
          this.position.y = platform.position.y + platform.height + 0.01;
        }
        // if (this.vy == 0 || this.vy == 0.4) {
        //   platform.position.y = this.position.y - platform.height - 0.01;
        //   this.position.y = platform.position.y + platform.height + 0.01;
        // }
        if (this.vy > 0) {
          this.vy = 0;
          this.position.y = platform.position.y - this.height - 0.01;
          this.element == "fire"
            ? (fireboyMovement.isGrounded = true)
            : (watergirlMovement.isGrounded = true);
        }
      }
    }
  }

  /**
   * check if the character is colliding with the top of a platform and make it land there if it does
   */
  // landingOnPlatforms(platform) {
  //   if (detectCollision({ object1: this, object2: platform })) {
  //     // this.position.y = platform.y - this.height;
  //     this.vy = 0;
  //     this.element == "fire"
  //       ? (fireboyMovement.isGrounded = true)
  //       : (watergirlMovement.isGrounded = true);
  //   }
  // }

  horizontalCollisionWithPool() {
    for (let i = 0; i < poolArray.length; i++) {
      let pool = poolArray[i];
      if (detectCollision({ object1: this, object2: pool })) {
        if (this.vx < 0) {
          this.vx = 0;
          this.position.x = pool.position.x + pool.width + 0.01;
        }
        if (this.vx > 0) {
          this.vx = 0;
          this.position.x = pool.position.x - this.width - 0.01;
        }
      }
    }
  }

  verticalCollisionWithPool() {
    for (let i = 0; i < poolArray.length; i++) {
      let pool = poolArray[i];
      if (detectCollision({ object1: this, object2: pool })) {
        if (this.vy < 0) {
          this.vy = 0;
          this.position.y = pool.position.y + pool.height + 0.01;
        }
        if (this.vy > 0) {
          this.vy = 0;
          if (this.element == pool.type) {
            this.position.y = pool.position.y - this.height - 0.01;
          } else {
            this.position.y = 2000;
            this.isDead = true;
            death.play();
            gameLost = true;
          }
          this.element == "fire"
            ? (fireboyMovement.isGrounded = true)
            : (watergirlMovement.isGrounded = true);
        }
      }
    }
  }

  // collisionWithPools(pool) {
  //   if (detectCollision({ object1: this, object2: pool })) {
  //     if (this.element == "fire") {
  //       if (pool.type == "fire") {
  //         if (this.vy > 0) {
  //           this.vy = 0;
  //           this.position.y = pool.position.y - this.height - 0.01;
  //         }
  //       } else {
  //         this.isDead = true;
  //         death.play();
  //         gameLost = true;
  //       }
  //     } else {
  //       if (pool.type == "water") {
  //         this.vy = 0;
  //         watergirlMovement.isGrounded = true;
  //         this.position.y = pool.position.y - this.height - 0.01;
  //       } else {
  //         this.isDead = true;
  //         death.play();
  //         gameLost = true;
  //       }
  //     }
  //   }
  // }

  // collisionWithPushers(pusher) {
  //   if (detectCollision({ object1: this, object2: pusher })) {
  //     pusher.position.y += 0.1;
  //   } else {
  //     // console.log(detectCollision({ object1: this, object2: pusher }));
  //     // if (pusher.position.y > pusher.originalY) pusher.position.y -= 0.5;
  //   }
  // }

  horizontalCollisionWithBlock() {
    blockArray.forEach((block) => {
      block.update();
      if (detectCollision({ object1: this, object2: block })) {
        if (this.vx < 0) {
          this.isPushingBlock = true;
          block.position.x += this.vx;
        }
        if (this.vx > 0) {
          this.isPushingBlock = true;
          block.position.x += this.vx;
        }
      } else {
        this.isPushingBlock = false;
      }
    });
    // if (this.vy < 0) {
    //   this.vy = 0;
    //   this.position.y = block.position.y + block.height + 0.01;
    // }
    // if (this.vy > 0) {
    //   this.vy = 0;
    //   this.position.y = block.position.y - this.height - 0.01;
    // }
  }

  verticalCollisionWithBlock() {
    blockArray.forEach((block) => {
      block.update();
      if (detectCollision({ object1: this, object2: block })) {
        if (this.vy < 0) {
          this.vy = 0;
          this.position.y = block.position.y + block.height + 0.01;
        }
        if (this.vy > 0) {
          this.vy = 0;
          this.position.y = block.position.y - this.height - 0.01;
          this.element == "fire"
            ? (fireboyMovement.isGrounded = true)
            : (watergirlMovement.isGrounded = true);
        }
      }
    });
  }

  /**
   * to render the relevant character image
   * @param {context} ctx
   */
  draw() {
    if (this.element == "fire") this.setFireboyCropbox();
    else this.setWatergirlCropbox();
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

    ctx.fillStyle = "transparent";
    ctx.fillRect(this.position.x, this.position.y, 50, 50);
    // console.log(this.position.y);
  }

  setFireboyCropbox() {
    if (this.isDead) {
      this.image.src = "/fireboy-and-watergirl/spritesheet/characters/die.png";
      setCropboxAttributes({
        position: {
          x: 0,
          y: 0,
        },
        width: 493,
        height: 484,
      });
    } else if (this.vx == 0 && fireboyMovement.isGrounded) {
      setCropboxAttributes({
        position: {
          x: 0,
          y: 0,
        },
        width: 40,
        height: 59,
      });
    } else if (this.vy < 0 && fireboyMovement.right) {
      setCropboxAttributes({
        position: {
          x: 845,
          y: 0,
        },
        width: 40,
        height: 55,
      });
    } else if (this.vy < 0 && fireboyMovement.left) {
      setCropboxAttributes({
        position: {
          x: 800,
          y: 0,
        },
        width: 40,
        height: 55,
      });
    } else if (this.vy > 0.4 && fireboyMovement.right) {
      setCropboxAttributes({
        position: {
          x: 925,
          y: 0,
        },
        width: 40,
        height: 55,
      });
    } else if (this.vy > 0.4 && fireboyMovement.left) {
      setCropboxAttributes({
        position: {
          x: 885,
          y: 0,
        },
        width: 40,
        height: 55,
      });
    } else if (fireboyMovement.left) {
      fbFrameCounter = (fbFrameCounter + 1) % framesPerUpdate;
      setCropboxAttributes(fbCurrentAnimationFrames[fbAnimationFrame]);

      if (fbFrameCounter === 0) {
        fbAnimationFrame =
          fbAnimationFrame >= fbCurrentAnimationFrames.length - 1
            ? 0
            : fbAnimationFrame + 1;
      }
    } else if (fireboyMovement.right) {
      fbFrameCounter = (fbFrameCounter + 1) % framesPerUpdate;
      setCropboxAttributes(fbCurrentAnimationFrames[fbAnimationFrame]);

      if (fbFrameCounter === 0) {
        fbAnimationFrame =
          fbAnimationFrame >= fbCurrentAnimationFrames.length - 1
            ? 0
            : fbAnimationFrame + 1;
      }
    } else if (this.vy < 0) {
      setCropboxAttributes({
        position: {
          x: 965,
          y: 0,
        },
        width: 35,
        height: 50,
      });
    } else if (this.vy > 0) {
      setCropboxAttributes({
        position: {
          x: 1005,
          y: 0,
        },
        width: 35,
        height: 55,
      });
    }
  }

  setWatergirlCropbox() {
    if (this.isDead) {
      this.image.src = "/fireboy-and-watergirl/spritesheet/characters/die.png";
      setCropboxAttributes({
        position: {
          x: 0,
          y: 0,
        },
        width: 493,
        height: 484,
      });
    } else if (this.vx == 0 && watergirlMovement.isGrounded) {
      setCropboxAttributes({
        position: {
          x: 0,
          y: 0,
        },
        width: 57,
        height: 50,
      });
    } else if (this.vy < 0 && watergirlMovement.right) {
      setCropboxAttributes({
        position: {
          x: 1085,
          y: 0,
        },
        width: 30,
        height: 50,
      });
    } else if (this.vy < 0 && watergirlMovement.left) {
      setCropboxAttributes({
        position: {
          x: 1130,
          y: 0,
        },
        width: 40,
        height: 50,
      });
    } else if (this.vy > 0.4 && watergirlMovement.right) {
      setCropboxAttributes({
        position: {
          x: 1230,
          y: 0,
        },
        width: 39,
        height: 55,
      });
    } else if (this.vy > 0.4 && watergirlMovement.left) {
      setCropboxAttributes({
        position: {
          x: 1175,
          y: 0,
        },
        width: 40,
        height: 52,
      });
    } else if (watergirlMovement.left) {
      wgFrameCounter = (wgFrameCounter + 1) % framesPerUpdate;
      setCropboxAttributes(wgCurrentAnimationFrames[wgAnimationFrame]);

      if (wgFrameCounter === 0) {
        wgAnimationFrame =
          wgAnimationFrame >= wgCurrentAnimationFrames.length - 1
            ? 0
            : wgAnimationFrame + 1;
      }
    } else if (watergirlMovement.right) {
      wgFrameCounter = (wgFrameCounter + 1) % framesPerUpdate;
      setCropboxAttributes(wgCurrentAnimationFrames[wgAnimationFrame]);

      if (wgFrameCounter === 0) {
        wgAnimationFrame =
          wgAnimationFrame >= wgCurrentAnimationFrames.length - 1
            ? 0
            : wgAnimationFrame + 1;
      }
    } else if (this.vy < 0) {
      setCropboxAttributes({
        position: {
          x: 985,
          y: 0,
        },
        width: 50,
        height: 50,
      });
    } else if (this.vy > 0) {
      setCropboxAttributes({
        position: {
          x: 1030,
          y: 10,
        },
        width: 40,
        height: 40,
      });
    }
  }
}

let characters = [];
