import AST from "@/models/AST";

export class ITALIC extends AST
{
	override render()
	{
		return `<i>${this.body}</i>`;
	}
}
