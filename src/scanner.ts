import Level from "./enums/level";

import Token from "./models/token";
import Buffer from "./models/buffer";

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

	constructor(data: Token[])
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

					if (char in node)
					{
						if (i + 1 < token.syntax.length)
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
							if (node[char] instanceof Token)
							{
								throw new Error(`Token [${node[char]}] and [${token}] has exact syntax`);
							}
							else
							{
								node[char].default = token;
							}
						}
					}
					else
					{
						if (i + 1 < token.syntax.length)
						{
							node = (node[char] = {});
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
		[this.state, this.buffer, this.stream] = [null as unknown as State, null as unknown as Buffer, null as unknown as Chunk[]];
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
				[this.state.node, this.state.depth, this.state.escape] = [this.TRIE[Level.INLINE], 0, true]; continue main;
			}
			// buffer::build
			this.buffer.write(char);

			// unescape sequence
			if (this.state.escape)
			{
				// state::update
				[this.state.node, this.state.depth, this.state.escape] = [this.TRIE[Level.INLINE], 0, false]; continue main;
			}
			//----------//
			//          //
			// SCANNING //
			//          //
			//----------//

			// delve branch
			if (char in this.state.node)
			{
				this.lookup(char);
			}
			// fail-safe plan..!
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

							// stream::build - chunk
							this.stream.push(this.buffer.splice(0, - this.state.depth - 1));
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
					// stream::build - token
					this.stream.push(token);
				}
				// state::update
				[this.state.node, this.state.depth] = [this.TRIE[level ?? Level.INLINE], 0];

				// delve branch
				if (char in this.state.node)
				{
					this.lookup(char);
				}
			}
		}
		// if buffer is not empty
		if (0 < this.buffer.size)
		{
			if (this.state.node.default)
			{
				// stream::build - chunk
				this.stream.push(this.buffer.splice(0, - this.state.depth));

				// stream::build - token
				this.stream.push(this.state.node.default);
			}
			else
			{
				// stream::build - full
				this.stream.push(this.buffer.toString());
			}
		}
		return this.stream;
	}

	private lookup(char: string)
	{
		// :3
		if (this.state.node[char] instanceof Token)
		{
			const token = this.state.node[char];

			if (++this.state.depth < this.buffer.size)
			{
				// stream::build && buffer::modify
				this.stream.push(this.buffer.slice(0, - this.state.depth));
			}
			// stream::build && buffer::clear
			this.stream.push(token); this.buffer.clear();

			// state::update
			[this.state.node, this.state.depth] = [this.TRIE[token.next], 0];
		}
		// delve branch
		else
		{
			// state::update
			[this.state.node, this.state.depth] = [this.state.node[char], this.state.depth + 1];
		}
	}
}

interface State
{
	node: Route;
	depth: number;
	escape: boolean;
}

interface Route
{
	[key: string]: Route | Token; default?: Token;
}
