import '../../components/atoms/cc-button.js';
import notes from '../../.components-docs/cc-input-text.md';
import { storiesOf } from '@storybook/html';
import { withCustomEventActions } from '../lib/event-action';

const eventNames = ['cc-input-text:input'];

storiesOf('atoms/<cc-input-text>', module)
  .add('simple', () => withCustomEventActions(...eventNames)(() => `

    <style>cc-input-text { width: 200px; }</style>
    
    Empty value:<br>
    <cc-input-text placeholder="Placeholder here..."></cc-input-text>
    
    <br>
    With value:<br>
    <cc-input-text value="Awesome value"></cc-input-text>
    
    <br>
    Disabled:<br>
    <cc-input-text disabled value="This is disabled"></cc-input-text>
    
    <br>
    Readonly:<br>
    <cc-input-text readonly value="This is readonly"></cc-input-text>
    
  `), { notes })
  .add('multiline', () => withCustomEventActions(...eventNames)(() => `

    <style>cc-input-text { width: 400px; }</style>
      
    Empty value:
    <cc-input-text multi placeholder="Placeholder here..."></cc-input-text>
    
    With value:
    <cc-input-text multi value="Line one\nLine two"></cc-input-text>
    
    Disabled:
    <cc-input-text multi disabled value="Disabled line one\nDisabled line two"></cc-input-text>
    
    Readonly:
    <cc-input-text multi readonly value="Readonly line one\nReadonly line two"></cc-input-text>
  `), { notes });
