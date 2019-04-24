const defaultCustomEventsOptions = { bubbles: true, composed: true }

export function dispatchCustomEvent (node, suffix, detail, options = {}) {
  const eventName = `${node.nodeName.toLocaleLowerCase()}:${suffix}`
  node.dispatchEvent(new CustomEvent(eventName, { detail, ...defaultCustomEventsOptions, ...options }))
}
