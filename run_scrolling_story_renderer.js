const Renderer = require('./scrolling_story_renderer.js');

const STORY = `
Lorem ipsum dolor sit amet,
consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Amet purus gravida quis blandit turpis.
Euismod elementum nisi quis eleifend quam adipiscing.
Velit dignissim sodales ut eu sem integer.
Tincidunt dui ut ornare lectus sit amet est placerat in.
`

Renderer(512, 512).render(STORY, 'scrolling-story.gif');
