import * as Babel from '@babel/standalone';
import { i, id, init } from '@instantdb/react-native';
import React from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function codeStrToReactElement(inputCode: string) {
  // Clean the code: find the first import statement and start from there
  let code = inputCode
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

  const transformed = Babel.transform(code.trim(), {
    presets: [
      ['env', { targets: { esmodules: true } }],
      'react',
      'typescript'
    ],
    filename: 'component.tsx',
    plugins: [['transform-modules-commonjs', { strict: false }]],
  }).code;

  const moduleCode = `
    const exports = {};
    const module = { exports };
    
    const require = (name) => {
      if (name === 'react') return React;
      if (name === 'react-native') return { View, Text, TouchableOpacity, Alert, ScrollView, TextInput, FlatList, StyleSheet };
      if (name === '@instantdb/react-native') return { i, id, init, InstaQLEntity: {} };
      throw new Error('Module not found: ' + name);
    };
    
    ${transformed}
    
    return module.exports.default || module.exports;
  `;

  const moduleFn = new Function(
    'React',
    'View',
    'Text',
    'TouchableOpacity',
    'Alert',
    'ScrollView',
    'TextInput',
    'FlatList',
    'StyleSheet',
    'i',
    'id',
    'init',
    moduleCode
  );

  const Component = moduleFn(
    React,
    View,
    Text,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    FlatList,    
    StyleSheet,
    i,
    id,
    init
  );

  return React.createElement(Component);
}
