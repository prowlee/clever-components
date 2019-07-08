export class LastPromiseValue {

  constructor (onChange) {
    this._onChange = onChange;
    this._abortControllers = [];
  }

  push (promise, abort) {
    this._lastPromise = promise;
    if (this._lastAbort) {
      this._lastAbort();
    }
    this._lastAbort = abort;
    promise
      .then((result) => {
        if (promise === this._lastPromise) {
          this._onChange(null, result);
          this._lastAbort = null;
        }
      })
      .catch((error) => {
        if (promise === this._lastPromise) {
          this._onChange(error);
          this._lastAbort = null;
        }
      });
  }
}

function sameArray (arrayA, arrayB) {
  if (arrayA.length !== arrayB.length) {
    return false;
  }
  if (arrayA.some((a, i) => a !== arrayB[i])) {
    return false;
  }
  return true;
}

export function memoLast (theFunction) {

  let lastArgs = [];
  let lastResult;

  return function (...newArgs) {

    if (sameArray(newArgs, lastArgs)) {
      return lastResult;
    }

    lastArgs = newArgs;
    lastResult = theFunction.apply(this, newArgs);

    return lastResult;
  };
}

export function memoizeMethods (theClass, ...allMethods) {
  for (let method of allMethods) {
    theClass.prototype[method.name] = memoLast(method);
  }
}
