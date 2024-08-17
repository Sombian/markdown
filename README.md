# About

[![npm](https://badgen.net/npm/v/@sombian/markdown)](https://www.npmjs.com/package/@sombian/markdown)
[![downloads](https://badgen.net/npm/dt/@sombian/markdown)](https://www.npmjs.com/package/@sombian/markdown)
[![install size](https://packagephobia.com/badge?p=@sombian/markdown)](https://packagephobia.com/result?p=@sombian/markdown)

```sh
npm i @sombian/markdown
```

**@sombian/markdown** is my take on modernizing markdown syntax.

this project focuses on high performance, modularity, and, above all, simplicity.

# Usage

> this project is under heavy development and not yet suitable for production use.

```ts
import { Markdown, Presets } from "@sombian/markdown";

const markdown = new Markdown(...Presets.NekoNote);

console.debug(markdown.run("# hello *world*"));
```

## Presets.`NekoNote`

whilst **NekoNote** builds on existing markdown grammars, it differs from regular markdown in several ways. also, rather than offering a universal solution, it serves as a template that illustrates how to write your own preset.

please be aware that **NekoNote** does not support every feature specified in the markdown spec, nor does it provide its own formal spec yet. these will be available after the project reaches the ready-for-production stage.

###### Escape

```
# hello \*world*
```
->
```ts
["H1", "hello", "SPACE", "*world", "ITALIC", "BREAK"]
```
->

```html
<article class="md"><h1>hello *world</h1></article>
```

###### Comment

```
/* comment */
```
->
```ts
["COMMENT_L", "SPACE", "comment", "SPACE", "COMMENT_R", "BREAK"]
```
->
```html
<article class="md"></article>
```

###### Heading 1

```
# hello world
```
->
```ts
["H1", "hello", "SPACE", "world", "BREAK"]
```
->
```html
<article class="md"><h1>hello world</h1></article>
```

###### Heading 2

```
## hello world
```
->
```ts
["H2", "hello", "SPACE", "world", "BREAK"]
```
->
```html
<article class="md"><h2>hello world</h2></article>
```

###### Heading 3

```
### hello world
```
->
```ts
["H3", "hello", "SPACE", "world", "BREAK"]
```
->
```html
<article class="md"><h3>hello world</h3></article>
```

###### Heading 4

```
#### hello world
```
->
```ts
["H4", "hello", "SPACE", "world", "BREAK"]
```
->
```html
<article class="md"><h4>hello world</h4></article>
```

###### Heading 5

```
##### hello world
```
->
```ts
["H5", "hello", "SPACE", "world", "BREAK"]
```
->
```html
<article class="md"><h5>hello world</h5></article>
```

###### Heading 6

```
###### hello world
```
->
```ts
["H6", "hello", "SPACE", "world", "BREAK"]
```
->
```html
<article class="md"><h6>hello world</h6></article>
```

###### Horizontal Rule

```
___
---
===
```
->
```ts
["HR_1", "HR_2", "HR_3"]
```
->
```html
<article class="md"><hr/><hr/><hr/></article>
```

...and more
