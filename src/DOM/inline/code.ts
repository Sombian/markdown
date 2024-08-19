import AST from "@/models/ast";

export class CODE extends AST
{
	override render()
	{
		return `<code>${this.body}</code>`;
	}
}
