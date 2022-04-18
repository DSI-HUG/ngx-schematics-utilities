"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[952],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return u}});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},c=Object.keys(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(a=0;a<c.length;a++)n=c[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var r=a.createContext({}),l=function(e){var t=a.useContext(r),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=l(e.components);return a.createElement(r.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},h=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,c=e.originalType,r=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),h=l(n),u=i,d=h["".concat(r,".").concat(u)]||h[u]||p[u]||c;return n?a.createElement(d,o(o({ref:t},m),{},{components:n})):a.createElement(d,o({ref:t},m))}));function u(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var c=n.length,o=new Array(c);o[0]=h;var s={};for(var r in t)hasOwnProperty.call(t,r)&&(s[r]=t[r]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var l=2;l<c;l++)o[l]=n[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},1349:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return r},default:function(){return u},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return p}});var a=n(7462),i=n(3366),c=(n(7294),n(3905)),o=["components"],s={title:"Core"},r=void 0,l={unversionedId:"apis/core",id:"apis/core",title:"Core",description:"Rules",source:"@site/docs/apis/core.md",sourceDirName:"apis",slug:"/apis/core",permalink:"/ngx-schematics-utilities/apis/core",editUrl:"https://github.com/DSI-HUG/ngx-schematics-utilities/edit/main/docs/docs/apis/core.md",tags:[],version:"current",frontMatter:{title:"Core"},sidebar:"docs",previous:{title:"Usage",permalink:"/ngx-schematics-utilities/usage"},next:{title:"File",permalink:"/ngx-schematics-utilities/apis/file"}},m={},p=[{value:"Rules",id:"rules",level:2},{value:"<code>schematic</code>",id:"schematic",level:3},{value:"<code>log</code>",id:"log",level:3},{value:"<code>info</code>",id:"info",level:3},{value:"<code>warn</code>",id:"warn",level:3},{value:"<code>action</code>",id:"action",level:3},{value:"<code>spawn</code>",id:"spawn",level:3},{value:"Helpers",id:"helpers",level:2},{value:"<code>getSchematicSchemaOptions</code>",id:"getschematicschemaoptions",level:3},{value:"<code>getSchematicSchemaDefaultOptions</code>",id:"getschematicschemadefaultoptions",level:3}],h={toc:p};function u(e){var t=e.components,n=(0,i.Z)(e,o);return(0,c.kt)("wrapper",(0,a.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("h2",{id:"rules"},"Rules"),(0,c.kt)("h3",{id:"schematic"},(0,c.kt)("inlineCode",{parentName:"h3"},"schematic")),(0,c.kt)("p",null,"Executes a set of rules by outputing first the name of the associated schematic and its options to the console."),(0,c.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,c.kt)("div",{parentName:"div",className:"admonition-heading"},(0,c.kt)("h5",{parentName:"div"},(0,c.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,c.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,c.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"Note")),(0,c.kt)("div",{parentName:"div",className:"admonition-content"},(0,c.kt)("p",{parentName:"div"},'The schematic name will be prefixed by the word "SCHEMATIC" printed in magenta and the given options will follow inlined, stringified and printed in gray.'))),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{5-7}","{5-7}":!0},"import { schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    ...\n  ]);\n")),(0,c.kt)("h3",{id:"log"},(0,c.kt)("inlineCode",{parentName:"h3"},"log")),(0,c.kt)("p",null,"Outputs a message to the console."),(0,c.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,c.kt)("div",{parentName:"div",className:"admonition-heading"},(0,c.kt)("h5",{parentName:"div"},(0,c.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,c.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,c.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"Note")),(0,c.kt)("div",{parentName:"div",className:"admonition-content"},(0,c.kt)("p",{parentName:"div"},"By default, the Angular schematic's logger will misplace messages with breaking indentations.",(0,c.kt)("br",null),"\nThis method makes sure that messages are always displayed at the beginning of the current console line."))),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { log, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    log('My log message')\n  ]);\n")),(0,c.kt)("h3",{id:"info"},(0,c.kt)("inlineCode",{parentName:"h3"},"info")),(0,c.kt)("p",null,"Outputs a message to the console, preceded by a blue (i) icon."),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { info, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    info('My info message')\n  ]);\n")),(0,c.kt)("h3",{id:"warn"},(0,c.kt)("inlineCode",{parentName:"h3"},"warn")),(0,c.kt)("p",null,'Outputs a message to the console, prefixed by the word "WARNING" printed in yellow.'),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { warn, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    warn('My warn message')\n  ]);\n")),(0,c.kt)("h3",{id:"action"},(0,c.kt)("inlineCode",{parentName:"h3"},"action")),(0,c.kt)("p",null,'Outputs a message to the console, prefixed by the word "ACTION" printed in yellow.'),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{6}","{6}":!0},"import { action, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    action('My action message')\n  ]);\n")),(0,c.kt)("h3",{id:"spawn"},(0,c.kt)("inlineCode",{parentName:"h3"},"spawn")),(0,c.kt)("p",null,"Spawns a new process using the given command and arguments."),(0,c.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,c.kt)("div",{parentName:"div",className:"admonition-heading"},(0,c.kt)("h5",{parentName:"div"},(0,c.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,c.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,c.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"Note")),(0,c.kt)("div",{parentName:"div",className:"admonition-content"},(0,c.kt)("p",{parentName:"div"},"By default, the output will not be redirected to the console unless otherwise specified by the ",(0,c.kt)("inlineCode",{parentName:"p"},"showOutput"),"\nparameter or the ",(0,c.kt)("inlineCode",{parentName:"p"},"--verbose")," current schematic process argument."),(0,c.kt)("p",{parentName:"div"},"When the output is not redirected to the console, an animated spinner will be displayed to the console to\nindicates the current process activity, as well as the command and its options displayed inlined and printed\nin cyan."))),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{7,10}","{7,10}":!0},"import { spawn, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  schematic('my-schematic', [\n    // Display an animated spinner along with the command and its arguments\n    spawn('ng', ['add', '@angular/material', '--skip-confirmation']),\n\n    // Display the command outputs directly to the console\n    spawn('npx', ['-p', 'package-name', 'some-command'], true)\n  ]);\n")),(0,c.kt)("h2",{id:"helpers"},"Helpers"),(0,c.kt)("h3",{id:"getschematicschemaoptions"},(0,c.kt)("inlineCode",{parentName:"h3"},"getSchematicSchemaOptions")),(0,c.kt)("p",null,"Returns all the options of a specific local or external schematic's schema."),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{9,12,15,18}","{9,12,15,18}":!0},"import { getSchematicSchemaOptions, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  (tree: Tree, context: SchematicContext): Rule =>\n    schematic('my-schematic', [\n        async(): Rule => {\n            // Get the `ng-add` schema of the current running schematic\n            const opts1 = await getSchematicSchemaOptions(context);\n\n            // Get the `schematic-name` schema of the current running schematic\n            const opts2 = await getSchematicSchemaOptions(context, 'schematic-name'));\n\n            // Get the `ng-add` schema of the local package `@angular/material`\n            const opts3 = await getSchematicSchemaOptions(context, 'ng-add', '@angular/material'));\n\n            // Get the `sentry` schema of the external package `@hug/ngx-sentry` on npm\n            const opts4 = await getSchematicSchemaOptions(context, 'sentry', '@hug/ngx-sentry', true));\n            ...\n        }\n    ]);\n")),(0,c.kt)("h3",{id:"getschematicschemadefaultoptions"},(0,c.kt)("inlineCode",{parentName:"h3"},"getSchematicSchemaDefaultOptions")),(0,c.kt)("p",null,"Returns all the default options of a specific local or external schematic's schema."),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts",metastring:"{9,12,15,18}","{9,12,15,18}":!0},"import { getSchematicSchemaDefaultOptions, schematic } from '@hug/ngx-schematics-utilities';\nimport { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';\n\nexport default (options: any): Rule =>\n  (tree: Tree, context: SchematicContext): Rule =>\n    schematic('my-schematic', [\n        async (): Rule => {\n            // Get the default options from the `ng-add` schema of the current running schematic\n            const opts1 = await getSchematicSchemaDefaultOptions(context);\n\n            // Get the default options from the `schematic-name` schema of the current running schematic\n            const opts2 = await getSchematicSchemaDefaultOptions(context, 'schematic-name'));\n\n            // Get the default options from the `ng-add` schema of the local package `@angular/material`\n            const opts3 = await getSchematicSchemaDefaultOptions(context, 'ng-add', '@angular/material'));\n\n            // Get the default options from the `sentry` schema of the external package `@hug/ngx-sentry` on npm\n            const opts4 = await getSchematicSchemaDefaultOptions(context, 'sentry', '@hug/ngx-sentry', true));\n            ...\n        }\n    ]);\n")))}u.isMDXComponent=!0}}]);