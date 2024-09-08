export default class Buffer implements Iterable<string>
{
	private static DC: TextDecoder;
	// stores binary data
	private u16a: Uint16Array;
	// pointer to end of string
	private i = 0;

	constructor(capacity: number)
	{
		this.u16a = new Uint16Array(capacity);
		// lazy init
		Buffer.DC ??= new TextDecoder("utf-16");
	}

	public write(data: string)
	{
		if (this.u16a.length < this.i + data.length)
		{
			// 2x capacity
			const temp = new Uint16Array((this.i + data.length) * 2);
			// transfer data
			temp.set(this.u16a, 0);
			// replace u16a
			this.u16a = temp;
		}
		// write
		for (let j = 0; j < data.length; ++j)
		{
			this.u16a[this.i + j] = data.charCodeAt(j);
		}
		// offset
		this.i += data.length;
	}

	public slice(start: number, count: number)
	{
		if (start < 0) throw new Error("Invalid Range");

		const clamp = Math.min(start + (count < 0 ? this.i + count : count), this.i);

		const r1 = this.u16a.subarray(start, clamp);

		return Buffer.DC.decode(r1);
	}

	public splice(start: number, count: number)
	{
		if (start < 0) throw new Error("Invalid Range");

		const clamp = Math.min(start + (count < 0 ? this.i + count : count), this.i);

		const [r1, r2] = [
			this.u16a.subarray(start, clamp),
			this.u16a.subarray(clamp, this.i),
		];
		const slice = Buffer.DC.decode(r1);
		// shift
		this.u16a.set(r2, start);
		// offset
		this.i -= clamp;

		return slice;
	}

	public clear()
	{
		this.i = 0;
	}

	public get size()
	{
		return this.i;
	}

	public get capacity()
	{
		return this.u16a.length;
	}

	public toArray()
	{
		return Array.from(this.u16a.subarray(0, this.i));
	}

	public toString()
	{
		return Buffer.DC.decode(this.u16a.subarray(0, this.i));
	}

	[Symbol.iterator]()
	{
		return this.toString()[Symbol.iterator]();
	}
}
