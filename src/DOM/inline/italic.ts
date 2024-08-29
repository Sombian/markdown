import AST from "@/models/ast";

export class ITALIC extends AST
{
	override toString()
	{
		return `<i>${this.body}</i>`;
	}
}
