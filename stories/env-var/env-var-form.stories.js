import '../../components/env-var/env-var-form';
import notes from '../../.components-docs/env-var-form.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/even-action';

const eventNames = ['env-var-form:submit'];

storiesOf('env-var', module)
  .add('<env-var-form>', () => withCustomEventActions(...eventNames)(() => {

    const envVarForm = document.createElement('env-var-form');
    envVarForm.variables = [
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ];

    return envVarForm;
  }), { notes });
