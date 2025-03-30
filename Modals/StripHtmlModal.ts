import { App, Modal, Setting } from "obsidian";

export class StripHtmlModal extends Modal {
	constructor(app: App, onSubmit: (bool: boolean) => void) {
		super(app);
		this.setTitle("HTML Tags Removal");
		this.setContent(
			"Do you want to remove existing HTML tags before applying new tags?"
		);

		new Setting(this.contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Yes, remove HTML")
					.setCta()
					.onClick(() => {
						onSubmit(true);
						this.close();
					})
			)
			.addButton((btn) =>
				btn
					.setButtonText("No, keep HTML")
					.setCta()
					.onClick(() => {
						onSubmit(false);

						this.close();
					})
			).settingEl.style.marginTop = "10px";
	}
}
