export interface HTMLWrapper {
	name: string;
	wrappers: Wrapper[];
}

export interface Wrapper {
	name: string;
	content: string;
}
