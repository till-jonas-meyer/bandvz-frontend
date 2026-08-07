import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input:
    '../api/dist/swagger.json',
  output: {
    path: './src/api/generated',
  },
  plugins: [
    '@hey-api/client-axios',
  ],
});
