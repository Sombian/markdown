import AST from "@/models/AST";

export class STRIKE extends AST
{
	override render()
	{
		return `<s>${this.body}</s>`;
	}
}
 