import AST from "@/models/ast";

export class BACKLINK extends AST
{
	constructor(private readonly text?: string, private readonly href?: string)
	{
		super();
	}

	override render()
	{
		return `<a href="${this.href ?? ""}">${this.text ?? ""}</a>`;
	}
}
