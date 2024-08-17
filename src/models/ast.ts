type Child = AST | string;

export default abstract class AST
{
	public readonly children: Child[];

	constructor(...children: typeof this.children)
	{
		this.children = children;
	}

	public get body()
	{
		return this.children.map((child) => typeof child === "string" ? child : child.render()).join("");
	}

	public abstract render(): string;
}
