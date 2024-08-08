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

```ts {6,10}
import { packageInstallTask, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    packageInstallTask(),

    // Using chainable
    workspace()
      .packageInstallTask()
      .toRule()
  ]);
```

### `addPackageJsonDependencies`

Adds items to the `dependencies` section of `package.json` file.

```ts {6,11}
import { addPackageJsonDependencies, packageInstallTask, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addPackageJsonDependencies([ '@my/dep', { name: 'my-dep', version: '1.0.0' } ]),
    packageInstallTask(),

    // Using chainable
    workspace()
      .addPackageJsonDependencies([ '@my/dep', { name: 'my-dep', version: '1.0.0' } ])
      .packageInstallTask()
      .toRule()
  ]);
```

### `addPackageJsonDevDependencies`

Adds items to the `devDependencies` section of `package.json` file.

```ts {6,11}
import { addPackageJsonDevDependencies, packageInstallTask, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addPackageJsonDevDependencies([ '@my/dev-dep', { name: 'my-dev-dep', version: '1.0.0' } ]),
    packageInstallTask(),

    // Using chainable
    workspace()
      .addPackageJsonDevDependencies([ '@my/dev-dep', { name: 'my-dev-dep', version: '1.0.0' } ])
      .packageInstallTask()
      .toRule()
  ]);
```

### `addPackageJsonPeerDependencies`

Adds items to the `peerDependencies` section of `package.json` file.

```ts {6,11}
import { addPackageJsonPeerDependencies, packageInstallTask, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    addPackageJsonPeerDependencies([ '@my/peer-dep', { name: 'my-peer-dep', version: '1.0.0' } ]),
    packageInstallTask(),

    // Using chainable
    workspace()
      addPackageJsonPeerDependencies([ '@my/peer-dep', { name: 'my-peer-dep', version: '1.0.0' } ])
      .packageInstallTask()
      .toRule()
  ]);
```

### `removePackageJsonDependencies`

Removes items from the `dependencies` section of `package.json` file.

```ts {6,11}
import { removePackageJsonDependencies, packageInstallTask, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removePackageJsonDependencies([ '@my/dep', { name: 'my-dep', version: '1.0.0' } ]),
    packageInstallTask(),

    // Using chainable
    workspace()
      .removePackageJsonDependencies([ '@my/dep', { name: 'my-dep', version: '1.0.0' } ])
      .packageInstallTask()
      .toRule()
  ]);
```

### `removePackageJsonDevDependencies`

Removes items from the `devDependencies` section of `package.json` file.

```ts {6,11}
import { removePackageJsonDevDependencies, packageInstallTask, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removePackageJsonDevDependencies([ '@my/dev-dep', { name: 'my-dev-dep', version: '1.0.0' } ]),
    packageInstallTask(),

    // Using chainable
    workspace()
      .removePackageJsonDevDependencies([ '@my/dev-dep', { name: 'my-dev-dep', version: '1.0.0' } ])
      .packageInstallTask()
      .toRule()
  ]);
```

### `removePackageJsonPeerDependencies`

Removes items from the `peerDependencies` section of `package.json` file.

```ts {6,11}
import { removePackageJsonPeerDependencies, packageInstallTask, schematic, workspace } from '@hug/ngx-schematics-utilities';
import { Rule } from '@angular-devkit/schematics';

export default (options: any): Rule =>
  schematic('my-schematic', [
    removePackageJsonPeerDependencies([ '@my/peer-dep', { name: 'my-peer-dep', version: '1.0.0' } ]),
    packageInstallTask(),

    // Using chainable
    workspace()
      .removePackageJsonPeerDependencies([ '@my/peer-dep', { name: 'my-peer-dep', version: '1.0.0' } ])
      .packageInstallTask()
      .toRule()
  ]);
```
