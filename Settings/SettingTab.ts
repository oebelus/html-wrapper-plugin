import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import { HTMLWrapper } from "Helpers/interfaces";
import HtmlWrapper from "main";

export default class WrapperSettings extends PluginSettingTab {
	plugin: HtmlWrapper;

	constructor(app: App, plugin: HtmlWrapper) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h1", { text: "HTML Wrappers" });

		if (this.plugin.settings.wrappers.length == 0) {
			containerEl.createEl("h5", {
				text: "No wrappers found. Create some!",
			});
		} else
			this.plugin.settings.wrappers.forEach(
				(category: HTMLWrapper, categoryIndex: number) => {
					const categoryName = containerEl.createEl("h3", {
						text: category.name,
					});
					new Setting(containerEl)
						.setName("Edit Category Name")
						.addText((text) =>
							text
								.setPlaceholder(category.name)
								.onChange(async (value) => {
									category.name = value;

									categoryName.setText(category.name);

									await this.plugin.saveSettings();
								})
						);

					category.wrappers.forEach((wrapper, wrapperIndex) => {
						new Setting(containerEl)
							.setName(wrapper.name)
							.setDesc(wrapper.content)

							.addText((text) =>
								text
									.setPlaceholder(wrapper.name)
									.onChange(async (value) => {
										wrapper.name = value;
										await this.plugin.saveSettings();
									})
							)
							.addText((text) =>
								text
									.setPlaceholder(wrapper.content)
									.onChange(async (value) => {
										wrapper.content = value;

										await this.plugin.saveSettings();
									})
							)
							.addButton((button) => {
								button
									.setIcon("trash")
									.setWarning()
									.setCta()
									.onClick(async () => {
										category.wrappers.splice(
											wrapperIndex,
											1
										);
										await this.plugin.saveSettings();

										this.display();
										new Notice(
											"Element deleted successfully!"
										);
									});
							});
					});

					new Setting(containerEl).addButton((button) => {
						button
							.setButtonText("Delete Category")
							.setWarning()
							.setCta()
							.onClick(async () => {
								this.plugin.settings.wrappers.splice(
									categoryIndex,
									1
								);
								await this.plugin.saveSettings();

								this.display();
								new Notice("Category deleted successfully!");
							});
					});
				}
			);
	}
}
