import * as assert from "assert";

// from https://github.com/piotrwitek/utility-types
type NonUndefined<T> = T extends undefined ? never : T;

function assertUnwrap<T>(
  value: NonUndefined<T> | undefined,
  f: (v: NonUndefined<T>) => void
): void {
  if (value) {
    const unwrapped: NonUndefined<T> = value;
    f(unwrapped);
    return;
  }
  assert.fail("failure unwrapping");
}

export { assertUnwrap, NonUndefined };
