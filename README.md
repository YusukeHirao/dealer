# Dealer

Deal commands and logs parallel.

## Install

```shell
npm i -D @yusukehirao/dealer

yarn add -D @yusukehirao/dealer
```

## API

```ts
import { Dealer } from '@yusukehirao/dealer';

const dealer = new Dealer({
  fps: 30,
  indent: 2,
});

dealer.header('Command title and description');

objects.forEach((object) => {
  objects.addListener('eventType', (event) => {
    dealer.push(object.id, `%propeller% ${event.type} ${event.message}`);
  });
});
```
