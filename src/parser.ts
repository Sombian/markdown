import Scanner, { Token } from "./scanner";

export abstract class AST
{
	public readonly children: (string | AST)[];

	constructor(...children: AST["children"])
	{
		this.children = children;
	}

	public get body()
	{
		return this.children.map((child) => typeof child === "string" ? child : child.render()).join("");
	}

	public abstract render(): string;
}

export default class Parser
{
	private data: ReturnType<typeof Scanner.prototype.scan>; private i: number;

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

	public parse(data: typeof Parser.prototype.data)
	{
		const root = new (class ROOT extends AST
		{
			override render()
			{
				return `<article class="md">${this.body}</article>`;
			}
		})
		();
		//
		// assign
		//
		[this.data, this.i] = [data, 0];
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
				if (error !== "EOF") console.debug(error);
			}
		}
		return root;
	}

	private peek(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token ${this.data[this.i].constructor.name} at position ${this.i}`);
		}
		return this.i in this.data ? this.data[this.i] : null;
	}

	private next(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token ${this.data[this.i].constructor.name} at position ${this.i}`);
		}
		return this.i in this.data ? this.data[this.i++] : null;
	}
}
