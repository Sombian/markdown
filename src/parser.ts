
import AST from "./models/AST";
import Token from "./models/Token";

import Scanner from "./scanner";

export default class Parser
{
	private data: ReturnType<typeof Scanner.prototype.scan> = []; private i = 0;

	constructor(private readonly handle: ({ peek, next, until }:
	{
		readonly peek: typeof Parser.prototype.peek,
		readonly next: typeof Parser.prototype.next,
		readonly until: Token[],
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
				return `<article class="md">${this.body}</article>`;
			}
		})
		();
		//
		// iterate
		//
		while (this.i in this.data)
		{
			try
			{
				root.children.push(this.handle(
				{
					peek: this.peek.bind(this),
					next: this.next.bind(this),
					until: [],
				}));
			}
			catch (error)
			{
				if (error === "EOF") continue;

				console.debug(error);

				break;
			}
		}
		return root;
	}

	private peek(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token found at position ${this.i}; ${{ expect: type.constructor.name, found: this.data[this.i].constructor.name }}`);
		}
		return this.i in this.data ? this.data[this.i] : null;
	}

	private next(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token found at position ${this.i}; ${{ expect: type.constructor.name, found: this.data[this.i].constructor.name }}`);
		}
		return this.i in this.data ? this.data[this.i++] : null;
	}
}
