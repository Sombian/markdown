import AST from "@/models/ast";

export class UL extends AST
{
	override render()
	{
		return `<ul>${this.body}</ul>`;
	}
}
