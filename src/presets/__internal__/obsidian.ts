import Helper from "@/helper";
import Scanner from "@/scanner";
import Parser from "@/parser";

class Preset extends Parser
{
	protected main(): ReturnType<typeof Parser.prototype["main"]>
	{
		throw new Error("Unimplemented");
	}
}

export default new Helper(new Scanner([]), new Preset());
