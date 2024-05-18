const startButton = document.getElementById("start");
const designerButton = document.getElementById("designer");
const mapEditor = document.querySelector(".mapEditor");
const menu = document.getElementById("menu");
const scoreBoard = document.getElementById("scoreboard");
const scoreImages = document.querySelectorAll(".score");
const levelSelector = document.querySelector(".level-selector");

let availableLevels = 0;
let currentLevel = 0;
let gameStart = false;
let scoreStatus = 1;
let gameLost = false;

let musicEnabled = true;
let introSound;
let levelSound;
let coinCollected;
let death;
let fbJump;
let wgJump;
let door;
let lever;
let pusher;
let platform;

function createAudio(path, loop = false) {
  const audio = new Audio(path);
  audio.loop = loop;
  return audio;
}

function setMusic() {
  const defaultPath =
    "/fireboy-and-watergirl/music/HD - Absolute Silence Sound Effect.mp3";

  if (musicEnabled) {
    introSound = createAudio(
      "/fireboy-and-watergirl/music/IntroMusic.wav",
      true
    );
    levelSound = createAudio(
      "/fireboy-and-watergirl/music/LevelMusic.wav",
      true
    );
    coinCollected = createAudio("/fireboy-and-watergirl/music/coinCollect.ogg");
    death = createAudio("/fireboy-and-watergirl/music/death.ogg");
    fbJump = createAudio("/fireboy-and-watergirl/music/fireboyJump.ogg");
    wgJump = createAudio("/fireboy-and-watergirl/music/watergirlJump.ogg");
    door = createAudio("/fireboy-and-watergirl/music/Door.mp3");
    lever = createAudio("/fireboy-and-watergirl/music/Lever.mp3");
    pusher = createAudio("/fireboy-and-watergirl/music/Pusher.mp3");
    platform = createAudio("/fireboy-and-watergirl/music/Platform.mp3");
  } else {
    introSound = createAudio(defaultPath);
    levelSound = createAudio(defaultPath);
    coinCollected = createAudio(defaultPath);
    death = createAudio(defaultPath);
    fbJump = createAudio(defaultPath);
    wgJump = createAudio(defaultPath);
    door = createAudio(defaultPath);
    lever = createAudio(defaultPath);
    pusher = createAudio(defaultPath);
    platform = createAudio(defaultPath);
  }
}
setMusic();

document.addEventListener("mousedown", () => {
  introSound.play();
});

const musicBtn = document.querySelector(".music");
musicBtn.addEventListener("mousedown", (e) => {
  setMusic();
  musicEnabled = !musicEnabled;
});

startButton.addEventListener("click", (e) => {
  menu.style.display = "none";
  levelSelector.style.display = "block";
});

designerButton.addEventListener("mousedown", (e) => {
  menu.style.display = "none";
  mapEditor.style.display = "flex";
});

levelSelector.addEventListener("mousedown", (e) => {
  currentLevel = e.target.dataset.id;
  if (currentLevel) {
    levelSelector.style.display = "none";
    menu.style.display = "none";
    mapEditor.style.display = "none";
    myCanvas.style.display = "block";
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);
    tile.draw(maps[currentLevel - 1]);
    startTimer();
    gameStart = true;
    introSound.pause();
    levelSound.play();
  }
});

let seconds = 0;
let timerInterval;
let displayTime = "00:00";

function updateTimer() {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  displayTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function incrementTimer() {
  seconds++;
  updateTimer();
}

function startTimer() {
  timerInterval = setInterval(incrementTimer, 1000);
}
