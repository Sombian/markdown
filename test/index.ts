import fs from "fs";
import path from "path";
import util from "util";

import Parser from "../parser";
import Scanner from "../scanner";

const [input, output] = [path.join(import.meta.dirname, "in.txt"), path.join(import.meta.dirname, "out.html")];

main();

function main()
{
	function benchmark<T>(name: string, task: () => T)
	{
		const t1 = performance.now();

		const value = task();

		const t2 = performance.now();

		console.debug(`\x1b[33m⚡ ${name}\x1b[0m took \x1b[4m${t2 - t1}ms\x1b[0m`);

		return value;
	}
	Bun.file(input).text().then(async (text) =>
	{
		process.stdout.write("\x1Bc");

		const tokens = benchmark("Scanner", () => Scanner.run(text));
	
		console.debug("\n", tokens.map((_) => typeof _ === "string" ? _ : _.constructor.name), "\n");
	
		const AST = benchmark("Parser", () => Parser.run(tokens));
		
		console.debug("\n", util.inspect(AST, { depth: null, colors: true }), "\n");
	
		const HTML = benchmark("Render", () => AST.render());
	
		console.debug("\n", util.inspect(HTML, { depth: null, colors: true }), "\n");

		const bytes = await Bun.write(output, HTML);

		console.debug(`${output}: \x1b[4m${bytes}bytes\x1b[0m`);
	});
}

declare global
{
	// eslint-disable-next-line no-var
	var watcher: fs.FSWatcher;
}

globalThis.watcher ??= fs.watch(input, main); process.on("SIGINT", () => { globalThis?.watcher.close(); process.exit(0); });
