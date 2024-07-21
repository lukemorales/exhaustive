/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { exhaustive } from './exhaustive';

describe('exhaustive', () => {
  describe('when used with two arguments', () => {
    it('has the correct types', () => {
      type Union = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

      function withMissingRequiredProperties(union: Union) {
        // @ts-expect-error missing required properties
        return exhaustive(union, {
          IDLE: (value) => value.toLowerCase(),
        });
      }

      expectTypeOf(withMissingRequiredProperties).toEqualTypeOf<
        (union: Union) => unknown
      >();

      function withUnknownProperties(union: Union) {
        return exhaustive(union, {
          IDLE: (value) => value.toLowerCase(),
          ERROR: (value) => value.toLowerCase(),
          LOADING: (value) => value.toLowerCase(),
          SUCCESS: (value) => value.toLowerCase(),
          // @ts-expect-error unknown property
          extra: (value) => value.toLowerCase(),
        });
      }

      expectTypeOf(withUnknownProperties).toEqualTypeOf<
        (union: Union) => unknown
      >();

      function withInferredReturn(union: Union) {
        return exhaustive(union, {
          IDLE: (value) => value.toLowerCase(),
          LOADING: (value) => value.toLowerCase(),
          SUCCESS: (value) => value.toLowerCase(),
          ERROR: (value) => value.toLowerCase(),
        });
      }

      expectTypeOf(withInferredReturn).toEqualTypeOf<
        (union: Union) => string
      >();

      type LowerUnion = Lowercase<Union>;

      function withTypedReturn(union: Union): LowerUnion {
        return exhaustive(union, {
          IDLE: () => 'idle',
          LOADING: () => 'loading',
          SUCCESS: () => 'success',
          // @ts-expect-error value should be of type LowerUnion, but is of type string
          ERROR: (value) => value.toLowerCase(),
        });
      }

      expectTypeOf(withTypedReturn).toEqualTypeOf<
        (union: Union) => LowerUnion
      >();
    });

    describe('when used with a union of strings', () => {
      type Union = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

      type ExecOptions = { withFallback: boolean };

      const exec = (union: Union, options?: ExecOptions) =>
        exhaustive(union, {
          IDLE: (value) => {
            expectTypeOf(value).toEqualTypeOf<'IDLE'>();

            return value.toLowerCase();
          },
          LOADING: (value) => {
            expectTypeOf(value).toEqualTypeOf<'LOADING'>();

            return value.toLowerCase();
          },
          SUCCESS: (value) => {
            expectTypeOf(value).toEqualTypeOf<'SUCCESS'>();

            return value.toLowerCase();
          },
          ERROR: (value) => {
            expectTypeOf(value).toEqualTypeOf<'ERROR'>();

            return value.toLowerCase();
          },
          ...(options?.withFallback ?
            {
              _: (value) => {
                expectTypeOf(value).toEqualTypeOf<never>();

                return '🚨';
              },
            }
          : {}),
        });

      const eachCase = it.each<Union>(['IDLE', 'LOADING', 'SUCCESS', 'ERROR']);

      eachCase('returns the lower cased value for "%s"', (value) => {
        expect(exec(value)).toBe(value.toLowerCase());
      });

      describe('when no fallback is declared', () => {
        it('throws an exception when an invalid value is passed through', () => {
          expect(() => exec('unknown' as never)).toThrow(TypeError);
        });
      });

      describe('when a fallback is declared', () => {
        it('returns the declared fallback value', () => {
          expect(exec('unknown' as never, { withFallback: true })).toBe('🚨');
        });
      });
    });

    describe('when used with an enum', () => {
      // eslint-disable-next-line no-restricted-syntax
      enum Union {
        'IDLE' = 'IDLE',
        'LOADING' = 'LOADING',
        'SUCCESS' = 'SUCCESS',
        'ERROR' = 'ERROR',
      }

      type ExecOptions = { withFallback: boolean };

      const exec = (union: Union, options?: ExecOptions) =>
        exhaustive(union, {
          IDLE: (value) => {
            expectTypeOf(value).toEqualTypeOf<Union.IDLE>();

            return value.toLowerCase();
          },
          LOADING: (value) => {
            expectTypeOf(value).toEqualTypeOf<Union.LOADING>();

            return value.toLowerCase();
          },
          SUCCESS: (value) => {
            expectTypeOf(value).toEqualTypeOf<Union.SUCCESS>();

            return value.toLowerCase();
          },
          ERROR: (value) => {
            expectTypeOf(value).toEqualTypeOf<Union.ERROR>();

            return value.toLowerCase();
          },
          ...(options?.withFallback ?
            {
              _: (value) => {
                expectTypeOf(value).toEqualTypeOf<never>();

                return '🚨';
              },
            }
          : {}),
        });

      const eachCase = it.each<Union>([
        Union.IDLE,
        Union.LOADING,
        Union.SUCCESS,
        Union.ERROR,
      ]);

      eachCase('returns the lower cased value for "%s"', (value) => {
        expect(exec(value)).toBe(value.toLowerCase());
      });

      describe('when no fallback is declared', () => {
        it('throws an exception when an invalid value is passed through', () => {
          expect(() => exec('unknown' as never)).toThrow(TypeError);
        });
      });

      describe('when a fallback is declared', () => {
        it('returns the declared fallback value', () => {
          expect(exec('unknown' as never, { withFallback: true })).toBe('🚨');
        });
      });
    });

    describe('when used with a boolean', () => {
      type Condition = boolean;

      type ExecOptions = { withFallback: boolean };

      const exec = (condition: Condition, options?: ExecOptions) =>
        exhaustive(condition, {
          true: (value) => {
            expectTypeOf(value).toEqualTypeOf<true>();

            return value.toString();
          },
          false: (value) => {
            expectTypeOf(value).toEqualTypeOf<false>();

            return value.toString();
          },
          ...(options?.withFallback ? { _: () => '🚨' } : {}),
        });

      const eachCase = it.each<boolean>([true, false]);

      eachCase('returns the stringified value for "%s"', (value) => {
        expect(exec(value)).toBe(value.toString());
      });

      describe('when no fallback is declared', () => {
        it('throws an exception when an invalid value is passed through', () => {
          expect(() => exec('unknown' as never)).toThrow(TypeError);
        });
      });

      describe('when a fallback is declared', () => {
        it('returns the declared fallback value', () => {
          expect(exec('unknown' as never, { withFallback: true })).toBe('🚨');
        });
      });
    });
  });

  describe('when used with three arguments', () => {
    it('has the correct types', () => {
      type TaggedUnion =
        | { state: 'IDLE' }
        | { state: 'LOADING' }
        | { state: 'SUCCESS'; data: string }
        | { state: 'ERROR'; error: string };

      function withMissingRequiredProperties(union: TaggedUnion) {
        // @ts-expect-error missing required properties
        return exhaustive(union, 'state', {
          IDLE: (value) => value.state.toLowerCase(),
        });
      }

      expectTypeOf(withMissingRequiredProperties).toEqualTypeOf<
        (union: TaggedUnion) => unknown
      >();

      function withUnknownProperties(union: TaggedUnion) {
        return exhaustive(union, 'state', {
          IDLE: (value) => value.state.toLowerCase(),
          ERROR: (value) => value.state.toLowerCase(),
          LOADING: (value) => value.state.toLowerCase(),
          SUCCESS: (value) => value.state.toLowerCase(),
          // @ts-expect-error unknown property
          extra: (value) => value.state.toLowerCase(),
        });
      }

      expectTypeOf(withUnknownProperties).toEqualTypeOf<
        (union: TaggedUnion) => unknown
      >();

      function withInferredReturn(union: TaggedUnion) {
        return exhaustive(union, 'state', {
          IDLE: (value) => value.state.toLowerCase(),
          LOADING: (value) => value.state.toLowerCase(),
          SUCCESS: (value) => value.state.toLowerCase(),
          ERROR: (value) => value.state.toLowerCase(),
        });
      }

      expectTypeOf(withInferredReturn).toEqualTypeOf<
        (union: TaggedUnion) => string
      >();

      type LowerState = Lowercase<TaggedUnion['state']>;

      function withTypedReturn(union: TaggedUnion): LowerState {
        return exhaustive(union, 'state', {
          IDLE: () => 'idle',
          LOADING: () => 'loading',
          SUCCESS: () => 'success',
          // @ts-expect-error value should be of type LowerUnion, but is of type string
          ERROR: (value) => value.toLowerCase(),
        });
      }

      expectTypeOf(withTypedReturn).toEqualTypeOf<
        (union: TaggedUnion) => LowerState
      >();
    });

    describe('when used with a discriminated union', () => {
      type TaggedUnion =
        | { state: 'IDLE' }
        | { state: 'LOADING' }
        | { state: 'SUCCESS'; data: string }
        | { state: 'ERROR'; error: string };

      type ExecOptions = { withFallback: boolean };

      const exec = (union: TaggedUnion, options?: ExecOptions) =>
        exhaustive(union, 'state', {
          IDLE: (value) => {
            expectTypeOf(value).toEqualTypeOf<{ state: 'IDLE' }>();

            return value.state.toLowerCase();
          },
          LOADING: (value) => {
            expectTypeOf(value).toEqualTypeOf<{ state: 'LOADING' }>();

            return value.state.toLowerCase();
          },
          SUCCESS: (value) => {
            expectTypeOf(value).toEqualTypeOf<{
              state: 'SUCCESS';
              data: string;
            }>();

            return value.state.toLowerCase();
          },
          ERROR: (value) => {
            expectTypeOf(value).toEqualTypeOf<{
              state: 'ERROR';
              error: string;
            }>();

            return value.state.toLowerCase();
          },
          ...(options?.withFallback ?
            {
              _: (value) => {
                expectTypeOf(value).toEqualTypeOf<never>();

                return '🚨';
              },
            }
          : {}),
        });

      const eachCase = it.each<TaggedUnion>([
        { state: 'IDLE' },
        { state: 'LOADING' },
        { state: 'SUCCESS', data: '✅' },
        { state: 'ERROR', error: '❌' },
      ]);

      eachCase(
        'returns the lower cased value of the discriminator for "%s"',
        (value) => {
          expect(exec(value)).toBe(value.state.toLowerCase());
        },
      );

      describe('when no fallback is declared', () => {
        it('throws an exception when an invalid value is passed through', () => {
          expect(() => exec('unknown' as never)).toThrow(TypeError);
        });
      });

      describe('when a fallback is declared', () => {
        it('returns the declared fallback value', () => {
          expect(exec('unknown' as never, { withFallback: true })).toBe('🚨');
        });
      });
    });

    describe('when used with a discriminated union whose values are booleans', () => {
      type TaggedUnion =
        | { checked: true; data: string }
        | { checked: false; error: string };

      type ExecOptions = { withFallback: boolean };

      const exec = (union: TaggedUnion, options?: ExecOptions) =>
        exhaustive(union, 'checked', {
          true: (value) => {
            expectTypeOf(value).toEqualTypeOf<{
              checked: true;
              data: string;
            }>();

            return value.checked.toString();
          },
          false: (value) => {
            expectTypeOf(value).toEqualTypeOf<{
              checked: false;
              error: string;
            }>();

            return value.checked.toString();
          },
          ...(options?.withFallback ?
            {
              _: (value) => {
                expectTypeOf(value).toEqualTypeOf<never>();

                return '🚨';
              },
            }
          : {}),
        });

      const eachCase = it.each<TaggedUnion>([
        { checked: true, data: '✅' },
        { checked: false, error: '❌' },
      ]);

      eachCase(
        'returns the lower cased value of the discriminator for "%s"',
        (value) => {
          expect(exec(value)).toBe(value.checked.toString());
        },
      );

      describe('when no fallback is declared', () => {
        it('throws an exception when an invalid value is passed through', () => {
          expect(() => exec('unknown' as never)).toThrow(TypeError);
        });
      });

      describe('when a fallback is declared', () => {
        it('returns the declared fallback value', () => {
          expect(exec('unknown' as never, { withFallback: true })).toBe('🚨');
        });
      });
    });
  });
});

describe('exhaustive.tag', () => {
  it('has the correct types', () => {
    type TaggedUnion =
      | { state: 'IDLE' }
      | { state: 'LOADING' }
      | { state: 'SUCCESS'; data: string }
      | { state: 'ERROR'; error: string };

    function withMissingRequiredProperties(union: TaggedUnion) {
      // @ts-expect-error missing required properties
      return exhaustive.tag(union, 'state', {
        IDLE: (value) => value.state.toLowerCase(),
      });
    }

    expectTypeOf(withMissingRequiredProperties).toEqualTypeOf<
      (union: TaggedUnion) => unknown
    >();

    function withUnknownProperties(union: TaggedUnion) {
      return exhaustive.tag(union, 'state', {
        IDLE: (value) => value.state.toLowerCase(),
        ERROR: (value) => value.state.toLowerCase(),
        LOADING: (value) => value.state.toLowerCase(),
        SUCCESS: (value) => value.state.toLowerCase(),
        // @ts-expect-error unknown property
        extra: (value) => value.state.toLowerCase(),
      });
    }

    expectTypeOf(withUnknownProperties).toEqualTypeOf<
      (union: TaggedUnion) => unknown
    >();

    function withInferredReturn(union: TaggedUnion) {
      return exhaustive.tag(union, 'state', {
        IDLE: (value) => value.state.toLowerCase(),
        LOADING: (value) => value.state.toLowerCase(),
        SUCCESS: (value) => value.state.toLowerCase(),
        ERROR: (value) => value.state.toLowerCase(),
      });
    }

    expectTypeOf(withInferredReturn).toEqualTypeOf<
      (union: TaggedUnion) => string
    >();

    type LowerState = Lowercase<TaggedUnion['state']>;

    function withTypedReturn(union: TaggedUnion): LowerState {
      return exhaustive.tag(union, 'state', {
        IDLE: () => 'idle',
        LOADING: () => 'loading',
        SUCCESS: () => 'success',
        // @ts-expect-error value should be of type LowerUnion, but is of type string
        ERROR: (value) => value.toLowerCase(),
      });
    }

    expectTypeOf(withTypedReturn).toEqualTypeOf<
      (union: TaggedUnion) => LowerState
    >();
  });

  describe('when used with a discriminated union', () => {
    type TaggedUnion =
      | { state: 'IDLE' }
      | { state: 'LOADING' }
      | { state: 'SUCCESS'; data: string }
      | { state: 'ERROR'; error: string };

    type ExecOptions = { withFallback: boolean };

    const exec = (union: TaggedUnion, options?: ExecOptions) =>
      exhaustive.tag(union, 'state', {
        IDLE: (value) => {
          expectTypeOf(value).toEqualTypeOf<{ state: 'IDLE' }>();

          return value.state.toLowerCase();
        },
        LOADING: (value) => {
          expectTypeOf(value).toEqualTypeOf<{ state: 'LOADING' }>();

          return value.state.toLowerCase();
        },
        SUCCESS: (value) => {
          expectTypeOf(value).toEqualTypeOf<{
            state: 'SUCCESS';
            data: string;
          }>();

          return value.state.toLowerCase();
        },
        ERROR: (value) => {
          expectTypeOf(value).toEqualTypeOf<{
            state: 'ERROR';
            error: string;
          }>();

          return value.state.toLowerCase();
        },
        ...(options?.withFallback ?
          {
            _: (value) => {
              expectTypeOf(value).toEqualTypeOf<never>();

              return '🚨';
            },
          }
        : {}),
      });

    const eachCase = it.each<TaggedUnion>([
      { state: 'IDLE' },
      { state: 'LOADING' },
      { state: 'SUCCESS', data: '✅' },
      { state: 'ERROR', error: '❌' },
    ]);

    eachCase(
      'returns the lower cased value of the discriminator for "%s"',
      (value) => {
        expect(exec(value)).toBe(value.state.toLowerCase());
      },
    );

    describe('when no fallback is declared', () => {
      it('throws an exception when an invalid value is passed through', () => {
        expect(() => exec('unknown' as never)).toThrow(TypeError);
      });
    });

    describe('when a fallback is declared', () => {
      it('returns the declared fallback value', () => {
        expect(exec('unknown' as never, { withFallback: true })).toBe('🚨');
      });
    });
  });

  describe('when used with a discriminated union whose values are booleans', () => {
    type TaggedUnion =
      | { checked: true; data: string }
      | { checked: false; error: string };

    type ExecOptions = { withFallback: boolean };

    const exec = (union: TaggedUnion, options?: ExecOptions) =>
      exhaustive.tag(union, 'checked', {
        true: (value) => {
          expectTypeOf(value).toEqualTypeOf<{
            checked: true;
            data: string;
          }>();

          return value.checked.toString();
        },
        false: (value) => {
          expectTypeOf(value).toEqualTypeOf<{
            checked: false;
            error: string;
          }>();

          return value.checked.toString();
        },
        ...(options?.withFallback ?
          {
            _: (value) => {
              expectTypeOf(value).toEqualTypeOf<never>();

              return '🚨';
            },
          }
        : {}),
      });

    const eachCase = it.each<TaggedUnion>([
      { checked: true, data: '✅' },
      { checked: false, error: '❌' },
    ]);

    eachCase(
      'returns the lower cased value of the discriminator for "%s"',
      (value) => {
        expect(exec(value)).toBe(value.checked.toString());
      },
    );

    describe('when no fallback is declared', () => {
      it('throws an exception when an invalid value is passed through', () => {
        expect(() => exec('unknown' as never)).toThrow(TypeError);
      });
    });

    describe('when a fallback is declared', () => {
      it('returns the declared fallback value', () => {
        expect(exec('unknown' as never, { withFallback: true })).toBe('🚨');
      });
    });
  });
});
