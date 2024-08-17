import AST from "../../models/ast";

export class PR extends AST
{
	override render()
	{
		return `<pr>${this.body}</pr>`;
	}
}
