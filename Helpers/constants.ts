export const ALL_WRAPPERS = [
	{
		name: "Text Color",
		wrappers: [
			{ name: "Blue", content: '<span style="color: blue">{{}}</span>' },
			{
				name: "Yellow",
				content: '<span style="color: yellow">{{}}</span>',
			},
			{
				name: "Purple",
				content: '<span style="color: purple">{{}}</span>',
			},
			{
				name: "Green",
				content: '<span style="color: green">{{}}</span>',
			},
			{ name: "Cyan", content: '<span style="color:cyan">{{}}</span>' },
		],
	},
	{
		name: "Background Color",
		wrappers: [
			{
				name: "Red",
				content: '<span style="background-color: red">{{}}</span>',
			},
			{
				name: "Green",
				content: '<span style="background-color: green">{{}}</span>',
			},
			{
				name: "Blue",
				content: '<span style="background-color: blue">{{}}</span>',
			},
			{
				name: "Yellow",
				content: '<span style="background-color: yellow">{{}}</span>',
			},
			{
				name: "Purple",
				content: '<span style="background-color: purple">{{}}</span>',
			},
		],
	},
	{
		name: "Outline",
		wrappers: [
			{
				name: "Red",
				content:
					'<div style="border: 2px solid red; padding: 5px;">{{}}</div>',
			},
			{
				name: "Green",
				content:
					'<div style="border: 2px solid green; padding: 5px;">{{}}</div>',
			},
			{
				name: "Blue",
				content:
					'<div style="border: 2px solid blue; padding: 5px;">{{}}</div>',
			},
			{
				name: "Yellow",
				content:
					'<div style="border: 2px solid yellow; padding: 5px;">{{}}</div>',
			},
			{
				name: "Purple",
				content:
					'<div style="border: 2px solid purple; padding: 5px;">{{}}</div>',
			},
		],
	},
	{
		name: "Text Style",
		wrappers: [
			{ name: "Bold", content: "<strong>{{}}</strong>" },
			{ name: "Italic", content: "<em>{{}}</em>" },
			{ name: "Underline", content: "<u>{{}}</u>" },
			{ name: "Strikethrough", content: "<s>{{}}</s>" },
			{ name: "Superscript", content: "<sup>{{}}</sup>" },
			{ name: "Subscript", content: "<sub>{{}}</sub>" },
		],
	},
	{
		name: "Code",
		wrappers: [
			{ name: "Inline Code", content: "<code>{{}}</code>" },
			{ name: "Code Block", content: "<pre><code>{{}}</code></pre>" },
		],
	},
	{
		name: "Image Position",
		wrappers: [
			{
				name: "Center",
				content:
					'<div style="display:flex; justify-content:center"> <img src="{{}}" /> </div>',
			},
		],
	},
];
