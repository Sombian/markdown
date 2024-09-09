import Parser from "./parser";
import Scanner from "./scanner";

export default class Helper
{
	constructor(private readonly scanner: Scanner, private readonly parser: Parser)
	{
		// TODO: none
	}

	public scan(...args: Parameters<typeof this.scanner.scan>)
	{
		return this.scanner.scan(...args);
	}

	public parse(...args: Parameters<typeof this.parser.parse>)
	{
		return this.parser.parse(...args);
	}

	public run(data: string)
	{
		return this.parse(this.scan(data)).toString();
	}
}
