---
'exhaustive': patch
---

Improve inference of return types with new generic value

The return type of `exhaustive` and `exhaustive.tag` will now be inferred based on the return type of the callback function.

```ts
type Union = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

type HumanReadableUnion = 'idle' | 'loading' | 'success' | 'error';

function unionToHumanReadableString(union: Union): HumanReadableUnion {
  return exhaustive(union, {
    IDLE: () => 'idle',
    LOADING: () => 'loading',
    SUCCESS: () => 'success',
    ERROR: (value) => value.toLowerCase(), // type `string` is not assignable to type `HumanReadableUnion`
  });
}
```
