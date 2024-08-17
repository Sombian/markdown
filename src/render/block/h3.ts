import AST from "../../models/ast";

export class H3 extends AST
{
	override render()
	{
		return `<h3>${this.body}</h3>`;
	}
}
