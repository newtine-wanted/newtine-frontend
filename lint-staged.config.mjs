const config = {
  "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": [
    "prettier --write",
    "eslint --fix --max-warnings=0",
  ],
  "*.{json,jsonc,css,md,mdx,yaml,yml}": "prettier --write",
};

export default config;
