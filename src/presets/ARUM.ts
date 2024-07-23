import { Markdown } from ".."; import { Token, Context } from "../scanner"; import { AST } from "../parser"; import * as HTML from "../html";

abstract class impl extends Token
{
	override get next()
	{
		switch (this.code.at(-1))
		{
			case "\n":
			{
				return Context.BLOCK;
			}
			default:
			{
				return Context.INLINE;
			}
		}
	}
}

const T = Object.freeze(
{
	//
	// core
	//
	BREAK: new (class BREAK extends impl {})
	("all", "\n"),
	COMMENT_L: new (class COMMENT_L extends impl {})
	("all", "/*"),
	COMMENT_R: new (class COMMENT_R extends impl {})
	("all", "*/"),
	//
	// block
	//
	H1: new (class H1 extends impl {})
	(Context.BLOCK, "#".repeat(1) + "\u0020"),
	H2: new (class H2 extends impl {})
	(Context.BLOCK, "#".repeat(2) + "\u0020"),
	H3: new (class H3 extends impl {})
	(Context.BLOCK, "#".repeat(3) + "\u0020"),
	H4: new (class H4 extends impl {})
	(Context.BLOCK, "#".repeat(4) + "\u0020"),
	H5: new (class H5 extends impl {})
	(Context.BLOCK, "#".repeat(5) + "\u0020"),
	H6: new (class H6 extends impl {})
	(Context.BLOCK, "#".repeat(6) + "\u0020"),
	CB: new (class CB extends impl {})
	(Context.BLOCK, "```"),
	HR_1: new (class HR_1 extends impl {})
	(Context.BLOCK, "___" + "\n"),
	HR_2: new (class HR_2 extends impl {})
	(Context.BLOCK, "---" + "\n"),
	HR_3: new (class HR_3 extends impl {})
	(Context.BLOCK, "===" + "\n"),
	//
	// stack
	//
	BQ: new (class BQ extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "> "),
	OL: new (class OL extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "- "),
	UL: new (class UL extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "~ "),
	INDENT_1T: new (class INDENT_1T extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "\u0009".repeat(1)),
	INDENT_2S: new (class INDENT_2S extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "\u0020".repeat(2)),
	INDENT_4S: new (class INDENT_4S extends impl
	{
		override get next()
		{
			return Context.BLOCK;
		}
	})
	(Context.BLOCK, "\u0020".repeat(4)),
	//
	// inline
	//
	SPACE: new (class SPACE extends impl {})
	(Context.INLINE, " "),
	CODE: new (class CODE extends impl {})
	(Context.INLINE, "`"),
	BOLD: new (class BOLD extends impl {})
	(Context.INLINE, "**"),
	ITALIC: new (class ITALIC extends impl {})
	(Context.INLINE, "*"),
	STRIKE: new (class STRIKE extends impl {})
	(Context.INLINE, "~~"),
	UNDERLINE: new (class UNDERLINE extends impl {})
	(Context.INLINE, "__"),
	UNCHECKED_BOX: new (class UNCHECKED_BOX extends impl {})
	(Context.INLINE, "[ ]"),
	CHECKED_BOX: new (class CHECKED_BOX extends impl {})
	(Context.INLINE, "[x]"),
	ARROW_ALL: new (class ARROW_ALL extends impl {})
	(Context.INLINE, "<->"),
	ARROW_LEFT: new (class ARROW_LEFT extends impl {})
	(Context.INLINE, "<-"),
	ARROW_RIGHT: new (class ARROW_RIGHT extends impl {})
	(Context.INLINE, "->"),
	FAT_ARROW_ALL: new (class FAT_ARROW_ALL extends impl {})
	(Context.INLINE, "<=>"),
	FAT_ARROW_LEFT: new (class FAT_ARROW_LEFT extends impl {})
	(Context.INLINE, "<=="),
	FAT_ARROW_RIGHT: new (class FAT_ARROW_RIGHT extends impl {})
	(Context.INLINE, "=>"),
	MATH_APX: new (class MATH_APX extends impl {})
	(Context.INLINE, "~="),
	MATH_NET: new (class MATH_NET extends impl {})
	(Context.INLINE, "!="),
	MATH_LTOET: new (class MATH_LTOET extends impl {})
	(Context.INLINE, "<="),
	MATH_GTOET: new (class MATH_GTOET extends impl {})
	(Context.INLINE, ">="),
	EXCLAMATION: new (class EXCLAMATION extends impl {})
	(Context.INLINE, "!"),
	BRACKET_L: new (class BRACKET_L extends impl {})
	(Context.INLINE, "["),
	BRACKET_R: new (class BRACKET_R extends impl {})
	(Context.INLINE, "]"),	
	PAREN_L: new (class PAREN_L extends impl {})
	(Context.INLINE, "("),
	PAREN_R: new (class PAREN_R extends impl {})
	(Context.INLINE, ")"),
});

export default Object.freeze([
	//
	// tokens
	//
	Object.freeze(Object.values(T)),
	//
	// handle
	//
	function recursive({ peek, next, until }): AST
	{
		function scan()
		{
			switch (peek())
			{
				case T.COMMENT_L:
				{
					next();
			
					comment:
					while (true)
					{
						switch (next())
						{
							case null:
							{
								throw "EOF";
							}
							case T.COMMENT_R:
							{
								break comment;
							}
						}
					}
					break;
				}
			}
			return peek();
		}

		function core()
		{
			switch (peek())
			{
				case null:
				{
					throw "EOF";
				}
				case T.BREAK:
				{
					next();
		
					const token = peek();
		
					if (token instanceof impl)
					{
						// edge case - itself
						if (token === T.BREAK)
						{
							return new HTML.BR();
						}
						// edge case - inline
						if (token.ctx === Context.INLINE)
						{
							return new HTML.BR();
						}
					}
					return recursive({ peek, next, until: [] });
				}
			}
		}

		function block()
		{
			switch (scan())
			{
				case T.H1:
				{
					next(); return new HTML.H1(...inline().children);
				}
				case T.H2:
				{
					next(); return new HTML.H2(...inline().children);
				}
				case T.H3:
				{
					next(); return new HTML.H3(...inline().children);
				}
				case T.H4:
				{
					next(); return new HTML.H4(...inline().children);
				}
				case T.H5:
				{
					next(); return new HTML.H5(...inline().children);
				}
				case T.H6:
				{
					next(); return new HTML.H6(...inline().children);
				}
				case T.HR_1:
				case T.HR_2:
				case T.HR_3:
				{
					next(); return new HTML.HR(/* leaf node */);
				}
			}
		}

		function stack()
		{
			const root = (() =>
			{
				switch (scan())
				{
					case T.BQ: { next(); return new HTML.BQ(); }
					case T.OL: { next(); return new HTML.OL(); }
					case T.UL: { next(); return new HTML.UL(); }
				}
			})
			();

			if (root)
			{
				let [node, list] = [root as null | AST, root !instanceof HTML.BQ];

				stack:
				while (true)
				{
					switch (scan())
					{
						case null:
						{
							break stack;
						}
						case T.BREAK:
						{
							if (node === null) break stack;

							next();
							node = null;
							continue stack;
						}
						case T.INDENT_1T:
						case T.INDENT_2S:
						case T.INDENT_4S:
						{
							indent:
							while (true)
							{
								const ref = node?.children.at(-1) ?? root;
								
								switch (peek())
								{
									// redundant lookup... im sorry :(
									case T.INDENT_1T:
									case T.INDENT_2S:
									case T.INDENT_4S:
									{		
										switch (ref.constructor)
										{
											case HTML.OL:
											case HTML.UL:
											{
												// pickup
												next();
												node = ref as AST;
												continue indent;
											}
											default:
											{
												// indent level mismatch
												if (!node) break stack;
												node.children.push(inline()); break indent
											}
										}
									}
									default:
									{
										if (node === null) break stack;

										break indent;
									}
								}
							}
							continue stack;
						}
						case T.BQ:
						{
							const ref = node?.children.at(-1) ?? root;
								
							if (ref instanceof HTML.BQ)
							{
								next();
								// pickup
								node = ref;
							}
							else if (ref === root)
							{
								// oops
								break stack;
							}
							else if (node)
							{
								next();
								// insert
								node.children.push(node = new HTML.BQ());
							}
							else
							{
								break stack;
							}
							continue stack;
						}
						case T.OL:
						{
							const ref = node?.children.at(-1) ?? root;

							list = true;
								
							if (ref instanceof HTML.OL)
							{
								next();
								// pickup
								node = ref;
							}
							else if (node)
							{
								next();
								// insert
								node.children.push(node = new HTML.OL());
							}
							else
							{
								break stack;
							}
							continue stack;
						}
						case T.UL:
						{
							const ref = node?.children.at(-1) ?? root;

							list = true;
								
							if (ref instanceof HTML.UL)
							{
								next();
								// pickup
								node = ref;
							}
							else if (node)
							{
								next();
								// insert
								node.children.push(node = new HTML.UL());
							}
							else
							{
								break stack;
							}
							continue stack;
						}
						default:
						{
							if (node === null) break stack;
							const ast = recursive({ peek, next, until: [] });
							node.children.push(list ? new HTML.LI(...ast.children) : ast);
							list = false;
							continue stack;
						}
					}
				}
				return root;
			}
		}

		function inline()
		{
			const ast = new HTML.PR();

			function style(ast: AST, closing: Token)
			{
				style:
				while (true)
				{
					const token = scan(); if (until.includes(token as never)) break style;

					switch (token)
					{
						case null:
						case T.BREAK:
						{
							break style;
						}
						case closing:
						{
							next(); break style;
						}
						default:
						{
							if (typeof token === "string")
							{
								ast.children.push(next() as string);
							}
							else
							{
								ast.children.push(...recursive(
								{
									peek, next, until: [...until, closing]
								}
								).children);
							}
							continue style;
						}
					}
				}
				return ast;
			}

			inline:
			while (true)
			{
				const token = scan(); if (until.includes(token as never)) break inline;
				
				examine:
				switch (token)
				{
					case null:
					case T.BREAK:
					{
						break inline;
					}
					case T.BOLD:
					{
						next(); const ast = style(new HTML.BOLD(), T.BOLD);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					case T.CODE:
					{
						next(); const ast = style(new HTML.CODE(), T.CODE);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					case T.ITALIC:
					{
						next(); const ast = style(new HTML.ITALIC(), T.ITALIC);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					case T.STRIKE:
					{
						next(); const ast = style(new HTML.STRIKE(), T.STRIKE);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					case T.UNDERLINE:
					{
						next(); const ast = style(new HTML.UNDERLINE(), T.UNDERLINE);
						
						if (0 < ast.children.length) ast.children.push(ast);
						
						break examine;
					}
					default:
					{
						if (typeof token === "string")
						{
							next(); ast.children.push(token);
						}
						else
						{
							next(); ast.children.push(token.code);
						}
						break examine;
					}
				}
			}
			return ast;
		}
		return core() ?? block() ?? stack() ?? inline();
	},
] satisfies ConstructorParameters<typeof Markdown>);
