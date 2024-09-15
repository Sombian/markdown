import Scanner from "./scanner";
import Level from "./enums/level";
import AST from "./models/ast";
import Token from "./models/token";

type Rule = (token: Token) => AST[number];

export default abstract class Parser
{
	// @ts-expect-error auto generate
	private readonly RULES: Record<Level, Map<Token, Rule>> = {
		// auto-generate
	};
	private data: ReturnType<Scanner["scan"]> = [];
	/** keep track of current position */
	private i = 0;

	public parse(data: typeof this.data)
	{
		[this.data, this.i] = [data, 0];

		return this.block();
	}

	protected rule(token: Token, handle: Rule)
	{
		(this.RULES[token.lvl] ??= new Map()).set(token, handle);
	}

	protected peek(token?: Token)
	{
		if (token && this.data[this.i] !== token)
		{
			throw new Error(`Unexpected token found at position ${this.i}. Expected '${token.constructor.name}', but found '${this.data[this.i].constructor.name}'`);
		}
		return this.i < this.data.length ? this.data[this.i] : null;
	}

	protected consume(token?: Token)
	{
		if (token && this.data[this.i] !== token)
		{
			throw new Error(`Unexpected token found at position ${this.i}. Expected '${token.constructor.name}', but found '${this.data[this.i].constructor.name}'`);
		}
		return this.i < this.data.length ? this.data[this.i++] : null;
	}

	protected block()
	{
		const ast = new $();

		for (/* none */; this.i < this.data.length; /* none */)
		{
			try
			{
				const t = this.peek();
				
				if (t === null) break;
				
				const rule = this.RULES[Level.BLOCK].get(t as Token);

				if (rule) this.consume();

				ast.push(rule?.(t as Token) ?? this.inline());
			}
			catch (error)
			{
				if (error === "continue")
				{
					continue;
				}
				if (error === "EOF")
				{
					break;
				}
				throw error;
			}
		}
		return ast;
	}

	protected inline(...until: ReturnType<typeof this.consume>[])
	{
		const ast = new _();

		for (/* none */; this.i < this.data.length; /* none */)
		{
			try
			{
				const t = this.consume();
				
				if (t === null) break;
				
				const rule = this.RULES[Level.INLINE].get(t as Token);

				if (until.includes(t)) break;
	
				ast.push(rule?.(t as Token) ?? t.toString());
			}
			catch (error)
			{
				if (error === "continue")
				{
					continue;
				}
				if (error instanceof AST)
				{
					ast.push(error);
					break;
				}
				throw error;
			}
		}
		return ast;
	}
}

class $ extends AST // root
{
	override toString()
	{
		return this.body;
	}
}

class _ extends AST // inline
{
	override toString()
	{
		return this.body;
	}	
}
