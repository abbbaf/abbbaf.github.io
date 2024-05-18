let gameWon = false;
let gameOver = false;

let fireBoy;
let waterGirl;

function animate() {
  maps = [];
  maps.push(map2);
  maps.push(map1);
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = JSON.parse(localStorage.getItem(key));
    maps.push(value);
  }

  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  maps.forEach((_, i) => {
    let levelHtml = `
        <div class="level">
          <button data-id="${i + 1}">Level ${i + 1}</button>
        </div>`;
    levelContainer.insertAdjacentHTML("beforeend", levelHtml);
    availableLevels++;
  });
  if (gameStart) {
    characters.forEach((character) => {
      if (character.element == "fire") fireBoy = character;
      else waterGirl = character;
    });

    if (fireBoy && waterGirl) {
      if (
        fireBoy.position.x > myCanvas.width ||
        fireBoy.position.y > myCanvas.height ||
        fireBoy.position.x < 0 ||
        fireBoy.position.y < 0 ||
        waterGirl.position.x > myCanvas.width ||
        waterGirl.position.y > myCanvas.height ||
        waterGirl.position.x < 0 ||
        waterGirl.position.y < 0
      )
        gameLost = true;
    }

    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.drawImage(background, 0, 0, myCanvas.width, myCanvas.height);
    doorArray.forEach((door) => {
      door.drawDoors();
      if (fireBoy && waterGirl) {
        door.isOpen(fireBoy);
        door.isOpen(waterGirl);
      }
    });

    if (doorArray.length > 0) {
      if (doorArray[0].open && doorArray[1].open) {
        gameWon = true;
        fireBoy.width = 0;
        waterGirl.width = 0;
      }
    }

    if (fireBoy && waterGirl) {
      fireBoy.draw();
      waterGirl.draw();
    }

    for (let i = 0; i < poolArray.length; i++) {
      poolArray[i].drawPool();
    }

    for (let i = 0; i < pushersArray.length; i++) {
      pushersArray[i].drawPusher();

      if (fireBoy && waterGirl) {
        const isFireBoyColliding = detectCollision({
          object1: fireBoy,
          object2: pushersArray[i],
        });
        const isWaterGirlColliding = detectCollision({
          object1: waterGirl,
          object2: pushersArray[i],
        });
        const isBlockColliding = blockArray.some((block) =>
          detectCollision({ object1: block, object2: pushersArray[i] })
        );

        if (isFireBoyColliding || isWaterGirlColliding || isBlockColliding) {
          pushersArray[i].pusherPushed();
        } else {
          pushersArray[i].pusherNotPushed();
        }
      }

      if (pushersArray[i].position.y <= pushersArray[i].originalY)
        pushersArray[i].pusherSoundDisabled = false;
    }

    leverArray.forEach((lever) => {
      lever.checkOverlapWithCharacter(fireBoy);
      lever.checkOverlapWithCharacter(waterGirl);
      lever.update();
    });

    movingPlatformsArray
      .filter((platform) => {
        return platform.trigger == "pusher";
      })
      .forEach((platform) => {
        platform.drawPlatform();
        let matchingPushers = pushersArray.filter((pusher) => {
          return pusher.color === platform.color && pusher.isPushed;
        });
        if (matchingPushers.length > 0) {
          matchingPushers.forEach(() => {
            platform.movePlatform(true);
          });
        } else {
          platform.movePlatform(false);
        }
      });

    movingPlatformsArray
      .filter((platform) => {
        return platform.trigger == "lever";
      })
      .forEach((platform) => {
        platform.drawPlatform();
        let matchingLevers = leverArray.filter((lever) => {
          return lever.color === platform.color && lever.isActive;
        });
        if (matchingLevers.length > 0) {
          matchingLevers.forEach(() => {
            platform.movePlatform(true);
          });
        } else {
          platform.movePlatform(false);
        }
      });

    // blockArray.forEach((block) => {
    //   block.update();
    //   pushersArray.forEach((pusher) => {
    //     if (detectCollision({ object1: block, object2: pusher })) {
    //       pusher.pusherPushed();
    //     }
    //   });
    // });

    if (diamondsArray.length > 0) {
      diamondsArray.forEach((dia, i) => {
        dia.update();
        if (fireBoy && waterGirl) {
          dia.collisionWithCharacter(fireBoy, i);
          dia.collisionWithCharacter(waterGirl, i);
        }
      });
    }
    if (fireBoy && waterGirl) {
      fireBoy.update();
      waterGirl.update();
    }
  }

  ctx.drawImage(timerImage, 520, 0, 200, 100);
  ctx.font = "30px Arial";
  ctx.fillStyle = "yellow";
  ctx.fillText(displayTime, 585, 40);

  let animationId = requestAnimationFrame(animate);
  if (gameOver) {
    clearInterval(timerInterval);
    cancelAnimationFrame(animationId);
    calculateScore();
    let matchingScoreImage;
    scoreImages.forEach((img) => {
      img.classList.remove("active");
      if (img.dataset.id == scoreStatus) matchingScoreImage = img;
    });
    matchingScoreImage?.classList.add("active");
    scoreBoard.style.display = "block";
    scoreBoard.querySelector("#retry").classList.remove("active");
    scoreBoard.querySelector("#continue").classList.add("active");
  }

  if (gameLost) {
    clearInterval(timerInterval);
    cancelAnimationFrame(animationId);
    scoreImages.forEach((img) => {
      img.classList.remove("active");
      img.dataset.id == 0 ? img.classList.add("active") : "";
    });
    scoreBoard.style.display = "block";
    scoreBoard.querySelector("#continue").classList.remove("active");
    scoreBoard.querySelector("#retry").classList.add("active");
  }
}

animate();

function calculateScore() {
  if (diamondsArray.length == 0 && seconds <= 90) {
    scoreStatus = 1;
  } else if (diamondsArray.length !== 0 && seconds <= 90) {
    scoreStatus = 2;
  } else if (diamondsArray.length !== 0 && seconds > 90) {
    scoreStatus = 3;
  } else {
    scoreStatus = 4;
  }
}

//listen for the jumping event triggered by the player
document.addEventListener("keydown", (e) => {
  if (e.key == "ArrowUp") {
    if (fireboyMovement.isGrounded) {
      fireBoy.jump();
    }
  }
  if (e.key == "w") {
    if (watergirlMovement.isGrounded) {
      waterGirl.jump();
    }
  }
});

function resetGame() {
  // Reset all relevant game state variables to their initial values
  gameWon = false;
  gameOver = false;
  gameLost = false;
  gameStart = true;
  scoreStatus = 1;
  seconds = 0;
  displayTime = "00:00";
  clearInterval(timerInterval);
  leverArray = [];
  movingPlatformsArray = [];
  doorArray = [];
  diamondsArray = [];
  platformArray = [];
  blockArray = [];
  pushersArray = [];
  poolArray = [];
  // Clear any existing animations or intervals
  // cancelAnimationFrame(animationId);
  tile.draw(maps[currentLevel - 1]);
  startTimer();

  // Call the animation function to restart the game loop
  animate();
}

scoreBoard.addEventListener("mousedown", (e) => {
  if (e.target.getAttribute("id") === "continue") {
    myCanvas.style.display = "none";
    scoreBoard.style.display = "none";
    levelSelector.style.display = "block";
    levelSound.pause();
    introSound.play();
    resetGame();
  } else if (e.target.getAttribute("id") === "exit") {
    // myCanvas.style.display = "none";
    // scoreBoard.style.display = "none";
    // menu.style.display = "block";
    // levelSound.pause();
    // introSound.play();
    // resetGame();
    location.reload();
  } else if (e.target.getAttribute("id") === "retry") {
    scoreBoard.style.display = "none";
    resetGame();
  }
});
