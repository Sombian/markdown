import AST from "@/models/ast";

export class UNDERLINE extends AST
{
	override toString()
	{
		return `<u>${this.body}</u>`;
	}
}
