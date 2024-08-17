import AST from "../../models/ast";

export class UNDERLINE extends AST
{
	override render()
	{
		return `<u>${this.body}</u>`;
	}
}
