import Scanner from "./scanner";
import Parser from "./parser";

// @ts-ignore
Bun.file("file.md").text().then((text) =>
{
	console.log(text);
	//
	// scanner
	//
	if (true)
	{
		console.log(Scanner.run(text).map((_) => typeof _ === "string" ? _ : _.constructor.name));
	}
	//
	// parser
	//
	if (true)
	{
		// @ts-ignore
		console.log(require("util").inspect(Parser.run(Scanner.run(text)).parse(), { depth: null }));
	}
});
