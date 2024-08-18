import AST from "@/models/ast";

export class BOLD extends AST
{
	override render()
	{
		return `<strong>${this.body}</strong>`;
	}
}
