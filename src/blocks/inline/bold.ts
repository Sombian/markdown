import AST from "@/models/AST";


export class BOLD extends AST
{
	override render()
	{
		return `<strong>${this.body}</strong>`;
	}
}
