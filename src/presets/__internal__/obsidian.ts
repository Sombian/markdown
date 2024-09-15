import Helper from "@/helper";
import Scanner from "@/scanner";
import Parser from "@/parser";

class Preset extends Parser
{
	static { console.warn("This preset is unimplemented."); }

	constructor()
	{
		super();
	}
}

export default new Helper(new Scanner([]), new Preset());
