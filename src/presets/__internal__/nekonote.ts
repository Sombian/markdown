import Helper from "@/helper";
import Scanner from "@/scanner";
import Parser from "@/parser";
import AST from "@/models/ast";
import Token from "@/models/token";
import Level from "@/enums/level";
import * as DOM from "@/DOM";

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
		this.rule(Level.BLOCK, T.BR, () =>
		{
			return new DOM.BR(/* leaf node */);
		});
		this.rule(Level.BLOCK, T.H1, () =>
		{
			const temp = new DOM.H1(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.BLOCK, T.H2, () =>
		{
			const temp = new DOM.H2(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.BLOCK, T.H3, () =>
		{
			const temp = new DOM.H3(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.BLOCK, T.H4, () =>
		{
			const temp = new DOM.H4(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.BLOCK, T.H5, () =>
		{
			const temp = new DOM.H5(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.BLOCK, T.H6, () =>
		{
			const temp = new DOM.H6(...this.inline()); try { this.consume(T.BR); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.BLOCK, T.HR_1, () =>
		{
			return new DOM.HR(/* leaf node */);
		});
		this.rule(Level.BLOCK, T.HR_2, () =>
		{
			return new DOM.HR(/* leaf node */);
		});
		this.rule(Level.BLOCK, T.OL, (t) =>
		{
			return this.stack(t);
		});
		this.rule(Level.BLOCK, T.UL, (t) =>
		{
			return this.stack(t);
		});
		this.rule(Level.BLOCK, T.BQ_1, (t) =>
		{
			return this.stack(t);
		});
		this.rule(Level.BLOCK, T.BQ_2, (t) =>
		{
			return this.stack(t);
		});
		//--------//
		//        //
		// INLINE //
		//        //
		//--------//
		this.rule(Level.INLINE, T.BR, () =>
		{
			throw "exit";
		});
		this.rule(Level.INLINE, T.BOLD, (t) =>
		{
			const temp = new DOM.BOLD(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.INLINE, T.CODE, (t) =>
		{
			const temp = new DOM.CODE(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.INLINE, T.ITALIC, (t) =>
		{
			const temp = new DOM.ITALIC(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.INLINE, T.STRIKE, (t) =>
		{
			const temp = new DOM.STRIKE(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.INLINE, T.UNDERLINE, (t) =>
		{
			const temp = new DOM.UNDERLINE(...this.inline(T.BR, t)); try { this.consume(t); } catch { /* ignore */ } return temp;
		});
		this.rule(Level.INLINE, T.CHECKED_BOX, () =>
		{
			return new DOM.TODO(true);
		});
		this.rule(Level.INLINE, T.UNCHECKED_BOX, () =>
		{
			return new DOM.TODO(false);
		});
		this.rule(Level.INLINE, T.ARROW_ALL, () =>
		{
			return "↔";
		});
		this.rule(Level.INLINE, T.ARROW_LEFT, () =>
		{
			return "←";
		});
		this.rule(Level.INLINE, T.ARROW_RIGHT, () =>
		{
			return "→";
		});
		this.rule(Level.INLINE, T.FAT_ARROW_ALL, () =>
		{
			return "⇔";
		});
		this.rule(Level.INLINE, T.FAT_ARROW_LEFT, () =>
		{
			return "⇐";
		});
		this.rule(Level.INLINE, T.FAT_ARROW_RIGHT, () =>
		{
			return "⇒";
		});
		this.rule(Level.INLINE, T.MATH_APX, () =>
		{
			return "≈";
		});
		this.rule(Level.INLINE, T.MATH_NET, () =>
		{
			return "≠";
		});
		this.rule(Level.INLINE, T.MATH_LTOET, () =>
		{
			return "≤";
		});
		this.rule(Level.INLINE, T.MATH_GTOET, () =>
		{
			return "≥";
		});
		//---------//
		//         //
		// PATTERN //
		//         //
		//---------//
		this.rule(Level.INLINE, T.BRACKET_L, () =>
		{
			let string = "";
			try
			{
				string += this.consume(T.BRACKET_L)!.toString();

				const text: ConstructorParameters<typeof DOM.BACKLINK>[0] = this.inline(T.BRACKET_R).body || null; if (text) string += text;

				string += this.consume(T.BRACKET_R)!.toString();
				string += this.consume(T.PAREN_L)!.toString();

				const href: ConstructorParameters<typeof DOM.BACKLINK>[1] = this.inline(T.PAREN_R).body || null; if (href) string += href;

				string += this.consume(T.PAREN_R)!.toString();

				return new DOM.BACKLINK(text, href);
			}
			catch
			{
				return string;
			}
		});
		this.rule(Level.INLINE, T.EXCLAMATION, () =>
		{
			let string = "";
			try
			{
				string += this.consume(T.EXCLAMATION)!.toString();
				string += this.consume(T.BRACKET_L)!.toString();

				const alt: ConstructorParameters<typeof DOM.EM>[0] = this.inline(T.BRACKET_R).body || null; if (alt) string += alt;

				string += this.consume(T.BRACKET_R)!.toString();
				string += this.consume(T.PAREN_L)!.toString();

				const src: ConstructorParameters<typeof DOM.EM>[1] = this.inline(T.PAREN_R).body || null; if (src) string += src;

				string += this.consume(T.PAREN_R)!.toString();

				return new DOM.EM(alt, src);
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
							throw "exit"
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
		let is_item: boolean;

		function type(token: Token)
		{
			switch (token)
			{
				case T.OL: { is_item = true; return DOM.OL; }
				case T.UL: { is_item = true; return DOM.UL; }
				case T.BQ_1: { is_item = false; return DOM.BQ; }
				case T.BQ_2: { is_item = false; return DOM.BQ; }
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

					const stack = type(t);
					
					// if the types of ast and token correspond
					if (ast instanceof stack)
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
						node.push(node = new stack());
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

					indent:
					switch (ast.constructor)
					{
						case DOM.OL:
						case DOM.UL:
						{
							this.consume();
							node = ast as AST;
							break indent;
						}
						default:
						{
							// if an indent is found before BQ/OL/UL
							if (!node) break stack;
							node.push(this.inline(T.BR));
							break indent;
						}
					}
					break build;
				}
				default:
				{
					// if an inline element is found before a block element
					if (!node) break stack;

					// @ts-expect-error stfu
					node.push(...(!is_item
						?
						[this.inline(T.BR), new DOM.BR()]
						:
						[new DOM.LI(...this.inline(T.BR))]
					));
					is_item = false;
					break build;
				}
			}
		}
		return root;
	}
}

export default new Helper(new Scanner(Object.values(T)), new Preset());
