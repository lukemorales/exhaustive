---
"exhaustive": minor
---

## Add `exhaustive.tag` overload to core function

The same functionality of `exhaustive.tag` is available in the main function by adding a third argument to `exhaustive` that will trigger the Tagged Union overload.

```ts
const area = (s: Shape) => {
  return exhaustive(s, 'kind', {
    square: (shape) => shape.size ** 2,
    rectangle: (shape) => shape.width * shape.height,
    circle: (shape) => Math.PI * shape.radius ** 2,
  });
};
```

PS: Note that TypeScript has a limitation inferring the Tagged Union overload via argument types because they are generic values. Typescript will only fallback to the Tagged Union overload when you add a third argument. This means autocomplete for the Tagged Union keys will not exist until you declare an empty object as the third argument:

```ts
exhaustive(shape, 'kind', {});
//                        ^ this will trigger the Tagged Union overload
```

This feature is being added as a reflect of how the API was originally intended. Use it at your own convenience, but if you prefer the better DX of inferred types from the start, calling `exhaustive.tag` is still preferrable.
