---
"exhaustive": minor
---

## Add support for booleans

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
  return exhaustive.tag(status, 'checked', {
    true: (value) => saveProfile(value.data),
//           ^? value is { checked: true; data: string }
    false: (value) => throwException(value.error),
//           ^? value is { checked: false; error: string }
  });
}
```
