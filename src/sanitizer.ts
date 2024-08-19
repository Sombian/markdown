import Buffer from "./models/buffer";

export default class Sanitizer
{
	private static readonly TABLE = new Map<string, string>();

	static {
		this.TABLE.set("<", "&lt;");
		this.TABLE.set(">", "&gt;");
		this.TABLE.set("&", "&amp;");
		this.TABLE.set('"', "&quot;");
		this.TABLE.set("'", "&#x27;");
		this.TABLE.set("/", "&#x2F;");
		this.TABLE.set("`", "&#x60;");
	}

	public static sanitize(data: string)
	{
		const buffer = new Buffer(data.length);

		for (const char of data)
		{
			buffer.write(this.TABLE.get(char) ?? char);
		}
		// is it clean now..?
		return buffer.toString();
	}
}
