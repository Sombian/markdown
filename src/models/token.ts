import Level from "@/enums/level";

export default abstract class Token
{
	constructor(public readonly lvl: Level, public readonly syntax: string, public readonly next: Level)
	{
		// TODO: none
	}

	public toString()
	{
		return this.syntax;
	}
}
