class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;
  }

  /**
   * legend:
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
   * 35:blue diamond
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
  map = [
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 61, 0, 0, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 19, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 53, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 4, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 36, 0, 0, 0, 0,
      0, 0, 0, 0, 35, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    ],
    [
      1, 0, 0, 99, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 0, 1, 1, 1,
      1, 2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
  ];

  draw(map) {
    for (let row = 0; row < map.length; row++) {
      for (let column = 0; column < map[row].length; column++) {
        let tile = map[row][column];
        switch (tile) {
          case 1:
            platformArray.push(
              new Platform({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: this.tileSize,
                height: this.tileSize,
              })
            );
            break;
          case 2:
            poolArray.push(
              new Pool({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: this.tileSize * 5,
                height: this.tileSize,
                type: "water",
              })
            );
            break;
          case 3:
            poolArray.push(
              new Pool({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: this.tileSize * 5,
                height: this.tileSize,
                type: "fire",
              })
            );
            break;
          case 4:
            poolArray.push(
              new Pool({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: this.tileSize * 5,
                height: this.tileSize,
                type: "goo",
              })
            );
            break;
          case 5:
            pushersArray.push(
              new Pusher({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                color: "purple",
              })
            );
            break;
          case 16:
            movingPlatformsArray.push(
              new MovingPlatforms({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: tileSize * 4,
                trigger: "pusher",
                color: "purple",
                movement: "horizontalLeft",
              })
            );
          case 17:
            movingPlatformsArray.push(
              new MovingPlatforms({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: tileSize * 4,
                trigger: "pusher",
                color: "purple",
                movement: "horizontalRight",
              })
            );
            break;
          case 18:
            movingPlatformsArray.push(
              new MovingPlatforms({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: tileSize * 4,
                trigger: "pusher",
                color: "purple",
                movement: "verticalUp",
              })
            );
            break;
          case 19:
            movingPlatformsArray.push(
              new MovingPlatforms({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: 128,
                trigger: "pusher",
                color: "purple",
                movement: "verticalDown",
              })
            );
            break;
          case 30:
            blockArray.push(
              new Block({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
              })
            );
            break;
          case 35:
            diamondsArray.push(
              new Diamonds({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                type: "water",
              })
            );
            break;
          case 36:
            diamondsArray.push(
              new Diamonds({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                type: "fire",
              })
            );
            break;
          case 40:
            leverArray.push(
              new Lever({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                color: "yellow",
                trigger: "leftToRight",
              })
            );
            break;
          case 41:
            leverArray.push(
              new Lever({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                color: "yellow",
                trigger: "rightToLeft",
              })
            );
            break;
          case 50:
            movingPlatformsArray.push(
              new MovingPlatforms({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: 128,
                trigger: "lever",
                color: "yellow",
                movement: "horizontalLeft",
              })
            );
          case 51:
            movingPlatformsArray.push(
              new MovingPlatforms({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: 128,
                trigger: "lever",
                color: "yellow",
                movement: "horizontalRight",
              })
            );
            break;
          case 52:
            movingPlatformsArray.push(
              new MovingPlatforms({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: 128,
                trigger: "lever",
                color: "yellow",
                movement: "verticalUp",
              })
            );
            break;
          case 53:
            movingPlatformsArray.push(
              new MovingPlatforms({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: 128,
                trigger: "lever",
                color: "yellow",
                movement: "verticalDown",
              })
            );
            break;
          case 60:
            doorArray.push(
              new Doors({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: this.tileSize * 3,
                height: this.tileSize * 3,
                element: "fire",
              })
            );
            break;
          case 61:
            doorArray.push(
              new Doors({
                position: {
                  x: column * this.tileSize,
                  y: row * this.tileSize,
                },
                width: this.tileSize * 3,
                height: this.tileSize * 3,
                element: "water",
              })
            );
            break;
          case 99:
            characters.push(
              new Character({
                position: { x: column * this.tileSize, y: row * this.tileSize },
                element: "fire",
              })
            );
            break;
          case 100:
            characters.push(
              new Character({
                position: { x: column * this.tileSize, y: row * this.tileSize },
                element: "water",
              })
            );
            break;
          default:
            break;
        }
      }
    }
  }
}
let tileSize = 32;
let tile = new TileMap(tileSize);
let maps;
