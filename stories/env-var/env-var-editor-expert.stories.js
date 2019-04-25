import '../../components/env-var/env-var-editor-expert.js';
import notes from '../../.components-docs/env-var-editor-expert.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action';

const eventNames = ['env-var-editor-expert:change'];

storiesOf('env-var', module)
  .add('<env-var-editor-expert>', () => withCustomEventActions(...eventNames)(() => {

    const envVarFormExpert = document.createElement('env-var-editor-expert');
    envVarFormExpert.variables = [
      { name: 'EMPTY', value: '' },
      { name: 'PRISTINE', value: 'pristine value' },
      { name: 'NEW', value: 'new value', isNew: true },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'EDITED', value: 'edited value', isEdited: true },
      { name: 'DELETED', value: 'deleted value', isDeleted: true },
    ];

    return envVarFormExpert;
  }), { notes });
