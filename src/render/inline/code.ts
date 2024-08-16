import AST from "@/models/AST";

export class CODE extends AST
{
	override render()
	{
		return `<code>${this.body}</code>`;
	}
}
