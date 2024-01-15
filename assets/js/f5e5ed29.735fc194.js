"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[337],{7320:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>r,toc:()=>a});var s=i(5893),t=i(1151);const o={title:"File"},l=void 0,r={id:"apis/file",title:"File",description:"Rules",source:"@site/docs/apis/file.md",sourceDirName:"apis",slug:"/apis/file",permalink:"/ngx-schematics-utilities/apis/file",draft:!1,unlisted:!1,editUrl:"https://github.com/dsi-hug/ngx-schematics-utilities/edit/main/docs/docs/apis/file.md",tags:[],version:"current",frontMatter:{title:"File"},sidebar:"docs",previous:{title:"Core",permalink:"/ngx-schematics-utilities/apis/core"},next:{title:"Angular",permalink:"/ngx-schematics-utilities/apis/angular"}},c={},a=[{value:"Rules",id:"rules",level:2},{value:"<code>deployFiles</code>",id:"deployfiles",level:3},{value:"<code>deleteFiles</code>",id:"deletefiles",level:3},{value:"<code>renameFile</code>",id:"renamefile",level:3},{value:"<code>createOrUpdateFile</code>",id:"createorupdatefile",level:3},{value:"<code>downloadFile</code>",id:"downloadfile",level:3},{value:"<code>replaceInFile</code>",id:"replaceinfile",level:3},{value:"<code>addImportToFile</code>",id:"addimporttofile",level:3},{value:"<code>modifyImportInFile</code>",id:"modifyimportinfile",level:3},{value:"<code>removeImportFromFile</code>",id:"removeimportfromfile",level:3},{value:"<code>modifyJsonFile</code>",id:"modifyjsonfile",level:3},{value:"<code>removeFromJsonFile</code>",id:"removefromjsonfile",level:3},{value:"Helpers",id:"helpers",level:2},{value:"<code>serializeToJson</code>",id:"serializetojson",level:3},{value:"<code>getTsSourceFile</code>",id:"gettssourcefile",level:3},{value:"<code>commitChanges</code>",id:"commitchanges",level:3}];function d(e){const n={admonition:"admonition",code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,t.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h2,{id:"rules",children:"Rules"}),"\n",(0,s.jsx)(n.h3,{id:"deployfiles",children:(0,s.jsx)(n.code,{children:"deployFiles"})}),"\n",(0,s.jsx)(n.p,{children:"Deploys assets files and optionally applies computation to them."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{7,10,13,16}",children:"import { deployFiles, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // By default: deploy schematic `./files` folder into project root folder\n    deployFiles(),\n\n    // Use defaults but also apply computation to `*.template` files\n    deployFiles(options),\n\n    // Use a different source folder\n    deployFiles(undefined, './my-files'),\n\n    // Use a different destination folder\n    deployFiles(undefined, './files', './my-dest-folder'),\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"deletefiles",children:(0,s.jsx)(n.code,{children:"deleteFiles"})}),"\n",(0,s.jsx)(n.p,{children:"Deletes a collection of files or folders"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{6-9,12}",children:"import { deleteFiles, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    deleteFiles([\n      'src/assets/.gitkeep',\n      'src/app/app.component.spec.ts'\n    ]),\n\n    // Folder deletion needs to be forced\n    deleteFiles(['src'], true)\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"renamefile",children:(0,s.jsx)(n.code,{children:"renameFile"})}),"\n",(0,s.jsx)(n.p,{children:"Rename a file"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{6}",children:"import { renameFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    renameFile('src/old/a.ts', 'src/new/b.ts')\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"createorupdatefile",children:(0,s.jsx)(n.code,{children:"createOrUpdateFile"})}),"\n",(0,s.jsx)(n.p,{children:"Creates or updates a file."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{6}",children:"import { createOrUpdateFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    createOrUpdateFile('README.md', 'My readme content')\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"downloadfile",children:(0,s.jsx)(n.code,{children:"downloadFile"})}),"\n",(0,s.jsx)(n.p,{children:"Downloads a file."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{9-12}",children:"import { downloadFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { chain, Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    (): Rule => {\n      const sizes = ['72', '96', '128', '144', '152', '192', '384', '512'];\n      return chain(\n        sizes.map(size => downloadFile(\n          `https://my-cdn.com/icons/icon-${size}x${size}.png`,\n          `src/assets/icons/icon-${size}x${size}.png`\n        ))\n      );\n    }\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"replaceinfile",children:(0,s.jsx)(n.code,{children:"replaceInFile"})}),"\n",(0,s.jsx)(n.p,{children:"Replaces text in a file, using a regular expression or a search string."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{6}",children:"import { replaceInFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    replaceInFile('.editorconfig', /(indent_size = )(.*)/gm, '$14')\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"addimporttofile",children:(0,s.jsx)(n.code,{children:"addImportToFile"})}),"\n",(0,s.jsx)(n.p,{children:"Adds an import to a file."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{7,10}",children:"import { addImportToFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // ES format : `import { environment } from './environments/environment';`\n    addImportToFile('src/main.ts', 'environment', './environments/environment'),\n\n    // Default format : `import packageJson from 'package.json';`\n    addImportToFile('src/main.ts', 'packageJson', 'package.json', true)\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"modifyimportinfile",children:(0,s.jsx)(n.code,{children:"modifyImportInFile"})}),"\n",(0,s.jsx)(n.p,{children:"Modifies or removes an import inside a file."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{7,10}",children:"import { modifyImportInFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // Rename an import\n    modifyImportInFile('src/main.ts', 'name', 'newName', 'src/my-file');\n\n    // Remove an import\n    modifyImportInFile('src/main.ts', 'environment', undefined, 'src/environments/environment');\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"removeimportfromfile",children:(0,s.jsx)(n.code,{children:"removeImportFromFile"})}),"\n",(0,s.jsx)(n.p,{children:"Removes an import inside a file."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{6}",children:"import { modifyImportInFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    removeImportFromFile('src/main.ts', 'environment', 'src/environments/environment');\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"modifyjsonfile",children:(0,s.jsx)(n.code,{children:"modifyJsonFile"})}),"\n",(0,s.jsx)(n.p,{children:"Adds, modifies or removes an element in a JSON file."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{7,10,13}",children:"import { modifyJsonFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // Add or update an element\n    modifyJsonFile('tsconfig.json', ['compilerOptions', 'emitDecoratorMetadata'], true),\n\n    // Remove an element\n    modifyJsonFile('tsconfig.json', ['compilerOptions', 'strict'], undefined),\n\n    // Add an element at the beginning\n    modifyJsonFile('tsconfig.json', ['extends'], './my-tsconfig.json', () => 0)\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"removefromjsonfile",children:(0,s.jsx)(n.code,{children:"removeFromJsonFile"})}),"\n",(0,s.jsx)(n.p,{children:"Removes an element inside a JSON file."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{6}",children:"import { removeFromJsonFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    removeFromJsonFile('package.json', ['scripts', 'start'])\n  ]);\n"})}),"\n",(0,s.jsx)(n.h2,{id:"helpers",children:"Helpers"}),"\n",(0,s.jsx)(n.h3,{id:"serializetojson",children:(0,s.jsx)(n.code,{children:"serializeToJson"})}),"\n",(0,s.jsx)(n.p,{children:"Converts a JavaScript value to a JavaScript Object Notation (JSON) string."}),"\n",(0,s.jsx)(n.admonition,{title:"Note",type:"note",children:(0,s.jsx)(n.p,{children:"Uses a default indentation of 2."})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{8}",children:"import { serializeToJson, schematic } from '@hug/ngx-schematics-utilities';\nimport { chain, Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    (): Rule => {\n      const data = { key: 'value' };\n      const str = serializeToJson(data);\n      ...\n    }\n  ]);\n"})}),"\n",(0,s.jsx)(n.h3,{id:"gettssourcefile",children:(0,s.jsx)(n.code,{children:"getTsSourceFile"})}),"\n",(0,s.jsx)(n.p,{children:"Gets the source of a TypeScript file."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{6}",children:"import { getTsSourceFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, Tree } from '@angular-devkit/schematics';\n\nexport const myRule = (filePath: string): Rule =>\n  (tree: Tree): void => {\n    const sourceFile = getTsSourceFile(tree, filePath);\n    ...\n  };\n"})}),"\n",(0,s.jsx)(n.h3,{id:"commitchanges",children:(0,s.jsx)(n.code,{children:"commitChanges"})}),"\n",(0,s.jsx)(n.p,{children:"Applies changes on a file inside the current schematic's project tree."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",metastring:"{7}",children:"import { commitChanges } from '@hug/ngx-schematics-utilities';\nimport { Rule, Tree } from '@angular-devkit/schematics';\n\nexport const myRule = (filePath: string): Rule =>\n  (tree: Tree): void => {\n    ...\n    commitChanges(tree, filePath, changes);\n  };\n"})})]})}function m(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>r,a:()=>l});var s=i(7294);const t={},o=s.createContext(t);function l(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);