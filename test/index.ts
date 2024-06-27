import Scanner from "../scanner";
import Parser from "../parser";

// @ts-ignore
Bun.file("./input.md").text().then((text) =>
{
	const tokens = Scanner.run(text); const AST = Parser.run(tokens);

	if (true)
	{
		console.debug(text);
	}
	if (true)
	{
		console.debug(tokens.map((_) => typeof _ === "string" ? _ : _.constructor.name));
	}
	if (true)
	{
		// @ts-ignore
		console.debug(require("util").inspect(AST, { depth: null }));
	}
	// @ts-ignore
	Bun.write("./output.html", AST.parse());
});
