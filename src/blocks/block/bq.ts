import AST from "@/models/AST";

export class BQ extends AST
{
	override render()
	{
		return `<blockquote>${this.body}</blockquote>`;
	}
}
