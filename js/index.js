let mycanvas = document.getElementById("myCanvas");
let context = mycanvas.getContext("2d");

let loadImage = (src, callback) => {
  let myImg = new Image();
  myImg.src = src;
  // load image and do something with it
  myImg.onload = () => callback(myImg);
};

let imagePath = (frameNumber, folder) =>
  "images/" + folder + "/" + frameNumber + ".png";

// loadImage(imagePath(1), (image) => context.drawImage(image, 0, 0, 500, 500));

let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
  forward: [1, 2, 3, 4, 5, 6],
  backward: [1, 2, 3, 4, 5, 6],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
};

let loadImages = (callback) => {
  let images = {
    idle: [],
    kick: [],
    punch: [],
    forward: [],
    backward: [],
    block: [],
  };
  let imagesToLoad = 0;

  // load images and so something with it
  ["idle", "kick", "punch", "forward", "backward", "block"].forEach(
    (animation) => {
      let animationFrames = frames[animation];
      imagesToLoad = imagesToLoad + animationFrames.length;

      animationFrames.forEach((frameNumber) => {
        let path = imagePath(frameNumber, animation);
        loadImage(path, (image) => {
          images[animation][frameNumber - 1] = image;
          imagesToLoad = imagesToLoad - 1;
          // when all images loaded then do something with it
          if (imagesToLoad === 0) {
            callback(images);
          }
        });
      });
    }
  );
};

// loadImages((images) => context.drawImage(images[1], 0, 0, 500, 500));

let animate = (context, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      // clear canvas
      context.clearRect(0, 0, 500, 500);
      // draw image
      context.drawImage(image, 0, 0, 500, 500);
    }, index * 100);
  });
  setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
  let queuedAnimation = [];

  // auxilary function
  let aux = () => {
    let selectedAnimation;

    if (queuedAnimation.length === 0) {
      selectedAnimation = "idle";
    } else {
      selectedAnimation = queuedAnimation.shift();
    }

    animate(context, images, selectedAnimation, aux);
  };
  aux();

  document.getElementById("kick").onclick = () => queuedAnimation.push("kick");
  document.getElementById("punch").onclick = () => queuedAnimation.push("punch");
  document.getElementById("forward").onclick = () => queuedAnimation.push("forward");
  document.getElementById("backward").onclick = () => queuedAnimation.push("backward");
  document.getElementById("block").onclick = () => queuedAnimation.push("block");

  document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    console.log(key)
    switch (key) {
      case "a":
        queuedAnimation.push("backward");
        break;
      case "d":
        queuedAnimation.push("forward");
        break;
      case "w":
        queuedAnimation.push("punch");
        break;
      case "s":
        queuedAnimation.push("kick");
        break;
      case "e":
        queuedAnimation.push("block");
        break;
    }
  });
});
