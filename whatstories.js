const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const fs = require('fs');
 
const WORDS_PER_MIN = {
    100: '100 WPM - Lazy',
    200: '100 WPM - Could do better',
    266: '100 WPM - Could do better',
    300: '300 WPM - Now we reading',
    400: '400 WPM - Kinda Fast',
    500: '500 WPM - Damn, yo',
    600: '600 WPM - Professor',
    900: '900 WPM - Nope'
};

/**
 * Calculates animation interval rate in milliseconds, given the word per min
 * value.
 * 
 * @param int wpmValue
 * @return int the value representing animation rate 
 */
function wpmToAnimationIntervalMillis(wpmValue) {
    return Math.floor(60000 / wpmValue);
}

function createStory(text, wordsPerMin, width, height, backgroundColor, filename) {
    var corpus = text.split(' ').filter(val => val && val.length > 0);
    var curIndex = 0;
    var previousWord = '';
    var currentWord =  '';
    const animationRate = wpmToAnimationIntervalMillis(wordsPerMin);

    const encoder = new GIFEncoder(width, height);
    // stream the results as they are available into myanimated.gif
    encoder.createReadStream().pipe(fs.createWriteStream(filename));
     
    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(animationRate);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.

    // use node-canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    for(var curIndex = 0; curIndex < corpus.length; curIndex++) {
        currentWord = corpus[curIndex];
        empty = "";
        if (curIndex > 0 && curIndex < corpus.length) {
            previousWord = corpus[curIndex - 1];
            if (previousWord && previousWord.length > currentWord.length) {
                empty = " ".repeat(previousWord.length - currentWord.length); 
            }
        }
        
        process.stdout.write(`\r${currentWord}${empty}`)
        
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '50px Arial';
        // TODO: Put word in the center of the image..
        if ("¨" != currentWord) 
            ctx.fillText(currentWord, width/2 - 100, height/2);
        encoder.addFrame(ctx);
    }
    // 10 extra frames for a "pause"
    for(var i = 0; i < 10; i++) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        encoder.addFrame(ctx);
    }

    encoder.finish();
}

createStory("Hello there, this is a basic story created by WhatStories. You are currently reading this at 100 words per minute- learn to read faster!", 100, 500, 500, '#000000', 'file-100.gif');

createStory("Hello there, this is a basic story created by WhatStories. You are currently reading this at 200 words per minute- so if you're able to follow along you're okay at reading, but could be faster. ", 100, 500, 500, '#000000',  'file-200.gif');

createStory("Hello there, this is a basic story created by WhatStories. You are currently reading this at 300 words per minute- so if you're able to follow along you're a pretty fast reader. ", 300, 500, 500, '#000000', 'file-300.gif');