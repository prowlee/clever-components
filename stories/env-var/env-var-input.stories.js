import '../../components/env-var/env-var-input.js';
import notes from '../../.components-docs/env-var-input.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/even-action';

const eventNames = ['env-var-input:input', 'env-var-input:delete', 'env-var-input:undelete'];

storiesOf('env-var/<env-var-input>', module)
  .add('all', () => withCustomEventActions(...eventNames)(() => `
    
    <env-var-input name="EMPTY" value=""></env-var-input>
    
    <env-var-input name="PRISTINE" value="pristine value"></env-var-input>
    
    <env-var-input name="NEW" value="new value" is-new></env-var-input>
    
    <env-var-input name="NEW_EDITED" value="new deleted value" is-new is-edited></env-var-input>
    
    <env-var-input name="EDITED" value="edited value" is-edited></env-var-input>
    
    <env-var-input name="DELETED" value="deleted value" is-deleted></env-var-input>
    
    <env-var-input name="EDITED_DELETED" value="edited deleted value" is-edited is-deleted></env-var-input>
    
  `), { notes });
