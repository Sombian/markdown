import { Markdown } from ".."; import { Token, Context } from "../scanner"; import { AST } from "../parser"; import * as HTML from "../html";

abstract class impl extends Token
{
	override get next()
	{
		switch (this.code.at(-1))
		{
			case "\n":
			{
				return Context.BLOCK;
			}
			default:
			{
				return Context.INLINE;
			}
		}
	}
}

const T = Object.freeze(
{
	//
	// core
	//
	BREAK: new (class BREAK extends impl {})
	(null as never, "\n"),
	COMMENT_L: new (class COMMENT_L extends impl {})
	(null as never, "/*"),
	COMMENT_R: new (class COMMENT_R extends impl {})
	(null as never, "*/"),
	//
	// block
	//
	H1: new (class H1 extends impl {})
	(Context.BLOCK, "#".repeat(1) + "\u0020"),
	H2: new (class H2 extends impl {})
	(Context.BLOCK, "#".repeat(2) + "\u0020"),
	H3: new (class H3 extends impl {})
	(Context.BLOCK, "#".repeat(3) + "\u0020"),
	H4: new (class H4 extends impl {})
	(Context.BLOCK, "#".repeat(4) + "\u0020"),
	H5: new (class H5 extends impl {})
	(Context.BLOCK, "#".repeat(5) + "\u0020"),
	H6: new (class H6 extends impl {})
	(Context.BLOCK, "#".repeat(6) + "\u0020"),
	CB: new (class CB extends impl {})
	(Context.BLOCK, "```"),
	HR_1: new (class HR_1 extends impl {})
	(Context.BLOCK, "___\n"),
	HR_2: new (class HR_2 extends impl {})
	(Context.BLOCK, "---\n"),
	HR_3: new (class HR_3 extends impl {})
	(Context.BLOCK, "===\n"),
	//
	// stack
	//
	BQ: new (class BQ extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "> "),
	OL: new (class OL extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "- "),
	UL: new (class UL extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "~ "),
	INDENT_1T: new (class INDENT_1T extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "\u0009".repeat(1)),
	INDENT_2S: new (class INDENT_2S extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "\u0020".repeat(2)),
	INDENT_4S: new (class INDENT_4S extends impl
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
	SPACE: new (class SPACE extends impl {})
	(Context.INLINE, " "),
	CODE: new (class CODE extends impl {})
	(Context.INLINE, "`"),
	BOLD: new (class BOLD extends impl {})
	(Context.INLINE, "**"),
	ITALIC: new (class ITALIC extends impl {})
	(Context.INLINE, "*"),
	STRIKE: new (class STRIKE extends impl {})
	(Context.INLINE, "~~"),
	UNDERLINE: new (class UNDERLINE extends impl {})
	(Context.INLINE, "__"),
	UNCHECKED_BOX: new (class UNCHECKED_BOX extends impl {})
	(Context.INLINE, "[ ]"),
	CHECKED_BOX: new (class CHECKED_BOX extends impl {})
	(Context.INLINE, "[x]"),
	ARROW_ALL: new (class ARROW_ALL extends impl {})
	(Context.INLINE, "<->"),
	ARROW_LEFT: new (class ARROW_LEFT extends impl {})
	(Context.INLINE, "<-"),
	ARROW_RIGHT: new (class ARROW_RIGHT extends impl {})
	(Context.INLINE, "->"),
	FAT_ARROW_ALL: new (class FAT_ARROW_ALL extends impl {})
	(Context.INLINE, "<=>"),
	FAT_ARROW_LEFT: new (class FAT_ARROW_LEFT extends impl {})
	(Context.INLINE, "<=="),
	FAT_ARROW_RIGHT: new (class FAT_ARROW_RIGHT extends impl {})
	(Context.INLINE, "=>"),
	MATH_APX: new (class MATH_APX extends impl {})
	(Context.INLINE, "~="),
	MATH_NET: new (class MATH_NET extends impl {})
	(Context.INLINE, "!="),
	MATH_LTOET: new (class MATH_LTOET extends impl {})
	(Context.INLINE, "<="),
	MATH_GTOET: new (class MATH_GTOET extends impl {})
	(Context.INLINE, ">="),
	EXCLAMATION: new (class EXCLAMATION extends impl {})
	(Context.INLINE, "!"),
	BRACKET_L: new (class BRACKET_L extends impl {})
	(Context.INLINE, "["),
	BRACKET_R: new (class BRACKET_R extends impl {})
	(Context.INLINE, "]"),	
	PAREN_L: new (class PAREN_L extends impl {})
	(Context.INLINE, "("),
	PAREN_R: new (class PAREN_R extends impl {})
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

				if (token instanceof impl)
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

				function style(ast: AST, closing: impl)
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
							next(); const ast = style(new HTML.BOLD(), T.BOLD);
							
							if (0 < ast.children.length) inline.children.push(ast);
							
							break examine;
						}
						case T.CODE:
						{
							next(); const ast = style(new HTML.CODE(), T.CODE);
							
							if (0 < ast.children.length) inline.children.push(ast);
							
							break examine;
						}
						case T.ITALIC:
						{
							next(); const ast = style(new HTML.ITALIC(), T.ITALIC);
							
							if (0 < ast.children.length) inline.children.push(ast);
							
							break examine;
						}
						case T.STRIKE:
						{
							next(); const ast = style(new HTML.STRIKE(), T.STRIKE);
							
							if (0 < ast.children.length) inline.children.push(ast);
							
							break examine;
						}
						case T.UNDERLINE:
						{
							next(); const ast = style(new HTML.UNDERLINE(), T.UNDERLINE);
							
							if (0 < ast.children.length) inline.children.push(ast);
							
							break examine;
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
