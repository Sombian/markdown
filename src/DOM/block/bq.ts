import AST from "@/models/ast";

export class BQ extends AST
{
	override toString()
	{
		return `<blockquote>${this.body}</blockquote>`;
	}
}
