import AST from "@/models/AST";

export class UL extends AST
{
	override render()
	{
		return `<ul>${this.body}</ul>`;
	}
}
