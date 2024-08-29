import AST from "@/models/ast";

export class CB extends AST
{
	override toString()
	{
		return `<pre><code>${this.body}</code></pre>`
	}
}
