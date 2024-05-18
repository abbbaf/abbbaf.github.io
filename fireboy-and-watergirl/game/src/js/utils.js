const fireboyMovement = {
  right: false,
  left: false,
  isGrounded: true,
};

const watergirlMovement = {
  right: false,
  left: false,
  isGrounded: true,
};

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowRight":
      fireboyMovement.right = true;
      fbCurrentAnimationFrames = fireboyRightRun;
      break;
    case "ArrowLeft":
      fireboyMovement.left = true;
      fbCurrentAnimationFrames = fireboyRunLeft;
      break;
    case "d":
      watergirlMovement.right = true;
      wgCurrentAnimationFrames = watergirlRunRight;
      break;
    case "a":
      watergirlMovement.left = true;
      wgCurrentAnimationFrames = watergirlLeftRun;
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowRight":
      fireboyMovement.right = false;
      fbAnimationFrame = 0;
      break;
    case "ArrowLeft":
      fireboyMovement.left = false;
      fbAnimationFrame = 0;
      break;
    case "d":
      watergirlMovement.right = false;
      wgAnimationFrame = 0;
    case "a":
      watergirlMovement.left = false;
      wgAnimationFrame = 0;
      break;
  }
});

function detectCollision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x &&
    object1.position.y <= object2.position.y + object2.height
  );
}

/**
 * cropbox to crop a fixed area from a spritesheet from (x, y)
 */
const cropbox = {
  position: {
    x: 0,
    y: 0,
  },
  width: 0,
  height: 0,
};

/**'
 * @param {number} position
 * @param {number} width
 * @param {number} height
 */
function setCropboxAttributes({ position, width, height }) {
  cropbox.position = position;
  cropbox.width = width;
  cropbox.height = height;
}

function randomNumGenerator(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}
