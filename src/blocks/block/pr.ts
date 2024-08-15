import AST from "@/models/AST";


export class PR extends AST
{
	override render()
	{
		return `<pr>${this.body}</pr>`;
	}
}
