import '../../components/atoms/cc-button.js';
import notes from '../../.components-docs/cc-button.md';
import { storiesOf } from '@storybook/html';
import { text, withKnobs } from '@storybook/addon-knobs';
import { withActions } from '@storybook/addon-actions';

const eventNames = ['click cc-button'];

storiesOf('atoms/<cc-button>', module)
  .addDecorator(withKnobs)
  .add('all', () => withActions(...eventNames)(() => {

    const label = text('Button label', '');

    return `
      Simple:<br>
      <cc-button simple>${label || 'Simple button'}</cc-button>
      <cc-button simple disabled>${label || 'Simple button'}</cc-button>
      <br>
      
      Primary:<br>
      <cc-button primary>${label || 'Primary button'}</cc-button>
      <cc-button primary disabled>${label || 'Primary button'}</cc-button>
      <br>
      <cc-button primary outlined>${label || 'Primary button'}</cc-button>
      <cc-button primary outlined disabled>${label || 'Primary button'}</cc-button>
      <br>

      Success:<br>
      <cc-button success>${label || 'Success button'}</cc-button>
      <cc-button success disabled>${label || 'Success button'}</cc-button>
      <br>
      <cc-button success outlined>${label || 'Success button'}</cc-button>
      <cc-button success outlined disabled>${label || 'Success button'}</cc-button>
      <br>
      
      Danger:<br>
      <cc-button danger>${label || 'Danger button'}</cc-button>
      <cc-button danger disabled>${label || 'Danger button'}</cc-button>
      <br>
      <cc-button danger outlined>${label || 'Danger button'}</cc-button>
      <cc-button danger outlined disabled>${label || 'Danger button'}</cc-button>
    `;
  }), { notes });
