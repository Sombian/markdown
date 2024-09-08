import Scanner from "./scanner";

import AST from "./models/ast";
import Token from "./models/token";

export default abstract class Parser
{
	private data: ReturnType<typeof Scanner.prototype.scan> = [];
	/** keep track of current position */
	private i = 0;

	public parse(data: typeof this.data)
	{
		const root = new ROOT();

		for ([this.data, this.i] = [data, 0]; this.i < this.data.length; /* nothing */)
		{
			try
			{
				root.push(this.main());
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

	protected peek(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token found at position ${this.i}. Expected '${type.constructor.name}', but found '${this.data[this.i].constructor.name}'`);
		}
		return this.i < this.data.length ? this.data[this.i] : null;
	}

	protected next(type?: Token)
	{
		if (type && this.data[this.i] !== type)
		{
			throw new Error(`Unexpected token found at position ${this.i}. Expected '${type.constructor.name}', but found '${this.data[this.i].constructor.name}'`);
		}
		return this.i < this.data.length ? this.data[this.i++] : null;
	}

	protected abstract main(): AST;
}

class ROOT extends AST
{
	override toString()
	{
		return this.body;
	}
}
