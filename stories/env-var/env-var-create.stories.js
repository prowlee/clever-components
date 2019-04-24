import '../../components/env-var/env-var-create.js';
import notes from '../../.components-docs/env-var-input.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/even-action.js';

const eventNames = ['env-var-create:create'];

storiesOf('env-var', module)
  .add('<env-var-create>', () => withCustomEventActions(...eventNames)(() => `
    
    <env-var-create></env-var-create>
    
  `), { notes });
