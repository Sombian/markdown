import Helper from "@/helper";
import Scanner from "@/scanner";
import Parser from "@/parser";
import AST from "@/models/ast";
import Token from "@/models/token";
import Level from "@/enums/level";
import * as XML from "@/DOM";

abstract class _ extends Token
{
	constructor(...args: [...Take<ConstructorParameters<typeof Token>, 2>, Level?])
	{
		const [lvl, syntax, next] = args;
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
	(Level.BLOCK, "---" + "\n"),
	HR_2: new (class HR_2 extends _ {})
	(Level.BLOCK, "===" + "\n"),
	//-------//
	//       //
	// STACK //
	//       //
	//-------//
	OL: new (class OL extends _ { })
	(Level.BLOCK, "- ", Level.BLOCK),
	UL: new (class UL extends _ { })
	(Level.BLOCK, "~ ", Level.BLOCK),
	BQ_1: new (class BQ_1 extends _ { })
	(Level.BLOCK, ">", Level.BLOCK),
	BQ_2: new (class BQ_2 extends _ { })
	(Level.BLOCK, "> ", Level.BLOCK),
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
	constructor()
	{
		super();
		//-------//
		//       //
		// BLOCK //
		//       //
		//-------//
		this.rule(T.H1, () =>
		{
			const temp = new XML.H1(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(T.H2, () =>
		{
			const temp = new XML.H2(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(T.H3, () =>
		{
			const temp = new XML.H3(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(T.H4, () =>
		{
			const temp = new XML.H4(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(T.H5, () =>
		{
			const temp = new XML.H5(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(T.H6, () =>
		{
			const temp = new XML.H6(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(T.HR_1, () =>
		{
			return new XML.HR(/* leaf node */);
		});
		this.rule(T.HR_2, () =>
		{
			return new XML.HR(/* leaf node */);
		});
		this.rule(T.OL, (t) =>
		{
			return this.stack(t);
		});
		this.rule(T.UL, (t) =>
		{
			return this.stack(t);
		});
		this.rule(T.BQ_1, (t) =>
		{
			return this.stack(t);
		});
		this.rule(T.BQ_2, (t) =>
		{
			return this.stack(t);
		});
		//--------//
		//        //
		// INLINE //
		//        //
		//--------//
		this.rule(T.BR, () =>
		{
			throw new XML.BR(/* leaf node */);
		});
		this.rule(T.BOLD, (t) =>
		{
			const temp = new XML.BOLD(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(T.CODE, (t) =>
		{
			const temp = new XML.CODE(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(T.ITALIC, (t) =>
		{
			const temp = new XML.ITALIC(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(T.STRIKE, (t) =>
		{
			const temp = new XML.STRIKE(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(T.UNDERLINE, (t) =>
		{
			const temp = new XML.UNDERLINE(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(T.CHECKED_BOX, () =>
		{
			return new XML.TODO(true);
		});
		this.rule(T.UNCHECKED_BOX, () =>
		{
			return new XML.TODO(false);
		});
		this.rule(T.ARROW_ALL, () =>
		{
			return "↔";
		});
		this.rule(T.ARROW_LEFT, () =>
		{
			return "←";
		});
		this.rule(T.ARROW_RIGHT, () =>
		{
			return "→";
		});
		this.rule(T.FAT_ARROW_ALL, () =>
		{
			return "⇔";
		});
		this.rule(T.FAT_ARROW_LEFT, () =>
		{
			return "⇐";
		});
		this.rule(T.FAT_ARROW_RIGHT, () =>
		{
			return "⇒";
		});
		this.rule(T.MATH_APX, () =>
		{
			return "≈";
		});
		this.rule(T.MATH_NET, () =>
		{
			return "≠";
		});
		this.rule(T.MATH_LTOET, () =>
		{
			return "≤";
		});
		this.rule(T.MATH_GTOET, () =>
		{
			return "≥";
		});
		//---------//
		//         //
		// PATTERN //
		//         //
		//---------//
		this.rule(T.BRACKET_L, () =>
		{
			let string = "";
			try
			{
				string += this.consume(T.BRACKET_L)!.toString();

				const text: ConstructorParameters<typeof XML.BACKLINK>[0] = this.inline(T.BRACKET_R).body || null; if (text) string += text;

				string += this.consume(T.BRACKET_R)!.toString();
				string += this.consume(T.PAREN_L)!.toString();

				const href: ConstructorParameters<typeof XML.BACKLINK>[1] = this.inline(T.PAREN_R).body || null; if (href) string += href;

				string += this.consume(T.PAREN_R)!.toString();

				return new XML.BACKLINK(text, href);
			}
			catch
			{
				return string;
			}
		});
		this.rule(T.EXCLAMATION, () =>
		{
			let string = "";
			try
			{
				string += this.consume(T.EXCLAMATION)!.toString();
				string += this.consume(T.BRACKET_L)!.toString();

				const alt: ConstructorParameters<typeof XML.EM>[0] = this.inline(T.BRACKET_R).body || null; if (alt) string += alt;

				string += this.consume(T.BRACKET_R)!.toString();
				string += this.consume(T.PAREN_L)!.toString();

				const src: ConstructorParameters<typeof XML.EM>[1] = this.inline(T.PAREN_R).body || null; if (src) string += src;

				string += this.consume(T.PAREN_R)!.toString();

				return new XML.EM(alt, src);
			}
			catch
			{
				return string;
			}
		});
	}

	override peek(type?: Token)
	{
		if (type)
		{
			return super.peek(type);
		}
		let t: ReturnType<Parser["peek"]>;

		main:
		switch (t = super.peek())
		{
			case T.COMMENT_L:
			{
				comment:
				while (true)
				{
					switch (t = this.consume())
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
				try
				{
					this.consume(T.BR);
				}
				catch
				{
					/* ignore */
				}
				finally
				{
					t = super.peek();
				}
				break main;
			}
		}
		return t;
	}

	private stack(token: Token)
	{
		let LI: boolean;

		function type(token: Token)
		{
			switch (token)
			{
				case T.OL: { LI = true; return XML.OL; }
				case T.UL: { LI = true; return XML.UL; }
				case T.BQ_1: { LI = false; return XML.BQ; }
				case T.BQ_2: { LI = false; return XML.BQ; }
			}
			throw new Error();
		}
		const root = new (type(token))();

		let node: Nullable<typeof root> = root;

		stack:
		while (true)
		{
			const t = this.peek();

			build:
			switch (t)
			{
				case null:
				{
					break stack;
				}
				case T.BR:
				{
					// if EOL is found before BQ/OL/UL
					if (!node) break stack;
					this.consume();
					node = null;
					break build;
				}
				case T.OL:
				case T.UL:
				case T.BQ_1:
				case T.BQ_2:
				{
					// get the most recently working node
					const ast = node?.at(-1) ?? root;

					const html = type(t);
					
					// if the types of ast and token correspond
					if (ast instanceof html)
					{
						this.consume();
						// pickup
						node = ast as AST;
					}
					// if the types of ast and token differ
					else if (node)
					{
						this.consume();
						// insert
						node.push(node = new html());
					}
					// if a diff type of ast is found before its kind
					else
					{
						break stack;
					}
					break build;
				}
				case T.INDENT_1T:
				case T.INDENT_2S:
				case T.INDENT_4S:
				{
					// get the most recently working node
					const ast = node?.at(-1) ?? root;

					// if an indent is found after OL/UL
					if (!(ast instanceof XML.BQ))
					{
						this.consume();
						// pickup
						node = ast as AST;
					}
					// if an indent is found after BQ
					else if (node)
					{
						// insert
						node.push(this.inline(T.BR));
					}
					// if an indent is found after BQ/OL/UL
					else
					{
						break stack;
					}
					break build;
				}
				default:
				{
					// if an inline element is found before a block element
					if (!node) break stack;

					// @ts-expect-error stfu
					node.push(...(!LI
						?
						[this.inline(T.BR), new XML.BR()]
						:
						[new XML.LI(...this.inline(T.BR))]
					));
					LI = false;
					break build;
				}
			}
		}
		return root;
	}
}

export default new Helper(new Scanner(Object.values(T)), new Preset());
