import { App, PluginSettingTab, Setting } from "obsidian";
import MyPlugin from "main";
import { HTMLWrapper } from "Helpers/interfaces";
import { ALL_WRAPPERS } from "Helpers/constants";

// interface WrapperSettings {
// 	wrappers: HTMLWrapper[];
// }

// const DEFAULT_SETTINGS: WrapperSettings = {
// 	wrappers: [],
// };

export default class WrapperSettings extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	filename = "constants.ts";

	pluginDirectory =
		this.app.vault.configDir + "/plugins/wrap-w-html/Helpers/";

	filePath = this.pluginDirectory + this.filename;

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h1", { text: "HTML Wrappers" });

		if (ALL_WRAPPERS.length == 0) {
			containerEl.createEl("h5", {
				text: "No wrappers found. Create some!",
			});
		}
		// for each wrapper, add the categories as title/name, and under the name i should have the wraps and 2 buttons to edit and delete
		else
			ALL_WRAPPERS.forEach((wrapper: HTMLWrapper) => {
				containerEl.createEl("h3", { text: wrapper.name });

				wrapper.wrappers.forEach((wrapper) => {
					new Setting(containerEl)
						.setName(wrapper.name)
						.setDesc(wrapper.content)

						.addText((text) =>
							text
								.setPlaceholder(wrapper.name)
								.onChange(async (value) => {
									wrapper.name = value;
									await this.plugin.saveSettings();

									await this.app.vault.adapter.write(
										this.filePath,
										"export const ALL_WRAPPERS = " +
											JSON.stringify(ALL_WRAPPERS)
									);
								})
						)
						.addText((text) =>
							text
								.setPlaceholder(wrapper.content)
								.onChange(async (value) => {
									wrapper.content = value;

									await this.plugin.saveSettings();

									await this.app.vault.adapter.write(
										this.filePath,
										"export const ALL_WRAPPERS = " +
											JSON.stringify(ALL_WRAPPERS)
									);
								})
						);
				});

				new Setting(containerEl).addButton((button) => {
					button
						.setButtonText("Delete Category")
						.setCta()
						.onClick(async () => {
							const index = (
								ALL_WRAPPERS as unknown as HTMLWrapper[]
							).indexOf(wrapper);
							if (index > -1) {
								ALL_WRAPPERS.splice(index, 1);
							}
							await this.plugin.saveSettings();

							await this.app.vault.adapter.write(
								this.filePath,
								"export const ALL_WRAPPERS = " +
									JSON.stringify(ALL_WRAPPERS)
							);
							this.display();
						});
				});
			});
	}
}
