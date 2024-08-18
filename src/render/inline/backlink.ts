import AST from "@/models/ast";

export class BACKLINK extends AST
{
	constructor(private readonly text?: string, private readonly href?: string)
	{
		super();
	}

	override render()
	{
		// TODO: maybe return an empty string if both this.text & this.href is empty or undefined
		return `<${["a", this.href ? `href="${this.href}"` : null].filter((_) => _ !== null).join("\u0020")}>${this.text ?? ""}</a>`;
	}
}
