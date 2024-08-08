---
title: Request
---

## Helpers

### `getDataFromUrl`

Returns the response data of a given url as a buffer object.

```ts {8}
import { getDataFromUrl, schematic, rule } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    rule((): Rule => {
      const url = 'https://my-data-source-url';
      const data = await getDataFromUrl(url);
      ...
    })
  ]);
```

### `getJsonFromUrl`

Returns the response data of a given url as a JSON object.

```ts {8}
import { getJsonFromUrl, schematic, rule } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    rule((): Rule => {
      const url = 'https://cdn.jsdelivr.net/npm/@angular/core@latest/package.json';
      const packageJson = await getJsonFromUrl(url);
      ...
    })
  ]);
```
