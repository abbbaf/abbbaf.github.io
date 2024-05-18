let wgAnimationFrame = 0;
let wgCurrentAnimationFrames = [];
let fbAnimationFrame = 0;
let fbCurrentAnimationFrames = [];
let wgFrameCounter = 0;
let fbFrameCounter = 0;
const framesPerUpdate = 10;

let currentFbDoor = 0;
let fbDoorAnimationFrames = [
  {
    position: {
      x: 15,
      y: 10,
    },
    width: 80,
    height: 90,
  },
  {
    position: {
      x: 103,
      y: 10,
    },
    width: 80,
    height: 90,
  },
  {
    position: {
      x: 192,
      y: 10,
    },
    width: 82,
    height: 90,
  },
  {
    position: {
      x: 280,
      y: 10,
    },
    width: 82,
    height: 90,
  },
  {
    position: {
      x: 370,
      y: 10,
    },
    width: 82,
    height: 90,
  },
  {
    position: {
      x: 460,
      y: 10,
    },
    width: 82,
    height: 90,
  },
  {
    position: {
      x: 550,
      y: 10,
    },
    width: 82,
    height: 90,
  },
  {
    position: {
      x: 640,
      y: 10,
    },
    width: 82,
    height: 90,
  },
  {
    position: {
      x: 730,
      y: 10,
    },
    width: 82,
    height: 90,
  },
  {
    position: {
      x: 820,
      y: 10,
    },
    width: 82,
    height: 90,
  },
];

let currentWgDoor = 0;
let wgDoorAnimationFrames = [
  {
    position: {
      x: 10,
      y: 10,
    },
    width: 70,
    height: 80,
  },
  {
    position: {
      x: 87,
      y: 10,
    },
    width: 70,
    height: 80,
  },
  {
    position: {
      x: 167,
      y: 10,
    },
    width: 72,
    height: 80,
  },
  {
    position: {
      x: 250,
      y: 10,
    },
    width: 72,
    height: 80,
  },
  {
    position: {
      x: 330,
      y: 10,
    },
    width: 72,
    height: 80,
  },
  {
    position: {
      x: 410,
      y: 10,
    },
    width: 72,
    height: 80,
  },
  {
    position: {
      x: 490,
      y: 10,
    },
    width: 72,
    height: 80,
  },
  {
    position: {
      x: 570,
      y: 10,
    },
    width: 72,
    height: 80,
  },
];

let watergirlLeftRun = [
  {
    position: {
      x: 78,
      y: 0,
    },
    width: 45,
    height: 55,
  },
  {
    position: {
      x: 145,
      y: 0,
    },
    width: 50,
    height: 55,
  },
  {
    position: {
      x: 220,
      y: 0,
    },
    width: 50,
    height: 55,
  },
  {
    position: {
      x: 280,
      y: 0,
    },
    width: 50,
    height: 55,
  },
  {
    position: {
      x: 349,
      y: 0,
    },
    width: 50,
    height: 53,
  },
  {
    position: {
      x: 410,
      y: 0,
    },
    width: 50,
    height: 53,
  },
  {
    position: {
      x: 475,
      y: 0,
    },
    width: 45,
    height: 53,
  },
];

let watergirlRunRight = [
  {
    position: {
      x: 935,
      y: 0,
    },
    width: 40,
    height: 53,
  },
  {
    position: {
      x: 870,
      y: 0,
    },
    width: 38,
    height: 53,
  },
  {
    position: {
      x: 795,
      y: 0,
    },
    width: 42,
    height: 53,
  },
  {
    position: {
      x: 725,
      y: 0,
    },
    width: 42,
    height: 53,
  },
  {
    position: {
      x: 660,
      y: 0,
    },
    width: 42,
    height: 53,
  },
  {
    position: {
      x: 595,
      y: 0,
    },
    width: 42,
    height: 53,
  },
  {
    position: {
      x: 535,
      y: 0,
    },
    width: 42,
    height: 53,
  },
];

let fireboyRunLeft = [
  {
    position: {
      x: 50,
      y: 0,
    },
    width: 37,
    height: 57,
  },
  {
    position: {
      x: 105,
      y: 0,
    },
    width: 37,
    height: 57,
  },
  {
    position: {
      x: 160,
      y: 0,
    },
    width: 39,
    height: 52,
  },
  {
    position: {
      x: 215,
      y: 0,
    },
    width: 45,
    height: 55,
  },
  {
    position: {
      x: 275,
      y: 0,
    },
    width: 45,
    height: 55,
  },
  {
    position: {
      x: 325,
      y: 0,
    },
    width: 40,
    height: 55,
  },
  {
    position: {
      x: 375,
      y: 0,
    },
    width: 35,
    height: 55,
  },
];

let fireboyRightRun = [
  {
    position: {
      x: 745,
      y: 0,
    },
    width: 40,
    height: 55,
  },
  {
    position: {
      x: 690,
      y: 0,
    },
    width: 40,
    height: 55,
  },
  {
    position: {
      x: 635,
      y: 0,
    },
    width: 40,
    height: 55,
  },
  {
    position: {
      x: 575,
      y: 0,
    },
    width: 45,
    height: 55,
  },
  {
    position: {
      x: 520,
      y: 0,
    },
    width: 40,
    height: 55,
  },
  {
    position: {
      x: 470,
      y: 0,
    },
    width: 40,
    height: 55,
  },
  {
    position: {
      x: 425,
      y: 0,
    },
    width: 35,
    height: 55,
  },
];
