var p5Inst = new p5(null, 'sketch');

window.preload = function () {
  initMobileControls(p5Inst);

  p5Inst._predefinedSpriteAnimations = {};
  p5Inst._pauseSpriteAnimationsByDefault = false;
  var animationListJSON = {"orderedKeys":["28c258c0-4c2b-4601-8de9-6f77bf531010","79acc3cd-f181-4da3-8575-60eb2af89545","92d5c077-6cf8-47bf-aec0-e8bb5fce6f94","6fd21535-643c-4521-8841-cbfff0ae9841","284c4a8e-21b1-43c0-aee9-f6e57f4a625c","3960b478-22f4-4a1b-bf93-b53eaf20d8b8","759fef1c-6b9c-4892-8979-0b3fd2d3b679","52997c51-a641-4fe2-afae-4882221a376f","f7c1f398-a0fc-49b9-8f94-a96bacdd6f98","7e6cbfcc-229f-472b-8734-4b01c303c1e2","3632a22f-6380-4311-b088-a83f35246cca","da115e0e-d774-4a9d-87c2-5f8498807da4","607f26ab-298d-44c6-9820-17fed9c1ac47"],"propsByKey":{"28c258c0-4c2b-4601-8de9-6f77bf531010":{"name":"WaterGirl","sourceUrl":"assets/api/v1/animation-library/gamelab/Q06Mtp7OA9HZ97lXOvJ7J59dO3jcjyLu/category_animals/bunny2_walk1.png","frameSize":{"x":152,"y":193},"frameCount":2,"looping":true,"frameDelay":2,"version":"Q06Mtp7OA9HZ97lXOvJ7J59dO3jcjyLu","categories":["animals","characters"],"loadedFromSource":true,"saved":true,"sourceSize":{"x":304,"y":193},"rootRelativePath":"assets/api/v1/animation-library/gamelab/Q06Mtp7OA9HZ97lXOvJ7J59dO3jcjyLu/category_animals/bunny2_walk1.png"},"79acc3cd-f181-4da3-8575-60eb2af89545":{"name":"FireBoy","sourceUrl":null,"frameSize":{"x":69,"y":98},"frameCount":2,"looping":true,"frameDelay":12,"version":"4VZGK9QpamAOHm6_EK5rViW6AXz2MN7d","categories":["characters"],"loadedFromSource":true,"saved":true,"sourceSize":{"x":138,"y":98},"rootRelativePath":"assets/79acc3cd-f181-4da3-8575-60eb2af89545.png"},"92d5c077-6cf8-47bf-aec0-e8bb5fce6f94":{"name":"Background 2.jpg_1","sourceUrl":"assets/v3/animations/4ULnjZrGgCX-DQsWFo961vrb3cwKmVkI3fSZ0-FW4ho/92d5c077-6cf8-47bf-aec0-e8bb5fce6f94.png","frameSize":{"x":277,"y":182},"frameCount":1,"looping":true,"frameDelay":4,"version":"U8UxZ9EUogZT5tCSouOtA1cSjHfvhYvA","loadedFromSource":true,"saved":true,"sourceSize":{"x":277,"y":182},"rootRelativePath":"assets/v3/animations/4ULnjZrGgCX-DQsWFo961vrb3cwKmVkI3fSZ0-FW4ho/92d5c077-6cf8-47bf-aec0-e8bb5fce6f94.png"},"6fd21535-643c-4521-8841-cbfff0ae9841":{"name":"Block","sourceUrl":"assets/api/v1/animation-library/gamelab/9ob_82sFDBfxzTsmevhTazDGxLmup3Kp/category_environment/ground_grass_broken.png","frameSize":{"x":380,"y":94},"frameCount":1,"looping":true,"frameDelay":2,"version":"9ob_82sFDBfxzTsmevhTazDGxLmup3Kp","categories":["environment"],"loadedFromSource":true,"saved":true,"sourceSize":{"x":380,"y":94},"rootRelativePath":"assets/api/v1/animation-library/gamelab/9ob_82sFDBfxzTsmevhTazDGxLmup3Kp/category_environment/ground_grass_broken.png"},"284c4a8e-21b1-43c0-aee9-f6e57f4a625c":{"name":"blue_diamond_1","sourceUrl":"assets/api/v1/animation-library/gamelab/wa81_Ik95NqJUJzWlrUAZU1P7HMPhR9o/category_obstacles/ore_diamond.png","frameSize":{"x":128,"y":128},"frameCount":1,"looping":true,"frameDelay":2,"version":"wa81_Ik95NqJUJzWlrUAZU1P7HMPhR9o","categories":["obstacles"],"loadedFromSource":true,"saved":true,"sourceSize":{"x":128,"y":128},"rootRelativePath":"assets/api/v1/animation-library/gamelab/wa81_Ik95NqJUJzWlrUAZU1P7HMPhR9o/category_obstacles/ore_diamond.png"},"3960b478-22f4-4a1b-bf93-b53eaf20d8b8":{"name":"red_diamond_1","sourceUrl":"assets/api/v1/animation-library/gamelab/fhb60UTSxElfkmU4M1zpY1cW.tttCvnt/category_obstacles/ore_ruby.png","frameSize":{"x":128,"y":128},"frameCount":1,"looping":true,"frameDelay":2,"version":"fhb60UTSxElfkmU4M1zpY1cW.tttCvnt","categories":["obstacles"],"loadedFromSource":true,"saved":true,"sourceSize":{"x":128,"y":128},"rootRelativePath":"assets/api/v1/animation-library/gamelab/fhb60UTSxElfkmU4M1zpY1cW.tttCvnt/category_obstacles/ore_ruby.png"},"759fef1c-6b9c-4892-8979-0b3fd2d3b679":{"name":"Door_1","sourceUrl":null,"frameSize":{"x":140,"y":190},"frameCount":1,"looping":true,"frameDelay":12,"version":"IvtF4zoPzpLnKI0KF7eR4.NrI4v6.HN5","categories":["gameplay"],"loadedFromSource":true,"saved":true,"sourceSize":{"x":140,"y":190},"rootRelativePath":"assets/759fef1c-6b9c-4892-8979-0b3fd2d3b679.png"},"52997c51-a641-4fe2-afae-4882221a376f":{"name":"water_ 1","sourceUrl":"assets/api/v1/animation-library/gamelab/wAz9fQ3UVdLojkSsI8ePjwyooSCnPzVW/category_environment/ground_snow_broken.png","frameSize":{"x":380,"y":94},"frameCount":1,"looping":true,"frameDelay":2,"version":"wAz9fQ3UVdLojkSsI8ePjwyooSCnPzVW","categories":["environment"],"loadedFromSource":true,"saved":true,"sourceSize":{"x":380,"y":94},"rootRelativePath":"assets/api/v1/animation-library/gamelab/wAz9fQ3UVdLojkSsI8ePjwyooSCnPzVW/category_environment/ground_snow_broken.png"},"f7c1f398-a0fc-49b9-8f94-a96bacdd6f98":{"name":"fire_1","sourceUrl":null,"frameSize":{"x":380,"y":94},"frameCount":1,"looping":true,"frameDelay":12,"version":"mORD1yAq477aAMjJ4Yui9CUBxW.EJhR2","categories":["environment"],"loadedFromSource":true,"saved":true,"sourceSize":{"x":380,"y":94},"rootRelativePath":"assets/f7c1f398-a0fc-49b9-8f94-a96bacdd6f98.png"},"7e6cbfcc-229f-472b-8734-4b01c303c1e2":{"name":"ground_1","sourceUrl":"assets/api/v1/animation-library/gamelab/6P0qiJ4tk2DRvYR2XIH3iDx5caeUKG4g/category_environment/ground_stone_broken.png","frameSize":{"x":380,"y":94},"frameCount":1,"looping":true,"frameDelay":2,"version":"6P0qiJ4tk2DRvYR2XIH3iDx5caeUKG4g","categories":["environment"],"loadedFromSource":true,"saved":true,"sourceSize":{"x":380,"y":94},"rootRelativePath":"assets/api/v1/animation-library/gamelab/6P0qiJ4tk2DRvYR2XIH3iDx5caeUKG4g/category_environment/ground_stone_broken.png"},"3632a22f-6380-4311-b088-a83f35246cca":{"name":"Button1","frameCount":1,"frameSize":{"x":91,"y":91},"looping":true,"frameDelay":2,"categories":["gameplay"],"jsonLastModified":"2020-07-16 22:29:39 UTC","pngLastModified":"2020-01-29 19:48:59 UTC","version":"vntCR0RflBpKQrj4NmRiBVttUiGjMqDc","sourceUrl":"assets/api/v1/animation-library/gamelab/vntCR0RflBpKQrj4NmRiBVttUiGjMqDc/category_gameplay/ufoRed.png","sourceSize":{"x":91,"y":91},"loadedFromSource":true,"saved":true,"rootRelativePath":"assets/api/v1/animation-library/gamelab/vntCR0RflBpKQrj4NmRiBVttUiGjMqDc/category_gameplay/ufoRed.png"},"da115e0e-d774-4a9d-87c2-5f8498807da4":{"name":"Button2","frameCount":1,"frameSize":{"x":91,"y":91},"looping":true,"frameDelay":2,"categories":["gameplay"],"jsonLastModified":"2020-07-16 22:29:39 UTC","pngLastModified":"2020-01-29 19:48:58 UTC","version":"AZXV1fERawN6p8xIEsuPHce9OI_CnE3W","sourceUrl":"assets/api/v1/animation-library/gamelab/AZXV1fERawN6p8xIEsuPHce9OI_CnE3W/category_gameplay/ufoGreen.png","sourceSize":{"x":91,"y":91},"loadedFromSource":true,"saved":true,"rootRelativePath":"assets/api/v1/animation-library/gamelab/AZXV1fERawN6p8xIEsuPHce9OI_CnE3W/category_gameplay/ufoGreen.png"},"607f26ab-298d-44c6-9820-17fed9c1ac47":{"name":"GoldDiamond","frameCount":1,"frameSize":{"x":128,"y":128},"looping":true,"frameDelay":12,"categories":["obstacles"],"jsonLastModified":"2020-07-16 22:29:51 UTC","pngLastModified":"2020-01-29 19:49:19 UTC","version":"zz4sSqOA4czYXFnUNwZKirwyotmmpO5A","sourceUrl":null,"sourceSize":{"x":128,"y":128},"loadedFromSource":true,"saved":true,"rootRelativePath":"assets/607f26ab-298d-44c6-9820-17fed9c1ac47.png"}}};
  var orderedKeys = animationListJSON.orderedKeys;
  var allAnimationsSingleFrame = false;
  orderedKeys.forEach(function (key) {
    var props = animationListJSON.propsByKey[key];
    var frameCount = allAnimationsSingleFrame ? 1 : props.frameCount;
    var image = loadImage(props.rootRelativePath, function () {
      var spriteSheet = loadSpriteSheet(
          image,
          props.frameSize.x,
          props.frameSize.y,
          frameCount
      );
      p5Inst._predefinedSpriteAnimations[props.name] = loadAnimation(spriteSheet);
      p5Inst._predefinedSpriteAnimations[props.name].looping = props.looping;
      p5Inst._predefinedSpriteAnimations[props.name].frameDelay = props.frameDelay;
    });
  });

  function wrappedExportedCode(stage) {
    if (stage === 'preload') {
      if (setup !== window.setup) {
        window.setup = setup;
      } else {
        return;
      }
    }
// -----

var bg = createSprite(200, 200, 400, 400);
bg.setAnimation("Background 2.jpg_1");
bg.scale = 2.5;
var fireBoy = createSprite(20, 375, 10, 10);
fireBoy.setAnimation("FireBoy");
fireBoy.scale = 0.5;
var waterGirl = createSprite(60, 375, 10, 10);
waterGirl.setAnimation("WaterGirl");
waterGirl.scale = 0.3;
var block1 = createSprite(200, 375, 50, 10);
block1.setAnimation("Block");  
block1.scale = 0.2;
var block2 = createSprite(290, 325, 50, 10);
block2.setAnimation("Block");
block2.scale = 0.2;
var block3 = createSprite(375, 300, 50, 10);
block3.setAnimation("Block");
block3.scale = 0.2;
var block4 = createSprite(120, 75, 50, 10);
block4.setAnimation("Block");
block4.scale = 0.2;
var block5 = createSprite(260, 150, 50, 10);
block5.setAnimation("Block");
block5.scale = 0.2;
var block6 = createSprite(300, 220, 50, 10);
block6.setAnimation("Block");
block6.scale = 0.2;
var block7 = createSprite(30, 325, 50, 10);
block7.setAnimation("Block");
block7.scale = 0.2;
var block8 = createSprite(140, 217, 50 ,10);
block8.setAnimation("Block");
block8.scale = 0.2;
var D1 = createSprite(190, 320, 10, 10);
D1.setAnimation("red_diamond_1");
D1.scale  = 0.5;
var D2 = createSprite(360, 250, 10, 10);
D2.setAnimation("red_diamond_1");
D2.scale = 0.5;
var D3  = createSprite(23, 108, 10, 10);
D3.setAnimation("red_diamond_1");
D3.scale = 0.5;
var redDiamonds = createGroup();
redDiamonds.add(D1);
redDiamonds.add(D2);
redDiamonds.add(D3);
var door1 = createSprite(25, 30, 10, 10);
door1.setAnimation("Door_1");
door1.scale = 0.3;
var D4 = createSprite(280, 270, 10, 10);
D4.setAnimation("blue_diamond_1");
D4.scale = 0.5;
var D5 = createSprite(147, 190, 10, 10);
D5.setAnimation("blue_diamond_1");
D5.scale = 0.5;
var D6 = createSprite(128, 30, 10, 10);
D6.setAnimation("blue_diamond_1");
D6.scale = 0.5;
var blueDiamonds = createGroup();
blueDiamonds.add(D4);
blueDiamonds.add(D5);
blueDiamonds.add(D6);
var water1 = createSprite(40, 240, 10, 10);
water1.setAnimation("water_ 1");
water1.scale = 0.2;
var fire1 = createSprite(280, 330, 10, 10);
fire1.setAnimation("fire_1");
fire1.scale = 0.2;
var door2 = createSprite(30, 25, 10, 10);
door2.setAnimation("Door_1");
door2.scale = 0.4;
var gameState = "start";
//var go = createSprite(350, 350, 50, 20);
var wGScore = 0;
var fBScore = 0;
var fBHighestScore = 0;
var wGHighestScore = 0;
var lazer1 = createSprite(298, 86, 200, 3);
lazer1.shapeColor = "red";
lazer1.visible = false;
var lazer2 = createSprite(34, 215, 200, 3);
lazer2.shapeColor = "red";
lazer2.visible = false;
angle = 0;

var button1 = createSprite(380, 280, 10, 10);
button1.setAnimation("Button1");
button1.scale = 0.3;
button1.visible = false;
button1.setCollider("circle",0,0,15);
var button2 = createSprite(180, 130, 10, 10);
button2.setAnimation("Button2");
button2.scale = 0.3;
button2.setCollider("circle",0,0,15);
button2.visible = false;
var Gdiamond = createSprite(384, 95, 10, 10);
Gdiamond.setAnimation("GoldDiamond");
Gdiamond.scale = 0.5;
Gdiamond.setCollider("circle",0,0,15);
Gdiamond.visible = false;
function draw() 
{
  if(gameState === "start")
  {
    background("black");
    textSize(13);
    text("Instructions", 150, 15);
    text("Fireboy cannot touch the water",15,110) 
    text("if diamonds are collected then the score would increase by 1",15, 135);
    text("Watergirl cannot touch the fire",15,155)
    text("if diamonds are collected then the score would incraese by 1",15, 175);
    text("click the space bar to continue the game",15, 350);
    text("If you pick up the diamond you win the game");
    if(keyDown("space"))
    {
      gameState = "stage1"
    }
  }
  createEdgeSprites();
  fireBoy.collide(edges);
  fireBoy.collide(block1);
  fireBoy.collide(block2);
  fireBoy.collide(block3);
  fireBoy.collide(block4);
  fireBoy.collide(block5);
  fireBoy.collide(block6);
  fireBoy.collide(block7);
  fireBoy.collide(block8);
  
  waterGirl.collide(edges);
  waterGirl.collide(block1);
  waterGirl.collide(block2);
  waterGirl.collide(block3);
  waterGirl.collide(block4);
  waterGirl.collide(block5);
  waterGirl.collide(block6);
  waterGirl.collide(block7);
  waterGirl.collide(block8);
  
  if (gameState === "stage1")
  {
    drawSprites();
    fill("black");
    textSize("15")
    text("Watergirl's SCORE: "+wGScore, 175, 20);
    text("FireBoy's SCORE: "+fBScore, 175, 50);
    movement();
  for(var i = 0; i<redDiamonds.length; i++){
  if(redDiamonds.get(i).isTouching(fireBoy))
  {
    redDiamonds.get(i).destroy()
    fBScore = fBScore+1;
 }
}
  for(var i = 0; i<redDiamonds.length; i++){
   if(redDiamonds.get(i).isTouching(waterGirl))
  {
    redDiamonds.get(i).destroy()
    wGScore = wGScore-1
}
  }
   for(var i = 0; i<blueDiamonds.length; i++){
  if(blueDiamonds.get(i).isTouching(waterGirl))
  {
    blueDiamonds.get(i).destroy()
    wGScore = wGScore+1; 
}
   }  
  for(var i = 0; i<blueDiamonds.length; i++){
  if(blueDiamonds.get(i).isTouching(fireBoy))
  {
    blueDiamonds.get(i).destroy()
    fBScore = fBScore-1;
 } 
}
  //waterGirl.collide(door1);
  //waterGirl.collide(fire1);
  //waterGirl.collide(water1);
  
  if(fireBoy.isTouching(door1)&&waterGirl.isTouching(door1))
    {
      gameState = "stage2";
      fireBoy.x = 0;
      fireBoy.y = 390;
      waterGirl.x = 0;
      waterGirl.y = 390;
      fireBoy.velocityY = 0;
      waterGirl.velocityY = 0;
    }
  }  
    //gameState = "stage2"
    if(gameState === "stage2")
    {
      background("lightGrey");
      bg.destroy();
      block1.destroy();
      block2.destroy();
      block3.destroy();
      block4.destroy();
      block5.destroy();
      block6.destroy();
      block7.destroy();
      block8.destroy();
      blueDiamonds.destroyEach();
      redDiamonds.destroyEach();
      water1.destroy();
      fire1.destroy();
      door1.destroy();
      text("WaterGirl Scores: "+wGScore, 250, 60);
      text("FireBoy Scores: "+fBScore, 250, 30);
      var block9 = createSprite(330, 330, 10, 10);
      block9.setAnimation("ground_1");
      block9.scale = 0.3;
      var block10 = createSprite(120, 320, 10, 10);
      block10.setAnimation("ground_1");
      block10.scale = 0.3;
      var block11 = createSprite(180, 180, 10, 10);
      block11.setAnimation("ground_1");
      block11.scale = 0.3;
      waterGirl.collide(block9);
      waterGirl.collide(block10);
      waterGirl.collide(block11);
      fireBoy.collide(block9);
      fireBoy.collide(block10);
      fireBoy.collide(block11);
      lazer1.visible = true;
      lazer1.rotation = angle;
      console.log("HI")
      angle = angle+5;
      
      lazer2.visible = true;
      lazer2.rotation = angle;
      button1.visible = true;
      button2.visible = true;
      Gdiamond.visible = true;
      angle = angle+5;
      movement();      
      if(waterGirl.isTouching(lazer1)||waterGirl.isTouching(lazer2)||
      fireBoy.isTouching(lazer1)||fireBoy.isTouching(lazer2))
      {
        gameState = "stage3";
      }
      if(fireBoy.isTouching(button1)||waterGirl.isTouching(button1))
      {
         lazer2.destroy(); 
      }  
      if(fireBoy.isTouching(button2)||waterGirl.isTouching(button2))
      {
         lazer1.destroy(); 
      } 
      //fireBoy.debug = false;
      //waterGirl.debug = ;
      //button1.debug = true;
      //button2.debug = true;
      //Gdiamond.debug = true;
      if(fireBoy.isTouching(Gdiamond)||waterGirl.isTouching(Gdiamond)){
        stroke("yellow");
        fill("green");
        textSize(25);
        text("YIPPEE YOU WON THE GAME",10, 250);
        fireBoy.setVelocity(0,0);
        waterGirl.setVelocity(0,0);
      }
      drawSprites()
    }
    if (gameState==="stage3")
    {
      background("red");
      text("GameOver", 150, 200);
    }
  }
  function movement()
  {
     if(keyDown(UP_ARROW))
  {
    fireBoy.y = fireBoy.y-5;
  }
  if(keyDown(RIGHT_ARROW))
  {
    fireBoy.x = fireBoy.x+2;
  }
  if(keyDown(LEFT_ARROW))
  {
    fireBoy.x = fireBoy.x-2;
  }
  if(keyDown(DOWN_ARROW))
  {
    fireBoy.y = fireBoy.y+5;
  }
  if(keyDown("W"))
  {
    waterGirl.y = waterGirl.y-5;
  }
  if(keyDown("D"))
  {
    waterGirl.x = waterGirl.x+2;
  }
  if(keyDown("A"))
  {
    waterGirl.x = waterGirl.x-2;
  }
  if(keyDown("S"))
  {
    waterGirl.y = waterGirl.y+5;
  }
}
// -----
    try { window.draw = draw; } catch (e) {}
    switch (stage) {
      case 'preload':
        if (preload !== window.preload) { preload(); }
        break;
      case 'setup':
        if (setup !== window.setup) { setup(); }
        break;
    }
  }
  window.wrappedExportedCode = wrappedExportedCode;
  wrappedExportedCode('preload');
};

window.setup = function () {
  window.wrappedExportedCode('setup');
};
