import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import createStyledComponentsTransformer from 'typescript-plugin-styled-components';
import packageJson from './package.json';
import image from '@rollup/plugin-image';

const styledComponentsTransformer = createStyledComponentsTransformer({
  displayName: true,
});

export default [
  {
    input: ['./src/index.ts'],
    external: ['react', 'react-dom', 'framer-motion'],
    output: [
      {
        file: packageJson.exports.import,
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [
      image(),
      peerDepsExternal(),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: 'node_modules/**',
        transformers: [
          () => ({
            before: [styledComponentsTransformer],
          }),
        ],
      }),
    ],
  },
];