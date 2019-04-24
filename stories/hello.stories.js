import { storiesOf } from '@storybook/html'

storiesOf('Hello component', module)
  .add('Hello story', () => {
    return `<h1>Hello</h1><abu-button>Button</abu-button> <abu-button link="https://example.com">Link</abu-button>`
  }, { notes: 'Hello docs' })
