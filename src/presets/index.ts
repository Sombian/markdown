import Github from "./private/github";
import NekoNote from "./private/nekonote";
import Obsidian from "./private/obsidian";

export default abstract class Presets
{
	public static readonly Github = Object.freeze(Github);
	public static readonly NekoNote = Object.freeze(NekoNote);
	public static readonly Obsidian = Object.freeze(Obsidian);

	private constructor()
	{
		// final
	}
}
