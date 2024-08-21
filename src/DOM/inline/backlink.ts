import AST from "@/models/ast";

export class BACKLINK extends AST
{
	constructor(private readonly text: Nullable<string>, private readonly href: Nullable<string>)
	{
		super();
	}

	override render()
	{
		// TODO: maybe return an empty string if both this.text & this.href is empty or null
		return `<${["a", this.href ? `href="${this.href}"` : null].filter((_) => _ !== null).join("\u0020")}>${this.text ?? ""}</a>`;
	}
}