module.exports = {
  env: {
    es2022: true,
    jest: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  settings: {
    "import/resolver": {
      node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      typescript: {},
    },
    "import/extensions": [".js", ".mjs", ".jsx", ".ts", ".tsx"],
    jest: {
      version: 29,
    },
  },
  extends: [
    "airbnb-base",
    "plugin:import/typescript",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:jest-formatting/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: [
    "import-helpers",
    "simple-import-sort",
    "jest",
    "jest-formatting",
    "@typescript-eslint",
    "prettier",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        printWidth: 80,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: "all",
        arrowParens: "always",
      },
      { usePrettierrc: false },
    ],

    // base
    "arrow-body-style": ["error", "as-needed"],
    camelcase: "off",
    "class-methods-use-this": "off",
    "implicit-arrow-linebreak": "off",
    "no-await-in-loop": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsForRegex: [
          "^draft",
          "(result|map|set|obj|record|sum|group)",
          "^acc",
          ".*(Map|Set)$",
        ],
      },
    ],
    "no-shadow": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "no-unneeded-ternary": "error",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "no-use-before-define": "off",
    "no-useless-concat": "error",
    "no-useless-constructor": "off",
    "no-void": "off",
    "prefer-template": "error",
    "padding-line-between-statements": [
      "warn",
      // Note: When defining new entries for this rule keep the related lines
      // together and separate them from other lines using blank lines.

      // Require a blank line after groups of imports.
      { blankLine: "always", prev: "import", next: "*" },
      { blankLine: "any", prev: "import", next: ["import"] },

      // Require a blank line after block-like statements.
      { blankLine: "always", prev: "block-like", next: "*" },
      // Ignore rule for blocks within `switch` statements.
      { blankLine: "any", prev: "block-like", next: ["case", "default"] },
    ],

    //imports
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/prefer-default-export": "off",
    "import/no-duplicates": ["error", { considerQueryString: true }],
    "import/no-named-as-default": "off",
    "import/no-useless-path-segments": ["error", { noUselessIndex: true }],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/test/**", // tape, common npm pattern
          "**/tests/**", // also common npm pattern
          "**/__tests__/**", // jest pattern
          "**/__mocks__/**", // jest pattern
          "test.{js,jsx,ts,tsx}", // repos with a single test file
          "test-*.{js,jsx,ts,tsx}", // repos with multiple top-level test files
          "**/*{.,_}{test,spec,e2e-spec}.{js,jsx,ts,tsx}", // tests where the extension or filename suffix denotes that it is a test
          "**/*.config.{js,ts}", // config files
          "**/*.setup.{js,ts}", // setup files
          "**/.eslintrc.js", // eslint config
        ],
        optionalDependencies: false,
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      { js: "never", mjs: "never", jsx: "never", ts: "never", tsx: "never" },
    ],
    "import-helpers/order-imports": [
      "warn",
      {
        newlinesBetween: "always",
        groups: [
          [
            "/^(react|express|fastify)$/",
            "/^react-(native|dom)$/",
            "/^(next|@next|@nestjs|@fastify)/",
          ],
          "module",
          [
            "/^@(api|app|assets|common|components|constants|contexts|features|hooks|mocks|pages|routes|services|styles|types|utils|shared|store)/",
          ],
          ["parent", "sibling"],
          "index",
        ],
        alphabetize: { order: "ignore", ignoreCase: true },
      },
    ],
    "import/no-anonymous-default-export": [
      "error",
      {
        allowArray: true,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true,
        allowLiteral: true,
        allowObject: true,
      },
    ],
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@features/*/*"],
            message:
              "Usage of a feature internal modules is not allowed, please import from the feature public API",
          },
        ],
      },
    ],

    // jest
    "jest/consistent-test-it": "error",
    "jest/expect-expect": [
      "error",
      {
        assertFunctionNames: [
          "expect",
          "expectTypeOf",
          "request.**.expect",
          "supertest.**.expect",
        ],
      },
    ],
    "jest/no-standalone-expect": [
      "error",
      { additionalTestBlockFunctions: ["eachCase"] },
    ],
    "jest/prefer-lowercase-title": [
      "error",
      {
        allowedPrefixes: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        ignoreTopLevelDescribe: true,
      },
    ],
    "jest/valid-title": [
      "error",
      {
        mustNotMatch: {
          it: [/^should/.source, 'Titles should not start with "should"'],
        },
      },
    ],
    "jest/no-conditional-expect": "warn",
    "jest-formatting/padding-around-after-all-blocks": "warn",
    "jest-formatting/padding-around-after-each-blocks": "warn",
    "jest-formatting/padding-around-before-all-blocks": "warn",
    "jest-formatting/padding-around-before-each-blocks": "warn",
    "jest-formatting/padding-around-describe-blocks": "warn",
    "jest-formatting/padding-around-test-blocks": "warn",

    // typescript
    "no-undef": "off",
    "@typescript-eslint/array-type": [
      "warn",
      { default: "array-simple", readonly: "array-simple" },
    ],
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: { "{}": false },
      },
    ],
    camelcase: "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { fixStyle: "inline-type-imports" },
    ],
    "@typescript-eslint/consistent-generic-constructors": "warn",
    "@typescript-eslint/consistent-indexed-object-style": "warn",
    "@typescript-eslint/consistent-type-assertions": "warn",
    "default-param-last": "off",
    "@typescript-eslint/default-param-last": "warn",
    "dot-notation": "off",
    "@typescript-eslint/dot-notation": "warn",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/member-delimiter-style": "warn",
    "@typescript-eslint/method-signature-style": "warn",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
        leadingUnderscore: "allow",
      },
    ],
    "@typescript-eslint/no-confusing-non-null-assertion": "warn",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "no-dupe-class-members": "off",
    "@typescript-eslint/no-dupe-class-members": "warn",
    "@typescript-eslint/no-duplicate-enum-values": "warn",
    "@typescript-eslint/no-dynamic-delete": "warn",
    "@typescript-eslint/no-empty-interface": [
      "error",
      { allowSingleExtends: true },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "no-extra-parens": "off",
    "@typescript-eslint/no-extra-parens": "off",
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/no-floating-promises": ["error", { ignoreVoid: true }],
    "@typescript-eslint/no-for-in-array": "off",
    "@typescript-eslint/no-inferrable-types": [
      "error",
      { ignoreParameters: true },
    ],
    "@typescript-eslint/no-invalid-void-type": "warn",

    "@typescript-eslint/no-meaningless-void-operator": "warn",
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: { attributes: false, properties: false } },
    ],
    "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "warn",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    "no-return-await": "off",
    "@typescript-eslint/return-await": "error",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error", { ignoreTypeValueShadow: true }],
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/no-unnecessary-type-arguments": "warn",
    "@typescript-eslint/no-unnecessary-type-constraint": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_$|[iI]gnored",
      },
    ],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/non-nullable-type-assertion-style": "warn",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-includes": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/prefer-reduce-type-parameter": "error",
    "@typescript-eslint/prefer-return-this-type": "error",
    "@typescript-eslint/prefer-string-starts-ends-with": "error",
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "@typescript-eslint/require-array-sort-compare": "error",
    "@typescript-eslint/restrict-plus-operands": [
      "error",
      { checkCompoundAssignments: true },
    ],
    "@typescript-eslint/switch-exhaustiveness-check": "warn",
    "@typescript-eslint/unified-signatures": "warn",
  },

  overrides: [
    {
      files: ["*.spec.ts", "*.e2e-spec.ts"],
      rules: {
        "@typescript-eslint/no-unsafe-argument": "off",
      },
    },
  ],
};
