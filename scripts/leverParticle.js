/**
 * @fileoverview This script handles the management of powered lever blocks in Minecraft using a custom linked list.
 * It listens for lever actions and spawns particles around powered levers.
 * 
 * @version 0.1.0
 * @date 2024-07
 * @author WavePlayz
 * @discord @waveplayz
 * @serverVersion 1.14.0-beta
 */

import { world, system } from "@minecraft/server";
import LinkedList from "./libs/LinkedList";
import ModControl from "./pkgs/ModControl";
import { jobInterval } from "./pkgs/Utils";

const UPDATE_INTERVAL_IN_TICKS = 20;

// Initialize the mod control and the linked list for lever blocks
const modControl = new ModControl("leverParticle");
const poweredLeverBlocks = new LinkedList();

// Subscribe to lever actions and add powered levers to the list
world.afterEvents.leverAction.subscribe(
	modControl.ifEnabled((e) => {
		const { block, isPowered } = e;

		if (!isPowered) return;

		poweredLeverBlocks.add(block);
	})
);

/**
 * Calculates the particle location for a lever based on its direction.
 * @param {Vector3} location - The current location.
 * @param {number} location.x - The x coordinate.
 * @param {number} location.y - The y coordinate.
 * @param {number} location.z - The z coordinate.
 * @param {string} direction - The direction of the lever.
 * @returns {Vector3} The new location with particle offset.
 */
function getLeverParticleLocation({ x, y, z }, direction) {
	x += 0.5;
	y += 0.5;
	z += 0.5;

	switch (direction) {
		case "east":
			x -= 0.25;
			break;
		case "west":
			x += 0.25;
			break;
		case "north":
			z += 0.25;
			break;
		case "south":
			z -= 0.25;
			break;
		case "up_east_west":
		case "up_north_south":
			y -= 0.25;
			break;
		case "down_east_west":
		case "down_north_south":
			y += 0.25;
			break;
	}
	return { x, y, z };
}

/**
 * Generator function to handle particles around powered levers.
 */
function* handleLeverParticles() {
	if (! modControl.enabled) return
	
	for (const node of poweredLeverBlocks.nodes) {
		const block = node.value;

		if (!block.isValid()) continue;

		const { isAir, permutation, dimension, location } = block;
		const isNotPowered = isAir || !permutation.getState("open_bit"); // Check power state

		if (isNotPowered) {
			poweredLeverBlocks.removeNode(node);
			continue;
		}

		const direction = permutation.getState("lever_direction");
		
		dimension.spawnParticle(
			"minecraft:redstone_wire_dust_particle",
			getLeverParticleLocation(location, direction)
		);

		yield;
	}
}


// Run the particle handling job at defined intervals
jobInterval(
	handleLeverParticles,
	UPDATE_INTERVAL_IN_TICKS
);
