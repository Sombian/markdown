import Parser from "./parser";
import Scanner from "./scanner";
import Presets from "./presets";

import Level from "./enums/level";
import AST from "./models/ast";
import Token from "./models/token";

class Markdown
{
	constructor(private readonly scanner: Scanner, private readonly parser: Parser)
	{
		// TODO: none
	}

	public get scan()
	{
		return this.scanner.scan.bind(this.scanner);
	}

	public get parse()
	{
		return this.parser.parse.bind(this.parser);
	}

	public run(data: string)
	{
		return this.parse(this.scan(data)).toString();
	}
}

export { Markdown, Parser, Scanner, Presets, Level, AST, Token };
