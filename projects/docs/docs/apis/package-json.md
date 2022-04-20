---
title: Package.json
---

## Rules

### `packageInstallTask`

Triggers a package installation task using the user's preferred package manager.

:::note Note
By default the installation will only occur if any packages were previously added or removed to/from the `package.json` file.<br/>
This default behavior can be bypassed by setting the `force` parameter to `true`.
:::

```ts {6}
import { packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    packageInstallTask()
  ]);
```

### `addPackageJsonDependencies`

Adds items to the `dependencies` section of `package.json` file.

```ts {6}
import { addPackageJsonDependencies, packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addPackageJsonDependencies([ '@my/dep', { name: 'my-dep', version: '1.0.0' } ]),
    packageInstallTask()
  ]);
```

### `addPackageJsonDevDependencies`

Adds items to the `devDependencies` section of `package.json` file.

```ts {6}
import { addPackageJsonDevDependencies, packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addPackageJsonDevDependencies([ '@my/dev-dep', { name: 'my-dev-dep', version: '1.0.0' } ]),
    packageInstallTask()
  ]);
```

### `addPackageJsonPeerDependencies`

Adds items to the `peerDependencies` section of `package.json` file.

```ts {6}
import { addPackageJsonPeerDependencies, packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addPackageJsonPeerDependencies([ '@my/peer-dep', { name: 'my-peer-dep', version: '1.0.0' } ]),
    packageInstallTask()
  ]);
```

### `removePackageJsonDependencies`

Removes items from the `dependencies` section of `package.json` file.

```ts {6}
import { removePackageJsonDependencies, packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removePackageJsonDependencies([ '@my/dep', { name: 'my-dep', version: '1.0.0' } ]),
    packageInstallTask()
  ]);
```

### `removePackageJsonDevDependencies`

Removes items from the `devDependencies` section of `package.json` file.

```ts {6}
import { removePackageJsonDevDependencies, packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removePackageJsonDevDependencies([ '@my/dev-dep', { name: 'my-dev-dep', version: '1.0.0' } ]),
    packageInstallTask()
  ]);
```

### `removePackageJsonPeerDependencies`

Removes items from the `peerDependencies` section of `package.json` file.

```ts {6}
import { removePackageJsonPeerDependencies, packageInstallTask, schematic } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removePackageJsonPeerDependencies([ '@my/peer-dep', { name: 'my-peer-dep', version: '1.0.0' } ]),
    packageInstallTask()
  ]);
```
