import { Markdown } from "@";

import Parser from "@/parser";
import Scanner from "@/scanner";

import AST from "@/models/ast";

class Preset extends Parser
{
	protected main(): AST
	{
		throw new Error("Unimplemented");
	}
}

export default [new Scanner([]), new Preset()] satisfies ConstructorParameters<typeof Markdown> as ConstructorParameters<typeof Markdown>;
