import AST from "@/models/ast";

export class UL extends AST
{
	override toString()
	{
		return `<ul>${this.body}</ul>`;
	}
}
