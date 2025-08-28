import { HTMLWrapper, Wrapper } from "Helpers/interfaces";
import { containsHTMLTags, stripHTMLTags } from "Helpers/htmlchecker";
import { Editor, Menu, Notice, Plugin } from "obsidian";
import { CreateHTMLModal } from "Modals/CreateHtmlModal";
import { StripHtmlModal } from "Modals/StripHtmlModal";
import WrapperSettings from "Settings/SettingTab";

interface HtmlWrapperSettings {
	wrappers: HTMLWrapper[];
}

const DEFAULT_SETTINGS: HtmlWrapperSettings = {
	wrappers: [
		{
			name: "Text Color",
			wrappers: [
				{
					name: "Blue",
					content: '<span style="color: blue">{{}}</span>',
				},
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
				{
					name: "Cyan",
					content: '<span style="color:cyan">{{}}</span>',
				},
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
					content:
						'<span style="background-color: green">{{}}</span>',
				},
				{
					name: "Blue",
					content: '<span style="background-color: blue">{{}}</span>',
				},
				{
					name: "Yellow",
					content:
						'<span style="background-color: yellow">{{}}</span>',
				},
				{
					name: "Purple",
					content:
						'<span style="background-color: purple">{{}}</span>',
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
	],
};

export default class HtmlWrapper extends Plugin {
	settings: HtmlWrapperSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new WrapperSettings(this.app, this));

		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Create a HTML wrapper",
			(evt: MouseEvent) => {
				new CreateHTMLModal(
					this.app,
					async (name, content, category) => {
						try {
							const html: Wrapper = {
								name: name,
								content: content,
							};

							const existingCategory =
								this.settings.wrappers.find(
									(wrapper) =>
										wrapper.name.trim() === category.trim()
								);

							if (existingCategory) {
								existingCategory.wrappers.push(html);
							} else {
								this.settings.wrappers.push({
									name: category,
									wrappers: [html],
								});
							}

							await this.saveSettings();
							new Notice("HTML wrapper created successfully!");
						} catch (error) {
							new Notice("Error creating HTML wrapper: " + error);
						}
					}
				).open();
			}
		);

		ribbonIconEl.addClass("my-plugin-ribbon-class");

		this.registerEvent(
			this.app.workspace.on(
				"editor-menu",
				(menu: Menu, editor: Editor) => {
					const selectedText = editor.getSelection();
					if (selectedText) {
						menu.addItem((item) => {
							item.setTitle("Wrap in HTML")
								.setIcon("code")
								.setSection("Wrap");

							// @ts-ignore
							const categorySubmenu = item.setSubmenu();

							this.settings.wrappers.forEach(
								(category: HTMLWrapper) => {
									categorySubmenu.addItem(
										(subitem: HTMLWrapper) => {
											subitem
												// @ts-ignore
												.setTitle(category.name)
												.setIcon("folder");

											const wrapperSubmenu =
												// @ts-ignore
												subitem.setSubmenu();
											category.wrappers.forEach(
												(wrapper: Wrapper) => {
													wrapperSubmenu.addItem(
														(
															wrapperItem: Wrapper
														) => {
															wrapperItem
																// @ts-ignore
																.setTitle(
																	wrapper.name
																)
																.setIcon("code")
																.onClick(() => {
																	if (
																		containsHTMLTags(
																			selectedText
																		)
																	)
																		new StripHtmlModal(
																			this.app,
																			(
																				shouldStrip: boolean
																			) => {
																				try {
																					if (
																						shouldStrip
																					) {
																						const html =
																							wrapper.content.replace(
																								"{{}}",
																								stripHTMLTags(
																									selectedText
																								)
																							);
																						editor.replaceSelection(
																							html
																						);
																					} else {
																						const html =
																							wrapper.content.replace(
																								"{{}}",
																								selectedText
																							);
																						editor.replaceSelection(
																							html
																						);
																					}
																				} catch (error) {
																					new Notice(
																						"Error wrapping HTML: " +
																							error
																					);
																				}
																			}
																		).open();
																	else {
																		const html =
																			wrapper.content.replace(
																				"{{}}",
																				selectedText
																			);
																		editor.replaceSelection(
																			html
																		);
																	}
																});
														}
													);
												}
											);
											// @ts-ignore
											subitem.setSubmenu(wrapperSubmenu);
										}
									);
								}
							);

							// @ts-ignore
							item.setSubmenu(categorySubmenu);
						});
					}
				}
			)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
