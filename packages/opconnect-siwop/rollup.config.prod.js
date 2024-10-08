import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import image from '@rollup/plugin-image';

import packageJson from './package.json';

export default [
  {
    input: ['./src/index.ts'],
    external: ['react', 'react-dom', 'framer-motion'],
    output: {
      file: packageJson.exports.import,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      image(),
      peerDepsExternal(),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: 'node_modules/**',
      }),
    ],
  },
];
