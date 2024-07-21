/* eslint-disable prefer-object-has-own */
import { corrupt } from './corrupt';

type NoInfer<T> = [T][T extends any ? 0 : never];

/**
 * `unknown` extends `any` will be true,
 * whereas `unknown` extends other types will be false
 */
type ValidateOutput<T> = unknown extends T ? unknown : T;

export type ExhaustiveUnion<Union extends string | boolean, Output = unknown> =
  [Union] extends [string] ?
    {
      [Key in Union]: (value: Key) => Output;
    } & ExhaustiveDefaultCase<NoInfer<Output>>
  : Union extends boolean ?
    {
      true: (value: true) => Output;
      false: (value: false) => Output;
    } & ExhaustiveDefaultCase<NoInfer<Output>>
  : never;

export type ExhaustiveTag<
  Union extends object,
  Tag extends keyof Union,
  Output = unknown,
> =
  [Union[Tag]] extends [string] ?
    {
      [Key in `${Union[Tag]}`]: (
        value: Extract<Union, { [K in Tag]: Key }>,
      ) => Output;
    } & ExhaustiveDefaultCase<NoInfer<Output>>
  : Union[Tag] extends boolean ?
    {
      true: (value: Extract<Union, { [K in Tag]: true }>) => Output;
      false: (value: Extract<Union, { [K in Tag]: false }>) => Output;
    } & ExhaustiveDefaultCase<NoInfer<Output>>
  : never;

type ExhaustiveDefaultCase<Output> = {
  /**
   * Default case
   *
   * @description
   * When declared, "exhaustive" will fallback to this case
   * instead of throwing an unreachable error on unmatched case
   */
  _?: (value: never) => Output;
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
): match is Required<ExhaustiveDefaultCase<any>> {
  return Object.prototype.hasOwnProperty.call(match, '_');
}

type MatchCases<InferredCases, StrictCases, Output> =
  unknown extends Output ? InferredCases : StrictCases;

type ExtractOutput<
  Cases extends Record<string, (...args: any) => unknown>,
  Output,
> =
  unknown extends Output ? ValidateOutput<ReturnType<Cases[keyof Cases]>>
  : Output;

function exhaustive<
  Union extends string | boolean,
  Output,
  Cases extends ExhaustiveUnion<Union> = ExhaustiveUnion<Union>,
>(
  union: Union,
  match: MatchCases<
    ValidateKeys<Cases, ExhaustiveUnion<Union>>,
    ExhaustiveUnion<Union, Output>,
    Output
  >,
): ExtractOutput<Cases, Output>;
function exhaustive<
  Union extends object,
  Tag extends keyof Union,
  Output,
  Cases extends ExhaustiveTag<Union, Tag> = ExhaustiveTag<Union, Tag>,
>(
  union: Union,
  tag: Tag,
  match: MatchCases<
    ValidateKeys<Cases, ExhaustiveTag<Union, Tag>>,
    ExhaustiveTag<Union, Tag, Output>,
    Output
  >,
): ExtractOutput<Cases, Output>;
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
    const never = union as never;

    return hasDefaultCase($cases) ? $cases._(never) : corrupt(never);
  }

  const event = $cases[union];

  return event(union);
}

exhaustive.tag = <
  Union extends object,
  Tag extends keyof Union,
  Output,
  Cases extends ExhaustiveTag<Union, Tag> = ExhaustiveTag<Union, Tag>,
>(
  union: Union,
  tag: Tag,
  cases: MatchCases<
    ValidateKeys<Cases, ExhaustiveTag<Union, Tag>>,
    ExhaustiveTag<Union, Tag, Output>,
    Output
  >,
): ExtractOutput<Cases, Output> => {
  const key = union[tag];

  const matchesKey: boolean = Object.prototype.hasOwnProperty.call(cases, key);

  if (!matchesKey) {
    const never = union as never;

    return (hasDefaultCase(cases) ? cases._(never) : corrupt(never)) as never;
  }

  const event = cases[key as string];

  return event(union);
};

export { exhaustive };
