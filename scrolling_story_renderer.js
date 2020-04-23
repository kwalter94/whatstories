const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');
const fs = require('fs');
 
module.exports = (width, height, {backgroundColor, textColor, frameRate, scrollSpeed, imageQuality} = {}) => {
  const LINE_HPADDING = Math.round((0.4 * width) / 2);
  const LINE_VPADDING = Math.round((0.1 * height) / 2);
  const CHARACTER_SIZE = Math.round(width / 24); // Pixels
  const MAX_SCROLLING_SPEED = height / 2;

  const canvas = Canvas.createCanvas(width, height);

  backgroundColor = backgroundColor || '#013220';
  textColor = textColor || '#FFFFFF';
  frameRate = frameRate || 30;
  frameTime = Math.round(1000 / frameRate);
  scrollSpeed = ((scrollSpeed || 2) * MAX_SCROLLING_SPEED) / 10; // We are giving clients a scrolling speed in range [0, 10]
  imageQuality = imageQuality || 10;

  function render(text, filename) {
    const context = getCanvasContext();
    const encoder = getGIFEncoder(filename);
    const lines = wrapTextToLines(text);
    const sprites = linesToSprites(lines);

    while (sprites.length > 0) {
      console.log(sprites);
      refreshCanvasContext(context);

      sprites.forEach(sprite => {
        renderTextToCanvasContext(context, sprite.line, sprite.x, sprite.y);
        sprite.y -= Math.round((1 / frameRate) * (height / scrollSpeed));
      });

      encoder.addFrame(context);
      if (sprites[0].y < 0) sprites.shift();
    }

    encoder.finish();
  }

  function wrapTextToLines(text) {
      const words = text.split(/\s+/);

      return words.reduce((lines, word) => {
        console.log([word, lines])
        const lastLine = lines.pop() || '';

        if (lastLine.length === 0) {
          return [word];
        } else if (lineOverflowsOnScreen(`${lastLine} ${word}`)) {
          return [...lines, lastLine, word]; // What if the word is too long to fit on screen? Zofuna...
        } else {
          return [...lines, `${lastLine} ${word}`.trim()];
        }

      }, []);
  }

  function lineOverflowsOnScreen(line) {
    return line.trim().length * (CHARACTER_SIZE / 2) > width - (LINE_HPADDING);
  }

  function linesToSprites(lines) {
    const startY = Math.round(0.8 * height);
    const sprites = [];

    lines.forEach((line, i) => {
      const lineWidth = (line.length * CHARACTER_SIZE) / 2; // Assuming that a character's width is 1/2 of CHARACTER_SIZE;
      const x = Math.round((width - lineWidth) / 2);
      const y = sprites.length === 0 ? startY : sprites[i - 1].y + LINE_VPADDING;

      sprites.push({x, y, line});
    });

    return sprites;
  }

  function getCanvasContext() {
    const context = canvas.getContext('2d');

    context.font = `${CHARACTER_SIZE}px Arial`;

    return context;
  }

  function getGIFEncoder(filename) {
    const encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(fs.createWriteStream(filename));
     
    encoder.start();
    encoder.setRepeat(0);  // 0 for repeat, -1 for no-repeat
    encoder.setDelay(frameTime);
    encoder.setQuality(imageQuality);

    return encoder;
  }

  function refreshCanvasContext(context) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
  }

  function renderTextToCanvasContext(context, text, x, y) {
    context.fillStyle = textColor;
    context.fillText(text, x, y);
  }

  return {render};
};
