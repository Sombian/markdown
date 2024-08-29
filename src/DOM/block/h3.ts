import AST from "@/models/ast";

export class H3 extends AST
{
	override toString()
	{
		return `<h3>${this.body}</h3>`;
	}
}
