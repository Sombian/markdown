import AST from "../../models/ast";

export class OL extends AST
{
	override render()
	{
		return `<ol>${this.body}</ol>`;
	}
}
