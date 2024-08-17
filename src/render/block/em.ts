import AST from "../../models/ast";

const GIST = /^https:\/\/gist\.github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9]+)$/;
const YOUTUBE = /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})$/;

export class EM extends AST
{
	constructor(private readonly alt: string, private readonly src: string)
	{
		super();
	}

	override render()
	{
		let groups: ReturnType<typeof RegExp.prototype.exec>;

		if ((groups = GIST.exec(this.src)))
		{
			return `<iframe src="https://gist.github.com/${groups[1]}/${groups[2]}.pibb" style="width: 100%; height: 300px; border: 0;"></iframe>`
		}
		if ((groups = YOUTUBE.exec(this.src)))
		{
			return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${groups[1]}" title="${this.alt}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
		}
		// fallback
		return `<img alt="${this.alt}" src="${this.src}">`;
	}
}
