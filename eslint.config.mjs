import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    plugins: {
      prettier: (await import("eslint-plugin-prettier")).default,
    },
    rules: {
      // Enforce the use of double quotes
      quotes: ["error", "double"],
      // Prohibit the use of semicolons
      semi: ["error", "never"],
      // Enforce 2-space indentation
      indent: ["error", 2],
      // Run prettier as an eslint rule
      "prettier/prettier": [
        "error",
        {
          semi: false,
          singleQuote: false,
          tabWidth: 2,
        },
      ],
      // Allow unused variables if they start with an underscore
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@next/next/no-html-link-for-pages": "off",
      indent: "off",
      quotes: "off",
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      ".next/*",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]

export default eslintConfig
