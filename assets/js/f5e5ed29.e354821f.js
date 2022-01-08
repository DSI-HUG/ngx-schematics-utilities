"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[337],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return u}});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=i.createContext({}),c=function(e){var t=i.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=c(e.components);return i.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},d=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,s=e.parentName,m=l(e,["components","mdxType","originalType","parentName"]),d=c(n),u=a,f=d["".concat(s,".").concat(u)]||d[u]||p[u]||r;return n?i.createElement(f,o(o({ref:t},m),{},{components:n})):i.createElement(f,o({ref:t},m))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var c=2;c<r;c++)o[c]=n[c];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8517:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return m},default:function(){return d}});var i=n(7462),a=n(3366),r=(n(7294),n(3905)),o=["components"],l={title:"File"},s=void 0,c={unversionedId:"apis/file",id:"apis/file",title:"File",description:"Rules",source:"@site/docs/apis/file.md",sourceDirName:"apis",slug:"/apis/file",permalink:"/ngx-schematics-utilities/apis/file",editUrl:"https://github.com/DSI-HUG/ngx-schematics-utilities/edit/main/docs/docs/apis/file.md",tags:[],version:"current",frontMatter:{title:"File"},sidebar:"docs",previous:{title:"Core",permalink:"/ngx-schematics-utilities/apis/core"},next:{title:"Angular",permalink:"/ngx-schematics-utilities/apis/angular"}},m=[{value:"Rules",id:"rules",children:[{value:"<code>deployFiles</code>",id:"deployfiles",children:[],level:3},{value:"<code>deleteFiles</code>",id:"deletefiles",children:[],level:3},{value:"<code>createOrUpdateFile</code>",id:"createorupdatefile",children:[],level:3},{value:"<code>downloadFile</code>",id:"downloadfile",children:[],level:3},{value:"<code>replaceInFile</code>",id:"replaceinfile",children:[],level:3},{value:"<code>addImportToFile</code>",id:"addimporttofile",children:[],level:3},{value:"<code>modifyImportInFile</code>",id:"modifyimportinfile",children:[],level:3},{value:"<code>removeImportFromFile</code>",id:"removeimportfromfile",children:[],level:3},{value:"<code>modifyJsonFile</code>",id:"modifyjsonfile",children:[],level:3},{value:"<code>removeFromJsonFile</code>",id:"removefromjsonfile",children:[],level:3}],level:2},{value:"Helpers",id:"helpers",children:[{value:"<code>serializeToJson</code>",id:"serializetojson",children:[],level:3},{value:"<code>getTsSourceFile</code>",id:"gettssourcefile",children:[],level:3},{value:"<code>commitChanges</code>",id:"commitchanges",children:[],level:3}],level:2}],p={toc:m};function d(e){var t=e.components,n=(0,a.Z)(e,o);return(0,r.kt)("wrapper",(0,i.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"rules"},"Rules"),(0,r.kt)("h3",{id:"deployfiles"},(0,r.kt)("inlineCode",{parentName:"h3"},"deployFiles")),(0,r.kt)("p",null,"Deploys assets files and optionally applies computation to them."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10,13,16}","{7,10,13,16}":!0},"import { deployFiles, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // By default: deploy schematic './files' folder into project root folder\n    deployFiles(),\n\n    // Use defaults but also apply computation to `*.template` files\n    deployFiles(options),\n\n    // Use a different source folder\n    deployFiles(undefined, './my-files'),\n\n    // Use a different destination folder\n    deployFiles(undefined, './files', './my-dest-folder'),\n  ]);\n")),(0,r.kt)("h3",{id:"deletefiles"},(0,r.kt)("inlineCode",{parentName:"h3"},"deleteFiles")),(0,r.kt)("p",null,"Deletes a collection of files."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6-9}","{6-9}":!0},"import { deleteFiles, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    deleteFiles([\n      'src/assets/.gitkeep',\n      'src/app/app.component.spec.ts'\n    ])\n  ]);\n")),(0,r.kt)("h3",{id:"createorupdatefile"},(0,r.kt)("inlineCode",{parentName:"h3"},"createOrUpdateFile")),(0,r.kt)("p",null,"Creates or updates a file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { createOrUpdateFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    createOrUpdateFile('README.md', 'My readme content')\n  ]);\n")),(0,r.kt)("h3",{id:"downloadfile"},(0,r.kt)("inlineCode",{parentName:"h3"},"downloadFile")),(0,r.kt)("p",null,"Downloads a file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{9-12}","{9-12}":!0},"import { downloadFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { chain, Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    (): Rule => {\n      const sizes = ['72', '96', '128', '144', '152', '192', '384', '512'];\n      return chain(\n        sizes.map(size => downloadFile(\n          `https://my-cdn.com/icons/icon-${size}x${size}.png`,\n          `src/assets/icons/icon-${size}x${size}.png`\n        ))\n      );\n    }\n  ]);\n")),(0,r.kt)("h3",{id:"replaceinfile"},(0,r.kt)("inlineCode",{parentName:"h3"},"replaceInFile")),(0,r.kt)("p",null,"Replaces text in a file, using a regular expression or a search string."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { replaceInFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    replaceInFile('.editorconfig', /(indent_size = )(.*)/gm, '$14')\n  ]);\n")),(0,r.kt)("h3",{id:"addimporttofile"},(0,r.kt)("inlineCode",{parentName:"h3"},"addImportToFile")),(0,r.kt)("p",null,"Adds an import to a file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10}","{7,10}":!0},"import { addImportToFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // ES : `import { environment } from './environments/environment';`\n    addImportToFile('src/main.ts', 'environment', './environments/environment'),\n\n    // Default : `import packageJson from 'package.json';`\n    addImportToFile('src/main.ts', 'packageJson', 'package.json', true)\n  ]);\n")),(0,r.kt)("h3",{id:"modifyimportinfile"},(0,r.kt)("inlineCode",{parentName:"h3"},"modifyImportInFile")),(0,r.kt)("p",null,"Modifies or removes an import inside a file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10}","{7,10}":!0},"import { modifyImportInFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // Rename an import\n    modifyImportInFile('src/main.ts', 'name', 'newName', 'src/my-file');\n\n    // Remove an import\n    modifyImportInFile('src/main.ts', 'environment', undefined, 'src/environments/environment');\n  ]);\n")),(0,r.kt)("h3",{id:"removeimportfromfile"},(0,r.kt)("inlineCode",{parentName:"h3"},"removeImportFromFile")),(0,r.kt)("p",null,"Removes an import inside a file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { modifyImportInFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    removeImportFromFile('src/main.ts', 'environment', 'src/environments/environment');\n  ]);\n")),(0,r.kt)("h3",{id:"modifyjsonfile"},(0,r.kt)("inlineCode",{parentName:"h3"},"modifyJsonFile")),(0,r.kt)("p",null,"Adds, modifies or removes an element in a JSON file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10,13}","{7,10,13}":!0},"import { modifyJsonFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // Add or update an element\n    modifyJsonFile('tsconfig.json', ['compilerOptions', 'emitDecoratorMetadata'], true),\n\n    // Remove an element\n    modifyJsonFile('tsconfig.json', ['compilerOptions', 'strict'], undefined),\n\n    // Add an element at the beginning\n    modifyJsonFile('tsconfig.json', ['extends'], './my-tsconfig.json', () => 0)\n  ]);\n")),(0,r.kt)("h3",{id:"removefromjsonfile"},(0,r.kt)("inlineCode",{parentName:"h3"},"removeFromJsonFile")),(0,r.kt)("p",null,"Removes an element inside a JSON file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { removeFromJsonFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    removeFromJsonFile('package.json', ['scripts', 'start'])\n  ]);\n")),(0,r.kt)("h2",{id:"helpers"},"Helpers"),(0,r.kt)("h3",{id:"serializetojson"},(0,r.kt)("inlineCode",{parentName:"h3"},"serializeToJson")),(0,r.kt)("p",null,"Converts a JavaScript value to a JavaScript Object Notation (JSON) string."),(0,r.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"Note")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Uses a default indentation of 2."))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{8}","{8}":!0},"import { serializeToJson, schematic } from '@hug/ngx-schematics-utilities';\nimport { chain, Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    (): Rule => {\n      const data = { key: 'value' };\n      const str = serializeToJson(data);\n      ...\n    }\n  ]);\n")),(0,r.kt)("h3",{id:"gettssourcefile"},(0,r.kt)("inlineCode",{parentName:"h3"},"getTsSourceFile")),(0,r.kt)("p",null,"Gets the source of a TypeScript file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { getTsSourceFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, Tree } from '@angular-devkit/schematics';\n\nexport const myRule = (filePath: string): Rule =>\n  (tree: Tree): void => {\n    const sourceFile = getTsSourceFile(tree, filePath);\n    ...\n  };\n")),(0,r.kt)("h3",{id:"commitchanges"},(0,r.kt)("inlineCode",{parentName:"h3"},"commitChanges")),(0,r.kt)("p",null,"Applies changes on a file inside the current schematic's project tree."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7}","{7}":!0},"import { commitChanges } from '@hug/ngx-schematics-utilities';\nimport { Rule, Tree } from '@angular-devkit/schematics';\n\nexport const myRule = (filePath: string): Rule =>\n  (tree: Tree): void => {\n    ...\n    commitChanges(tree, filePath, changes);\n  };\n")))}d.isMDXComponent=!0}}]);