import { HTMLWrapper } from "Helpers/constants";
import { ALL_WRAPPERS } from "HTMLwrapper";
import {
	App,
	Editor,
	MarkdownView,
	Menu,
	Modal,
	Notice,
	Plugin,
	Setting,
} from "obsidian";

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: "default",
};

export class CreateHTMLModal extends Modal {
	constructor(app: App, onSubmit: (name: string, content: string) => void) {
		super(app);
		this.setTitle("Create your HTML wrapper");

		let name = "";
		let content = "";

		new Setting(this.contentEl).setName("Name").addText((text) =>
			text.onChange((value) => {
				name = value;
			})
		);

		new Setting(this.contentEl).setName("HTML Content").addText((text) =>
			text.onChange((value) => {
				content = value;
			})
		);

		new Setting(this.contentEl).addButton((btn) =>
			btn
				.setButtonText("Save")
				.setCta()
				.onClick(async () => {
					this.close();
					onSubmit(name, content);
				})
		);
	}
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Create a HTML wrapper",
			(evt: MouseEvent) => {
				new CreateHTMLModal(this.app, async (name, content) => {
					try {
						const filename = "HTMLWrapper.ts";

						const html = {
							name: name,
							content: content,
						};

						const pluginDirectory =
							this.app.vault.configDir + "/plugins/wrap-w-html/";
						const filePath = pluginDirectory + filename;

						const fileContent = JSON.stringify(html);

						const fileExists = await this.app.vault.adapter.exists(
							filePath
						);

						if (fileExists) {
							const existingContent =
								await this.app.vault.adapter.read(filePath);

							if (existingContent.includes("ALL_WRAPPERS = []")) {
								await this.app.vault.adapter.write(
									filePath,
									"export const ALL_WRAPPERS = [" +
										fileContent +
										"]"
								);
							} else {
								await this.app.vault.adapter.write(
									filePath,
									existingContent.split("]")[0] +
										"," +
										fileContent +
										"]"
								);
							}
						} else {
							await this.app.vault.create(
								filePath,
								"export const ALL_WRAPPERS = [" +
									fileContent +
									"]"
							);
						}

						new Notice("HTML wrapper created successfully!");
					} catch (error) {
						new Notice("Error creating HTML wrapper: " + error);
					}
				}).open();
			}
		);

		ribbonIconEl.addClass("my-plugin-ribbon-class");

		this.registerEvent(
			this.app.workspace.on(
				"editor-menu",
				(menu: Menu, editor: Editor, view: MarkdownView) => {
					const selectedText = editor.getSelection();
					if (selectedText) {
						menu.addItem((item) => {
							item.setTitle("Wrap in HTML")
								.setIcon("code")
								.setSection("Wrap");

							// @ts-ignore
							const submenu = item.setSubmenu();
							ALL_WRAPPERS.forEach((wrapper: HTMLWrapper) => {
								submenu.addItem((subitem: HTMLWrapper) => {
									subitem
										// @ts-ignore
										.setTitle(wrapper.name)
										.onClick(() => {
											const wrappedText =
												wrapper.content.replace(
													"{{content}}",
													selectedText
												);
											editor.replaceSelection(
												wrappedText
											);
											new Notice(
												`Wrapped in ${wrapper.name}`
											);
										});
								});
							});

							// @ts-ignore
							item.setSubmenu(submenu);
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
