# @sombian/markdown

[![npm](https://badgen.net/npm/v/@sombian/markdown)](https://www.npmjs.com/package/@sombian/markdown)
[![hits](https://hits.sh/github.com/Sombian/markdown.svg)](https://hits.sh/github.com/Sombian/markdown)
[![downloads](https://badgen.net/npm/dt/@sombian/markdown)](https://www.npmjs.com/package/@sombian/markdown)
[![install size](https://packagephobia.com/badge?p=@sombian/markdown)](https://packagephobia.com/result?p=@sombian/markdown)

```sh
npm i @sombian/markdown
```

**@sombian/markdown** is my take on modernizing markdown syntax.

this project focuses on high performance, modularity, and, above all, simplicity.

## Usage

> this project is under active development and not yet suitable for production use.

```ts
import { Presets } from "@sombian/markdown";

const helper = Presets.NekoNote;

console.debug(helper.run("hello world"));
// or helper.parse(helper.scan("hello world"))
```

## NekoNote

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
<h1>hello *world</h1>
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
<h1>hello world</h1>
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
<h2>hello world</h2>
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
<h3>hello world</h3>
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
<h4>hello world</h4>
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
<h5>hello world</h5>
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
<h6>hello world</h6>
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
<hr/><hr/><hr/>
```

...and more
