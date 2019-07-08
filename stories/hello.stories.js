import '../components/MyComponent.js';
import '../components/atoms/cc-toggle.js';
import '../components/MyComponentMem.js';
import { storiesOf } from '@storybook/html';

storiesOf('My Component', module)
  .add('My Component', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <my-component></my-component>
    `;

    return container;
  })
  .add('My Component Mem', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <my-component-mem></my-component-mem>
    `;

    return container;
  });
