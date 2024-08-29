import AST from "@/models/ast";

export class STRIKE extends AST
{
	override toString()
	{
		return `<s>${this.body}</s>`;
	}
}
 