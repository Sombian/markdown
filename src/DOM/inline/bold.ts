import AST from "@/models/ast";

export class BOLD extends AST
{
	override toString()
	{
		return `<strong>${this.body}</strong>`;
	}
}
