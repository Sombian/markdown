import fs from "fs"; import util from "util";

import Scanner from "../scanner";
import Parser from "../parser";

Bun.serve(
{
	fetch(request)
	{
		console.debug(request.url);
		return new Response("Hello, world!");
	}
});

function debug()
{
	Bun.file([import.meta.dirname, "input.md"].join("/")).text().then(async (text) =>
	{
		// clear
		process.stdout.write("\x1Bc");

		const tokens = benchmark("Scanner", () => Scanner.run(text));

		console.debug(tokens.map((_) => typeof _ === "string" ? _ : _.constructor), "\n");

		const AST = benchmark("Parser", () => Parser.run(tokens));

		console.debug(util.inspect(AST, { depth: null, colors: true }), "\n");

		const HTML = benchmark("Render", () => AST.render());

		console.debug(HTML, "\n");
		// :3
		Bun.write([import.meta.dirname, "output.html"].join("/"), HTML).then((bytes) =>
		{
			console.debug(`Total \x1b[4m${bytes}bytes\x1b[0m`);
		});
	});
}

function benchmark<T>(name: string, task: () => T)
{
	const t1 = performance.now();

	const value = task();

	const t2 = performance.now();

	console.debug(`\x1b[33m⚡ \x1b[1m${name}\x1b[0m took \x1b[4m${t2 - t1}ms\x1b[0m`);

	return value;
}

if (true)
{
	const watcher = fs.watch([import.meta.dirname, "input.md"].join("/"), (event, file) =>
	{
		debug();
	});
		
	process.on("SIGINT", () =>
	{
		watcher.close();
		
		process.exit(0);
	});
		
}

debug();
