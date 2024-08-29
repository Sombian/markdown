type Child = AST | string;

export default abstract class AST extends Array<Child>
{
	public get body()
	{
		return this.map((child) => child.toString()).join("");
	}

	public abstract toString(): string;
}
