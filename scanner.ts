const enum Context
{
	// HTML = "html",
	BLOCK = "block",
	STACK = "stack",
	INLINE = "inline",
}

export abstract class Token
{
	private constructor(public readonly grammar: string)
	{
		// final
	}

	public static of(ctx: Context)
	{
		switch (ctx)
		{
			case Context.BLOCK:
			{
				return [
					// core
					...Token.cores(),
					// block
					...Token.blocks(),
					// stack
					...Token.stacks(),
					// inline
					...Token.inlines(),
				];
			}
			case Context.STACK:
			{
				return [
					// core
					...Token.cores(),
					// stack
					...Token.stacks(),
					// inline
					...Token.inlines(),
				];
			}
			case Context.INLINE:
			{
				return [
					// core
					...Token.cores(),
					// inline
					...Token.inlines(),
				];
			}
		}
	}
	public abstract get ctx(): Context;
	//
	// core
	//
	public static cores()
	{
		return [
			Token.BREAK,
			Token.COMMENT_L,
			Token.COMMENT_R,
		];
	}
	public static readonly BREAK = new (class BREAK extends Token
	{
		override get ctx(): Context
		{
			throw new Error();
		}
	})
	("\n");
	public static readonly COMMENT_L = new (class COMMENT_L extends Token
	{
		override get ctx(): Context
		{
			throw new Error();
		}
	})
	("/*");
	public static readonly COMMENT_R = new (class COMMENT_R extends Token
	{
		override get ctx(): Context
		{
			throw new Error();
		}
	})
	("*/");
	//
	// block
	//
	public static blocks()
	{
		return [
			Token.H1,
			Token.H2,
			Token.H3,
			Token.H4,
			Token.H5,
			Token.H6,
			Token.HR_A,
			Token.HR_B,
			Token.HR_C,
		];
	}
	public static readonly H1 = new (class H1 extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("#\u0020");
	public static readonly H2 = new (class H2 extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("##\u0020");
	public static readonly H3 = new (class H3 extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("###\u0020");
	public static readonly H4 = new (class H4 extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("####\u0020");
	public static readonly H5 = new (class H5 extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("#####\u0020");
	public static readonly H6 = new (class H6 extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("######\u0020");
	public static readonly HR_A = new (class HR_A extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("___\n");
	public static readonly HR_B = new (class HR_B extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("---\n");
	public static readonly HR_C = new (class HR_C extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("===\n");
	//
	// stack
	//
	public static stacks()
	{
		return [
			Token.INDENT_1T,
			Token.INDENT_2S,
			Token.INDENT_4S,
			Token.BQ,
			Token.OL,
			Token.UL,
		];
	}
	public static readonly INDENT_1T = new (class INDENT_1T extends Token
	{
		override get ctx()
		{
			return Context.STACK;
		}
	})
	("	");
	public static readonly INDENT_2S = new (class INDENT_2S extends Token
	{
		override get ctx()
		{
			return Context.STACK;
		}
	})
	("  ");
	public static readonly INDENT_4S = new (class INDENT_4S extends Token
	{
		override get ctx()
		{
			return Context.STACK;
		}
	})
	("    ");
	public static readonly BQ = new (class BQ extends Token
	{
		override get ctx()
		{
			return Context.STACK;
		}
	})
	(">\u0020");
	public static readonly OL = new (class OL extends Token
	{
		override get ctx()
		{
			return Context.STACK;
		}
	})
	("-\u0020");
	public static readonly UL = new (class UL extends Token
	{
		override get ctx()
		{
			return Context.STACK;
		}
	})
	("~\u0020");
	//
	// inline
	//
	public static inlines()
	{
		return [
			Token.BOLD,
			Token.ITALIC,
			Token.UNDERLINE,
			Token.STRIKETHROUGH,
			Token.UNCHECKED_BOX,
			Token.CHECKED_BOX,
			Token.ARROW_ALL,
			Token.ARROW_LEFT,
			Token.ARROW_RIGHT,
			Token.FAT_ARROW_ALL,
			Token.FAT_ARROW_LEFT,
			Token.FAT_ARROW_RIGHT,
			Token.MATH_APX,
			Token.MATH_NET,
			Token.MATH_LTOET,
			Token.MATH_GTOET,
		];
	}
	public static readonly BOLD = new (class BOLD extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("**");
	public static readonly ITALIC = new (class ITALIC extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("??");
	public static readonly UNDERLINE = new (class UNDERLINE extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("__");
	public static readonly STRIKETHROUGH = new (class STRIKETHROUGH extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("~~");
	public static readonly UNCHECKED_BOX = new (class UNCHECKED_BOX extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("[ ]");
	public static readonly CHECKED_BOX = new (class CHECKED_BOX extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("[x]");
	public static readonly ARROW_ALL = new (class ARROW_ALL extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("<->");
	public static readonly ARROW_LEFT = new (class ARROW_LEFT extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("<-");
	public static readonly ARROW_RIGHT = new (class ARROW_RIGHT extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("->");
	public static readonly FAT_ARROW_ALL = new (class FAT_ARROW_ALL extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("<=>");
	public static readonly FAT_ARROW_LEFT = new (class FAT_ARROW_LEFT extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("<==");
	public static readonly FAT_ARROW_RIGHT = new (class FAT_ARROW_RIGHT extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("=>");
	public static readonly MATH_APX = new (class MATH_APX extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("~=");
	public static readonly MATH_NET = new (class MATH_NET extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("!=");
	public static readonly MATH_LTOET = new (class MATH_LTOET extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	("<=");
	public static readonly MATH_GTOET = new (class MATH_GTOET extends Token
	{
		override get ctx()
		{
			return Context.INLINE;
		}
	})
	(">=");
}

interface Route
{
	[key: string]: Token | Route;
	// @ts-ignore
	default?: Token;
}

const __TABLE__: Record<Context, Route> =
{
	// auto generate
	[Context.BLOCK]: {},
	// auto generate
	[Context.STACK]: {},
	// auto generate
	[Context.INLINE]: {},
};

for (const ctx of [Context.BLOCK, Context.STACK, Context.INLINE])
{
	for (const token of Token.of(ctx))
	{
		let node = __TABLE__[ctx];

		for (let i = 0; i < token.grammar.length; i++)
		{
			const char = token.grammar[i];

			if (i + 1 < token.grammar.length)
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
						throw new Error(`Token [${node[char].constructor.name}] and [${token.constructor.name}] has exact syntax`)
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

export default class Scanner
{
	private constructor()
	{
		// final
	}
	
	public static run(input: string)
	{
		const [tokens, buffer] = [[] as (string | Token)[], [] as string[]];

		let [ctx, node, depth, escape] = [Context.BLOCK, null as (null | Route), 0, false];

		function handle(char: string)
		{
			if (node === null) throw new Error();
			//
			// STEP 1. into the deep
			//
			depth++;
			//
			// STEP 2. examine token
			//
			if (node[char] instanceof Token)
			{
				const token = node[char];
				//
				// STEP 3. switch ctx
				//
				if ([Token.BREAK, Token.COMMENT_L, Token.COMMENT_R].includes(token))
				{
					// core -> inline
					ctx = Context.BLOCK;
				}
				else
				{
					switch (token.ctx)
					{
						case Context.BLOCK:
						{
							// block -> inline
							ctx = Context.INLINE;
							break;
						}
						case Context.STACK:
						{
							// stack -> stack
							ctx = Context.STACK;
							break;
						}
						case Context.INLINE:
						{
							// inline -> inline
							ctx = Context.INLINE;
							break;
						}
					}
				}
				//
				// STEP 4. flush buffer
				//
				if (depth < buffer.length)
				{
					tokens.push(buffer.join("").slice(0, - depth));
				}
				//
				// STEP 5. build token
				//
				tokens.push(token);
				//
				// STEP 6. reset states
				//
				[node, depth, buffer.length] = [null, 0, 0];
			}
			else
			{
				//
				// STEP 3. delve branch
				//
				node = node[char];
			}
		}

		main:
		for (const char of input.replace(/\r\n?/g, "\n"))
		{
			//
			// STEP 1. escape
			//
			if (!escape && char === "\\")
			{
				//
				// STEP 2. reset states
				//
				[ctx, node, depth, escape] = [Context.INLINE, null, 0, true];

				continue main;
			}
			//
			// STEP 2. consume
			//
			buffer.push(char);
			//
			// STEP 3. unescape
			//
			if (escape)
			{
				//
				// STEP 4. reset states
				//
				[ctx, node, depth, escape] = [Context.INLINE, null, 0, false];

				continue main;
			}
			//
			// STEP 4. delve branch - main
			//
			if (char in (node ??= __TABLE__[ctx]))
			{
				//
				// STEP 5. examine char
				//
				handle(char);
			}
			else
			{
				if (node.default)
				{
					const token = node.default;
					//
					// STEP 5. switch ctx
					//
					if ([Token.BREAK, Token.COMMENT_L, Token.COMMENT_R].includes(token))
					{
						// core -> inline
						ctx = Context.BLOCK;
					}
					else
					{
						switch (token.ctx)
						{
							case Context.BLOCK:
							{
								// block -> inline
								ctx = Context.INLINE;
								break;
							}
							case Context.STACK:
							{
								// stack -> stack
								ctx = Context.STACK;
								break;
							}
							case Context.INLINE:
							{
								// inline -> inline
								ctx = Context.INLINE;
								break;
							}
						}
					}
					//
					// STEP 6. shift buffer
					//
					if (depth < buffer.length)
					{
						buffer.splice(0, depth);
					}
					//
					// STEP 7. build token
					//
					tokens.push(token);
				}
				//
				// STEP 5. reset states
				//
				[ctx, node, depth] = [Context.INLINE, null, 0];
				//
				// STEP 6. delve branch - fallback
				//
				if (char in (node ??= __TABLE__[ctx]))
				{
					//
					// STEP 7. examine char
					//
					handle(char);
				}
			}
		}
		//
		// STEP ?. flush buffer
		//
		if (0 < buffer.length)
		{
			tokens.push(buffer.join(""));
		}
		
		return tokens;
	}
}
