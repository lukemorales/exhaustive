import { exhaustive } from './exhaustive';

describe('exhaustive', () => {
  describe('when used with two arguments', () => {
    describe('when used with a union of strings', () => {
      type Union = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

      type ExecOptions = { withFallback: boolean };

      const exec = (union: Union, options?: ExecOptions) =>
        exhaustive(union, {
          IDLE: (value) => value.toLowerCase(),
          LOADING: (value) => value.toLowerCase(),
          SUCCESS: (value) => value.toLowerCase(),
          ERROR: (value) => value.toLowerCase(),
          ...(options?.withFallback ? { _: () => '🚨' } : {}),
        });

      const eachCase = it.each([
        'IDLE',
        'LOADING',
        'SUCCESS',
        'ERROR',
      ] as const);

      eachCase('returns the lower cased value for "%s"', (value) => {
        expect(exec(value)).toBe(value.toLowerCase());
      });

      describe('when no fallback is declared', () => {
        it('throws an exception when an invalid value is passed through', () => {
          expect(() => exec('unknown' as any)).toThrow(TypeError);
        });
      });

      describe('when a fallback is declared', () => {
        it('returns the declared fallback value', () => {
          expect(exec('unknown' as any, { withFallback: true })).toBe('🚨');
        });
      });
    });

    describe('when used with an enum', () => {
      enum Union {
        'IDLE' = 'IDLE',
        'LOADING' = 'LOADING',
        'SUCCESS' = 'SUCCESS',
        'ERROR' = 'ERROR',
      }

      type ExecOptions = { withFallback: boolean };

      const exec = (union: Union, options?: ExecOptions) =>
        exhaustive(union, {
          IDLE: (value) => value.toLowerCase(),
          LOADING: (value) => value.toLowerCase(),
          SUCCESS: (value) => value.toLowerCase(),
          ERROR: (value) => value.toLowerCase(),
          ...(options?.withFallback ? { _: () => '🚨' } : {}),
        });

      const eachCase = it.each([
        Union.IDLE,
        Union.LOADING,
        Union.SUCCESS,
        Union.ERROR,
      ] as const);

      eachCase('returns the lower cased value for "%s"', (value) => {
        expect(exec(value)).toBe(value.toLowerCase());
      });

      describe('when no fallback is declared', () => {
        it('throws an exception when an invalid value is passed through', () => {
          expect(() => exec('unknown' as any)).toThrow(TypeError);
        });
      });

      describe('when a fallback is declared', () => {
        it('returns the declared fallback value', () => {
          expect(exec('unknown' as any, { withFallback: true })).toBe('🚨');
        });
      });
    });
  });

  describe('when used with three arguments', () => {
    describe('when used with a discriminated union', () => {
      type TaggedUnion =
        | { state: 'IDLE' }
        | { state: 'LOADING' }
        | { state: 'SUCCESS'; data: string }
        | { state: 'ERROR'; error: string };

      type ExecOptions = { withFallback: boolean };

      const exec = (union: TaggedUnion, options?: ExecOptions) =>
        exhaustive(union, 'state', {
          IDLE: (value) => value.state.toLowerCase(),
          LOADING: (value) => value.state.toLowerCase(),
          SUCCESS: (value) => value.state.toLowerCase(),
          ERROR: (value) => value.state.toLowerCase(),
          ...(options?.withFallback ? { _: () => '🚨' } : {}),
        });

      const eachCase = it.each([
        { state: 'IDLE' },
        { state: 'LOADING' },
        { state: 'SUCCESS', data: '✅' },
        { state: 'ERROR', error: '❌' },
      ] as TaggedUnion[]);

      eachCase(
        'returns the lower cased value of the discriminator for "%s"',
        (value) => {
          expect(exec(value)).toBe(value.state.toLowerCase());
        },
      );

      describe('when no fallback is declared', () => {
        it('throws an exception when an invalid value is passed through', () => {
          expect(() => exec('unknown' as any)).toThrow(TypeError);
        });
      });

      describe('when a fallback is declared', () => {
        it('returns the declared fallback value', () => {
          expect(exec('unknown' as any, { withFallback: true })).toBe('🚨');
        });
      });
    });
  });
});

describe('exhaustive._tag', () => {
  describe('when used with a discriminated union', () => {
    type TaggedUnion =
      | { state: 'IDLE' }
      | { state: 'LOADING' }
      | { state: 'SUCCESS'; data: string }
      | { state: 'ERROR'; error: string };

    type ExecOptions = { withFallback: boolean };

    const exec = (union: TaggedUnion, options?: ExecOptions) =>
      exhaustive._tag(union, 'state', {
        IDLE: (value) => value.state.toLowerCase(),
        LOADING: (value) => value.state.toLowerCase(),
        SUCCESS: (value) => value.state.toLowerCase(),
        ERROR: (value) => value.state.toLowerCase(),
        ...(options?.withFallback ? { _: () => '🚨' } : {}),
      });

    const eachCase = it.each([
      { state: 'IDLE' },
      { state: 'LOADING' },
      { state: 'SUCCESS', data: '✅' },
      { state: 'ERROR', error: '❌' },
    ] as TaggedUnion[]);

    eachCase(
      'returns the lower cased value of the discriminator for "%s"',
      (value) => {
        expect(exec(value)).toBe(value.state.toLowerCase());
      },
    );

    describe('when no fallback is declared', () => {
      it('throws an exception when an invalid value is passed through', () => {
        expect(() => exec('unknown' as any)).toThrow(TypeError);
      });
    });

    describe('when a fallback is declared', () => {
      it('returns the declared fallback value', () => {
        expect(exec('unknown' as any, { withFallback: true })).toBe('🚨');
      });
    });
  });
});
