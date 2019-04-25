import '../../components/env-var/env-var-editor-simple.js';
import notes from '../../.components-docs/env-var-editor-simple.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action';

const eventNames = ['env-var-editor-simple:change'];

storiesOf('env-var', module)
  .add('<env-var-editor-simple>', () => withCustomEventActions(...eventNames)(() => {

    const envVarForm = document.createElement('env-var-editor-simple');
    envVarForm.variables = [
      { name: 'EMPTY', value: '' },
      { name: 'PRISTINE', value: 'pristine value' },
      { name: 'NEW', value: 'new value', isNew: true },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'EDITED', value: 'edited value', isEdited: true },
      { name: 'DELETED', value: 'deleted value', isDeleted: true },
    ];

    return envVarForm;
  }), { notes });
