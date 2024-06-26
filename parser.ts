import Scanner, { Token } from "./scanner";

abstract class AST
{
	public abstract parse(): string;
}

abstract class Branch extends AST
{
	constructor(public readonly parent: Branch, public readonly children: AST[] = [])
	{
		super();
	}

	public first()
	{
		return this.children[0];
	}

	public last()
	{
		return this.children[this.children.length - 1];
	}
}

abstract class Leaf<T> extends AST
{
	constructor(public readonly data: T)
	{
		super();
	}
}
//
// core
//
class BREAK extends Leaf<never>
{
	override parse()
	{
		return `<br/>`;
	}
}
//
// block
//
class H1 extends Branch
{
	override parse()
	{
		return `<h1>${this.children.map((child) => child.parse()).join("")}</h1>`;
	}
}

class H2 extends Branch
{
	override parse()
	{
		return `<h2>${this.children.map((child) => child.parse()).join("")}</h2>`;
	}
}

class H3 extends Branch
{
	override parse()
	{
		return `<h3>${this.children.map((child) => child.parse()).join("")}</h3>`;
	}
}

class H4 extends Branch
{
	override parse()
	{
		return `<h4>${this.children.map((child) => child.parse()).join("")}</h4>`;
	}
}

class H5 extends Branch
{
	override parse()
	{
		return `<h5>${this.children.map((child) => child.parse()).join("")}</h5>`;
	}
}

class H6 extends Branch
{
	override parse()
	{
		return `<h6>${this.children.map((child) => child.parse()).join("")}</h6>`;
	}
}

class HR extends Branch
{
	override parse()
	{
		return `<hr/>`;
	}
}
//
// stack
//
class BQ extends Branch
{
	override parse()
	{
		return `<blockquote>${this.children.map((child) => child.parse()).join("")}</blockquote>`;
	}
}

class OL extends Branch
{
	override parse()
	{
		return `<ol>${this.children.map((child) => child.parse()).join("")}</ol>`;
	}
}

class UL extends Branch
{
	override parse()
	{
		return `<ul>${this.children.map((child) => child.parse()).join("")}</ul>`;
	}
}

class LI extends Branch
{
	override parse()
	{
		return `<li>${this.children.map((child) => child.parse()).join("")}</li>`;
	}
}
//
// inline
//
class TEXT extends Leaf<{ value: string; bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean; }>
{
	override parse()
	{
		const [tags, buffer] = [[] as string[], [] as string[]];

		if (this.data.bold) tags.push("strong");
		if (this.data.italic) tags.push("i");
		if (this.data.underline) tags.push("u");
		if (this.data.strikethrough) tags.push("s");

		// open
		for (const tag of tags)
		{
			buffer.push("<" + tag + ">");
		}
		// content
		buffer.push(this.data.value);
		// close
		for (const tag of tags.reverse())
		{
			buffer.push("</" + tag + ">");
		}

		return buffer.join("");
	}
}

class CHECKBOX extends Leaf<boolean>
{
	override parse()
	{
		if (!this.data)
		{
			return `<input type="checkbox" onClick="return false"/>`;
		}
		else
		{
			return `<input type="checkbox" checked onClick="return false"/>`;
		}
	}
}

export default class Parser
{
	public static run(tokens: ReturnType<typeof Scanner.run>)
	{
		const origin = new (class ROOT extends Branch { override parse() { return `<article>${this.children.map((child) => child.parse()).join("")}</article>`; } })(null as never);

		let node = origin;

		let [bold, italic, underline, strikethrough] = [false, false, false, false];

		let comment = false;

		main:
		for (const token of tokens)
		{
			if (comment)
			{
				switch (token)
				{
					case Token.COMMENT_R:
					{
						comment = false;
						break;
					}
				}
				continue main;
			}
			switch (token)
			{
				//
				// core
				//
				case Token.BREAK:
				{
					[bold, italic, underline, strikethrough] = [false, false, false, false]; // reset styles
					
					switch (node.constructor)
					{
						case H1:
						case H2:
						case H3:
						case H4:
						case H5:
						case H6:
						case HR:
						{
							break; // block-level, ignore
						}
						default:
						{
							node.children.push(new BREAK(null as never)); // others, continue
							break;
						}
					}
					node = origin
					break;
				}
				case Token.COMMENT_L:
				{
					comment = true;
					break;
				}
				//
				// block
				//
				case Token.H1:
				{
					node.children.push(node = new H1(node));
					break;
				}
				case Token.H2:
				{
					node.children.push(node = new H2(node));
					break;
				}
				case Token.H3:
				{
					node.children.push(node = new H3(node));
					break;
				}
				case Token.H4:
				{
					node.children.push(node = new H4(node));
					break;
				}
				case Token.H5:
				{
					node.children.push(node = new H5(node));
					break;
				}
				case Token.H6:
				{
					node.children.push(node = new H6(node));
					break;
				}
				case Token.HR_A:
				case Token.HR_B:
				case Token.HR_C:
				{
					node.children.push(node = new HR(node));
					break;
				}
				//
				// stack
				//
				case Token.INDENT_1T:
				case Token.INDENT_2S:
				case Token.INDENT_4S:
				{
					switch (node.last().constructor)
					{
						case OL:
						case UL:
						{
							node = node.last() as Branch;
							break;
						}
						default:
						{
							// fallback
							node.children.push(new TEXT({ value: token.grammar }));
							break;
						}
					}
					break;
				}
				case Token.BQ:
				{
					if (node.last() instanceof BQ)
					{
						node = node.last() as Branch;
					}
					else
					{
						node.children.push(node = new BQ(node));
					}
					break;
				}
				case Token.OL:
				{
					if (node.last() instanceof OL)
					{
						node = node.last() as Branch;
					}
					else
					{
						node.children.push(node = new OL(node))
					}
					// insert
					node.children.push(node = new LI(node));
					break;
				}
				case Token.UL:
				{
					if (node.last() instanceof UL)
					{
						node = node.last() as Branch;
					}
					else
					{
						node.children.push(node = new UL(node))
					}
					// insert
					node.children.push(node = new LI(node));
					break;
				}
				//
				// inline
				//
				case Token.BOLD:
				{
					bold = !bold;
					break;
				}
				case Token.ITALIC:
				{
					italic = !italic;
					break;
				}
				case Token.UNDERLINE:
				{
					underline = !underline;
					break;
				}
				case Token.STRIKETHROUGH:
				{
					strikethrough = !strikethrough;
					break;
				}
				case Token.UNCHECKED_BOX:
				{
					node.children.push(new CHECKBOX(false));
					break;
				}
				case Token.CHECKED_BOX:
				{
					node.children.push(new CHECKBOX(true));
					break;
				}
				case Token.ARROW_ALL:
				{
					node.children.push(new TEXT({ value: "↔", bold, italic, underline, strikethrough }));
					break;
				}
				case Token.ARROW_LEFT:
				{
					node.children.push(new TEXT({ value: "←", bold, italic, underline, strikethrough }));
					break;
				}
				case Token.ARROW_RIGHT:
				{
					node.children.push(new TEXT({ value: "→", bold, italic, underline, strikethrough }));
					break;
				}
				case Token.FAT_ARROW_ALL:
				{
					node.children.push(new TEXT({ value: "⇔", bold, italic, underline, strikethrough }));
					break;
				}
				case Token.FAT_ARROW_LEFT:
				{
					node.children.push(new TEXT({ value: "⇐", bold, italic, underline, strikethrough }));
					break;
				}
				case Token.FAT_ARROW_RIGHT:
				{
					node.children.push(new TEXT({ value: "⇒", bold, italic, underline, strikethrough }));
					break;
				}
				case Token.MATH_APX:
				{
					node.children.push(new TEXT({ value: "≈", bold, italic, underline, strikethrough }));
					break;
				}
				case Token.MATH_NET:
				{
					node.children.push(new TEXT({ value: "≠", bold, italic, underline, strikethrough }));
					break;
				}
				case Token.MATH_LTOET:
				{
					node.children.push(new TEXT({ value: "≤", bold, italic, underline, strikethrough }));
					break;
				}
				case Token.MATH_GTOET:
				{
					node.children.push(new TEXT({ value: "≥", bold, italic, underline, strikethrough }));
					break;
				}
				default:
				{
					if (typeof token === "string")
					{
						node.children.push(new TEXT({ value: token, bold, italic, underline, strikethrough }));
					}
					break;
				}
			}
		}
		return origin;
	}
}
