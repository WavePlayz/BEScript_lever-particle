import { world } from "@minecraft/server";

/**
 * Class to control the mod's enabled state and handle chat commands to toggle it.
 */
class ModControl {
	#enabled;
	#id;
	#onChange;
	#command;

	static modControls = [];

	/**
	 * Initializes a new instance of the ModControl class.
	 * @param {string} id - The unique identifier for the mod.
	 * @param {Function} onChange - The callback to invoke when the mod's state changes.
	 */
	constructor(id, onChange) {
		this.#id = id;
		this.#onChange = onChange;
		this.#command = `./toggle ${this.#id}`;
		this.#enabled = world?.getDynamicProperty?.(this.#id) ?? true;

		this.#initialize();
		ModControl.modControls.push(this);

		console.warn(this.#createMessage("loaded"));
	}

	/**
	 * Creates a status message for the mod.
	 * @param {string} text - The status text to include in the message.
	 * @returns {string} The complete status message.
	 */
	#createMessage(text) {
		return `${this.#id} ${text}`;
	}

	/**
	 * Notifies the system and invokes the callback about the mod's state change.
	 */
	#notifyChange() {
		world?.setDynamicProperty?.(this.#id, this.#enabled);
		world?.sendMessage?.(this.#createMessage(`enabled ${this.#enabled}`));
		this.#onChange?.(this.#enabled);
	}

	/**
	 * Initializes the mod control by setting up event subscriptions.
	 */
	#initialize() {
		world?.beforeEvents?.chatSend?.subscribe?.(e => {
			const { message, sender } = e;
			if (message === this.#command && sender.hasTag(this.#id)) {
				e.cancel = true;
				this.toggle();
			}
		});
	}

	/**
	 * Gets the enabled state of the mod.
	 * @returns {boolean} The enabled state.
	 */
	get enabled() {
		return this.#enabled;
	}

	/**
	 * Sets the enabled state of the mod.
	 * @param {boolean} value - The new enabled state.
	 */
	set enabled(value) {
		this.#enabled = Boolean(value);
		this.#notifyChange();
	}

	/**
	 * Toggles the enabled state of the mod.
	 */
	toggle() {
		this.enabled = !this.#enabled;
	}

	/**
	 * Creates a decorator function that executes the callback only if the mod is enabled.
	 * @param {Function} callback - The callback to execute.
	 * @returns {Function} The decorator function.
	 */
	ifEnabled(callback) {
		return (...args) => this.#enabled && callback?.(...args);
	}
}

// Export the ModControl class as the default export.
export default ModControl;
