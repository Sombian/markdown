import { Markdown } from "..";

import AST from "@/models/AST";
import Token from "@/models/Token";

import Level from "@/enums/Level";

import * as HTML from "@/render";

abstract class impl extends Token
{
	constructor(lvl: ConstructorParameters<typeof Token>[0], syntax: ConstructorParameters<typeof Token>[1], next?: ConstructorParameters<typeof Token>[2])
	{
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
	BQ: new (class BQ extends impl { })
	(Level.BLOCK, "> ", Level.BLOCK),
	OL: new (class OL extends impl { })
	(Level.BLOCK, "- ", Level.BLOCK),
	UL: new (class UL extends impl { })
	(Level.BLOCK, "~ ", Level.BLOCK),
	INDENT_1T: new (class INDENT_1T extends impl { })
	(Level.BLOCK, "\u0009".repeat(1), Level.BLOCK),
	INDENT_2S: new (class INDENT_2S extends impl { })
	(Level.BLOCK, "\u0020".repeat(2), Level.BLOCK),
	INDENT_4S: new (class INDENT_4S extends impl { })
	(Level.BLOCK, "\u0020".repeat(4), Level.BLOCK),
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
				next(); const t = lookup();

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
				return recursive({ peek, next, until: [] });
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
					switch (lookup())
					{
						case T.BQ: { next(); return new HTML.BQ(); }
						case T.OL: { next(); LI = true; return new HTML.OL(); }
						case T.UL: { next(); LI = true; return new HTML.UL(); }
					}
				})
				()!;
		
				let node: Nullable<AST> = root;
		
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
							// if indent is found before BQ/OL/UL
							if (node === null)
							{
								break stack;
							}
							// get the most recent working node
							const ast = node.children.at(-1) ?? root;

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
							// get the most recent working node
							const ast = node?.children.at(-1) ?? root;

							const type = (() =>
							{
								switch (t)
								{
									case T.BQ: { return HTML.BQ; }
									case T.OL: { return HTML.OL; }
									case T.UL: { return HTML.UL; }
								}
							})
							()!;
							
							if (ast instanceof type)
							{
								// pickup
								next(); node = ast as AST;
							}
							else if (node)
							{
								// create diff type of stack as child
								next(); node.children.push(node = new type());
							}
							else
							{
								// if diff type of stack is found before its kind
								break stack;
							}
							break build;
						}
						default:
						{
							// if inline is found before stack
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
							break build;
						}
					}
					LI = false;
				}
				return root;
			}
			default:
			{
				return inline();
			}
		}

		function inline()
		{
			const ast = new HTML.PR();

			function style(node: AST, closing: Token)
			{
				style:
				while (true)
				{
					const t = lookup(); if (until.includes(t as never)) break style;

					switch (t)
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
							if (typeof t === "string")
							{
								node.children.push(next() as string);
							}
							else
							{
								node.children.push(...recursive({ peek, next, until: [...until, closing] }).children);
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
				const t = lookup(); if (until.includes(t as never)) break inline;
				
				build:
				switch (t)
				{
					case null:
					case T.BREAK:
					{
						break inline;
					}
					//---------//
					//         //
					// COMPLEX //
					//         //
					//---------//
					case T.EXCLAMATION:
					{
						const fallback: string[] = [];
						try
						{
							let alt: ConstructorParameters<typeof HTML.EM>[0];
							let src: ConstructorParameters<typeof HTML.EM>[1];

							fallback.push(next(T.EXCLAMATION)!.toString());
							fallback.push(next(T.BRACKET_L)!.toString());

							const t1 = peek(); if (t1 === null) throw new Error(); if (typeof t1 === "string") { alt = t1; next(); };

							fallback.push(next(T.BRACKET_R)!.toString());
							fallback.push(next(T.PAREN_L)!.toString());

							const t2 = peek(); if (t1 === null) throw new Error(); if (typeof t2 === "string") { src = t2; next(); };

							fallback.push(next(T.PAREN_R)!.toString());

							ast.children.push(new HTML.EM(alt! ?? "", src! ?? ""));
						}
						catch
						{
							if (0 < fallback.length)
							{
								ast.children.push(...fallback);
							}
						}
						break build;
					}
					case T.BRACKET_L:
					{
						const fallback: string[] = [];
						try
						{
							let text: ConstructorParameters<typeof HTML.HREF>[0];
							let href: ConstructorParameters<typeof HTML.HREF>[1];

							fallback.push(next(T.BRACKET_L)!.toString());

							const t1 = peek(); if (t1 === null) throw new Error(); if (typeof t1 === "string") { text = t1; next(); };

							fallback.push(next(T.BRACKET_R)!.toString());
							fallback.push(next(T.PAREN_L)!.toString());

							const t2 = peek(); if (t1 === null) throw new Error(); if (typeof t2 === "string") { href = t2; next(); };

							fallback.push(next(T.PAREN_R)!.toString());

							ast.children.push(new HTML.HREF(text! ?? "", href! ?? ""));
						}
						catch
						{
							if (0 < fallback.length)
							{
								ast.children.push(...fallback);
							}
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
					//-------//
					//       //
					// OTHER //
					//       //
					//-------//
					default:
					{
						if (typeof t === "string")
						{
							next(); ast.children.push(t);
						}
						else
						{
							next(); ast.children.push(t.syntax);
						}
						break build;
					}
				}
			}
			return ast;
		}
	},
] satisfies ConstructorParameters<typeof Markdown>);
