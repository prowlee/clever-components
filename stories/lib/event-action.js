import { action, decorate } from '@storybook/addon-actions';

const customEvent = decorate([(args) => {
  return [JSON.stringify(args[0].detail)];
}]);

export function customEventAction (eventName) {
  return customEvent.action(eventName);
}

export function withCustomEventActions (...eventNames) {
  return customEvent.withActions(...eventNames);
}

export function eventAction (eventName) {
  return action(eventName);
}
