import AST from "@/models/ast";

export class TODO extends AST
{
	constructor(private readonly complete: boolean)
	{
		super();
	}

	override toString()
	{
		if (!this.complete)
		{
			return `<input type="checkbox" onClick="return false"/>`;
		}
		else
		{
			return `<input type="checkbox" checked onClick="return false"/>`;
		}
	}
}
