# About

*Arumdown* is my take on modernizing *Markdown* syntax. it features a modular design, allowing you to modify the grammar with ease.

please note that *Arumdown* does not support every feature specified in the markdown spec, nor does it provide its own formal spec yet.

one of the key aspects of this project is its simplicity and high performance, with the overall time complexity of each implementation being O(n).

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
- [ ] html sanitize

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
