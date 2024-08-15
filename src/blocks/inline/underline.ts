import AST from "@/models/AST";


export class UNDERLINE extends AST
{
	override render()
	{
		return `<u>${this.body}</u>`;
	}
}
