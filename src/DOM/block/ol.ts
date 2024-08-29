import AST from "@/models/ast";

export class OL extends AST
{
	override toString()
	{
		return `<ol>${this.body}</ol>`;
	}
}
