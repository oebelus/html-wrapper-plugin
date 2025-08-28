import { App, PluginSettingTab, Setting } from "obsidian";
import { HTMLWrapper } from "Helpers/interfaces";
import HtmlWrapper from "main";

export default class WrapperSettings extends PluginSettingTab {
	plugin: HtmlWrapper;

	constructor(app: App, plugin: HtmlWrapper) {
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

		if (this.plugin.settings.wrappers.length == 0) {
			containerEl.createEl("h5", {
				text: "No wrappers found. Create some!",
			});
		} else
			this.plugin.settings.wrappers.forEach((wrapper: HTMLWrapper) => {
				const categoryName = containerEl.createEl("h3", {
					text: wrapper.name,
				});
				new Setting(containerEl)
					.setName("Edit Category Name")
					.addText((text) =>
						text
							.setPlaceholder(wrapper.name)
							.onChange(async (value) => {
								wrapper.name = value;

								categoryName.setText(wrapper.name);

								await this.plugin.saveSettings();

								await this.app.vault.adapter.write(
									this.filePath,
									"export const this.plugin.settings.wrappers = " +
										JSON.stringify(
											this.plugin.settings.wrappers
										)
								);
							})
					);

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
										"export const this.plugin.settings.wrappers = " +
											JSON.stringify(
												this.plugin.settings.wrappers
											)
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
										"export const this.plugin.settings.wrappers = " +
											JSON.stringify(
												this.plugin.settings.wrappers
											)
									);
								})
						)
						.addButton((button) => {
							button
								.setIcon("trash")
								.setWarning()
								.setCta()
								.onClick(async () => {
									const index =
										this.plugin.settings.wrappers.findIndex(
											(wrapper) =>
												wrapper.name === wrapper.name
										);
									if (index > -1) {
										this.plugin.settings.wrappers[
											index
										].wrappers.splice(index, 1);
									}
									await this.plugin.saveSettings();

									await this.app.vault.adapter.write(
										this.filePath,
										"export const this.plugin.settings.wrappers = " +
											JSON.stringify(
												this.plugin.settings.wrappers
											)
									);
									this.display();
								});
						});
				});

				new Setting(containerEl).addButton((button) => {
					button
						.setButtonText("Delete Category")
						.setWarning()
						.setCta()
						.onClick(async () => {
							const index = (
								this.plugin.settings
									.wrappers as unknown as HTMLWrapper[]
							).indexOf(wrapper);
							if (index > -1) {
								this.plugin.settings.wrappers.splice(index, 1);
							}
							await this.plugin.saveSettings();

							await this.app.vault.adapter.write(
								this.filePath,
								"export const this.plugin.settings.wrappers = " +
									JSON.stringify(
										this.plugin.settings.wrappers
									)
							);
							this.display();
						});
				});
			});
	}
}
