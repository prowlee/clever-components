module.exports.fr = {
  'LANGUAGE': 'Français',
  // env-var-create
  'env-var-create.name.placeholder': `NOM_VAR_ENV`,
  'env-var-create.value.placeholder': `valeur var env`,
  'env-var-create.create-button': `Créer`,
  'env-var-create.errors.invalid-name': ({ name }) => `Name <code>${name}</code> is invalid`,
  'env-var-create.errors.already-defined-name': ({ name }) => `Name <code>${name}</code> is already defined`,
  // env-var-editor-expert
  'env-var-editor-expert.errors.none': `Pas d'erreur`,
  'env-var-editor-expert.errors.unknown': `Erreur inconnue`,
  'env-var-editor-expert.errors.invalid-name': ({ name }) => `<code>${name}</code> is not a valid variable name`,
  'env-var-editor-expert.errors.duplicated-name': ({ name }) => `be careful, the name <code>${name}</code> is already defined`,
  'env-var-editor-expert.errors.invalid-line': `this line is not valid, the correct pattern is <code>KEY="VALUE"</code>`,
  'env-var-editor-expert.errors.invalid-value': `the value is not valid, if you use quotes, you need to escape them like this <code>\\"</code> or quote the whole value.`,
  // env-var-form
  'env-var-form.mode.simple': `Simple`,
  'env-var-form.mode.expert': `Expert`,
  'env-var-form.reset': `Annuler les changements`,
  'env-var-form.update': `Mettre à jour les changements`,
  // env-var-input
  'env-var-input.delete-button': `Enlever`,
  'env-var-input.keep-button': `Garder`,
  'env-var-input.value-placeholder': `Valeur de la variable d'environnement`,
};
