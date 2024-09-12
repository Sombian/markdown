import AST from "@/models/ast";

const GIST = /^https:\/\/gist\.github\.com\/([\w-]+)\/(\w+)$/;
const YOUTUBE = /(?:youtu\.be|youtube\.com).{0,20}([a-zA-Z0-9_-]{11})/;

export class EM extends AST
{
	constructor(private readonly alt: Nullable<string>, private readonly src: Nullable<string>)
	{
		super();
	}

	override toString()
	{
		if (this.src)
		{
			let groups: ReturnType<RegExp["exec"]>;

			if ((groups = GIST.exec(this.src)))
			{
				return `<iframe src="https://gist.github.com/${groups[1]}/${groups[2]}.pibb" style="width: 100%; height: 300px; border: 0;"></iframe>`
			}
			if ((groups = YOUTUBE.exec(this.src)))
			{
				return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${groups[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
			}
		}
		return `<${["img", (this.alt ? `alt="${this.alt}"` : null), (this.src ? `src="${this.src}"` : null)].filter((_) => _ !== null).join("\u0020")}>`;
	}
}
