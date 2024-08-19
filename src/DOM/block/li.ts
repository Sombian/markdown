import AST from "@/models/ast";

export class LI extends AST
{
	override render()
	{
		return `<li>${this.body}</li>`;
	}
}
