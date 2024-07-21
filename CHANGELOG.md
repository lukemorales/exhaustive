# exhaustive

## 1.1.2

### Patch Changes

- [`aec6f75`](https://github.com/lukemorales/exhaustive/commit/aec6f75dcd2b92415419024290db4b03ef6ef8d5) Thanks [@lukemorales](https://github.com/lukemorales)! - Improve inference of return types with new generic value

  The return type of `exhaustive` and `exhaustive.tag` will now be inferred based on the return type of the callback function.

  ```ts
  type Union = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

  type HumanReadableUnion = "idle" | "loading" | "success" | "error";

  function unionToHumanReadableString(union: Union): HumanReadableUnion {
    return exhaustive(union, {
      IDLE: () => "idle",
      LOADING: () => "loading",
      SUCCESS: () => "success",
      ERROR: (value) => value.toLowerCase(), // type `string` is not assignable to type `HumanReadableUnion`
    });
  }
  ```

## 1.1.1

### Patch Changes

- [`d210075`](https://github.com/lukemorales/exhaustive/commit/d210075e1b7ee3e7a77b29f01d6137bf3be08aa7) Thanks [@lukemorales](https://github.com/lukemorales)! - Fix exhaustive compile checks

  With the added support of exhaustive boolean checks, TypeScript stopped complaining if a key was missing in the exhaustive object due to how the new types were declared. The types were adjusted to bring back the expected behavior of TypesScript complaining at compile-time if you forget to handle all the use-cases.

## 1.1.0

### Minor Changes

- [#6](https://github.com/lukemorales/exhaustive/pull/6) [`abc000e`](https://github.com/lukemorales/exhaustive/commit/abc000e7c7c176be342d27ffc55e3b88687ef534) Thanks [@lukemorales](https://github.com/lukemorales)! - ## Add support for booleans

  Both `exhaustive` and `exhaustive.tag` can now be exhaustive checked against booleans:

  ```ts
  function handleStatus(isSelected: boolean) {
    return exhaustive(isSelected, {
      true: () => {
        // ...run handler for true case
      },
      false: () => {
        // ...run handler for false case
      },
    });
  }
  ```

  ```ts
  type ProfileStatus =
    | { checked: true; data: string }
    | { checked: false; error: string };

  function handleProfileStatus(status: ProfileStatus) {
    return exhaustive.tag(status, "checked", {
      true: (value) => saveProfile(value.data),
      //           ^? value is { checked: true; data: string }
      false: (value) => throwException(value.error),
      //           ^? value is { checked: false; error: string }
    });
  }
  ```

## 1.0.0

### Major Changes

- [#4](https://github.com/lukemorales/exhaustive/pull/4) [`b287bbb`](https://github.com/lukemorales/exhaustive/commit/b287bbbb0fcb7a5f433bff2ff4124d5ae995a8ed) Thanks [@lukemorales](https://github.com/lukemorales)! - ## Exposed `Exhaustive` types and added new generic slot in core function for type of output

  The types `ExhaustiveUnion` and `Exhaustiveag` are now exposed for your own convenience if you'd like to override the generic slots of `exhaustive`. The inferred output was also added as a new slot in the function generics, allowing you to also override the output value of `exhaustive`:

  ```tsx
  import { exhaustive, type ExhaustiveTag } from "exhaustive";

  exhaustive<
    RequestState,
    "state",
    ExhaustiveTag<RequestState, "state">,
    JSX.Element
  >(request, "state", {
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

### Minor Changes

- [#4](https://github.com/lukemorales/exhaustive/pull/4) [`b287bbb`](https://github.com/lukemorales/exhaustive/commit/b287bbbb0fcb7a5f433bff2ff4124d5ae995a8ed) Thanks [@lukemorales](https://github.com/lukemorales)! - ## Add `exhaustive.tag` overload to core function

  The same functionality of `exhaustive.tag` is available in the main function by adding a third argument to `exhaustive` that will trigger the Tagged Union overload.

  ```ts
  const area = (s: Shape) => {
    return exhaustive(s, "kind", {
      square: (shape) => shape.size ** 2,
      rectangle: (shape) => shape.width * shape.height,
      circle: (shape) => Math.PI * shape.radius ** 2,
    });
  };
  ```

  PS: Note that TypeScript has a limitation inferring the Tagged Union overload via argument types because they are generic values. Typescript will only fallback to the Tagged Union overload when you add a third argument. This means autocomplete for the Tagged Union keys will not exist until you declare an empty object as the third argument:

  ```ts
  exhaustive(shape, "kind", {});
  //                        ^ this will trigger the Tagged Union overload
  ```

  This feature is being added as a reflect of how the API was originally intended. Use it at your own convenience, but if you prefer the better DX of inferred types from the start, calling `exhaustive.tag` is still preferrable.

## 0.1.0

### Minor Changes

- [#2](https://github.com/lukemorales/exhaustive/pull/2) [`c1c4c65`](https://github.com/lukemorales/exhaustive/commit/c1c4c65a3b9e57e2fefa73a2e84d6e606b7d2fd6) Thanks [@lukemorales](https://github.com/lukemorales)! - Initial release of `exhaustive` and `corrupt` functions
