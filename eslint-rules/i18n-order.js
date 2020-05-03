'use strict';

const { isTranslationFile, isMainTranslationNode, getTranslationProperties } = require('./i18n-shared.js');

module.exports = {
  meta: {
    type: 'TODO',
    docs: {
      description: 'TODO',
      category: 'TODO',
      url: 'TODO',
    },
    fixable: 'code',
    messages: {
      todo: 'todo',
    },
  },
  create: function (context) {

    // Early return for non translation files
    if (!isTranslationFile(context)) {
      return {};
    }

    return {

      ExportNamedDeclaration (node) {

        // Early return for nodes that aren't the one exporting translations
        if (!isMainTranslationNode(node)) {
          return;
        }

        const sourceCode = context.getSourceCode();

        const keysToNode = {};

        const translationComments = sourceCode.ast.comments
          .filter((commentNode) => {
            return commentNode.type === 'Line'
              && node.loc.start.line < commentNode.loc.start.line
              && commentNode.loc.end.line < node.loc.end.line;
          });

        const translationCommentsByKey = {};
        translationComments.forEach((commentNode) => {
          translationCommentsByKey[commentNode.value.trim()] = commentNode;
        });

        getTranslationProperties(node).forEach((tpNode) => {
          keysToNode[tpNode.key.value] = tpNode;
        });

        const translationKeys = Object.keys(keysToNode);
        const sortedTranslationKeys = [...translationKeys].sort();

        if (JSON.stringify(translationKeys) !== JSON.stringify(sortedTranslationKeys)) {

          const firstNodes = {};
          const getPrefix = (key) => key.split('.')[0];

          const fixes = translationKeys.map((oldKey, index) => {
            const oldNode = keysToNode[oldKey];
            const newKey = sortedTranslationKeys[index];
            const newNode = keysToNode[newKey];
            const oldRange = (oldNode.type === 'Line')
              ? oldNode.range
              : [oldNode.range[0], oldNode.range[1] + 1];
            const newText = (newNode.type === 'Line')
              ? sourceCode.text.substring(newNode.start, newNode.end)
              : sourceCode.text.substring(newNode.start, newNode.end + 1);
            const prefix = getPrefix(newKey);
            const isFirstNode = firstNodes[prefix] == null;
            if (isFirstNode) {
              firstNodes[prefix] = oldRange;
            }
            // console.log(newNode.type, newKey, oldNode.type, oldKey);
            return [oldRange, newText, isFirstNode, prefix];
          });

          context.report({
            node,
            messageId: 'todo',
            fix: (fixer) => {
              return [
                ...translationComments.flatMap((cmtNode) => fixer.removeRange([cmtNode.range[0], cmtNode.range[1] + 1])),
                ...fixes.flatMap(([oldRange, newText, isFirstNode, prefix]) => {
                  if (isFirstNode) {
                    return [
                      fixer.insertTextBeforeRange(oldRange, `// ${prefix}\n`),
                      fixer.replaceTextRange(oldRange, newText),
                    ];
                  }
                  return [fixer.replaceTextRange(oldRange, newText)];
                }),
              ];
            },
          });
        }
      },
    };
  },
};
