import { Markdown } from ".."; import { Token, Context } from "../scanner"; import { AST } from "../parser"; import * as HTML from "../html";

const T = Object.freeze(
{
	//
	// core
	//
	BREAK: new (class BREAK extends Token {})
	(null as never, "\n"),
	COMMENT_L: new (class COMMENT_L extends Token {})
	(null as never, "/*"),
	COMMENT_R: new (class COMMENT_R extends Token {})
	(null as never, "*/"),
	//
	// block
	//
	H1: new (class H1 extends Token {})
	(Context.BLOCK, "#".repeat(1) + "\u0020"),
	H2: new (class H2 extends Token {})
	(Context.BLOCK, "#".repeat(2) + "\u0020"),
	H3: new (class H3 extends Token {})
	(Context.BLOCK, "#".repeat(3) + "\u0020"),
	H4: new (class H4 extends Token {})
	(Context.BLOCK, "#".repeat(4) + "\u0020"),
	H5: new (class H5 extends Token {})
	(Context.BLOCK, "#".repeat(5) + "\u0020"),
	H6: new (class H6 extends Token {})
	(Context.BLOCK, "#".repeat(6) + "\u0020"),
	CB: new (class CB extends Token {})
	(Context.BLOCK, "```"),
	HR_1: new (class HR_1 extends Token {})
	(Context.BLOCK, "___\n"),
	HR_2: new (class HR_2 extends Token {})
	(Context.BLOCK, "---\n"),
	HR_3: new (class HR_3 extends Token {})
	(Context.BLOCK, "===\n"),
	//
	// stack
	//
	BQ: new (class BQ extends Token
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "> "),
	OL: new (class OL extends Token
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "- "),
	UL: new (class UL extends Token
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "~ "),
	INDENT_1T: new (class INDENT_1T extends Token
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "\u0009".repeat(1)),
	INDENT_2S: new (class INDENT_2S extends Token
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "\u0020".repeat(2)),
	INDENT_4S: new (class INDENT_4S extends Token
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "\u0020".repeat(4)),
	//
	// inline
	//
	SPACE: new (class SPACE extends Token {})
	(Context.INLINE, " "),
	CODE: new (class CODE extends Token {})
	(Context.INLINE, "`"),
	BOLD: new (class BOLD extends Token {})
	(Context.INLINE, "**"),
	ITALIC: new (class ITALIC extends Token {})
	(Context.INLINE, "*"),
	STRIKE: new (class STRIKE extends Token {})
	(Context.INLINE, "~~"),
	UNDERLINE: new (class UNDERLINE extends Token {})
	(Context.INLINE, "__"),
	UNCHECKED_BOX: new (class UNCHECKED_BOX extends Token {})
	(Context.INLINE, "[ ]"),
	CHECKED_BOX: new (class CHECKED_BOX extends Token {})
	(Context.INLINE, "[x]"),
	ARROW_ALL: new (class ARROW_ALL extends Token {})
	(Context.INLINE, "<->"),
	ARROW_LEFT: new (class ARROW_LEFT extends Token {})
	(Context.INLINE, "<-"),
	ARROW_RIGHT: new (class ARROW_RIGHT extends Token {})
	(Context.INLINE, "->"),
	FAT_ARROW_ALL: new (class FAT_ARROW_ALL extends Token {})
	(Context.INLINE, "<=>"),
	FAT_ARROW_LEFT: new (class FAT_ARROW_LEFT extends Token {})
	(Context.INLINE, "<=="),
	FAT_ARROW_RIGHT: new (class FAT_ARROW_RIGHT extends Token {})
	(Context.INLINE, "=>"),
	MATH_APX: new (class MATH_APX extends Token {})
	(Context.INLINE, "~="),
	MATH_NET: new (class MATH_NET extends Token {})
	(Context.INLINE, "!="),
	MATH_LTOET: new (class MATH_LTOET extends Token {})
	(Context.INLINE, "<="),
	MATH_GTOET: new (class MATH_GTOET extends Token {})
	(Context.INLINE, ">="),
	EXCLAMATION: new (class EXCLAMATION extends Token {})
	(Context.INLINE, "!"),
	BRACKET_L: new (class BRACKET_L extends Token {})
	(Context.INLINE, "["),
	BRACKET_R: new (class BRACKET_R extends Token {})
	(Context.INLINE, "]"),	
	PAREN_L: new (class PAREN_L extends Token {})
	(Context.INLINE, "("),
	PAREN_R: new (class PAREN_R extends Token {})
	(Context.INLINE, ")"),
});

const P: ConstructorParameters<typeof Markdown> = [
	//
	// tokens
	//
	Object.values(T),
	//
	// handle
	//
	function recursive({ peek, next, until }): AST
	{
		// eslint-disable-next-line no-unused-labels
		block:
		switch (peek())
		{
			case null:
			{
				throw "EOF";
			}
			case T.BREAK:
			{
				next();

				const token = peek();

				if (token instanceof Token)
				{
					// edge case - itself
					if (token === T.BREAK)
					{
						return new HTML.BR();
					}
					// edge case - inline
					if (token.ctx === Context.INLINE)
					{
						return new HTML.BR();
					}
				}
				return recursive({ peek, next, until: [] });
			}
			case T.COMMENT_L:
			{
				comment:
				while (true)
				{
					switch (next())
					{
						case null:
						{
							throw "EOF";
						}
						case T.COMMENT_R:
						{
							break comment;
						}
					}
				}
				return recursive({ peek, next, until: [] });
			}
			case T.H1:
			{
				next(); return new HTML.H1(...recursive({ peek, next, until: [] }).children);
			}
			case T.H2:
			{
				next(); return new HTML.H2(...recursive({ peek, next, until: [] }).children);
			}
			case T.H3:
			{
				next(); return new HTML.H3(...recursive({ peek, next, until: [] }).children);
			}
			case T.H4:
			{
				next(); return new HTML.H4(...recursive({ peek, next, until: [] }).children);
			}
			case T.H5:
			{
				next(); return new HTML.H5(...recursive({ peek, next, until: [] }).children);
			}
			case T.H6:
			{
				next(); return new HTML.H6(...recursive({ peek, next, until: [] }).children);
			}
			case T.HR_1:
			case T.HR_2:
			case T.HR_3:
			{
				next(); return new HTML.HR();
			}
			default:
			{
				const inline = new HTML.PR();

				function style(ast: AST, closing: Token)
				{
					main:
					while (true)
					{
						const token = peek();

						if ([T.BREAK, null, ...until].includes(peek() as never))
						{
							break main;
						}

						switch (token)
						{
							case closing:
							{
								next(); break main;
							}
							default:
							{
								if (typeof token === "string")
								{
									ast.children.push(next() as string);
								}
								else
								{
									ast.children.push(...recursive({ peek, next, until: [...until, closing] }).children);
								}
								continue main;
							}
						}
					}
					return ast;
				}

				inline:
				while (true)
				{
					const token = peek(); if (until.includes(token as never)) break inline;
					
					examine:
					switch (token)
					{
						case T.BREAK: case null:
						{
							break inline;
						}
						case T.BOLD:
						{
							next(); inline.children.push(style(new HTML.BOLD(), T.BOLD)); break examine;
						}
						case T.CODE:
						{
							next(); inline.children.push(style(new HTML.CODE(), T.CODE)); break examine;
						}
						case T.ITALIC:
						{
							next(); inline.children.push(style(new HTML.ITALIC(), T.ITALIC)); break examine;
						}
						case T.STRIKE:
						{
							next(); inline.children.push(style(new HTML.STRIKE(), T.STRIKE)); break examine;
						}
						case T.UNDERLINE:
						{
							next(); inline.children.push(style(new HTML.UNDERLINE(), T.UNDERLINE)); break examine;
						}
						default:
						{
							if (typeof token === "string")
							{
								next(); inline.children.push(token);
							}
							else
							{
								next(); inline.children.push(token.code);
							}
							break examine;
						}
					}
				}
				return inline;
			}
		}
	},
];

export default Object.freeze(P);
