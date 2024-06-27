const enum Context
{
	// HTML = "html",
	BLOCK = "block",
	STACK = "stack",
	INLINE = "inline",
}

export abstract class Token
{
	// @ts-ignore
	private static readonly __MAP__ = new Map<Context, Token[]>([
		// auto-generate
		[null, []],
		// auto-generate
		[Context.BLOCK, []],
		// auto-generate
		[Context.STACK, []],
		// auto-generate
		[Context.INLINE, []],
	]);

	private constructor(public readonly ctx: Context, public readonly grammar: string)
	{
		Token.__MAP__.get(ctx)?.push(this);
	}

	public static of(ctx: Context)
	{
		switch (ctx)
		{
			case Context.BLOCK:
			{
				return [
					// @ts-ignore
					...Token.__MAP__.get(null),
					// block
					...Token.__MAP__.get(Context.BLOCK),
					// stack
					...Token.__MAP__.get(Context.STACK),
					// inline
					...Token.__MAP__.get(Context.INLINE),
				];
			}
			case Context.STACK:
			{
				return [
					// @ts-ignore
					...Token.__MAP__.get(null),
					// stack
					...Token.__MAP__.get(Context.STACK),
					// inline
					...Token.__MAP__.get(Context.INLINE),
				];
			}
			case Context.INLINE:
			{
				return [
					// @ts-ignore
					...Token.__MAP__.get(null),
					// inline
					...Token.__MAP__.get(Context.INLINE),
				];
			}
		}
	}
	//
	// core
	//
	public static readonly BREAK = new (class BREAK extends Token {})
	(null as never, "\n");
	public static readonly COMMENT_L = new (class COMMENT_L extends Token {})
	(null as never, "/*");
	public static readonly COMMENT_R = new (class COMMENT_R extends Token {})
	(null as never, "*/");
	//
	// block
	//
	public static readonly H1 = new (class H1 extends Token {})
	(Context.BLOCK, "#\u0020");
	public static readonly H2 = new (class H2 extends Token {})
	(Context.BLOCK, "##\u0020");
	public static readonly H3 = new (class H3 extends Token {})
	(Context.BLOCK, "###\u0020");
	public static readonly H4 = new (class H4 extends Token {})
	(Context.BLOCK, "####\u0020");
	public static readonly H5 = new (class H5 extends Token {})
	(Context.BLOCK, "#####\u0020");
	public static readonly H6 = new (class H6 extends Token {})
	(Context.BLOCK, "######\u0020");
	public static readonly HR_A = new (class HR_A extends Token {})
	(Context.BLOCK, "___\n");
	public static readonly HR_B = new (class HR_B extends Token {})
	(Context.BLOCK, "---\n");
	public static readonly HR_C = new (class HR_C extends Token {})
	(Context.BLOCK, "===\n");
	//
	// stack
	//
	public static readonly INDENT_1T = new (class INDENT_1T extends Token {})
	(Context.STACK, "	");
	public static readonly INDENT_2S = new (class INDENT_2S extends Token {})
	(Context.STACK, "  ");
	public static readonly INDENT_4S = new (class INDENT_4S extends Token {})
	(Context.STACK, "    ");
	public static readonly BQ = new (class BQ extends Token {})
	(Context.STACK, ">\u0020");
	public static readonly OL = new (class OL extends Token {})
	(Context.STACK, "-\u0020");
	public static readonly UL = new (class UL extends Token {})
	(Context.STACK, "~\u0020");
	//
	// inline
	//
	public static readonly BOLD = new (class BOLD extends Token {})
	(Context.INLINE, "**");
	public static readonly ITALIC = new (class ITALIC extends Token {})
	(Context.INLINE, "*");
	public static readonly UNDERLINE = new (class UNDERLINE extends Token {})
	(Context.INLINE, "__");
	public static readonly STRIKETHROUGH = new (class STRIKETHROUGH extends Token {})
	(Context.INLINE, "~~");
	public static readonly UNCHECKED_BOX = new (class UNCHECKED_BOX extends Token {})
	(Context.INLINE, "[ ]");
	public static readonly CHECKED_BOX = new (class CHECKED_BOX extends Token {})
	(Context.INLINE, "[x]");
	public static readonly ARROW_ALL = new (class ARROW_ALL extends Token {})
	(Context.INLINE, "<->");
	public static readonly ARROW_LEFT = new (class ARROW_LEFT extends Token {})
	(Context.INLINE, "<-");
	public static readonly ARROW_RIGHT = new (class ARROW_RIGHT extends Token {})
	(Context.INLINE, "->");
	public static readonly FAT_ARROW_ALL = new (class FAT_ARROW_ALL extends Token {})
	(Context.INLINE, "<=>");
	public static readonly FAT_ARROW_LEFT = new (class FAT_ARROW_LEFT extends Token {})
	(Context.INLINE, "<==");
	public static readonly FAT_ARROW_RIGHT = new (class FAT_ARROW_RIGHT extends Token {})
	(Context.INLINE, "=>");
	public static readonly MATH_APX = new (class MATH_APX extends Token {})
	(Context.INLINE, "~=");
	public static readonly MATH_NET = new (class MATH_NET extends Token {})
	(Context.INLINE, "!=");
	public static readonly MATH_LTOET = new (class MATH_LTOET extends Token {})
	(Context.INLINE, "<=");
	public static readonly MATH_GTOET = new (class MATH_GTOET extends Token {})
	(Context.INLINE, ">=");
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
/*
e.g.
// '<='
{
	"<":
	{
		"=": <token> // less than or equal to, ≤
	}
}

// '<=='
{
	"<":
	{
		"=":
		{
			"=": <token> // fat arrow left, ⇐
		}
	}
}

// <merge>
{
	"<":
	{
		"=":
		{
			"=": <token> // fat arrow left, ⇐
			default: <token> // less than or equal to, ≤
		}
	}
}
*/
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

		// Greninja transformed into the Grass Type!
		function protean(token: Token)
		{
			switch (token.ctx)
			{
				case null:
				{
					// core -> inline
					ctx = Context.BLOCK;
					break;
				}
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

		function handle(char: string)
		{
			if (node === null) throw new Error();
			//
			// <into the deep>
			//
			depth++;
			//
			// <examine token>
			//
			if (node[char] instanceof Token)
			{
				const token = node[char];
				//
				// <ctx/switch>
				//
				protean(token);
				//
				// <buffer/flush>
				//
				if (depth < buffer.length)
				{
					tokens.push(buffer.join("").slice(0, - depth));
				}
				//
				// <token/build>
				//
				tokens.push(token);
				//
				// <state/reset>
				//
				[node, depth, buffer.length] = [null, 0, 0];
			}
			else
			{
				//
				// <branch/delve>
				//
				node = node[char];
			}
		}

		main:
		for (const char of input.replace(/\r\n?/g, "\n"))
		{
			//
			// <escape>
			//
			if (!escape && char === "\\")
			{
				//
				// <state/reset>
				//
				[ctx, node, depth, escape] = [Context.INLINE, null, 0, true];

				continue main;
			}
			//
			// <buffer/consume>
			//
			buffer.push(char);
			//
			// <unescape>
			//
			if (escape)
			{
				//
				// <state/reset>
				//
				[ctx, node, depth, escape] = [Context.INLINE, null, 0, false];

				continue main;
			}
			//
			// <branch/delve>
			//
			if (char in (node ??= __TABLE__[ctx]))
			{
				handle(char);
			}
			else
			{
				if (node.default)
				{
					const token = node.default;
					//
					// <ctx/switch>
					//
					protean(token);
					//
					// <buffer/manipulate>
					//
					if (depth < buffer.length)
					{
						if (depth + 1 < buffer.length)
						{
							/*
							e.g. token=<ITALIC { grammar: "*" }>, depth=1

							(from)
							buffer=["<char>", "<char>", "<char>", "*", "<CHARACTER>"]
							->
							(to)
							buffer=["*", "<CHARACTER>"]
							*/
							tokens.push(buffer.splice(0, buffer.length - depth - 1).join(""));
						}
						/*
						e.g. token=<ITALIC { grammar: "*" }>, depth=1
					
						(from)
						buffer=["*", "<CHARACTER>"]
						->
						(to)
						buffer=["<CHARACTER>"]
						*/
						buffer.splice(0, depth);
					}
					//
					// <token/build>
					//
					tokens.push(token);
				}
				//
				// <state/reset>
				//
				[ctx, node, depth] = [Context.INLINE, null, 0];
				//
				// <branch/delve>
				//
				if (char in (node ??= __TABLE__[ctx]))
				{
					handle(char);
				}
			}
		}
		//
		// <buffer/flush>
		//
		if (0 < buffer.length)
		{
			tokens.push(buffer.join(""));
		}
		
		return tokens;
	}
}
