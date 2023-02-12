---
"exhaustive": patch
---

Fix exhaustive compile checks

With the added support of exhaustive boolean checks, TypeScript stopped complaining if a key was missing in the exhaustive object due to how the new types were declared. The types were adjusted to bring back the expected behavior of TypesScript complaining at compile-time if you forget to handle all the use-cases.
