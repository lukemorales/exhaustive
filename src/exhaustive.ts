import { corrupt } from './corrupt';

type AnyFunction = (...args: any[]) => unknown;

export type ExhaustiveUnion<Union extends string> = {
  [Key in Union]: (value: Key) => any;
} & ExhaustiveFallback;

export type ExhaustiveTag<Union extends object, Tag extends keyof Union> = {
  [Key in Union[Tag] & string]: (
    value: Extract<Union, { [K in Tag]: Key }>,
  ) => any;
} & ExhaustiveFallback;

type ExhaustiveFallback = {
  /**
   * Default fallback
   *
   * @description
   * When declared, "exhaustive" will fallback to this callback
   * instead of throwing an unreachable error
   */
  _?: () => any;
};

/**
 * Ensures no extra values are passed to the object
 */
type ValidateKeys<T, U> = [keyof T] extends [keyof U]
  ? T
  : {
      [Key in keyof U]: Key extends keyof T ? T[Key] : never;
    };

function exhaustive<
  Union extends string,
  Match extends ExhaustiveUnion<Union> = ExhaustiveUnion<Union>,
  Output = Match[keyof Match] extends AnyFunction
    ? ReturnType<Match[keyof Match]>
    : never,
>(union: Union, match: ValidateKeys<Match, ExhaustiveUnion<Union>>): Output;
function exhaustive<
  Union extends object,
  Tag extends keyof Union,
  Match extends ExhaustiveTag<Union, Tag> = ExhaustiveTag<Union, Tag>,
  Output = Match[keyof Match] extends AnyFunction
    ? ReturnType<Match[keyof Match]>
    : never,
>(
  union: Union,
  tag: Tag,
  match: ValidateKeys<Match, ExhaustiveTag<Union, Tag>>,
): Output;
function exhaustive(union: any, matchOrKeyofUnion: any, match?: any) {
  if (typeof match !== 'undefined') {
    return exhaustive.tag(union, matchOrKeyofUnion, match);
  }

  if (!Object.prototype.hasOwnProperty.call(matchOrKeyofUnion, union)) {
    if (Object.prototype.hasOwnProperty.call(matchOrKeyofUnion, '_')) {
      return (matchOrKeyofUnion as Required<ExhaustiveFallback>)._();
    }

    return corrupt(union as never);
  }

  const result = (matchOrKeyofUnion as object)[union as string];
  return result(union);
}

exhaustive.tag = <
  Union extends object,
  Tag extends keyof Union,
  Match extends ExhaustiveTag<Union, Tag> = ExhaustiveTag<Union, Tag>,
  Output = Match[keyof Match] extends AnyFunction
    ? ReturnType<Match[keyof Match]>
    : never,
>(
  union: Union,
  tag: Tag,
  match: ValidateKeys<Match, ExhaustiveTag<Union, Tag>>,
): Output => {
  const key = union[tag];

  if (!Object.prototype.hasOwnProperty.call(match, key)) {
    if (Object.prototype.hasOwnProperty.call(match, '_')) {
      return (match as Required<ExhaustiveFallback>)._();
    }

    return corrupt(union as never);
  }

  const result = match[key as string];
  return result(union);
};

export { exhaustive };
