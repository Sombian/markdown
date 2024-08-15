import { Markdown } from "..";

import AST from "@/models/AST";
import Token from "@/models/Token";

import Level from "@/enums/Level";

import * as HTML from "../blocks";

abstract class impl extends Token
{
	override get next()
	{
		switch (this.syntax.at(-1))
		{
			case "\n":
			{
				return Level.BLOCK;
			}
			default:
			{
				return Level.INLINE;
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
	("all", "\n"),
	COMMENT_L: new (class COMMENT_L extends impl {})
	("all", "/*"),
	COMMENT_R: new (class COMMENT_R extends impl {})
	("all", "*/"),
	//
	// block
	//
	H1: new (class H1 extends impl {})
	(Level.BLOCK, "#".repeat(1) + "\u0020"),
	H2: new (class H2 extends impl {})
	(Level.BLOCK, "#".repeat(2) + "\u0020"),
	H3: new (class H3 extends impl {})
	(Level.BLOCK, "#".repeat(3) + "\u0020"),
	H4: new (class H4 extends impl {})
	(Level.BLOCK, "#".repeat(4) + "\u0020"),
	H5: new (class H5 extends impl {})
	(Level.BLOCK, "#".repeat(5) + "\u0020"),
	H6: new (class H6 extends impl {})
	(Level.BLOCK, "#".repeat(6) + "\u0020"),
	CB: new (class CB extends impl {})
	(Level.BLOCK, "```"),
	HR_1: new (class HR_1 extends impl {})
	(Level.BLOCK, "___" + "\n"),
	HR_2: new (class HR_2 extends impl {})
	(Level.BLOCK, "---" + "\n"),
	HR_3: new (class HR_3 extends impl {})
	(Level.BLOCK, "===" + "\n"),
	//
	// stack
	//
	BQ: new (class BQ extends impl
	{
		override get next()
		{
			return Level.BLOCK;
		}
	})
	(Level.BLOCK, "> "),
	OL: new (class OL extends impl
	{
		override get next()
		{
			return Level.BLOCK;
		}
	})
	(Level.BLOCK, "- "),
	UL: new (class UL extends impl
	{
		override get next()
		{
			return Level.BLOCK;
		}
	})
	(Level.BLOCK, "~ "),
	INDENT_1T: new (class INDENT_1T extends impl
	{
		override get next()
		{
			return Level.BLOCK;
		}
	})
	(Level.BLOCK, "\u0009".repeat(1)),
	INDENT_2S: new (class INDENT_2S extends impl
	{
		override get next()
		{
			return Level.BLOCK;
		}
	})
	(Level.BLOCK, "\u0020".repeat(2)),
	INDENT_4S: new (class INDENT_4S extends impl
	{
		override get next()
		{
			return Level.BLOCK;
		}
	})
	(Level.BLOCK, "\u0020".repeat(4)),
	//
	// inline
	//
	SPACE: new (class SPACE extends impl {})
	(Level.INLINE, " "),
	CODE: new (class CODE extends impl {})
	(Level.INLINE, "`"),
	BOLD: new (class BOLD extends impl {})
	(Level.INLINE, "**"),
	ITALIC: new (class ITALIC extends impl {})
	(Level.INLINE, "*"),
	STRIKE: new (class STRIKE extends impl {})
	(Level.INLINE, "~~"),
	UNDERLINE: new (class UNDERLINE extends impl {})
	(Level.INLINE, "__"),
	UNCHECKED_BOX: new (class UNCHECKED_BOX extends impl {})
	(Level.INLINE, "[ ]"),
	CHECKED_BOX: new (class CHECKED_BOX extends impl {})
	(Level.INLINE, "[x]"),
	ARROW_ALL: new (class ARROW_ALL extends impl {})
	(Level.INLINE, "<->"),
	ARROW_LEFT: new (class ARROW_LEFT extends impl {})
	(Level.INLINE, "<-"),
	ARROW_RIGHT: new (class ARROW_RIGHT extends impl {})
	(Level.INLINE, "->"),
	FAT_ARROW_ALL: new (class FAT_ARROW_ALL extends impl {})
	(Level.INLINE, "<=>"),
	FAT_ARROW_LEFT: new (class FAT_ARROW_LEFT extends impl {})
	(Level.INLINE, "<=="),
	FAT_ARROW_RIGHT: new (class FAT_ARROW_RIGHT extends impl {})
	(Level.INLINE, "=>"),
	MATH_APX: new (class MATH_APX extends impl {})
	(Level.INLINE, "~="),
	MATH_NET: new (class MATH_NET extends impl {})
	(Level.INLINE, "!="),
	MATH_LTOET: new (class MATH_LTOET extends impl {})
	(Level.INLINE, "<="),
	MATH_GTOET: new (class MATH_GTOET extends impl {})
	(Level.INLINE, ">="),
	EXCLAMATION: new (class EXCLAMATION extends impl {})
	(Level.INLINE, "!"),
	BRACKET_L: new (class BRACKET_L extends impl {})
	(Level.INLINE, "["),
	BRACKET_R: new (class BRACKET_R extends impl {})
	(Level.INLINE, "]"),	
	PAREN_L: new (class PAREN_L extends impl {})
	(Level.INLINE, "("),
	PAREN_R: new (class PAREN_R extends impl {})
	(Level.INLINE, ")"),
});

export default Object.freeze([
	//
	// tokens
	//
	Object.freeze(Object.values(T)),
	//
	// handle
	//
	function recursive({ peek, next, until }): AST
	{
		function scan()
		{
			switch (peek())
			{
				case T.COMMENT_L:
				{
					next();
			
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
					break;
				}
			}
			return peek();
		}

		function core()
		{
			switch (scan())
			{
				case null:
				{
					throw "EOF";
				}
				case T.BREAK:
				{
					next();
		
					const token = scan();
		
					if (token instanceof impl)
					{
						// edge case - itself
						if (token === T.BREAK)
						{
							return new HTML.BR();
						}
						// edge case - inline
						if (token.ctx === Level.INLINE)
						{
							return new HTML.BR();
						}
					}
					return recursive({ peek, next, until: [] });
				}
			}
		}

		function block()
		{
			switch (scan())
			{
				case T.H1:
				{
					next(); return new HTML.H1(...inline().children);
				}
				case T.H2:
				{
					next(); return new HTML.H2(...inline().children);
				}
				case T.H3:
				{
					next(); return new HTML.H3(...inline().children);
				}
				case T.H4:
				{
					next(); return new HTML.H4(...inline().children);
				}
				case T.H5:
				{
					next(); return new HTML.H5(...inline().children);
				}
				case T.H6:
				{
					next(); return new HTML.H6(...inline().children);
				}
				case T.HR_1:
				case T.HR_2:
				case T.HR_3:
				{
					next(); return new HTML.HR(/* leaf node */);
				}
				case T.BQ:
				case T.OL:
				case T.UL:
				{
					let LI = false;

					const root = (() =>
					{
						switch (scan())
						{
							case T.BQ: { next(); return new HTML.BQ(); }
							case T.OL: { next(); LI = true; return new HTML.OL(); }
							case T.UL: { next(); LI = true; return new HTML.UL(); }
						}
					})()!;
		
					let node: Nullable<AST> = root;
		
					stack:
					while (true)
					{
						const token = scan();
	
						lookup:
						switch (token)
						{
							case null:
							case T.BREAK:
							{
								// if newline/EOF is found before stack
								if (node === null) break stack;
	
								next();
								// breakout
								node = null;
	
								break lookup;
							}
							case T.INDENT_1T:
							case T.INDENT_2S:
							case T.INDENT_4S:
							{
								const ref = node?.children.at(-1) ?? root;
	
								if (ref !instanceof HTML.BQ)
								{
									next();
									// pickup
									node = ref as AST;
								}
								else if (node)
								{
									// treat as inline
									node.children.push(inline());
								}
								else
								{
									break stack;
								}
								break lookup;
							}
							case T.OL:
							case T.UL:
							{
								LI = true;
							}
							// eslint-disable-next-line no-fallthrough
							case T.BQ:
							{
								const ref = node?.children.at(-1) ?? root;
	
								const ast = (() =>
								{
									switch (token)
									{
										case T.BQ: { return HTML.BQ; }
										case T.OL: { return HTML.OL; }
										case T.UL: { return HTML.UL; }
									}
								})()!;
	
								if (ref instanceof ast)
								{
									next();
									// pickup
									node = ref;
								}
								else if (node)
								{
									next();
									// insert and pickup
									node.children.push(node = new ast());
								}
								else
								{
									break stack;
								}
								break lookup;
							}
							default:
							{
								// if newline/EOF is found before stack
								if (node === null) break stack;
	
								const ast = recursive({ peek, next, until: [] });
	
								if (!LI)
								{
									node.children.push(ast);
								}
								else
								{
									node.children.push(new HTML.LI(...ast.children));
								}
								break lookup;
							}
						}
						LI = false;
					}
					return root;
				}
			}
		}

		function inline()
		{
			const ast = new HTML.PR();

			function style(ast: AST, closing: Token)
			{
				style:
				while (true)
				{
					const token = scan(); if (until.includes(token as never)) break style;

					switch (token)
					{
						case null:
						case T.BREAK:
						{
							break style;
						}
						case closing:
						{
							next(); break style;
						}
						default:
						{
							if (typeof token === "string")
							{
								ast.children.push(next() as string);
							}
							else
							{
								ast.children.push(...recursive(
								{
									peek, next, until: [...until, closing]
								}
								).children);
							}
							continue style;
						}
					}
				}
				return ast;
			}

			inline:
			while (true)
			{
				const token = scan(); if (until.includes(token as never)) break inline;
				
				examine:
				switch (token)
				{
					case null:
					case T.BREAK:
					{
						break inline;
					}
					case T.BOLD:
					{
						next(); const ast = style(new HTML.BOLD(), T.BOLD);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					case T.CODE:
					{
						next(); const ast = style(new HTML.CODE(), T.CODE);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					case T.ITALIC:
					{
						next(); const ast = style(new HTML.ITALIC(), T.ITALIC);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					case T.STRIKE:
					{
						next(); const ast = style(new HTML.STRIKE(), T.STRIKE);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					case T.UNDERLINE:
					{
						next(); const ast = style(new HTML.UNDERLINE(), T.UNDERLINE);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					// macro
					case T.ARROW_ALL:
					{
						next(); ast.children.push("↔"); break examine;
					}
					case T.ARROW_LEFT:
					{
						next(); ast.children.push("←"); break examine;
					}
					case T.ARROW_RIGHT:
					{
						next(); ast.children.push("→"); break examine;
					}
					case T.FAT_ARROW_ALL:
					{
						next(); ast.children.push("⇔"); break examine;
					}
					case T.FAT_ARROW_LEFT:
					{
						next(); ast.children.push("⇐"); break examine;
					}
					case T.FAT_ARROW_RIGHT:
					{
						next(); ast.children.push("⇒"); break examine;
					}
					case T.MATH_APX:
					{
						next(); ast.children.push("≈"); break examine;
					}
					case T.MATH_NET:
					{
						next(); ast.children.push("≠"); break examine;
					}
					case T.MATH_LTOET:
					{
						next(); ast.children.push("≤"); break examine;
					}
					case T.MATH_GTOET:
					{
						next(); ast.children.push("≥"); break examine;
					}
					default:
					{
						if (typeof token === "string")
						{
							next(); ast.children.push(token);
						}
						else
						{
							next(); ast.children.push(token.syntax);
						}
						break examine;
					}
				}
			}
			return ast;
		}
		return block() ?? inline();
	},
] satisfies ConstructorParameters<typeof Markdown>);
