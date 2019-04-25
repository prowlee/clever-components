const translations = {
  en: {
    // env-var-create
    'env-var-create.name.placeholder': 'ENV_VAR_NAME',
    'env-var-create.value.placeholder': 'env var value',
    'env-var-create.create-button': 'Create',
    'env-var-create.errors.invalid-name': ({ name }) => `Name <code>${name}</code> is invalid`,
    'env-var-create.errors.already-defined-name': ({ name }) => `Name <code>${name}</code> is already defined`,
    // env-var-editor-expert
    'env-var-editor-expert.errors.none': `No errors`,
    'env-var-editor-expert.errors.unknown': `Unknown Error`,
    'env-var-editor-expert.errors.invalid-name': ({ name }) => `<code>${name}</code> is not a valid variable name`,
    'env-var-editor-expert.errors.duplicated-name': ({ name }) => `be careful, the name <code>${name}</code> is already defined`,
    'env-var-editor-expert.errors.invalid-line': `this line is not valid, the correct pattern is <code>KEY="VALUE"</code>`,
    'env-var-editor-expert.errors.invalid-value': `the value is not valid, if you use quotes, you need to escape them like this <code>\\"</code> or quote the whole value.`,
    // env-var-form
    'env-var-form.mode.simple': `Simple`,
    'env-var-form.mode.expert': `Expert`,
    // env-var-input
    'env-var-input.delete-button': 'Rem"ove',
    'env-var-input.keep-button': `Keep`,
    'env-var-input.value-placeholder': 'Environment variable value',
  },
  fr: {
    // env-var-create
    'env-var-create.name.placeholder': 'ENV_VAR_NAME',
    'env-var-create.value.placeholder': 'env var value',
    'env-var-create.create-button': 'Create',
    'env-var-create.errors.invalid-name': ({ name }) => `Name <code>${name}</code> is invalid`,
    'env-var-create.errors.already-defined-name': ({ name }) => `Name <code>${name}</code> is already defined`,
    // env-var-editor-expert
    'env-var-editor-expert.errors.none': `No errors`,
    'env-var-editor-expert.errors.unknown': `Unknown Error`,
    'env-var-editor-expert.errors.invalid-name': ({ name }) => `<code>${name}</code> is not a valid variable name`,
    'env-var-editor-expert.errors.duplicated-name': ({ name }) => `be careful, the name <code>${name}</code> is already defined`,
    'env-var-editor-expert.errors.invalid-line': `this line is not valid, the correct pattern is <code>KEY="VALUE"</code>`,
    'env-var-editor-expert.errors.invalid-value': `the value is not valid, if you use quotes, you need to escape them like this <code>\\"</code> or quote the whole value.`,
    // env-var-form
    'env-var-form.mode.simple': `Simple`,
    'env-var-form.mode.expert': `Expert`,
    // env-var-input
    'env-var-input.delete-button': 'Enlever',
    'env-var-input.keep-button': `Garder`,
    'env-var-input.value-placeholder': 'Valeur de la variable d\'environnement',
  },
};

function i18n (key, data) {

  const trs = translations[i18n.lang][key];

  if (trs == null) {
    console.warn(`Unknown translation ${key}`);
    return 'unknown';
  }

  return (typeof trs === 'function')
    ? trs(data)
    : trs;
}

i18n.lang = 'en';

module.exports = i18n;
