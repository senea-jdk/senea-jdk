import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'

import pkg from './package.json'

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return (id) => pattern.test(id)
}

const extensions = ['.ts', 'js']

export default [
  // CommonJS for Node
  {
    input: 'src/index.ts',
    output: { file: 'lib/index.js', format: 'cjs' },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      '@babel/runtime'
    ]),
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'runtime',
        extensions,
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        plugins: [['@babel/plugin-transform-runtime', { useESModules: false }]]
      }),
      commonjs({ extensions })
    ]
  },
  // ES for Node
  {
    input: 'src/index.ts',
    output: { file: 'es/index.js', format: 'es' },
    external: makeExternalPredicate([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      '@babel/runtime'
    ]),
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'runtime',
        extensions,
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
        plugins: [['@babel/plugin-transform-runtime', { useESModules: true }]]
      }),
      commonjs({ extensions })
    ]
  },
  // ES for Browsers
  {
    input: 'src/index.ts',
    output: {
      file: 'es/index.mjs',
      format: 'es'
    },
    external: makeExternalPredicate([]),
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions,
        presets: ['@babel/preset-env', '@babel/preset-typescript']
      }),
      commonjs({ extensions })
      // terser()
    ]
  },
  // UMD for Browsers
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'Senea'
    },
    external: makeExternalPredicate([]),
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions,
        presets: ['@babel/preset-env', '@babel/preset-typescript']
      }),
      commonjs({ extensions })
      // terser()
    ]
  }
]
