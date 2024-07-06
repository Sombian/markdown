import Scanner, { Token } from "./scanner";

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
		return this.body;
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

const EOF = Symbol();

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
			// ast may be null due to indent
			if (ast) this.node.children.push(ast);
		}
		if (true)
		{
			console.debug(require("util").inspect(this.origin, { depth: null }));
		}
		return this.origin;
	}

	private peek(offset = 0)
	{
		if ((this.i += offset) >= this.tokens.length)
		{
			return EOF;
		}
		return this.tokens[this.i];
	}

	private consume(token?: Token)
	{
		if (token && this.peek() !== token)
		{
			throw new Error(`Unexpected token ${this.peek().toString()} at position ${this.i}`);
		}
		this.i++; // next
	}

	private _block()
	{
		main:
		switch (this.peek())
		{
			case Token.BREAK:
			{
				this.consume(); this.node = this.origin; return null;
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
				this.consume(); return  new H4(this._inline());
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
				const token = this.peek(); this.consume();

				switch (this.node.last?.constructor)
				{
					case OL:
					case UL:
					{
						// pickup
						this.node = this.node.last as AST; return null;
					}
				}
				// fallback
				return (token as Token).grammar;
			}
			case Token.BQ:
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

		main:
		while (true)
		{
			switch (this.peek())
			{
				case EOF: case Token.BREAK:
				{
					break main; // let block handle Token.BREAK
				}
				default:
				{
					const token = this.peek();

					if (typeof token === "string")
					{
						this.consume(); node.children.push(token);
					}
					else
					{
						const ast = this._stack();
						// ast may be null due to indent
						if (ast) node.children.push(...(typeof ast === "string" ? [ast] : (ast as AST).children));
					}
					break;
				}
			}
		}
		switch (this.node.last?.constructor)
		{
			case BQ:
			{
				this.node = this.node.last as AST; return node;
			}
			default:
			{
				return new BQ(node);
			}
		}
	}

	private _ol()
	{
		const node = new LI();

		main:
		while (true)
		{
			switch (this.peek())
			{
				case EOF: case Token.BREAK:
				{
					break main; // let block handle Token.BREAK
				}
				default:
				{
					const token = this.peek();

					if (typeof token === "string")
					{
						this.consume(); node.children.push(token);
					}
					else
					{
						const ast = this._stack();
						// ast may be null due to indent
						if (ast) node.children.push(ast);
					}
					break;
				}
			}
		}
		return new OL(node);
	}

	private _ul()
	{
		const node = new LI();

		main:
		while (true)
		{
			switch (this.peek())
			{
				case EOF: case Token.BREAK:
				{
					break main; // let block handle Token.BREAK
				}
				default:
				{
					const token = this.peek();

					if (typeof token === "string")
					{
						this.consume(); node.children.push(token);
					}
					else
					{
						const ast = this._stack();
						// ast may be null due to indent
						if (ast) node.children.push(ast);
					}
					break;
				}
			}
		}
		return new UL(node);
	}

	private _inline()
	{
		const ast = new PR();

		main:
		while (true)
		{
			switch (this.peek())
			{
				case EOF: case Token.BREAK:
				{
					ast.children.push(new BR()); break main; // let block handle Token.BREAK
				}
				case Token.BOLD:
				{
					this.consume(); ast.children.push(this._bold()); break;
				}
				case Token.ITALIC:
				{
					this.consume(); ast.children.push(this._italic()); break;
				}
				case Token.UNDERLINE:
				{
					this.consume(); ast.children.push(this._underline()); break;
				}
				case Token.STRIKETHROUGH:
				{
					this.consume(); ast.children.push(this._strikethrough()); break;
				}
				case Token.UNCHECKED_BOX:
				{
					this.consume(); ast.children.push(new UNCHECKED_BOX()); break;
				}
				case Token.CHECKED_BOX:
				{
					this.consume(); ast.children.push(new CHECKED_BOX()); break;
				}
				case Token.ARROW_ALL:
				{
					this.consume(); ast.children.push("↔"); break;
				}
				case Token.ARROW_LEFT:
				{
					this.consume(); ast.children.push("←"); break;
				}
				case Token.ARROW_RIGHT:
				{
					this.consume(); ast.children.push("→"); break;
				}
				case Token.FAT_ARROW_ALL:
				{
					this.consume(); ast.children.push("⇔"); break;
				}
				case Token.FAT_ARROW_LEFT:
				{
					this.consume(); ast.children.push("⇐"); break;
				}
				case Token.FAT_ARROW_RIGHT:
				{
					this.consume(); ast.children.push("⇒"); break;
				}
				case Token.MATH_APX:
				{
					this.consume(); ast.children.push("≈"); break;
				}
				case Token.MATH_NET:
				{
					this.consume(); ast.children.push("≠"); break;
				}
				case Token.MATH_LTOET:
				{
					this.consume(); ast.children.push("≤"); break;
				}
				case Token.MATH_GTOET:
				{
					this.consume(); ast.children.push("≥"); break;
				}
				default:
				{
					const token = this.peek();
	
					if (typeof token === "string")
					{
						this.consume(); ast.children.push(token); break;
					}
					else
					{
						throw new Error(`Unexpected token ${token.constructor.name} at position ${this.i}`);
					}
				}
			}
		}
		return ast;
	}

	private _bold()
	{
		const ast = new BOLD();

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
					const token = this.peek();

					if (typeof token === "string")
					{
						this.consume(); ast.children.push(token);
					}
					else
					{
						ast.children.push(this._inline());
					}
					break;
				}
			}
		}
		return ast;
	}

	private _italic()
	{
		const ast = new ITALIC();

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
					const token = this.peek();

					if (typeof token === "string")
					{
						this.consume(); ast.children.push(token);
					}
					else
					{
						ast.children.push(this._inline());
					}
					break;
				}
			}
		}
		return ast;
	}

	private _underline()
	{
		const ast = new UNDERLINE();

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
					const token = this.peek();

					if (typeof token === "string")
					{
						this.consume(); ast.children.push(token);
					}
					else
					{
						ast.children.push(this._inline());
					}
					break;
				}
			}
		}
		return ast;
	}

	private _strikethrough()
	{
		const ast = new STRIKETHROUGH();

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
					const token = this.peek();

					if (typeof token === "string")
					{
						this.consume(); ast.children.push(token);
					}
					else
					{
						ast.children.push(this._inline());
					}
					break;
				}
			}
		}
		return ast;
	}
}
