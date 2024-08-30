import AST from "@/models/ast";

export class PR extends AST
{
	override toString()
	{
		return this.body;
	}
}
