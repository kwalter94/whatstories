const Renderer = require('./scrolling_story_renderer.js');

const STORY = `
The Tao gave birth to machine language. Machine language gave birth to the assembler.
The assembler gave birth to the compiler. Now there are ten thousand languages.
Each language has its purpose, however humble. Each language expresses the Yin and Yang of software. Each language has its place within the Tao.
But do not program in COBOL if you can avoid it.
`

Renderer(320, 480, {frameRate: 3, imageQuality: 15, scrollSpeed: 1.5}).render(STORY, 'scrolling-story.gif');
