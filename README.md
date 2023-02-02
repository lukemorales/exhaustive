<p align="center">
  <a href="https://github.com/lukemorales/exhaustive" target="\_parent"><img src="https://em-content.zobj.net/thumbs/240/emojidex/112/tired-face_1f62b.png" alt="Factory emoji" height="130"></a>
</p>

<h1 align="center">Exhaustive</h1>

<p align="center">
  <a href="https://github.com/lukemorales/exhaustive/actions/workflows/tests.yml" target="\_parent"><img src="https://github.com/lukemorales/exhaustive/actions/workflows/tests.yml/badge.svg?branch=main" alt="Latest build"></a>
  <a href="https://www.npmjs.com/package/exhaustive" target="\_parent"><img src="https://badgen.net/npm/v/exhaustive" alt="Latest published version"></a>
  <a href="https://bundlephobia.com/package/exhaustive@latest" target="\_parent"><img src="https://badgen.net/bundlephobia/minzip/exhaustive" alt="Bundlephobia"></a>
  <a href="https://bundlephobia.com/package/exhaustive@latest" target="\_parent"><img src="https://badgen.net/bundlephobia/tree-shaking/exhaustive" alt="Tree shaking available"></a>
  <a href="https://github.com/lukemorales/exhaustive" target="\_parent"><img src="https://badgen.net/npm/types/exhaustive" alt="Types included"></a>
  <a href="https://www.npmjs.com/package/exhaustive" target="\_parent"><img src="https://badgen.net/npm/license/exhaustive" alt="License"></a>
  <a href="https://www.npmjs.com/package/exhaustive" target="\_parent"><img src="https://badgen.net/npm/dt/exhaustive" alt="Number of downloads"></a>
  <a href="https://github.com/lukemorales/exhaustive" target="\_parent"><img src="https://img.shields.io/github/stars/lukemorales/exhaustive.svg?style=social&amp;label=Star" alt="GitHub Stars"></a>
</p>

<p align="center">
  <strong>Exhaustiveness checking in TypeScript</strong>
</p>

<p align="center">
  Tiny bundle footprint for typesafe exhaustiveness checks with helpful type inference<br />to ensure you haven’t forgotten any case.
</p>

## 📦 Install
`exhaustive` is available as a package on NPM. Install it with your favorite package manager:

```dircolors
npm install exhaustive
```

## ⚡ Quick start
```ts
import { exhaustive } from "exhaustive";

enum Role {
  ADMIN = 'ADMIN',
  DEFAULT = 'DEFAULT',
  VIEWER = 'VIEWER',
}

enum Permission {
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
}

const getUserPermissions = (role: Role) =>
  exhaustive(role, {
    ADMIN: () => [Permission.DELETE, Permission.EDIT, Permission.VIEW],
    DEFAULT: () => [Permission.EDIT, Permission.VIEW],
    VIEWER: () => [Permission.VIEW],
  });
```

<br />

## 📝 Features

### Tagged Unions
When working with `Tagged Unions` (or `Discriminated Unions`), use `exhaustive.tag` to inform what property to discriminate between union members:

```ts
interface Square {
  kind: 'square';
  size: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

interface Circle {
  kind: 'circle';
  radius: number;
}

type Shape = Square | Rectangle | Circle;

const area = (s: Shape) => {
  return exhaustive.tag(s, 'kind', {
    square: (shape) => shape.size ** 2,
    rectangle: (shape) => shape.width * shape.height,
    circle: (shape) => Math.PI * shape.radius ** 2,
  });
};
```

An overload is also available in the core `exhaustive` function: by adding a third parameter to the function, Typescript will fallback to the Tagged Union overload.

```ts
exhaustive(s, 'kind', {
  square: (shape) => shape.size ** 2,
  rectangle: (shape) => shape.width * shape.height,
  circle: (shape) => Math.PI * shape.radius ** 2,
});
```

PS: Note that TypeScript has a limitation inferring the Tagged Union overload via argument types because they are generic values. This means autocomplete for the Tagged Union keys will not exist until you declare an empty object as the third argument:

```ts
exhaustive(s, 'kind', {});
//                     ^ this will trigger the Tagged Union overload
```

This overload exists so you can use it at your own convenience, but if you prefer the better DX of inferred types from the start, calling `exhaustive.tag` is still preferrable.

### Type Narrowing
For every case checked, `exhaustive` will narrow the type of input:

```ts
const getRoleLabel = (r: Role) =>
  exhaustive(r, {
    ADMIN: (role) => capitalize(role), // Admin
//            ^? role is ADMIN
    DEFAULT: (role) => capitalize(role), // Default
//              ^? role is DEFAULT
    VIEWER: (role) => capitalize(role), // Viewer
//             ^? role is VIEWER
  });

const area = (s: Shape) => {
  return exhaustive.tag(s, 'kind', {
    square: (shape) => shape.size ** 2,
//             ^? shape is Square
    rectangle: (shape) => shape.width * shape.height,
//                ^? shape is Rectangle
    circle: (shape) => Math.PI * shape.radius ** 2,
//             ^? shape is Circle
  });
};
```


### Default Fallback
If any corrupt values make to the exhaustive checker, it will throw a `TypeError` at runtime. If you don't want `exhaustive` to throw, you can provide a default fallback:

```ts
enum Food {
  BANANA = 'BANANA',
  SALAD = 'SALAD',
}

const getFoodType = (food: Food) => {
  return exhaustive(food, {
    BANANA: () => 'Fruit',
    SALAD: () => 'Leaves',
    _: () => 'Unknown',
  });
};
```

### Exhaustive Switch Statements
Sometimes it's easier to work with switch statements, especially if you have a lot of cases that are falling-through to a common handler.

To enforce exhaustiveness checking inside `switch` statements, use the `corrupt` helper as your `default` value, which will make TypeScript complain of unhandled cases, and throw at runtime if the `default` case is reached:

```ts
import { corrupt } from "exhaustive";

type Day =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

const getLabelForDayOfWeek = (day: Day) => {
  switch (day) {
    case 'Monday':
    case 'Tuesday':
    case 'Wednesday':
    case 'Thursday':
    case 'Friday':
      return 'Weekday';
    case 'Saturday':
    // case 'Sunday':
      return 'Weekend';
    default:
      corrupt(day);
//             ^? Argument of type 'string' is not assignable to parameter of type 'never'
  }
};
```
