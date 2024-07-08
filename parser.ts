import Scanner, { Context, Token } from "./scanner";

const EOF = Symbol();

abstract class AST
{
	public readonly children: (string | AST)[] = [];

	constructor(...children: AST["children"])
	{
		this.children.push(...children);
	}

	public get first()
	{
		return this.children[0];
	}

	public get last()
	{
		return this.children[this.children.length - 1];
	}

	public get body()
	{
		return this.children.map((child) => typeof child === "string" ? child : child.render()).join("");
	}

	public abstract render(): string;
}
//
// block
//
class H1 extends AST
{
	override render()
	{
		return `<h1>${this.body}</h1>`;
	}
}

class H2 extends AST
{
	override render()
	{
		return `<h2>${this.body}</h2>`;
	}
}

class H3 extends AST
{
	override render()
	{
		return `<h3>${this.body}</h3>`;
	}
}

class H4 extends AST
{
	override render()
	{
		return `<h4>${this.body}</h4>`;
	}
}

class H5 extends AST
{
	override render()
	{
		return `<h5>${this.body}</h5>`;
	}
}

class H6 extends AST
{
	override render()
	{
		return `<h6>${this.body}</h6>`;
	}
}

class HR extends AST
{
	override render()
	{
		return `<hr/>`;
	}
}
//
// stack
//
class BQ extends AST
{
	override render()
	{
		return `<blockquote>${this.body}</blockquote>`;
	}
}

class OL extends AST
{
	override render()
	{
		return `<ol>${this.body}</ol>`;
	}
}

class UL extends AST
{
	override render()
	{
		return `<ul>${this.body}</ul>`;
	}
}

class LI extends AST
{
	override render()
	{
		return `<li>${this.body}</li>`;
	}
}
//
// inline
//
class BR extends AST
{
	override render()
	{
		return `<br>`;
	}
}

class PR extends AST
{
	override render()
	{
		return `<p>${this.body}</p>`
	}
}

class BOLD extends AST
{
	override render()
	{
		return `<strong>${this.body}</strong>`
	}
}

class ITALIC extends AST
{
	override render()
	{
		return `<i>${this.body}</i>`
	}
}

class UNDERLINE extends AST
{
	override render()
	{
		return `<u>${this.body}</u>`
	}
}

class STRIKETHROUGH extends AST
{
	override render()
	{
		return `<s>${this.body}</s>`
	}
}

class UNCHECKED_BOX extends AST
{
	override render()
	{
		return `<input type="checkbox" onClick="return false"/>`;
	}
}

class CHECKED_BOX extends AST
{
	override render()
	{
		return `<input type="checkbox" checked onClick="return false"/>`;
	}
}

class IMAGE extends AST
{
	constructor(private readonly alt: string, private readonly src: string)
	{
		super();
	}

	override render()
	{
		return `<img alt="${this.alt}" src="${this.src}">`;
	}
}

class BACKLINK extends AST
{
	constructor(private readonly text: string, private readonly href: string)
	{
		super();
	}

	override render()
	{
		return `<a href="${this.href}">${this.text}</a>`;
	}
}

export default class Parser
{
	public static run(tokens: ReturnType<typeof Scanner.run>)
	{
		return new Parser(tokens).run();
	}

	private readonly origin = new (class ROOT extends AST
	{
		override render()
		{
			return `<article class="md">${this.body}</article>`;
		}
	})
	();
	//
	// pointer
	//
	private i = 0; private node: AST = this.origin;

	private constructor(private readonly tokens: ReturnType<typeof Scanner.run>)
	{
		// final
	}

	private run()
	{
		main:
		while (this.peek() !== EOF)
		{
			const ast = this._block();
			// ast may be null due to edge cases
			if (ast) this.node.children.push(ast);
		}
		return this.origin;
	}

	private peek()
	{
		return (this.tokens[this.i] ?? EOF) as string | Token | typeof EOF;
	}

	private consume(token?: "string" | Token)
	{
		if (token && (token === "string" ? typeof this.peek() !== "string" : this.peek() !== token))
		{
			throw new Error(`Unexpected token ${this.peek().constructor.name} at position ${this.i}`);
		}
		return (this.tokens[this.i++] ?? EOF) as string | Token | typeof EOF;
	}

	private _block()
	{
		main:
		switch (this.peek())
		{
			case Token.BREAK:
			{
				this.consume();
				// reset pointer
				this.node = this.origin;

				if (this.peek() instanceof Token)
				{
					if (this.peek() === Token.BREAK)
					{
						// edge case - itself
						return new BR();
					}
					if ((this.peek() as Token).ctx === Context.INLINE)
					{
						// general case - inline
						return new BR();
					}
				}
				return null;
			}
			case Token.H1:
			{
				this.consume(); return new H1(this._inline());
			}
			case Token.H2:
			{
				this.consume(); return new H2(this._inline());
			}
			case Token.H3:
			{
				this.consume(); return new H3(this._inline());
			}
			case Token.H4:
			{
				this.consume(); return new H4(this._inline());
			}
			case Token.H5:
			{
				this.consume(); return new H5(this._inline());
			}
			case Token.H6:
			{
				this.consume(); return new H6(this._inline());
			}
			case Token.HR_A:
			case Token.HR_B:
			case Token.HR_C:
			{
				this.consume(); return new HR(); // no children
			}
			default:
			{
				return this._stack();
			}
		}
	}

	private _stack()
	{
		switch (this.peek())
		{
			case Token.INDENT_1T:
			case Token.INDENT_2S:
			case Token.INDENT_4S:
			{
				indent:
				while (true)
				{
					switch (this.peek())
					{
						// redundant lookup... im sorry :(
						case Token.INDENT_1T:
						case Token.INDENT_2S:
						case Token.INDENT_4S:
						{		
							switch (this.node.last?.constructor)
							{
								case OL:
								case UL:
								{
									this.consume();
									// pickup
									this.node = this.node.last as AST;
									break;
								}
								default:
								{
									// fuck
									this.node = this.origin;
									// insert
									this.node.children.push(this._inline());
									// indent level mismatch, exit
									break indent;
								}
							}
							// more to go
							continue indent;
						}
						default:
						{
							const ast = this._stack();
							// insert
							if (ast) this.node.children.push(ast);
							// no more indent, exit
							break indent;
						}
					}
				}
				return null;
			}
			case Token.BQ_A:
			case Token.BQ_B:
			{
				this.consume(); return this._bq();
			}
			case Token.OL:
			{
				this.consume(); return this._ol();
			}
			case Token.UL:
			{
				this.consume(); return this._ul();
			}
			default:
			{
				return this._inline();
			}
		}
	}

	private _bq()
	{
		const node = new PR();

		switch (this.node.last?.constructor)
		{
			case BQ:
			{
				// skip
				break;
			}
			default:
			{
				this.node.children.push(new BQ());
				break;
			}
		}
		// pickup
		this.node = this.node.last as AST;

		const ast = this._stack();

		switch (ast?.constructor)
		{
			case OL:
			case UL:
			case LI:
			{
				this.node.children.push(ast); this.node = this.node.last as AST;
				break;
			}
			case PR:
			{
				node.children.push(...(ast as AST).children);
				break;
			}
			default:
			{
				if (ast) node.children.push(ast);
				break;
			}
		}

		if (node.children.length)
		{
			this.node.children.push(node);
		}
		return null;
	}

	private _ol()
	{
		const [node, ast] = [new LI(), this._stack()];

		if (ast) node.children.push(...ast.children);

		switch (this.node.last?.constructor)
		{
			case OL:
			case UL:
			{
				// pickup
				this.node = this.node.last as AST;
				this.node.children.push(node);
				break;
			}
			default:
			{
				// insert
				this.node.children.push(new OL(node));
				break;
			}
		}
		return null;
	}

	private _ul()
	{
		const [node, ast] = [new LI(), this._stack()];

		if (ast) node.children.push(...ast.children);

		switch (this.node.last?.constructor)
		{
			case OL:
			case UL:
			{
				// pickup
				this.node = this.node.last as AST;
				this.node.children.push(node);
				break;
			}
			default:
			{
				// insert
				this.node.children.push(new UL(node));
				break;
			}
		}
		return null;
	}

	private _inline()
	{
		const node = new PR();

		main:
		while (true)
		{
			switch (this.peek())
			{
				case EOF: case Token.BREAK:
				{
					break main; // let block handle Token.BREAK
				}
				//
				// "Exhaust every possibility until none are left." - Raphael
				//
				case Token.COMMENT_L:
				{
					comment:
					while (true)
					{
						switch (this.consume())
						{
							case EOF: case Token.COMMENT_R:
							{
								this.consume(); break comment;
							}
						}
					}
					continue main;
				}
				//
				// ![alt](url)
				//
				case Token.EXCLAMATION:
				{
					/* this.consume(); */ node.children.push(this._image()); continue main;
				}
				//
				// [text](url)
				//
				case Token.BRACKET_L:
				{
					/* this.consume(); */ node.children.push(this._backlink()); continue main;
				}
				case Token.BOLD:
				{
					this.consume(); node.children.push(this._bold()); continue main;
				}
				case Token.ITALIC:
				{
					this.consume(); node.children.push(this._italic()); continue main;
				}
				case Token.UNDERLINE:
				{
					this.consume(); node.children.push(this._underline()); continue main;
				}
				case Token.STRIKETHROUGH:
				{
					this.consume(); node.children.push(this._strikethrough()); continue main;
				}
				case Token.UNCHECKED_BOX:
				{
					this.consume(); node.children.push(new UNCHECKED_BOX()); continue main;
				}
				case Token.CHECKED_BOX:
				{
					this.consume(); node.children.push(new CHECKED_BOX()); continue main;
				}
				case Token.ARROW_ALL:
				{
					this.consume(); node.children.push("↔"); continue main;
				}
				case Token.ARROW_LEFT:
				{
					this.consume(); node.children.push("←"); continue main;
				}
				case Token.ARROW_RIGHT:
				{
					this.consume(); node.children.push("→"); continue main;
				}
				case Token.FAT_ARROW_ALL:
				{
					this.consume(); node.children.push("⇔"); continue main;
				}
				case Token.FAT_ARROW_LEFT:
				{
					this.consume(); node.children.push("⇐"); continue main;
				}
				case Token.FAT_ARROW_RIGHT:
				{
					this.consume(); node.children.push("⇒"); continue main;
				}
				case Token.MATH_APX:
				{
					this.consume(); node.children.push("≈"); continue main;
				}
				case Token.MATH_NET:
				{
					this.consume(); node.children.push("≠"); continue main;
				}
				case Token.MATH_LTOET:
				{
					this.consume(); node.children.push("≤"); continue main;
				}
				case Token.MATH_GTOET:
				{
					this.consume(); node.children.push("≥"); continue main;
				}
				//
				// fallback
				//
				case Token.INDENT_1T:
				{
					this.consume(); node.children.push("&nbsp".repeat(4)); continue main;
				}
				case Token.INDENT_2S:
				{
					this.consume(); node.children.push("&nbsp".repeat(2)); continue main;
				}
				case Token.INDENT_4S:
				{
					this.consume(); node.children.push("&nbsp".repeat(4)); continue main;
				}
				case Token.COMMENT_R:
				case Token.BRACKET_R:
				case Token.PAREN_L:
				case Token.PAREN_R:
				case Token.OL:
				case Token.UL:
				{
					node.children.push((this.consume() as Token).grammar); continue main;
				}
				default:
				{
					if (typeof this.peek() === "string")
					{
						node.children.push(this.consume() as string); continue main;
					}
					else
					{
						throw new Error(`Unexpected token ${this.peek().constructor.name} at position ${this.i}`);
					}
				}
			}
		}
		return node;
	}

	private _bold()
	{
		const node = new BOLD();

		main:
		while (true)
		{
			switch (this.peek())
			{
				case EOF: case Token.BREAK:
				{
					break main; // let block handle Token.BREAK
				}
				case Token.BOLD:
				{
					this.consume(); break main;
				}
				default:
				{
					if (typeof this.peek() === "string")
					{
						node.children.push(this.consume() as string);
					}
					else
					{
						node.children.push(...this._inline().children);
					}
					break;
				}
			}
		}
		return node;
	}

	private _italic()
	{
		const node = new ITALIC();

		main:
		while (true)
		{
			switch (this.peek())
			{
				case EOF: case Token.BREAK:
				{
					break main; // let block handle Token.BREAK
				}
				case Token.ITALIC:
				{
					this.consume(); break main;
				}
				default:
				{
					if (typeof this.peek() === "string")
					{
						node.children.push(this.consume() as string);
					}
					else
					{
						node.children.push(...this._inline().children);
					}
					break;
				}
			}
		}
		return node;
	}

	private _underline()
	{
		const node = new UNDERLINE();

		main:
		while (true)
		{
			switch (this.peek())
			{
				case EOF: case Token.BREAK:
				{
					break main; // let block handle Token.BREAK
				}
				case Token.UNDERLINE:
				{
					this.consume(); break main;
				}
				default:
				{
					if (typeof this.peek() === "string")
					{
						node.children.push(this.consume() as string);
					}
					else
					{
						node.children.push(...this._inline().children);
					}
					break;
				}
			}
		}
		return node;
	}

	private _strikethrough()
	{
		const node = new STRIKETHROUGH();

		main:
		while (true)
		{
			switch (this.peek())
			{
				case EOF: case Token.BREAK:
				{
					break main; // let block handle Token.BREAK
				}
				case Token.STRIKETHROUGH:
				{
					this.consume(); break main;
				}
				default:
				{
					if (typeof this.peek() === "string")
					{
						node.children.push(this.consume() as string);
					}
					else
					{
						node.children.push(...this._inline().children);
					}
					break;
				}
			}
		}
		return node;
	}

	private _image()
	{
		const fallback: ReturnType<typeof this.consume>[] = [];

		try
		{
			for (const syntax of [Token.EXCLAMATION, Token.BRACKET_L, ("string" as const), Token.BRACKET_R, Token.PAREN_L, ("string" as const), Token.PAREN_R])
			{
				fallback.push(this.consume(syntax));
			}
			if (this.node.last.constructor === BR)
			{
				// dedupe newline
				this.node.children.pop();
			}
			return new IMAGE(fallback[2] as string, fallback[5] as string);
		}
		catch (error)
		{
			return fallback.map((_) => _ instanceof Token ? _.grammar : _.toString()).join("");
		}
	}

	private _backlink()
	{
		const fallback: ReturnType<typeof this.consume>[] = [];

		try
		{
			for (const syntax of [Token.BRACKET_L, ("string" as const), Token.BRACKET_R, Token.PAREN_L, ("string" as const), Token.PAREN_R])
			{
				fallback.push(this.consume(syntax));
			}
			if (this.node.last.constructor === BR)
			{
				// dedupe newline
				this.node.children.pop();
			}
			return new BACKLINK(fallback[1] as string, fallback[4] as string);
		}
		catch (error)
		{
			return fallback.map((_) => _ instanceof Token ? _.grammar : _.toString()).join("");
		}
	}
}
