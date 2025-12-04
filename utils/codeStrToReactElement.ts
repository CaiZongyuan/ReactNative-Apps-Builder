import * as Babel from '@babel/standalone';
import * as Instant from '@instantdb/react-native';
import React from 'react';
import ReactNative from 'react-native';

export default function codeStrToReactElement(instantAppId: string, inputCode: string) {
  let code = inputCode;
  // Replace the text `instantAppId` with the actual id
  console.log('instantAppId', instantAppId);

  code = code.replaceAll(/instantAppId/g, `"${instantAppId}"`);

  // Clean the code: find the first import statement and start from there
  const importIndex = code.indexOf('import ');
  if (importIndex > 0) {
    code = code.substring(importIndex);
  }

  // Trim any text after "export default App;"
  const exportText = 'export default App;';
  const exportIndex = code.indexOf(exportText);
  if (exportIndex > -1) {
    code = code.substring(0, exportIndex + exportText.length);
  }

  // Transform the javascript: this transpiles away JSX,
  // changes `import` to `require`, etc
  const transformed = Babel.transform(code.trim(), {
    presets: [['env', { targets: { esmodules: true } }], 'react', 'typescript'],
    filename: 'component.tsx',
    plugins: [['transform-modules-commonjs', { strict: false }]],
  }).code;

  // This creates a little `module` function.
  // Once this code is instantiated, we can run it,
  // and *the default export* will return!
  const moduleCode = `
    const exports = {};
    const module = { exports };

    const require = (name) => {
      if (name === 'react') return React;
      if (name === 'react-native') return ReactNative;
      if (name === '@instantdb/react-native') return Instant;
      throw new Error('Module not found: ' + name);
    };

    ${transformed}

    return module.exports.default || module.exports;
  `;

  const moduleFn = new Function('React', 'ReactNative', 'Instant', moduleCode);

  // Note:
  // We're now calling our module with everything `React`, `ReactNative`, and `Instant`.
  // This is what the code has access too.
  // We may want to be more specific eventually. For example, maybe we only want to expose
  // some React Native components, and not others. But this gets us to a preetty cool demo : )
  const Component = moduleFn(React, ReactNative, Instant);

  return React.createElement(Component);
}
