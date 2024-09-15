import Level from "./enums/level";
import Token from "./models/token";
import Buffer from "./models/buffer";

type Chunk = Token | string;

// TODO: dont merge BLOCK & INLINE, instead use INLINE as a fallback
export default class Scanner
{
	// @ts-expect-error auto generate
	private readonly TRIE: Record<Level, Route> = {
		// auto-generate
	};
	private state: State = null as unknown as typeof this.state;
	private buffer: Buffer = null as unknown as typeof this.buffer;
	private stream: Chunk[] = null as unknown as typeof this.stream;

	constructor(data: Token[])
	{
		function routes(lvl: Token["lvl"])
		{
			switch (lvl)
			{
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
			for (const lvl of routes(token.lvl))
			{
				let node = (this.TRIE[lvl] ??= {});
		
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
	}

	public scan(data: string)
	{
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
			else
			{
				let level = Level.INLINE;

				// handle fallback
				if (this.state.node.default)
				{
					const token = this.state.node.default;
					//------------------------------------------------//
					//                                                //
					// e.g. depth=1, token=(ITALIC { syntax: "*" })   //
					//                                                //
					// (BEFORE)                                       //
					// buffer -> ["<char>"..."<char>", "*", "<char>"] //
					//                                                //
					// (AFTER)                                        //
					// buffer -> ["*", "<char>"]                      //
					//                                                //
					//------------------------------------------------//

					// if chunk is not empty
					if (this.state.depth < this.buffer.size - 1)
					{
						// stream::build - chunk
						this.stream.push(this.buffer.splice(0, - this.state.depth - 1));
					}
					// stream::build - token
					this.stream.push(token);
					//----------------------------------------------//
					//                                              //
					// e.g. depth=1, token=(ITALIC { syntax: "*" }) //
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
					// :3
					level = token.next;
				}
				// state::update
				[this.state.node, this.state.depth] = [this.TRIE[level], 0];

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
			if (!this.state.node.default)
			{
				// stream::build - full
				this.stream.push(this.buffer.toString());
			}
			else
			{
				// stream::build - chunk, token
				this.stream.push(this.buffer.splice(0, - this.state.depth), this.state.node.default);
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
			// buffer:clear
			this.buffer.clear();
			// stream::build
			this.stream.push(token);
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
