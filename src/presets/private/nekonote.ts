import { Markdown } from "@";

import AST from "@/models/ast";
import Token from "@/models/token";

import Level from "@/enums/level";

import * as HTML from "@/DOM";

import type { Processor } from "@/parser";

abstract class _ extends Token
{
	constructor(lvl: typeof Token.prototype.lvl, syntax: typeof Token.prototype.syntax, next?: typeof Token.prototype.next)
	{
		// TODO: maybe change IIFE to a function declaration 
		super(lvl, syntax, next ?? (() =>
		{
			switch (syntax.at(-1))
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
		})
		());
	}
}

const T = Object.freeze(
{
	//------//
	//      //
	// CORE //
	//      //
	//------//
	BREAK: new (class BREAK extends _ {})
	("all", "\n"),
	COMMENT_L: new (class COMMENT_L extends _ {})
	("all", "/*"),
	COMMENT_R: new (class COMMENT_R extends _ {})
	("all", "*/"),
	//-------//
	//       //
	// BLOCK //
	//       //
	//-------//
	H1: new (class H1 extends _ {})
	(Level.BLOCK, "#".repeat(1) + "\u0020"),
	H2: new (class H2 extends _ {})
	(Level.BLOCK, "#".repeat(2) + "\u0020"),
	H3: new (class H3 extends _ {})
	(Level.BLOCK, "#".repeat(3) + "\u0020"),
	H4: new (class H4 extends _ {})
	(Level.BLOCK, "#".repeat(4) + "\u0020"),
	H5: new (class H5 extends _ {})
	(Level.BLOCK, "#".repeat(5) + "\u0020"),
	H6: new (class H6 extends _ {})
	(Level.BLOCK, "#".repeat(6) + "\u0020"),
	CB: new (class CB extends _ {})
	(Level.BLOCK, "```"),
	HR_1: new (class HR_1 extends _ {})
	(Level.BLOCK, "___" + "\n"),
	HR_2: new (class HR_2 extends _ {})
	(Level.BLOCK, "---" + "\n"),
	HR_3: new (class HR_3 extends _ {})
	(Level.BLOCK, "===" + "\n"),
	//-------//
	//       //
	// STACK //
	//       //
	//-------//
	BQ: new (class BQ extends _ { })
	(Level.BLOCK, "> ", Level.BLOCK),
	OL: new (class OL extends _ { })
	(Level.BLOCK, "- ", Level.BLOCK),
	UL: new (class UL extends _ { })
	(Level.BLOCK, "~ ", Level.BLOCK),
	INDENT_1T: new (class INDENT_1T extends _ { })
	(Level.BLOCK, "\u0009".repeat(1), Level.BLOCK),
	INDENT_2S: new (class INDENT_2S extends _ { })
	(Level.BLOCK, "\u0020".repeat(2), Level.BLOCK),
	INDENT_4S: new (class INDENT_4S extends _ { })
	(Level.BLOCK, "\u0020".repeat(4), Level.BLOCK),
	//--------//
	//        //
	// INLINE //
	//        //
	//--------//
	SPACE: new (class SPACE extends _ {})
	(Level.INLINE, " "),
	CODE: new (class CODE extends _ {})
	(Level.INLINE, "`"),
	BOLD: new (class BOLD extends _ {})
	(Level.INLINE, "**"),
	ITALIC: new (class ITALIC extends _ {})
	(Level.INLINE, "*"),
	STRIKE: new (class STRIKE extends _ {})
	(Level.INLINE, "~~"),
	UNDERLINE: new (class UNDERLINE extends _ {})
	(Level.INLINE, "__"),
	CHECKED_BOX: new (class CHECKED_BOX extends _ {})
	(Level.INLINE, "[x]"),
	UNCHECKED_BOX: new (class UNCHECKED_BOX extends _ {})
	(Level.INLINE, "[ ]"),
	ARROW_ALL: new (class ARROW_ALL extends _ {})
	(Level.INLINE, "<->"),
	ARROW_LEFT: new (class ARROW_LEFT extends _ {})
	(Level.INLINE, "<-"),
	ARROW_RIGHT: new (class ARROW_RIGHT extends _ {})
	(Level.INLINE, "->"),
	FAT_ARROW_ALL: new (class FAT_ARROW_ALL extends _ {})
	(Level.INLINE, "<=>"),
	FAT_ARROW_LEFT: new (class FAT_ARROW_LEFT extends _ {})
	(Level.INLINE, "<=="),
	FAT_ARROW_RIGHT: new (class FAT_ARROW_RIGHT extends _ {})
	(Level.INLINE, "=>"),
	MATH_APX: new (class MATH_APX extends _ {})
	(Level.INLINE, "~="),
	MATH_NET: new (class MATH_NET extends _ {})
	(Level.INLINE, "!="),
	MATH_LTOET: new (class MATH_LTOET extends _ {})
	(Level.INLINE, "<="),
	MATH_GTOET: new (class MATH_GTOET extends _ {})
	(Level.INLINE, ">="),
	EXCLAMATION: new (class EXCLAMATION extends _ {})
	(Level.INLINE, "!"),
	BRACKET_L: new (class BRACKET_L extends _ {})
	(Level.INLINE, "["),
	BRACKET_R: new (class BRACKET_R extends _ {})
	(Level.INLINE, "]"),	
	PAREN_L: new (class PAREN_L extends _ {})
	(Level.INLINE, "("),
	PAREN_R: new (class PAREN_R extends _ {})
	(Level.INLINE, ")"),
});

function impl({ peek, next }: Processor)
{
	function lookup()
	{
		const t = peek();

		switch (t)
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
		return t;
	}

	switch (lookup())
	{
		case null:
		{
			throw "EOF";
		}
		case T.BREAK:
		{
			next();
			
			const t = lookup();

			if (t instanceof Token)
			{
				// edge case - itself
				if (t === T.BREAK)
				{
					return new HTML.BR();
				}
				// edge case - inline
				if (t.lvl === Level.INLINE)
				{
					return new HTML.BR();
				}
			}
			return impl({ peek, next });
		}
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
				switch (next())
				{
					case T.BQ: { return new HTML.BQ(); }
					case T.OL: { LI = true; return new HTML.OL(); }
					case T.UL: { LI = true; return new HTML.UL(); }
				}
			})
			()!;
	
			let node: Nullable<HTML.BQ | HTML.OL | HTML.UL> = root;
	
			stack:
			while (true)
			{
				const t = lookup();

				build:
				switch (t)
				{
					case null:
					case T.BREAK:
					{
						// if EOF/BR is found before BQ/OL/UL
						if (node === null) break stack;

						next();
						node = null;
						break build;
					}
					case T.INDENT_1T:
					case T.INDENT_2S:
					case T.INDENT_4S:
					{
						// get the most recently working node
						const ast = node?.children.at(-1) ?? root;

						switch (ast.constructor)
						{
							case HTML.OL:
							case HTML.UL:
							{
								// pickup
								next(); node = ast as AST; break;
							}
							default:
							{
								// if an indent is found before BQ/OL/UL
								if (node === null)
								{
									// exit
									break stack;
								}
								// insert
								node.children.push(inline()); break;
							}
						}
						break build;
					}
					case T.BQ:
					case T.OL:
					case T.UL:
					{
						// get the most recently working node
						const ast = node?.children.at(-1) ?? root;

						const type = (() =>
						{
							switch (t)
							{
								case T.BQ: { return HTML.BQ; }
								case T.OL: { LI = true; return HTML.OL; }
								case T.UL: { LI = true; return HTML.UL; }
							}
						})
						()!;
						
						// if the types of ast and token correspond
						if (ast instanceof type)
						{
							// pickup
							next(); node = ast as AST;
						}
						// if the types of ast and token differ
						else if (node)
						{
							// delve
							next(); node.children.push(node = new type());
						}
						// if a diff type of ast is found before its kind
						else
						{
							// exit
							break stack;
						}
						break build;
					}
					default:
					{
						// if an inline element is found before a block element
						if (node === null) break stack;

						if (!LI)
						{
							node.children.push(inline());
						}
						else
						{
							node.children.push(new HTML.LI(...inline().children));
						}
						LI = false;
						break build;
					}
				}
			}
			return root;
		}
		default:
		{
			return inline();
		}
	}

	function inline(until: ReturnType<typeof lookup>[] = [])
	{
		const ast = new HTML.PR();

		function style(node: AST, ending: Token)
		{
			style:
			while (true)
			{
				const t = lookup(); if (until.includes(t)) break style;

				switch (t)
				{
					case null:
					case T.BREAK:
					{
						break style;
					}
					case ending:
					{
						next(); break style;
					}
					default:
					{
						if (typeof t === "string")
						{
							node.children.push(next() as string);
						}
						else
						{
							node.children.push(...inline([...until, ending]).children);
						}
						continue style;
					}
				}
			}
			return node;
		}

		inline:
		while (true)
		{
			const t = lookup(); if (until.includes(t)) break inline;
			
			build:
			switch (t)
			{
				case null:
				case T.BREAK:
				{
					break inline;
				}
				//----------//
				//          //
				// COMPOUND //
				//          //
				//----------//
				case T.EXCLAMATION:
				{
					const fallback: string[] = [];
					try
					{
						fallback.push(next(T.EXCLAMATION)!.toString());
						fallback.push(next(T.BRACKET_L)!.toString());

						const alt: ConstructorParameters<typeof HTML.EM>[0] = inline([...until, T.BRACKET_R]).body || null;

						fallback.push(next(T.BRACKET_R)!.toString());
						fallback.push(next(T.PAREN_L)!.toString());

						const src: ConstructorParameters<typeof HTML.EM>[1] = inline([...until, T.PAREN_R]).body || null;

						fallback.push(next(T.PAREN_R)!.toString());

						ast.children.push(new HTML.EM(alt, src));
					}
					catch
					{
						ast.children.push(...fallback);
					}
					break build;
				}
				case T.BRACKET_L:
				{
					const fallback: string[] = [];
					try
					{
						fallback.push(next(T.BRACKET_L)!.toString());

						const text: ConstructorParameters<typeof HTML.BACKLINK>[0] = inline([...until, T.BRACKET_R]).body || null;

						fallback.push(next(T.BRACKET_R)!.toString());
						fallback.push(next(T.PAREN_L)!.toString());

						const href: ConstructorParameters<typeof HTML.BACKLINK>[1] = inline([...until, T.PAREN_R]).body || null;

						fallback.push(next(T.PAREN_R)!.toString());

						ast.children.push(new HTML.BACKLINK(text, href));
					}
					catch
					{
						ast.children.push(...fallback);
					}
					break build;
				}
				//-------//
				//       //
				// STYLE //
				//       //
				//-------//
				case T.BOLD:
				{
					next(); const node = style(new HTML.BOLD(), T.BOLD);
					
					if (0 < node.children.length) ast.children.push(node);
					
					break build;
				}
				case T.CODE:
				{
					next(); const node = style(new HTML.CODE(), T.CODE);
					
					if (0 < node.children.length) ast.children.push(node);
					
					break build;
				}
				case T.ITALIC:
				{
					next(); const node = style(new HTML.ITALIC(), T.ITALIC);
					
					if (0 < node.children.length) ast.children.push(node);
					
					break build;
				}
				case T.STRIKE:
				{
					next(); const node = style(new HTML.STRIKE(), T.STRIKE);
					
					if (0 < node.children.length) ast.children.push(node);
					
					break build;
				}
				case T.UNDERLINE:
				{
					next(); const node = style(new HTML.UNDERLINE(), T.UNDERLINE);
					
					if (0 < node.children.length) ast.children.push(node);
					
					break build;
				}
				case T.CHECKED_BOX:
				{
					next(); ast.children.push(new HTML.TODO(true)); break build;
				}
				case T.UNCHECKED_BOX:
				{
					next(); ast.children.push(new HTML.TODO(false)); break build;
				}
				//-------//
				//       //
				// MACRO //
				//       //
				//-------//
				case T.ARROW_ALL:
				{
					next(); ast.children.push("↔"); break build;
				}
				case T.ARROW_LEFT:
				{
					next(); ast.children.push("←"); break build;
				}
				case T.ARROW_RIGHT:
				{
					next(); ast.children.push("→"); break build;
				}
				case T.FAT_ARROW_ALL:
				{
					next(); ast.children.push("⇔"); break build;
				}
				case T.FAT_ARROW_LEFT:
				{
					next(); ast.children.push("⇐"); break build;
				}
				case T.FAT_ARROW_RIGHT:
				{
					next(); ast.children.push("⇒"); break build;
				}
				case T.MATH_APX:
				{
					next(); ast.children.push("≈"); break build;
				}
				case T.MATH_NET:
				{
					next(); ast.children.push("≠"); break build;
				}
				case T.MATH_LTOET:
				{
					next(); ast.children.push("≤"); break build;
				}
				case T.MATH_GTOET:
				{
					next(); ast.children.push("≥"); break build;
				}
				//------//
				//      //
				// REST //
				//      //
				//------//
				default:
				{
					next(); ast.children.push(t.toString()); break build;
				}
			}
		}
		return ast;
	}
}

export default [Object.values(T), impl] satisfies ConstructorParameters<typeof Markdown> as ConstructorParameters<typeof Markdown>;
