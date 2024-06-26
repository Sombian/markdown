import { watch } from "fs";

import Scanner from "../scanner";
import Parser from "../parser";

function debug()
{
	Bun.file("./input.md").text().then((text) =>
	{
		const tokens = benchmark("Scanner", () => Scanner.run(text)); const AST = benchmark("Parser", () => Parser.run(tokens));
			
		if (!true)
		{
			console.debug(text);
		}
		if (true)
		{
			console.debug(tokens.map((_) => typeof _ === "string" ? _ : _.constructor.name));
		}
		if (!true)
		{
			console.debug(require("util").inspect(AST, { depth: null }));
		}
		// :3
		Bun.write("./output.html", AST.parse());
	});
}

function benchmark<T>(name: string, task: () => T)
{
	const t1 = performance.now();

	const value = task();

	const t2 = performance.now();

	console.log(`[${name}] took ${t2 - t1}ms`);

	return value;
}

const watcher = watch("./input.md", (event, file) =>
{
	debug();
});

process.on("SIGINT", () =>
{
	watcher.close();

	process.exit(0);
});


debug();
