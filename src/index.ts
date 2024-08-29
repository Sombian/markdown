import Parser from "./parser";
import Scanner from "./scanner";
import Presets from "./presets";

class Markdown
{
	private readonly scanner: Scanner;
	private readonly parser: Parser;

	constructor
	(
		param_0: ConstructorParameters<typeof Scanner>[0],
		param_1: ConstructorParameters<typeof Parser>[0],
	)
	{
		this.scanner = new Scanner(param_0);
		this.parser = new Parser(param_1);
	}

	public run(data: string)
	{
		return this.parser.parse(this.scanner.scan(data)).toString();
	}
}

export { Markdown, Parser, Scanner, Presets };
