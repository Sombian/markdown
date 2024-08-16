import Level from "@/enums/Level";

export default abstract class Token
{
	constructor(public readonly lvl: "all" | Level, public readonly syntax: string, public readonly next: Level)
	{
		// TODO: none
	}

	public toString()
	{
		return this.syntax;
	}
}
