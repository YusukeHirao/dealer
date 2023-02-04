import { test, expect } from '@jest/globals';

import { countDownFunctionParser } from '../esm/countDownFunctionParser.js';

test('Succeed', () => {
  expect(countDownFunctionParser('ABC%countDown(10000,a)%')).toStrictEqual({
    id: 'a',
    time: 10000,
    placeholder: '%countDown(10000,a)%',
    unit: 'ms',
  });
});

test('Succeed Unit:s', () => {
  expect(countDownFunctionParser('ABC%countDown(3000 , a , s)%')).toStrictEqual(
    {
      id: 'a',
      time: 3000,
      placeholder: '%countDown(3000 , a , s)%',
      unit: 's',
    }
  );
});

test('Failed', () => {
  expect(countDownFunctionParser('ABC%countDown(10000)%')).toBeNull();
});
