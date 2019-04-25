import { addDecorator, configure } from '@storybook/html';
import { withKnobs } from '@storybook/addon-knobs';
import { i18nKnob } from '../stories/lib/i18n-knob';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);

addDecorator(withKnobs);
addDecorator((storyFn) => {
  // Add language selector knob on each story
  i18nKnob();
  return storyFn();
});
i18nKnob();

function loadStories () {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
