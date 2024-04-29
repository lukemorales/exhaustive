/* eslint-disable prefer-object-has-own */
import { corrupt } from './corrupt';

type ParseValue<Value> =
  Value extends 'true' ? true
  : Value extends 'false' ? false
  : Value;

export type ExhaustiveUnion<Union extends string | boolean> = {
  [Key in `${Union}`]: (value: ParseValue<Key>) => any;
} & ExhaustiveDefaultCase;

export type ExhaustiveTag<Union extends object, Tag extends keyof Union> = {
  [Key in `${Union[Tag] & (string | boolean)}`]: (
    value: Extract<Union, { [K in Tag]: ParseValue<Key> }>,
  ) => any;
} & ExhaustiveDefaultCase;

type ExhaustiveDefaultCase = {
  /**
   * Default case
   *
   * @description
   * When declared, "exhaustive" will fallback to this case
   * instead of throwing an unreachable error on unmatched case
   */
  _?: () => any;
};

/**
 * Ensures no extra values are passed to the object
 */
type ValidateKeys<T, U> =
  [keyof T] extends [keyof U] ? T
  : {
      [Key in keyof U]: Key extends keyof T ? T[Key] : never;
    };

function hasDefaultCase(
  match: object,
): match is Required<ExhaustiveDefaultCase> {
  return Object.prototype.hasOwnProperty.call(match, '_');
}

function exhaustive<
  Union extends string | boolean,
  Cases extends ExhaustiveUnion<Union> = ExhaustiveUnion<Union>,
  Output = ReturnType<Cases[keyof Cases]>,
>(union: Union, match: ValidateKeys<Cases, ExhaustiveUnion<Union>>): Output;
function exhaustive<
  Union extends object,
  Tag extends keyof Union,
  Cases extends ExhaustiveTag<Union, Tag> = ExhaustiveTag<Union, Tag>,
  Output = ReturnType<Cases[keyof Cases]>,
>(
  union: Union,
  tag: Tag,
  match: ValidateKeys<Cases, ExhaustiveTag<Union, Tag>>,
): Output;
function exhaustive(
  unionOrObject: string | object,
  casesOrKeyofUnion: string | object,
  cases?: object,
) {
  if (typeof cases !== 'undefined') {
    return exhaustive.tag(
      unionOrObject as object,
      casesOrKeyofUnion as never,
      cases,
    );
  }

  const union = unionOrObject as string;
  const $cases = casesOrKeyofUnion as object;

  const matchesKey: boolean = Object.prototype.hasOwnProperty.call(
    $cases,
    union,
  );

  if (!matchesKey) {
    return hasDefaultCase($cases) ? $cases._() : corrupt(union as never);
  }

  const event = $cases[union];

  return event(union);
}

exhaustive.tag = <
  Union extends object,
  Tag extends keyof Union,
  Cases extends ExhaustiveTag<Union, Tag> = ExhaustiveTag<Union, Tag>,
  Output = ReturnType<Cases[keyof Cases]>,
>(
  union: Union,
  tag: Tag,
  cases: ValidateKeys<Cases, ExhaustiveTag<Union, Tag>>,
): Output => {
  const key = union[tag];

  const matchesKey: boolean = Object.prototype.hasOwnProperty.call(cases, key);

  if (!matchesKey) {
    return hasDefaultCase(cases) ? cases._() : corrupt(union as never);
  }

  const event = cases[key as string];

  return event(union);
};

export { exhaustive };
