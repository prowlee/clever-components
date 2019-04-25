import '../../components/env-var/env-var-input.js';
import notes from '../../.components-docs/env-var-input.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action';

const eventNames = ['env-var-input:input', 'env-var-input:delete', 'env-var-input:keep'];

storiesOf('env-var/<env-var-input>', module)
  .add('all', () => withCustomEventActions(...eventNames)(() => {
    // language=HTML
    return `
      <env-var-input name="EMPTY" value=""></env-var-input>
      <env-var-input name="PRISTINE" value="pristine value"></env-var-input>
      <env-var-input name="NEW" value="new value" is-new></env-var-input>
      <env-var-input name="NEW_EDITED" value="new deleted value" is-new is-edited></env-var-input>
      <env-var-input name="EDITED" value="edited value" is-edited></env-var-input>
      <env-var-input name="DELETED" value="deleted value" is-deleted></env-var-input>
      <env-var-input name="EDITED_DELETED" value="edited deleted value" is-edited is-deleted></env-var-input>
      <env-var-input name="VERY_LONG_NAME_THAT_IS_ACTUALLY_TOO_LONG_TOO_DISPLAY_OMG_WHAT_IS_HAPPENING" value="value for long name"></env-var-input>
      <env-var-input name="LONG_VALUE" value="very long name that is actually too long too display omg what is happening"></env-var-input>
    `;
  }), { notes });
