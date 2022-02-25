"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[651],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),m=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=m(e.components);return a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=m(n),d=o,g=u["".concat(l,".").concat(d)]||u[d]||p[d]||r;return n?a.createElement(g,i(i({ref:t},c),{},{components:n})):a.createElement(g,i({ref:t},c))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var m=2;m<r;m++)i[m]=n[m];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},1182:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return m},assets:function(){return c},toc:function(){return p},default:function(){return d}});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),i=["components"],s={title:"Angular"},l=void 0,m={unversionedId:"apis/angular",id:"apis/angular",title:"Angular",description:"Rules",source:"@site/docs/apis/angular.md",sourceDirName:"apis",slug:"/apis/angular",permalink:"/ngx-schematics-utilities/apis/angular",editUrl:"https://github.com/DSI-HUG/ngx-schematics-utilities/edit/main/docs/docs/apis/angular.md",tags:[],version:"current",frontMatter:{title:"Angular"},sidebar:"docs",previous:{title:"File",permalink:"/ngx-schematics-utilities/apis/file"},next:{title:"Package.json",permalink:"/ngx-schematics-utilities/apis/package-json"}},c={},p=[{value:"Rules",id:"rules",level:2},{value:"<code>ensureIsAngularWorkspace</code>",id:"ensureisangularworkspace",level:3},{value:"<code>ensureIsAngularProject</code>",id:"ensureisangularproject",level:3},{value:"<code>ensureIsAngularLibrary</code>",id:"ensureisangularlibrary",level:3},{value:"<code>isAngularVersion</code>",id:"isangularversion",level:3},{value:"<code>addAngularJsonAsset</code>",id:"addangularjsonasset",level:3},{value:"<code>removeAngularJsonAsset</code>",id:"removeangularjsonasset",level:3},{value:"<code>addDeclarationToNgModule</code>",id:"adddeclarationtongmodule",level:3},{value:"<code>removeDeclarationFromNgModule</code>",id:"removedeclarationfromngmodule",level:3},{value:"<code>addImportToNgModule</code>",id:"addimporttongmodule",level:3},{value:"<code>removeImportFromNgModule</code>",id:"removeimportfromngmodule",level:3},{value:"<code>addExportToNgModule</code>",id:"addexporttongmodule",level:3},{value:"<code>removeExportFromNgModule</code>",id:"removeexportfromngmodule",level:3},{value:"<code>addProviderToNgModule</code>",id:"addprovidertongmodule",level:3},{value:"<code>removeProviderFromNgModule</code>",id:"removeproviderfromngmodule",level:3},{value:"<code>addRouteDeclarationToNgModule</code>",id:"addroutedeclarationtongmodule",level:3},{value:"Helpers",id:"helpers",level:2},{value:"<code>getDefaultProjectName</code>",id:"getdefaultprojectname",level:3},{value:"<code>getProjectOutputPath</code>",id:"getprojectoutputpath",level:3},{value:"<code>getProjectFromWorkspace</code>",id:"getprojectfromworkspace",level:3}],u={toc:p};function d(e){var t=e.components,n=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h2",{id:"rules"},"Rules"),(0,r.kt)("h3",{id:"ensureisangularworkspace"},(0,r.kt)("inlineCode",{parentName:"h3"},"ensureIsAngularWorkspace")),(0,r.kt)("p",null,"Ensures that the workspace, where the schematic is currently running on, is actually an Angular workspace or throws an exception otherwise."),(0,r.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"Note")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"The test is done by ensuring the existence of an ",(0,r.kt)("inlineCode",{parentName:"p"},"angular.json")," file."))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { ensureIsAngularWorkspace, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    ensureIsAngularWorkspace()\n  ]);\n")),(0,r.kt)("h3",{id:"ensureisangularproject"},(0,r.kt)("inlineCode",{parentName:"h3"},"ensureIsAngularProject")),(0,r.kt)("p",null,"Ensures that a project is actually an Angular project or throws an exception otherwise."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10}","{7,10}":!0},"import { ensureIsAngularProject, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // By default: uses the default project name specified in the `angular.json` file\n    ensureIsAngularProject(),\n\n    // Use a specific project name\n    ensureIsAngularProject('ProjectName')\n  ]);\n")),(0,r.kt)("h3",{id:"ensureisangularlibrary"},(0,r.kt)("inlineCode",{parentName:"h3"},"ensureIsAngularLibrary")),(0,r.kt)("p",null,"Ensures that a project is actually an Angular library or throws an exception otherwise."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10}","{7,10}":!0},"import { ensureIsAngularLibrary, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // By default: uses the default project name specified in the `angular.json` file\n    ensureIsAngularLibrary(),\n\n    // Use a specific project name\n    ensureIsAngularLibrary('ProjectName')\n  ]);\n")),(0,r.kt)("h3",{id:"isangularversion"},(0,r.kt)("inlineCode",{parentName:"h3"},"isAngularVersion")),(0,r.kt)("p",null,"Executes a rule only if the current Angular version installed in the project satisfies a given range."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6-8}","{6-8}":!0},"import { isAngularVersion, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    isAngularVersion('<= 11', (): Rule => {\n      ...\n    })\n  ]);\n")),(0,r.kt)("h3",{id:"addangularjsonasset"},(0,r.kt)("inlineCode",{parentName:"h3"},"addAngularJsonAsset")),(0,r.kt)("p",null,"Adds a new asset to a project ",(0,r.kt)("inlineCode",{parentName:"p"},"build")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"test")," sections of the ",(0,r.kt)("inlineCode",{parentName:"p"},"angular.json")," file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10}","{7,10}":!0},"import { addAngularJsonAsset, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // By default: uses the default project name specified in the `angular.json` file\n    addAngularJsonAsset('src/manifest.webmanifest'),\n\n    // Use a specific project name\n    addAngularJsonAsset('src/manifest.webmanifest', 'ProjectName')\n  ]);\n")),(0,r.kt)("h3",{id:"removeangularjsonasset"},(0,r.kt)("inlineCode",{parentName:"h3"},"removeAngularJsonAsset")),(0,r.kt)("p",null,"Removes an asset from a project ",(0,r.kt)("inlineCode",{parentName:"p"},"build")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"test")," sections of the ",(0,r.kt)("inlineCode",{parentName:"p"},"angular.json")," file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10}","{7,10}":!0},"import { removeAngularJsonAsset, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // By default: uses the default project name specified in the `angular.json` file\n    removeAngularJsonAsset('src/manifest.webmanifest'),\n\n    // Use a specific project name\n    removeAngularJsonAsset('src/manifest.webmanifest', 'ProjectName')\n  ]);\n")),(0,r.kt)("h3",{id:"adddeclarationtongmodule"},(0,r.kt)("inlineCode",{parentName:"h3"},"addDeclarationToNgModule")),(0,r.kt)("p",null,"Inserts a declaration (ex. Component, Pipe, Directive) into an NgModule declarations and also imports that declaration."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { addDeclarationToNgModule, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    addDeclarationToNgModule('src/app/app.module.ts', 'TestComponent', './components/test')\n  ]);\n")),(0,r.kt)("h3",{id:"removedeclarationfromngmodule"},(0,r.kt)("inlineCode",{parentName:"h3"},"removeDeclarationFromNgModule")),(0,r.kt)("p",null,"Removes a declaration (ex. Component, Pipe, Directive) from an NgModule declarations."),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Use ",(0,r.kt)("a",{parentName:"p",href:"/apis/file#removeimportfromfile"},"#removeImportFromFile")," to also remove the import."))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { removeDeclarationFromNgModule, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    removeDeclarationFromNgModule('src/app/app.module.ts', 'AppComponent')\n  ]);\n")),(0,r.kt)("h3",{id:"addimporttongmodule"},(0,r.kt)("inlineCode",{parentName:"h3"},"addImportToNgModule")),(0,r.kt)("p",null,"Inserts an import (ex. NgModule) into an NgModule imports and also imports that import."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{8,11-19}","{8,11-19}":!0},"import { addImportToNgModule, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\nimport { tags } from '@angular-devkit/core';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // Import simple module\n    addImportToNgModule('src/app/app.module.ts', 'HttpClientModule', '@angular/common/http'),\n\n    // Import forRoot module\n    addImportToNgModule(\n      'src/app/app.module.ts',\n      tags.stripIndent`\n        TestModule.forRoot({\n          enabled: environment.production\n        })\n      `,\n      'src/common/test'\n    )\n  ]);\n")),(0,r.kt)("h3",{id:"removeimportfromngmodule"},(0,r.kt)("inlineCode",{parentName:"h3"},"removeImportFromNgModule")),(0,r.kt)("p",null,"Removes an import (ex. NgModule) from an NgModule imports."),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Use ",(0,r.kt)("a",{parentName:"p",href:"/apis/file#removeimportfromfile"},"#removeImportFromFile")," to also remove the import."))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { removeImportFromNgModule, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    removeImportFromNgModule('src/app/app.module.ts', 'TestModule')\n  ]);\n")),(0,r.kt)("h3",{id:"addexporttongmodule"},(0,r.kt)("inlineCode",{parentName:"h3"},"addExportToNgModule")),(0,r.kt)("p",null,"Inserts an export (ex. Component, Pipe, Directive) into an NgModule exports and also imports that export."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { addExportToNgModule, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    addExportToNgModule('src/app/app.module.ts', 'TestComponent', './components/test')\n  ]);\n")),(0,r.kt)("h3",{id:"removeexportfromngmodule"},(0,r.kt)("inlineCode",{parentName:"h3"},"removeExportFromNgModule")),(0,r.kt)("p",null,"Removes an export (ex. Component, Pipe, Directive) from an NgModule exports."),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Use ",(0,r.kt)("a",{parentName:"p",href:"/apis/file#removeimportfromfile"},"#removeImportFromFile")," to also remove the import."))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { removeExportFromNgModule, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    removeExportFromNgModule('src/app/app.module.ts', 'TestComponent')\n  ]);\n")),(0,r.kt)("h3",{id:"addprovidertongmodule"},(0,r.kt)("inlineCode",{parentName:"h3"},"addProviderToNgModule")),(0,r.kt)("p",null,"Inserts a provider (ex. Service) into an NgModule providers and also imports that provider."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { addExportToNgModule, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    addProviderToNgModule('src/app/app.module.ts', 'TestService', './services/test')\n  ]);\n")),(0,r.kt)("h3",{id:"removeproviderfromngmodule"},(0,r.kt)("inlineCode",{parentName:"h3"},"removeProviderFromNgModule")),(0,r.kt)("p",null,"Removes a provider (ex. Service) from an NgModule providers."),(0,r.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"Tip")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"Use ",(0,r.kt)("a",{parentName:"p",href:"/apis/file#removeimportfromfile"},"#removeImportFromFile")," to also remove the import."))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { removeProviderFromNgModule, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    removeProviderFromNgModule('src/app/app.module.ts', 'TestService')\n  ]);\n")),(0,r.kt)("h3",{id:"addroutedeclarationtongmodule"},(0,r.kt)("inlineCode",{parentName:"h3"},"addRouteDeclarationToNgModule")),(0,r.kt)("p",null,"Inserts a route declaration to a router module (i.e. as a RouterModule declaration)."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{10,14}","{10,14}":!0},"import { addRouteDeclarationToNgModule, addImportToFile, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule => {\n  const componentRoute = \"{ path: 'home', component: HomeComponent }\";\n  const lazyRoute = \"{ path: 'user', loadChildren: '() => import('./pages/user/user.module').then(m => m.UserModule)'; }\";\n\n  return schematic('my-schematic', [\n    // Add component route\n    addRouteDeclarationToNgModule('src/app/app-routing.module.ts', componentRoute),\n    addImportToFile('src/app/app-routing.module.ts', 'HomeComponent', './pages/home/home.component'),\n\n    // Add lazy route\n    addRouteDeclarationToNgModule('src/app/app-routing.module.ts', lazyRoute)\n  ]);\n}\n")),(0,r.kt)("h2",{id:"helpers"},"Helpers"),(0,r.kt)("h3",{id:"getdefaultprojectname"},(0,r.kt)("inlineCode",{parentName:"h3"},"getDefaultProjectName")),(0,r.kt)("p",null,"Gets the default project name defined in the ",(0,r.kt)("inlineCode",{parentName:"p"},"angular.json")," file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { getDefaultProjectName, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, Tree } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  (tree: Tree): Rule => {\n    const projectName = getDefaultProjectName(tree);\n    return schematic('my-schematic', [\n      ...\n    ]);\n  };\n")),(0,r.kt)("h3",{id:"getprojectoutputpath"},(0,r.kt)("inlineCode",{parentName:"h3"},"getProjectOutputPath")),(0,r.kt)("p",null,"Gets a project output path as defined in the ",(0,r.kt)("inlineCode",{parentName:"p"},"angular.json")," file."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10}","{7,10}":!0},"import { getProjectOutputPath, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, Tree } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  (tree: Tree): Rule => {\n    // By default: uses the default project name specified in the `angular.json` file\n    const defaultProjectOutputPath = getProjectOutputPath(tree);\n\n    // Use a specific project name\n    const projectOutputPath = getProjectOutputPath(tree, 'ProjectName');\n\n    return schematic('my-schematic', [\n      ...\n    ]);\n  };\n")),(0,r.kt)("h3",{id:"getprojectfromworkspace"},(0,r.kt)("inlineCode",{parentName:"h3"},"getProjectFromWorkspace")),(0,r.kt)("p",null,"Gets a project definition object from the current Angular workspace."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { getProjectFromWorkspace, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, Tree } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  (tree: Tree): Rule => {\n    const project = await getProjectFromWorkspace(tree);\n    return schematic('my-schematic', [\n      ...\n    ]);\n  };\n")))}d.isMDXComponent=!0}}]);