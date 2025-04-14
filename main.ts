import { ALL_WRAPPERS } from "Helpers/constants";
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
	wrappers: [],
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
							const filename = "constants.ts";

							const html: Wrapper = {
								name: name,
								content: content,
							};

							const pluginDirectory =
								this.app.vault.configDir +
								"/plugins/wrap-w-html/Helpers/";
							const filePath = pluginDirectory + filename;

							const fileExists =
								await this.app.vault.adapter.exists(filePath);

							console.log("here");

							if (fileExists) {
								const categoryExists = ALL_WRAPPERS.find(
									(wrapper: HTMLWrapper) => {
										return (
											wrapper.name.trim() ==
											category.trim()
										);
									}
								);
								if (
									categoryExists !== undefined &&
									(categoryExists as HTMLWrapper).wrappers
										.length > 0
								) {
									ALL_WRAPPERS.forEach(
										(wrapper: HTMLWrapper) => {
											if (wrapper.name === category) {
												wrapper.wrappers.push(html);
											}
										}
									);

									console.log(ALL_WRAPPERS);
								} else {
									(
										ALL_WRAPPERS as unknown as HTMLWrapper[]
									).push({
										name: category,
										wrappers: [html],
									});
								}
							} else {
								await this.app.vault.create(
									filePath,
									"export const ALL_WRAPPERS = []"
								);

								(ALL_WRAPPERS as unknown as HTMLWrapper[]).push(
									{
										name: category,
										wrappers: [html],
									}
								);
								return;
							}

							await this.app.vault.adapter.write(
								filePath,
								"export const ALL_WRAPPERS = " +
									JSON.stringify(ALL_WRAPPERS)
							);

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

							ALL_WRAPPERS.forEach((category: HTMLWrapper) => {
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
													(wrapperItem: Wrapper) => {
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
							});

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
