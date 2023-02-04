import c from 'ansi-colors';

import { Dealer } from '../esm/index.js';

const dealer = new Dealer({
  sort: ([a], [b]) => a - b,
});

dealer.header(`${c.red.bold('Header')} %earth% %dots%`);

// eslint-disable-next-line no-constant-condition
while (true) {
  await delay(300);
  const time = new Date().getSeconds();
  const id = time % 10;
  switch (id) {
    case 1: {
      dealer.push(
        id,
        `%dots% %propeller% ${Math.random() + id} %countDown(20000,${id},s)%s`
      );
      break;
    }
    case 5: {
      dealer.push(
        id,
        `%dots% %propeller% ${Math.random() + id} %countDown(10000,${id})%ms`
      );
      break;
    }
    default: {
      dealer.push(id, `%dots% %propeller% ${Math.random() + id}`);
    }
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
