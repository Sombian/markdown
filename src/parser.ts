import Scanner from "./scanner";

import AST from "./models/ast";
import Token from "./models/token";

export default class Parser
{
	private data: ReturnType<typeof Scanner.prototype.scan> = []; private i = 0;

	constructor(private readonly impl: ({ peek, next }:
	{
		readonly peek: typeof Parser.prototype.peek,
		readonly next: typeof Parser.prototype.next,
	}
	) => AST)
	{
		// TODO: none
	}

	public parse(data: typeof this.data)
	{
		this.data = data; this.i = 0; const root = new (class ROOT extends AST
		{
			override render()
			{
				// TODO: maybe just return this.body
				return `<article class="md">${this.body}</article>`;
			}
		})
		();
		//---------------------------//
		//                           //
		// RECURSIVE DESCENT PARSING //
		//                           //
		//---------------------------//
		
		while (this.i in this.data)
		{
			try
			{
				root.children.push(this.impl(
				{
					peek: this.peek.bind(this),
					next: this.next.bind(this),
				}));
			}
			catch (error)
			{
				if (error === "EOF") continue;

				console.error(error);

				break;
			}
		}
		return root;
	}

	private peek(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token found at position ${this.i}. Expected '${type.constructor.name}', but found '${this.data[this.i].constructor.name}'`);
		}
		return this.i in this.data ? this.data[this.i] : null;
	}

	private next(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token found at position ${this.i}. Expected '${type.constructor.name}', but found '${this.data[this.i].constructor.name}'`);
		}
		return this.i in this.data ? this.data[this.i++] : null;
	}
}
