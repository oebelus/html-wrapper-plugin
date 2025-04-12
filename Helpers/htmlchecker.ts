export function isValidHTML(htmlString: string): boolean {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, "text/html");
	return !doc.documentElement.querySelector("parsererror");
}

export function stripHTMLTags(htmlString: string): string {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, "text/html");
	return doc.body.textContent || "";
}

export function containsHTMLTags(str: string): boolean {
	return stripHTMLTags(str).trim() != str.trim();
}
