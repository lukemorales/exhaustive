import { corrupt } from './corrupt';

describe('unreachable', () => {
  it('handles "undefined"', () => {
    expect(() =>
      corrupt(undefined as never),
    ).toThrowErrorMatchingInlineSnapshot(
      '"Internal Error: encountered impossible value \\"undefined\\""',
    );
  });

  it('handles "null', () => {
    expect(() => corrupt(null as never)).toThrowErrorMatchingInlineSnapshot(
      '"Internal Error: encountered impossible value \\"null\\""',
    );
  });

  it('handles strings', () => {
    expect(() =>
      corrupt('corrupt' as never),
    ).toThrowErrorMatchingInlineSnapshot(
      '"Internal Error: encountered impossible value \\"corrupt\\""',
    );
  });

  it('handles objects', () => {
    expect(() =>
      corrupt({ key: 'corrupt' } as never),
    ).toThrowErrorMatchingInlineSnapshot(
      '"Internal Error: encountered impossible value \\"{\\"key\\":\\"corrupt\\"}\\""',
    );
  });

  it('handles circular objects', () => {
    const obj = { corrupt: {} };
    obj.corrupt = obj;

    expect(() => corrupt(obj as never)).toThrowErrorMatchingInlineSnapshot(
      '"Internal Error: encountered impossible value \\"circular object\\""',
    );
  });

  it('handles arrays', () => {
    expect(() =>
      corrupt(['corrupt'] as never),
    ).toThrowErrorMatchingInlineSnapshot(
      '"Internal Error: encountered impossible value \\"[\\"corrupt\\"]\\""',
    );
  });

  it('handles BigInt', () => {
    expect(() =>
      corrupt(BigInt(1) as never),
    ).toThrowErrorMatchingInlineSnapshot(
      '"Internal Error: encountered impossible value \\"1 (bigint)\\""',
    );
  });

  it('handles Symbol', () => {
    expect(() =>
      corrupt(Symbol('corrupt') as never),
    ).toThrowErrorMatchingInlineSnapshot(
      '"Internal Error: encountered impossible value \\"Symbol(corrupt)\\""',
    );
  });

  it('throws an unexpected error if failing to stringify value', () => {
    vi.spyOn(global.JSON, 'stringify').mockImplementation(() => {
      throw new Error('Unexpected error: failed to stringify value');
    });

    expect(() => corrupt({} as never)).toThrowErrorMatchingInlineSnapshot(
      '"Unexpected error: failed to stringify value"',
    );
  });
});
