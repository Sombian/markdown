import Level from "./enums/level";

import Token from "./models/token";

type Chunk = Token | string;

export default class Scanner
{
	private readonly TRIE: Record<Level, Route> = {
		// auto-generate
		[Level.BLOCK]: {},
		// auto-generate
		[Level.INLINE]: {},
	};
	private state: State;
	private buffer: Buffer;
	private stream: Chunk[];

	constructor(data: Readonly<Token[]>)
	{
		function routes(ctx: typeof Token.prototype.lvl)
		{
			switch (ctx)
			{
				case "all":
				{
					return [Level.BLOCK, Level.INLINE];
				}
				case Level.BLOCK:
				{
					return [Level.BLOCK];
				}
				case Level.INLINE:
				{
					return [Level.BLOCK, Level.INLINE];
				}
			}
		}

		//----------------------------------------------//
		//                                              //
		// e.g.                                         //
		//                                              //
		// (A)                                          //
		// { "<": { "=": "≤" } }                        //
		//                                              //
		// (B)                                          //
		// { "<": { "=": { "=": "⇐" } } }               //
		//                                              //
		// (MERGE)                                      //
		// { "<": { "=": { "=": "⇐", default: "≤" } } } //
		//                                              //
		//----------------------------------------------//

		for (const token of data)
		{
			for (const ctx of routes(token.lvl))
			{
				let node = this.TRIE[ctx];
		
				for (let i = 0; i < token.syntax.length; i++)
				{
					const char = token.syntax[i];
			
					if (i + 1 < token.syntax.length)
					{
						if (char in node)
						{
							if (node[char] instanceof Token)
							{
								node = (node[char] = { default: node[char] });
							}
							else
							{
								node = node[char];
							}
						}
						else
						{
							node = (node[char] = {});
						}
					}
					else
					{
						if (char in node)
						{
							if (node[char] instanceof Token)
							{
								throw new Error(`Token [${node[char]}] and [${token}] has exact syntax`)
							}
							else
							{
								node[char].default = token;
							}
						}
						else
						{
							node[char] = token;
						}
					}
				}
			}
		}
		// init...
		this.state = null as unknown as State;
		this.buffer = null as unknown as Buffer;
		this.stream = null as unknown as Chunk[];
	}

	public scan(data: string)
	{
		// init...
		[this.state, this.buffer, this.stream] = [{ node: this.TRIE[Level.BLOCK], depth: 0, escape: false }, new Buffer(data.length), []];

		main:
		for (const char of data.replace(/\r\n?/g, "\n"))
		{
			//-------------------//
			//                   //
			// ESCAPE & UNESCAPE //
			//                   //
			//-------------------//

			// escape sequence
			if (!this.state.escape && char === "\\")
			{
				// state::update
				this.state = { node: this.TRIE[Level.INLINE], depth: 0, escape: true };

				continue main;
			}
			// buffer::build
			this.buffer.write(char);

			// unescape sequence
			if (this.state.escape)
			{
				// state::update
				this.state = { node: this.TRIE[Level.INLINE], depth: 0, escape: false };

				continue main;
			}

			//----------//
			//          //
			// SCANNING //
			//          //
			//----------//

			// delve branch
			if (char in this.state.node)
			{
				this.build(char);
			}
			else
			{
				let level: Nullable<Level> = null;

				// handle fallback
				if (this.state.node.default)
				{
					const token = this.state.node.default;

					level = token.next;

					if (this.state.depth < this.buffer.size - 0)
					{
						if (this.state.depth < this.buffer.size - 1)
						{
							//---------------------------------------------------------//
							//                                                         //
							// e.g. token=(ITALIC { syntax: "*" }), depth=1            //
							//                                                         //
							// (BEFORE)                                                //
							// buffer -> ["<char>", "<char>", "<char>", "*", "<char>"] //
							//                                                         //
							// (AFTER)                                                 //
							// buffer -> ["*", "<char>"]                               //
							//                                                         //
							//---------------------------------------------------------//

							// stream::build & buffer::modify
							this.stream.push(this.buffer.splice(0, this.buffer.size - this.state.depth - 1));
						}
						//----------------------------------------------//
						//                                              //
						// e.g. token=(ITALIC { syntax: "*" }), depth=1 //
						//                                              //
						// (BEFORE)                                     //
						// buffer -> ["*", "<char>"]                    //
						//                                              //
						// (AFTER)                                      //
						// buffer -> ["<char>"]                         //
						//                                              //
						//----------------------------------------------//

						// buffer::modify
						this.buffer.splice(0, this.state.depth);
					}
					// stream::build
					this.stream.push(token);
				}
				// state::update
				[this.state.node, this.state.depth] = [this.TRIE[level ?? Level.INLINE], 0];

				// delve branch
				if (char in this.state.node)
				{
					this.build(char);
				}
			}
		}
		// if buffer is not empty
		if (0 < this.buffer.size)
		{
			// stream::build
			this.stream.push(this.buffer.toString());
		}
		return this.stream;
	}

	private build(char: string)
	{
		// state::update
		this.state.depth++;

		if (this.state.node[char] instanceof Token)
		{
			const token = this.state.node[char];

			if (this.state.depth < this.buffer.size)
			{
				// stream::build && buffer::modify
				this.stream.push(this.buffer.slice(0, this.buffer.size - this.state.depth));
			}
			// stream::build
			this.stream.push(token);

			// buffer::clear
			this.buffer.clear();

			// state::update
			[this.state.node, this.state.depth] = [this.TRIE[token.next], 0];
		}
		// delve branch
		else
		{
			// state::update
			this.state.node = this.state.node[char];
		}
	}
}

interface State
{
	node: Route;
	depth: number;
	escape: boolean;
}

class Buffer
{
	// lazy init
	private static DC: TextDecoder;
	// stores binary data
	private readonly u16a: Uint16Array;
	// pointer to end of string
	private i = 0;

	constructor(capacity: number)
	{
		this.u16a = new Uint16Array(capacity);

		Buffer.DC ??= new TextDecoder("utf-16");
	}

	public write(data: string)
	{
		if (this.u16a.length < this.i + data.length)
		{
			throw new Error("Buffer is full");
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
		if (start < 0 || count < 0) throw new Error("Invalid Range");

		const clamp = Math.min(start + count, this.i);

		const r1 = this.u16a.subarray(start, clamp);

		return Buffer.DC.decode(r1);
	}

	public splice(start: number, count: number)
	{
		if (start < 0 || count < 0) throw new Error("Invalid Range");

		const clamp = Math.min(start + count, this.i);

		const [r1, r2] = [
			this.u16a.subarray(start, clamp),
			this.u16a.subarray(clamp, this.i),
		];
		const slice = Buffer.DC.decode(r1);
		// shift
		this.u16a.set(r2, start);
		// offset
		this.i -= count;

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

	public toString()
	{
		return Buffer.DC.decode(this.u16a.subarray(0, this.i));
	}
}

interface Route
{
	// @ts-expect-error [key: "default"] is used for fallback
	[key: string]: Route | Token; default?: Token;
}
