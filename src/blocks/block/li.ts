import AST from "@/models/AST";


export class LI extends AST
{
	override render()
	{
		return `<li>${this.body}</li>`;
	}
}
