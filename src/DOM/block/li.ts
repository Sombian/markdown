import AST from "@/models/ast";

export class LI extends AST
{
	override toString()
	{
		return `<li>${this.body}</li>`;
	}
}
