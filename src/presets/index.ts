import Github from "./private/github";
import NekoNote from "./private/nekonote";
import Obsidian from "./private/obsidian";

export default abstract class Presets
{
	public static readonly Github = Github;
	public static readonly NekoNote = NekoNote;
	public static readonly Obsidian = Obsidian;

	private constructor()
	{
		// final
	}
}
