import Level from "@/enums/Level";

export default abstract class Token
{
	constructor(public readonly level: Level | "all", public readonly syntax: string)
	{
		// TODO: none
	}

	public abstract get next(): Level;
}
