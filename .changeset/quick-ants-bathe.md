---
"exhaustive": major
---

## Exposed `Exhaustive` types and added new generic slot in core function for type of output

The types `ExhaustiveUnion` and `Exhaustiveag` are now exposed for your own convenience if you'd like to override the generic slots of `exhaustive`. The inferred output was also added as a new slot in the function generics, allowing you to also override the output value of `exhaustive`:

```tsx
import { exhaustive, type ExhaustiveTag } from 'exhaustive';

exhaustive<RequestState, 'state', ExhaustiveTag<RequestState, 'state'>, JSX.Element>(request, 'state', {
  IDLE: () => null,
  LOADING: (value) => <Loading />,
  SUCCESS: (value) => <List data={value.data} />,
  ERROR: (value) => <Error message={value.error} />,
});
```

### BREAKING CHANGES

#### Renamed `_tag` method to `tag`
The `_tag` method was exposed as a some sort of secondary method to enhance the experience with Tagged Unions. Since the DX of using it is vastly superior compared to the Tagged Union overload in `exhaustive`, and it seems that we cannot improve the overload inference on the core funcion, the underscore has been removed from the method name and now you should used it as `exhaustive.tag` to make it official as the preferred way to exhaustive check Tagged Unions:

```diff
const area = (s: Shape) => {
- return exhaustive._tag(s, 'kind', {
+ return exhaustive.tag(s, 'kind', {
    square: (shape) => shape.size ** 2,
    rectangle: (shape) => shape.width * shape.height,
    circle: (shape) => Math.PI * shape.radius ** 2,
  });
};
```
