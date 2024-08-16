import AST from "@/models/AST";

export class OL extends AST
{
	override render()
	{
		return `<ol>${this.body}</ol>`;
	}
}
