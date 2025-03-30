import { isValidHTML } from "Helpers/htmlchecker";
import { App, Modal, Notice, Setting } from "obsidian";

export class CreateHTMLModal extends Modal {
	constructor(
		app: App,
		onSubmit: (name: string, content: string, category: string) => void
	) {
		super(app);
		this.setTitle("Create your HTML wrapper");

		let category = "";
		let name = "";
		let content = "";

		new Setting(this.contentEl).setName("Category").addText((text) =>
			text.onChange((value) => {
				category = value;
			})
		);

		new Setting(this.contentEl).setName("Name").addText((text) =>
			text.onChange((value) => {
				name = value;
			})
		);

		new Setting(this.contentEl).setName("Content").addText((text) =>
			text.onChange((value) => {
				content = value;
			})
		);

		new Setting(this.contentEl).addButton((btn) =>
			btn
				.setButtonText("Save")
				.setCta()
				.onClick(async () => {
					if (!name || !content || !category) {
						new Notice("Please, fill all the fields.");
						return;
					}

					if (!isValidHTML(content)) {
						new Notice("Invalid HTML content.");
						return;
					}

					this.close();
				})
		);
	}
}
