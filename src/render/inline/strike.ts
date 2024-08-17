import AST from "../../models/ast";

export class STRIKE extends AST
{
	override render()
	{
		return `<s>${this.body}</s>`;
	}
}
 