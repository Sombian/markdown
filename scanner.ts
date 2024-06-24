const enum Context
{
	BLOCK = "block", // Block
	NEST = "nest", // Nest extends Block
	LIST = "list", // List extends Nest
	INLINE = "inline", // Inline
}

export abstract class Token
{
	public readonly rules: string[];

	private constructor(...rules: string[])
	{
		this.rules = rules;
	}

	public static of(ctx: Context)
	{
		switch (ctx)
		{
			case Context.BLOCK:
			{
				return [
					// core
					Token.BREAK,
					Token.COMMENT_L,
					Token.COMMENT_R,
					// block
					Token.H1,
					Token.H2,
					Token.H3,
					Token.H4,
					Token.H5,
					Token.H6,
					Token.HR,
					// stack
					Token.BQ,
					// layer
					Token.INDENT,
					Token.OL,
					Token.UL,
					// inline
					Token.BOLD,
					Token.ITALIC,
					Token.UNDERLINE,
					Token.STRIKETHROUGH,
					Token.UNCHECKED_BOX,
					Token.CHECKED_BOX,
				];
			}
			case Context.NEST:
			{
				return [
					// core
					Token.BREAK,
					Token.COMMENT_L,
					Token.COMMENT_R,
					// stack
					Token.BQ,
					// layer
					Token.INDENT,
					Token.OL,
					Token.UL,
					// inline
					Token.BOLD,
					Token.ITALIC,
					Token.UNDERLINE,
					Token.STRIKETHROUGH,
					Token.UNCHECKED_BOX,
					Token.CHECKED_BOX,
				];
			}
			case Context.LIST:
			{
				return [
					// core
					Token.BREAK,
					Token.COMMENT_L,
					Token.COMMENT_R,
					// stack
					Token.BQ,
					// layer
					Token.INDENT,
					Token.OL,
					Token.UL,
					// inline
					Token.BOLD,
					Token.ITALIC,
					Token.UNDERLINE,
					Token.STRIKETHROUGH,
					Token.UNCHECKED_BOX,
					Token.CHECKED_BOX,
				];
			}
			case Context.INLINE:
			{
				return [
					// core
					Token.BREAK,
					Token.COMMENT_L,
					Token.COMMENT_R,
					// inline
					Token.BOLD,
					Token.ITALIC,
					Token.UNDERLINE,
					Token.STRIKETHROUGH,
					Token.UNCHECKED_BOX,
					Token.CHECKED_BOX,
				];
			}
		}
	}
	public abstract get ctx(): Context;
	//
	// core
	//
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
	public static readonly HR = new (class HR extends Token
	{
		override get ctx()
		{
			return Context.BLOCK;
		}
	})
	("---", "===");
	//
	// stack
	//
	public static readonly BQ = new (class BQ extends Token
	{
		override get ctx()
		{
			return Context.NEST;
		}
	})
	(">\u0020");
	//
	// layer
	//
	public static readonly INDENT = new (class INDENT extends Token
	{
		override get ctx()
		{
			return Context.LIST;
		}
	})
	("	", "  ", "    ");
	public static readonly OL = new (class OL extends Token
	{
		override get ctx()
		{
			return Context.LIST;
		}
	})
	("-\u0020");
	public static readonly UL = new (class UL extends Token
	{
		override get ctx()
		{
			return Context.LIST;
		}
	})
	("~\u0020");
	//
	// inline
	//
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
}

interface Route
{
	[key: string]: Token | Route;
}

const __TABLE__: Record<Context, Route> =
{
	// auto generate
	[Context.BLOCK]: {},
	// auto generate
	[Context.NEST]: {},
	// auto generate
	[Context.LIST]: {},
	// auto generate
	[Context.INLINE]: {},
};

for (const ctx of [Context.BLOCK, Context.NEST, Context.LIST, Context.INLINE])
{
	for (const token of Token.of(ctx))
	{
		for (const rule of token.rules)
		{
			let node = __TABLE__[ctx];

			for (let i = 0; i < rule.length; i++)
			{
				const char = rule[i];

				if (i + 1 === rule.length)
				{
					node[char] = token; 
				}
				else
				{
					// @ts-ignore
					node = node[char] ?? (node[char] = {});
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

		main:
		for (const char of input.replace(/\r\n?/g, "\n"))
		{
			//
			// STEP 1. escape
			//
			if (!escape && char === "\\")
			{
				//
				// STEP 2. reset
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
				// STEP 4. reset
				//
				[ctx, node, depth, escape] = [Context.INLINE, null, 0, false];

				continue main;
			}
			//
			// STEP 4. delve branch
			//
			if (char in (node ??= __TABLE__[ctx]))
			{
				//
				// STEP 5. into the deep
				//
				depth++
				//
				// STEP 6. examine token
				//
				if (node[char] instanceof Token)
				{
					//
					// STEP 7. switch ctx
					//
					if ([Token.BREAK, Token.COMMENT_L, Token.COMMENT_R].includes(node[char]))
					{
						// core -> inline
						ctx = Context.BLOCK;
					}
					else
					{
						switch (node[char].ctx)
						{
							case Context.BLOCK:
							{
								// block -> inline
								ctx = Context.INLINE;
								break;
							}
							case Context.NEST:
							{
								// nest -> nest
								ctx = Context.NEST;
								break;
							}
							case Context.LIST:
							{
								// list -> list
								ctx = Context.LIST;
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
					// STEP 8. flush buffer
					//
					if (0 < buffer.length - depth)
					{
						tokens.push(buffer.join("").slice(0, 0 < depth ? buffer.length - depth : Infinity));
					}
					//
					// STEP 9. build token
					//
					tokens.push(node[char]);
					//
					// STEP 10. reset
					//
					[node, depth, buffer.length] = [null, 0, 0];
				}
				else
				{
					//
					// STEP 7. delve branch
					//
					node = node[char];
				}
			}
			else
			{
				//
				// STEP 5. reset
				//
				[ctx, node, depth] = [Context.INLINE, null, 0];
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
