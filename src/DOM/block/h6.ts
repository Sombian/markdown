import AST from "@/models/ast";

export class H6 extends AST
{
	override toString()
	{
		return `<h6>${this.body}</h6>`;
	}
}
