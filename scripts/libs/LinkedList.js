/**
 * Represents a node in a doubly linked list.
 * @class
 */
class Node {
	/**
	 * Creates a new node.
	 * @param {*} value - The value stored in the node.
	 */
	constructor(value) {
		this.prev = null;
		this.value = value;
		this.next = null;
	}

	/**
	 * Sets the next node in the list.
	 * @param {Node} node - The next node to set.
	 */
	setNext(node) {
		if (node) node.prev = this;
		if (this.next) this.next.prev = null;
		this.next = node;
	}

	/**
	 * Unlinks the node from the list.
	 */
	unlink() {
		if (this.prev) {
			this.prev.setNext(this.next);
		}
		this.next = null;
	}
}

/**
 * Represents a doubly linked list.
 * @class
 */
export default class LinkedList {
	constructor() {
		/**
		 * The root node of the list.
		 * @type {Node|null}
		 */
		this.root = null;

		/**
		 * The last node of the list.
		 * @type {Node|null}
		 */
		this.last = null;

		/**
		 * The length of the list.
		 * @type {number}
		 */
		this.length = 0;
	}

	/**
	 * Adds a value to the list.
	 * @param {*} value - The value to add.
	 * @returns {Node} The node added.
	 */
	add(value) {
		const node = new Node(value);
		if (!this.root) {
			this.root = node;
		} else {
			this.last.setNext(node);
		}
		this.last = node;
		this.length++;
		return node;
	}

	/**
	 * Removes a node from the list.
	 * @param {Node} node - The node to remove.
	 */
	removeNode(node) {
		if (node === this.root) {
			this.root = node.next;
			if (this.root) {
				this.root.prev = null;
			}
		}
		if (node === this.last) {
			this.last = node.prev;
		}
		node.unlink();
		this.length--;
	}

	/**
	 * Returns an iterable object for the nodes in the list.
	 * @returns {Object} An iterable object.
	 */
	get nodes() {
		let root = this.root;
		return {
			[Symbol.iterator]() {
				let lastNode;
				return {
					next() {
						lastNode = lastNode ? lastNode.next : root;
						return {
							value: lastNode,
							done: !lastNode
						};
					}
				};
			}
		};
	}
}