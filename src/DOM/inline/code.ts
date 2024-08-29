import AST from "@/models/ast";

export class CODE extends AST
{
	override toString()
	{
		return `<code>${this.body}</code>`;
	}
}
