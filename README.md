# About

*Arumdown* is my take on modernizing *Markdown* syntax. it features a modular design, allowing you to modify the grammar with ease.

please note that *Arumdown* does not support every feature specified in the markdown spec, nor does it provide its own formal spec yet.

one of the key aspects of this project is its simplicity and high performance. it utilizes lookup instead of lookahead whenever possible while traversing through.

# Usage

```ts
import { Markdown, Preset } from "<path>";

const markdown = new Markdown(...Preset.ARUM);

console.debug(markdown.run("# hello world"));
```

# Features

this project is under heavy development and not yet suitable for production use.

### TODO

- [ ] html ctx
- [ ] sanitize

### Syntax

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
# hello world
```
->
```ts
["H2", "hello", "SPACE", "world", "BREAK"]
```
->
```html
<article class="md"><h2>hello world</h2></article>
```

- [x] H1
- [x] H2
- [x] H3
- [x] H4
- [x] H5
- [x] H6
- [x] HR
- [x] BQ
- [x] OL
- [x] UL
- [ ] CB
- [ ] EM
- [x] bold
- [x] code
- [x] italic
- [ ] hyperlink
- [x] underline
- [x] strikethrough
