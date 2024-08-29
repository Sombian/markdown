import AST from "@/models/ast";

export class H4 extends AST
{
	override toString()
	{
		return `<h4>${this.body}</h4>`;
	}
}
