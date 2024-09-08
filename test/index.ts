import fs from "fs";
import path from "path";
import util from "util";

import { Scanner, Parser, Presets } from "@";

const [input, output] = [path.join(import.meta.dirname, "in.txt"), path.join(import.meta.dirname, "out.html")];

main();

function main()
{
	function benchmark<T>(label: string, task: () => T)
	{
		console.time(label);

		const result = task();

		console.timeEnd(label);

		return result;
	}

	Bun.file(input).text().then(async (text) =>
	{
		process.stdout.write("\x1Bc");

		const tokens = benchmark("Scanner", () => new Scanner(Presets.NekoNote[0]).scan(text));
	
		console.debug("\n", tokens.map((_) => typeof _ === "string" ? _ : _.constructor.name), "\n");
	
		const AST = benchmark("Parser", () => new Parser(Presets.NekoNote[1]).parse(tokens));
		
		console.debug("\n", util.inspect(AST, { depth: null, colors: true }), "\n");
	
		const HTML = benchmark("Render", () => AST.toString());
	
		console.debug("\n", util.inspect(HTML, { depth: null, colors: true }), "\n");

		const bytes = await Bun.write(output, HTML);

		console.debug(`\x1b[4m${output}\x1b[0m ~ ${bytes}bytes`);
	});
}

declare global
{
	// eslint-disable-next-line no-var
	var watcher: fs.FSWatcher;
}

global.watcher ??= fs.watch(input, main); process.on("SIGINT", () => { global.watcher.close(); process.exit(0); });
