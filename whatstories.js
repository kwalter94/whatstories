const process = require('process');

const WORDS_PER_MIN = {
    100: '100 WPM - Lazy',
    200: '100 WPM - Could do better',
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
    // 500 words per minute == 500 / 60 seconds =
    return Math.round(60000 / wpmValue);
}

function startStory(text, wordsPerMin) {
    var corpus = text.split(' ').filter(val => val && val.length > 0);
    var curIndex = 0;
    var previousWord = '';
    var currentWord =  '';
    const animationRate = wpmToAnimationIntervalMillis(wordsPerMin);
    var intervalVal = setInterval(() => {
        currentWord = corpus[curIndex];
        empty = "";
        if (curIndex > 0 && curIndex < corpus.length) {
            previousWord = corpus[curIndex - 1];
            if (previousWord && previousWord.length > currentWord.length) {
                empty = " ".repeat(previousWord.length - currentWord.length); 
            }
        }
        process.stdout.write(`\r${currentWord}${empty}`)
        curIndex++;

        if (curIndex == corpus.length) {
            clearInterval(intervalVal);
        }
    }, animationRate);
}


startStory('Hello this is a test of the the wpm to animation interval function', 300);