const selectionBar = document.getElementById("selection-bar");

const images = document.querySelectorAll(".mapElement");
const mapCanvas = document.getElementById("mapEditor");
const context = mapCanvas.getContext("2d");

const saveBtn = document.querySelector(".saveCanvas");
const clearCanvas = document.querySelector(".clearCanvas");

let canHover = false;
/*index
 * 1: ground/wall
 * 2: waterpool
 * 3: lava pool
 * 4: goo pool
 * 5: purple pusher
 * 6: white pusher
 * 7: green pusher
 * 8: pink pusher
 * 10: lever
 * 16: purple leftMovingPlatform triggered by pusher
 * 17: purple rightMovingPlatform triggered by pusher
 * 18: purple upMovingPlatform triggered by pusher
 * 19: purple DownMovingPlatform triggered by pusher
 * 30: big block
 * 35: blue diamond
 * 36: red diamond
 * 40: yellow lever triggered left to right
 * 41: yellow lever triggered right to left
 * 50: yellow leftMovingPlatform triggered by lever
 * 51: yellow rightMovingPlatform triggered by lever
 * 52: yellow upMovingPlatform triggered by lever
 * 53: yellow DownMovingPlatform triggered by lever
 * 60: fireboy's door
 * 61: watergirl's door
 * 99: fireboy
 * 100: watergirl
 */
let selectedElement = 0;
let isSelected = false;

selectionBar.addEventListener("click", handleSelection);

function handleSelection(e) {
  let id = e.target.dataset.id;
  if (isSelected && id == selectedElement) {
    isSelected = false;
    canHover = false;
    selectedElement = 0;
    e.target.classList.remove("active");
  } else {
    isSelected = true;
    canHover = true;
    selectedElement = Number(e.target.dataset.id);
    images.forEach((img) => {
      img.classList.remove("active");
    });
    e.target.classList.add("active");
  }
}

let numRows = Math.floor(mapCanvas.height / tileSize);
let numCols = Math.floor(mapCanvas.width / tileSize);

let layer = {};

let previewElementX;
let previewElementY;

function draw() {
  context.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
  context.drawImage(background, 0, 0, mapCanvas.width, mapCanvas.height);
  setImage();
  if (canHover) {
    updatePreviewElement();
  }
  // Draw grid lines
  context.strokeStyle = "#ccc"; // Set the color of the grid lines
  context.lineWidth = 1;

  for (let i = 1; i < numRows; i++) {
    // Draw horizontal lines
    let y = i * tileSize;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(myCanvas.width, y);
    context.stroke();
  }

  for (let j = 1; j < numCols; j++) {
    // Draw vertical lines
    let x = j * tileSize;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, myCanvas.height);
    context.stroke();
  }
  requestAnimationFrame(draw);
}

draw();

let previewElement = document.querySelector(".preview-element");
let isMouseDown = false;

function updatePreviewElement() {
  let { src, width, height } = renderImage(selectedElement);
  context.fillStyle = "rgba(128,128,128,0.5)";
  context.fillRect(
    previewElementX * tileSize,
    previewElementY * tileSize,
    width,
    height
  );
  if (selectedElement != 0) {
    let selectedImage = new Image();
    selectedImage.src = src;
    context.drawImage(
      selectedImage,
      previewElementX * tileSize,
      previewElementY * tileSize,
      selectedImage.width,
      selectedImage.height
    );
  }
}

function getCoords(e) {
  const { x, y } = e.target.getBoundingClientRect();
  const mouseX = e.clientX - x;
  const mouseY = e.clientY - y;
  return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)];
}

mapCanvas.addEventListener("mousedown", () => {
  isMouseDown = true;
});
mapCanvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});
mapCanvas.addEventListener("mouseleave", () => {
  isMouseDown = false;
});
mapCanvas.addEventListener("mousedown", addTile);

mapCanvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    addTile(e);
  } else {
    [previewElementX, previewElementY] = getCoords(e);
  }
});

function addTile(e) {
  let keys = [];
  let clicked = getCoords(e);
  let key = clicked[0] + "-" + clicked[1];
  if (!(key in layer)) keys = setKeys(clicked);
  for (let i = 1; i < keys.length; i++) {
    layer[keys[i]] = -1;
  }
  layer[keys[0]] = selectedElement;
}

function setImage() {
  Object.entries(layer).forEach(([key, value]) => {
    if (value != -1) {
      let positionX = Number(key.split("-")[0]);
      let positionY = Number(key.split("-")[1]);
      let { src, width, height } = renderImage(Number(value));
      let image = new Image();
      image.src = src;
      context.drawImage(image, positionX * 32, positionY * 32, width, height);
    }
  });
}

function renderImage(value) {
  let src;
  let width = 32;
  let height = 32;
  switch (value) {
    case 1:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/block1 (1).png";
      break;
    case 99:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/FireBoy (1).png";
      width = 50;
      height = 50;
      break;
    case 100:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/WaterGirl (1).png";
      width = 50;
      height = 50;
      break;
    case 60:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/fire_door (1).png";
      width = 96;
      height = 96;
      break;
    case 61:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/water_door (1).png";
      width = 96;
      height = 96;
      break;
    case 36:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/fire_gem (1).png";
      break;
    case 35:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/water_gem (1).png";
      break;
    case 3:
      src =
        "/fireboy-and-watergirl/spritesheet/mapEditor/fire_obstacle (1).png";
      width = 160;
      height = 32;
      break;
    case 2:
      src =
        "/fireboy-and-watergirl/spritesheet/mapEditor/water_obstacle (1).png";
      width = 160;
      height = 32;
      break;
    case 4:
      src =
        "/fireboy-and-watergirl/spritesheet/mapEditor/poison_obstacle (1).png";
      width = 160;
      height = 32;
      break;
    case 5:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/purplePusher.png";
      break;
    case 19:
      src =
        "/fireboy-and-watergirl/spritesheet/mapEditor/purplePlatform (1).png";
      width = 128;
      height = 30;
      break;
    case 41:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/lever (1).png";
      width = 50;
      height = 32;
      break;
    case 53:
      src =
        "/fireboy-and-watergirl/spritesheet/mapEditor/yellowPlatform (1).png";
      width = 128;
      height = 30;
      break;
    case 30:
      src = "/fireboy-and-watergirl/spritesheet/mapEditor/block (1).png";
      width = 50;
      height = 50;
      break;
  }
  return { src, width, height };
}

function setKeys(clicked) {
  let keys = [];
  let positionX = clicked[0];
  let positionY = clicked[1];
  keys.push(positionX + "-" + positionY);
  switch (selectedElement) {
    case 1:
    case 35:
    case 36:
    case 5:
      break;
    case 2:
    case 3:
    case 4:
      for (let i = 1; i < 5; i++) keys.push(positionX + i + "-" + positionY);
      break;
    case 19:
    case 53:
      for (let i = 1; i < 4; i++) keys.push(positionX + i + "-" + positionY);
      break;
    case 41:
      for (let i = 1; i < 2; i++) keys.push(positionX + i + "-" + positionY);
      break;
    case 99:
    case 100:
    case 30:
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          keys.push(positionX + i + "-" + (positionY + j));
        }
      }
      break;
    case 60:
    case 61:
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          keys.push(positionX + i + "-" + (positionY + j));
        }
      }
    default:
      break;
  }
  return keys;
}

saveBtn.addEventListener("mousedown", () => {
  let maxRow = 21;
  let maxCol = 40;

  const map = Array.from({ length: maxRow }, () => Array(maxCol).fill(0));

  // Assign values from the layer object to the map array
  Object.entries(layer).forEach(([key, value]) => {
    if (key !== undefined && key !== "undefined") {
      const [col, row] = key.split("-").map(Number);
      map[row][col] = value;
    }
  });

  const mapJSON = JSON.stringify(map);

  // Store the JSON string in local storage with a specific key
  localStorage.setItem(`map${availableLevels + 1}`, mapJSON);
  availableLevels++;

  mapEditor.style.display = "none";
  levelSelector.style.display = "none";
  menu.style.display = "block";
});

clearCanvas.addEventListener("mousedown", (e) => {
  layer = {};
});

// localStorage.clear();
