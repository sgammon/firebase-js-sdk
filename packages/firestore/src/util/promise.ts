/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export interface Resolver<R> {
  (value?: R | Promise<R>): void;
}

export interface Rejecter {
  (reason?: Error): void;
}

export interface CancelablePromise<T> {
  // We are not extending Promise, since Node's Promise API require us to
  // implement 'finally', which is not fully supported on Web.
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult>;
  cancel(): void;
}

export class Deferred<R> {
  private promise = new Promise((resolve: Resolver<R>, reject: Rejecter) => {
    this.resolve = resolve;
    this.reject = reject;
  });
  resolve!: Resolver<R>;
  reject!: Rejecter;
  readonly [Symbol.toStringTag]: 'Promise';
  then = this.promise.then.bind(this.promise);
  catch = this.promise.catch.bind(this.promise);

  finally(onfinally?: (() => void) | undefined | null): Promise<R> {
    // Unlike the assignments above, `finally` is implemented as an override 
    // since `finally` support is only available in environments that support 
    // ES2018.
    return this.promise.finally(onfinally);
  }
}

/**
 * Takes an array of values and a function from a value to a Promise. The function is run on each
 * value sequentially, waiting for the previous promise to resolve before starting the next one.
 * The returned promise resolves once the function has been run on all values.
 */
export function sequence<T>(
  values: T[],
  fn: (value: T) => Promise<void>
): Promise<void> {
  let p = Promise.resolve();
  for (const value of values) {
    p = p.then(() => fn(value));
  }
  return p;
}
