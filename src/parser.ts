import Scanner from "./scanner";

import AST from "./models/ast";
import Token from "./models/token";

export default class Parser
{
	private data: ReturnType<typeof Scanner.prototype.scan> = []; private i = 0;

	constructor(private readonly impl: (args: Processor) => AST)
	{
		// TODO: none
	}

	public parse(data: typeof this.data)
	{
		[this.data, this.i] = [data, 0];
		//---------------------------//
		//                           //
		// RECURSIVE DESCENT PARSING //
		//                           //
		//---------------------------//

		const root = new ROOT();

		const args = Object.freeze(
		{
			peek: this.peek.bind(this),
			next: this.next.bind(this),
		});
		
		while (this.i < this.data.length)
		{
			try
			{
				root.push(this.impl(args));
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
		return this.i < this.data.length ? this.data[this.i] : null;
	}

	private next(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token found at position ${this.i}. Expected '${type.constructor.name}', but found '${this.data[this.i].constructor.name}'`);
		}
		return this.i < this.data.length ? this.data[this.i++] : null;
	}
}

class ROOT extends AST
{
	override toString()
	{
		return this.body;
	}
}

export interface Processor
{
	readonly peek: Parser["peek"];
	readonly next: Parser["next"];
}
