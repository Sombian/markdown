import fs from "fs";
import path from "path";
import util from "util";
import { Presets } from "@";

const sample = path.join(import.meta.dir, "sample.txt");

main();

function main()
{
	const preset = Presets.NekoNote;

	Bun.file(sample).text().then(async (text) =>
	{
		process.stdout.write("\x1Bc");
		
		console.time("Scan"); const T = preset.scan(text); console.timeEnd("Scan");

		console.debug("\n", T.map((_) => typeof _ === "string" ? _ : _.constructor.name), "\n");

		console.time("Parse"); const AST = preset.parse(T); console.timeEnd("Parse");

		console.debug("\n", util.inspect(AST, { depth: null, colors: true }), "\n");

		console.time("Render"); const HTML = AST.toString(); console.timeEnd("Render");

		console.debug("\n", util.inspect(HTML, { depth: null, colors: true }), "\n");

		console.debug(`${await Bun.write(path.join(import.meta.dir, "out.html"), HTML)} bytes in size`);
	});
}

declare global
{
	// eslint-disable-next-line no-var
	var watcher: fs.FSWatcher;
}

global.watcher ??= fs.watch(sample, main); process.on("SIGINT", () => { global.watcher.close(); process.exit(0); });
