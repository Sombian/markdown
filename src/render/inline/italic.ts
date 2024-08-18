import AST from "@/models/ast";

export class ITALIC extends AST
{
	override render()
	{
		return `<i>${this.body}</i>`;
	}
}
