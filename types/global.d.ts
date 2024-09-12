export {};

declare global
{
	type Maybe<T> = T | void;
	type Nullable<T> = T | null;

	type Skip<T extends readonly unknown[], N extends number, O extends readonly unknown[] = readonly []> =
	O["length"] extends N ? T : T extends readonly [infer F, ...infer R] ? Skip<R, N, readonly [...O, F]> : T;

	type Take<T extends readonly unknown[], N extends number, O extends readonly unknown[] = readonly []> =
	O["length"] extends N ? O : T extends readonly [infer F, ...infer R] ? Take<R, N, readonly [...O, F]> : O;
}
