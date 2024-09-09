import Helper from "@/helper";
import Scanner from "@/scanner";
import Parser from "@/parser";
import AST from "@/models/ast";
import Token from "@/models/token";
import Level from "@/enums/level";
import * as HTML from "@/DOM";

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
	BR: new (class BR extends _ {})
	(Level.INLINE, "\n"),
	COMMENT_L: new (class COMMENT_L extends _ {})
	(Level.INLINE, "/*"),
	COMMENT_R: new (class COMMENT_R extends _ {})
	(Level.INLINE, "*/"),
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
	BQ_1: new (class BQ extends _ { })
	(Level.BLOCK, ">", Level.BLOCK),
	BQ_2: new (class BQ extends _ { })
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

class Preset extends Parser
{
	protected main()
	{
		return this.block();
	}

	protected lookup()
	{
		const t = this.peek();

		switch (t)
		{
			case T.COMMENT_L:
			{
				this.next();

				comment:
				while (true)
				{
					switch (this.next())
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

	protected block()
	{
		switch (this.lookup())
		{
			case null:
			{
				throw "EOF";
			}
			case T.BR:
			{
				this.next(); return new HTML.BR();
			}
			case T.H1:
			{
				this.next(); return new HTML.H1(...this.inline());
			}
			case T.H2:
			{
				this.next(); return new HTML.H2(...this.inline());
			}
			case T.H3:
			{
				this.next(); return new HTML.H3(...this.inline());
			}
			case T.H4:
			{
				this.next(); return new HTML.H4(...this.inline());
			}
			case T.H5:
			{
				this.next(); return new HTML.H5(...this.inline());
			}
			case T.H6:
			{
				this.next(); return new HTML.H6(...this.inline());
			}
			case T.HR_1:
			case T.HR_2:
			case T.HR_3:
			{
				this.next(); return new HTML.HR(/* leaf node */);
			}
			case T.BQ_1:
			case T.BQ_2:
			case T.OL:
			case T.UL:
			{
				return this.stack();
			}
			default:
			{
				return this.inline();
			}
		}
	}

	protected stack()
	{
		let LI = false;

		const root = (() =>
		{
			switch (this.next())
			{
				case T.BQ_1: { return new HTML.BQ(); }
				case T.BQ_2: { return new HTML.BQ(); }
				case T.OL: { LI = true; return new HTML.OL(); }
				case T.UL: { LI = true; return new HTML.UL(); }
			}
		})
		()!;

		let node: Nullable<HTML.BQ | HTML.OL | HTML.UL> = root;

		stack:
		while (true)
		{
			const t = this.lookup();

			build:
			switch (t)
			{
				case null:
				case T.BR:
				{
					// if EOF/BR is found before BQ/OL/UL
					if (!node) break stack;

					this.next();
					node = null;
					break build;
				}
				case T.INDENT_1T:
				case T.INDENT_2S:
				case T.INDENT_4S:
				{
					// get the most recently working node
					const ast = node?.at(-1) ?? root;

					switch (ast.constructor)
					{
						case HTML.OL:
						case HTML.UL:
						{
							// pickup
							this.next(); node = ast as AST; break;
						}
						default:
						{
							// if an indent is found before BQ/OL/UL
							if (!node)
							{
								// exit
								break stack;
							}
							// insert
							node.push(this.inline()); break;
						}
					}
					break build;
				}
				case T.BQ_1:
				case T.BQ_2:
				case T.OL:
				case T.UL:
				{
					// get the most recently working node
					const ast = node?.at(-1) ?? root;

					const type = (() =>
					{
						switch (t)
						{
							case T.BQ_1: { return HTML.BQ; }
							case T.BQ_2: { return HTML.BQ; }
							case T.OL: { LI = true; return HTML.OL; }
							case T.UL: { LI = true; return HTML.UL; }
						}
					})
					()!;
					
					// if the types of ast and token correspond
					if (ast instanceof type)
					{
						// pickup
						this.next(); node = ast as AST;
					}
					// if the types of ast and token differ
					else if (node)
					{
						// delve
						this.next(); node.push(node = new type());
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
					if (!node) break stack;

					if (!LI)
					{
						node.push(this.inline(), new HTML.BR());
					}
					else
					{
						node.push(new HTML.LI(...this.inline()));
					}
					LI = false;
					break build;
				}
			}
		}
		return root;
	}

	protected inline(until: ReturnType<typeof this.lookup>[] = [])
	{
		const ast = new HTML.PR();

		inline:
		while (true)
		{
			const t = this.lookup(); if (until.includes(t)) break inline;
			
			build:
			switch (t)
			{
				case null:
				case T.BR:
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
						fallback.push(this.next(T.EXCLAMATION)!.toString());
						fallback.push(this.next(T.BRACKET_L)!.toString());

						const alt: ConstructorParameters<typeof HTML.EM>[0] = this.inline([...until, T.BRACKET_R]).body || null; if (alt) fallback.push(alt);

						fallback.push(this.next(T.BRACKET_R)!.toString());
						fallback.push(this.next(T.PAREN_L)!.toString());

						const src: ConstructorParameters<typeof HTML.EM>[1] = this.inline([...until, T.PAREN_R]).body || null; if (src) fallback.push(src);

						fallback.push(this.next(T.PAREN_R)!.toString());

						ast.push(new HTML.EM(alt, src));
					}
					catch
					{
						ast.push(...fallback);
					}
					break build;
				}
				case T.BRACKET_L:
				{
					const fallback: string[] = [];
					try
					{
						fallback.push(this.next(T.BRACKET_L)!.toString());

						const text: ConstructorParameters<typeof HTML.BACKLINK>[0] = this.inline([...until, T.BRACKET_R]).body || null; if (text) fallback.push(text);

						fallback.push(this.next(T.BRACKET_R)!.toString());
						fallback.push(this.next(T.PAREN_L)!.toString());

						const href: ConstructorParameters<typeof HTML.BACKLINK>[1] = this.inline([...until, T.PAREN_R]).body || null; if (href) fallback.push(href);

						fallback.push(this.next(T.PAREN_R)!.toString());

						ast.push(new HTML.BACKLINK(text, href));
					}
					catch
					{
						ast.push(...fallback);
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
					this.next(); ast.push(new HTML.BOLD(...this.style(until, T.BOLD))); break build;
				}
				case T.CODE:
				{
					this.next(); ast.push(new HTML.CODE(...this.style(until, T.CODE))); break build;
				}
				case T.ITALIC:
				{
					this.next(); ast.push(new HTML.ITALIC(...this.style(until, T.ITALIC))); break build;
				}
				case T.STRIKE:
				{
					this.next(); ast.push(new HTML.STRIKE(...this.style(until, T.STRIKE))); break build;
				}
				case T.UNDERLINE:
				{
					this.next(); ast.push(new HTML.UNDERLINE(...this.style(until, T.UNDERLINE))); break build;
				}
				case T.CHECKED_BOX:
				{
					this.next(); ast.push(new HTML.TODO(true)); break build;
				}
				case T.UNCHECKED_BOX:
				{
					this.next(); ast.push(new HTML.TODO(false)); break build;
				}
				//-------//
				//       //
				// MACRO //
				//       //
				//-------//
				case T.ARROW_ALL:
				{
					this.next(); ast.push("↔"); break build;
				}
				case T.ARROW_LEFT:
				{
					this.next(); ast.push("←"); break build;
				}
				case T.ARROW_RIGHT:
				{
					this.next(); ast.push("→"); break build;
				}
				case T.FAT_ARROW_ALL:
				{
					this.next(); ast.push("⇔"); break build;
				}
				case T.FAT_ARROW_LEFT:
				{
					this.next(); ast.push("⇐"); break build;
				}
				case T.FAT_ARROW_RIGHT:
				{
					this.next(); ast.push("⇒"); break build;
				}
				case T.MATH_APX:
				{
					this.next(); ast.push("≈"); break build;
				}
				case T.MATH_NET:
				{
					this.next(); ast.push("≠"); break build;
				}
				case T.MATH_LTOET:
				{
					this.next(); ast.push("≤"); break build;
				}
				case T.MATH_GTOET:
				{
					this.next(); ast.push("≥"); break build;
				}
				//-----//
				//     //
				// ETC //
				//     //
				//-----//
				default:
				{
					this.next(); ast.push(t.toString()); break build;
				}
			}
		}
		return ast;
	}

	protected style(until: ReturnType<typeof this.lookup>[] = [], ending: Token)
	{
		const temp: AST[number][] = [];

		style:
		while (true)
		{
			const t = this.lookup(); if (until.includes(t)) break style;

			switch (t)
			{
				case null:
				case T.BR:
				{
					break style;
				}
				case ending:
				{
					this.next(); break style;
				}
				default:
				{
					if (typeof t === "string")
					{
						temp.push(this.next() as string);
					}
					else
					{
						temp.push(...this.inline([...until, ending]));
					}
					continue style;
				}
			}
		}
		return temp;
	}
}

export default new Helper(new Scanner(Object.values(T)), new Preset());
