import '../../components/env-var/env-var-form';
import notes from '../../.components-docs/env-var-form.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action';

const withActions = withCustomEventActions('env-var-form:submit', 'env-var-form:dismissed-error', 'env-var-form:restart-app');

storiesOf('env-var/<env-var-form>/default', module)
  .add('no data yet (skeleton)', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    return envVarForm;
  }), { notes })
  .add('empty data', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.variables = Promise.resolve([]);
    return envVarForm;
  }), { notes })
  .add('with data', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.variables = Promise.resolve([
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ]);
    return envVarForm;
  }), { notes })
  .add('with data (restart button)', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.setAttribute('restart-app', 'true');
    envVarForm.variables = Promise.resolve([
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ]);
    return envVarForm;
  }), { notes })
  .add('with data (heading & description)', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.setAttribute('heading', 'Environment variables');
    envVarForm.variables = Promise.resolve([
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ]);
    envVarForm.innerHTML = `
      Environment variables allow you to inject data in your application’s environment.
      <a href="http://doc.clever-cloud.com/admin-console/environment-variables/" target="_blank">Learn more</a>
    `;
    return envVarForm;
  }), { notes })
  .add('saving data', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.variables = Promise.resolve([
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ]);
    setTimeout(() => {
      envVarForm.variables = new Promise(() => null);
    }, 0);
    return envVarForm;
  }), { notes })
  .add('error (loading data)', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    setTimeout(() => {
      envVarForm.variables = Promise.reject(new Error());
    }, 0);
    return envVarForm;
  }), { notes })
  .add('error (saving data)', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.variables = Promise.resolve([
      { name: 'EMPTY', value: '' },
      { name: 'ONE', value: 'value ONE' },
      { name: 'MULTI', value: 'line one\nline two\nline three' },
      { name: 'TWO', value: 'value TWO' },
    ]);
    setTimeout(() => {
      envVarForm.variables = Promise.reject(new Error());
    }, 0);
    return envVarForm;
  }), { notes });

storiesOf('env-var/<env-var-form>/readonly', module)
  .add('no data yet (skeleton)', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.setAttribute('readonly', 'true');
    return envVarForm;
  }), { notes })
  .add('empty data', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.setAttribute('readonly', 'true');
    envVarForm.variables = Promise.resolve([]);
    return envVarForm;
  }), { notes })
  .add('with data', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.setAttribute('readonly', 'true');
    envVarForm.variables = Promise.resolve([
      { name: 'VARIABLE_ONE', value: 'Value one' },
      { name: 'VARIABLE_TWO_TWO', value: 'Value two two' },
      { name: 'VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
    ]);
    return envVarForm;
  }), { notes })
  .add('with data (heading & description)', withActions(() => {
    const envVarForm = document.createElement('env-var-form');
    envVarForm.setAttribute('readonly', 'true');
    envVarForm.setAttribute('heading', 'Addon: foobar');
    envVarForm.variables = Promise.resolve([
      { name: 'VARIABLE_ONE', value: 'Value one' },
      { name: 'VARIABLE_TWO_TWO', value: 'Value two two' },
      { name: 'VARIABLE_THREE_THREE_THREE', value: 'Value three three three' },
    ]);
    return envVarForm;
  }), { notes });