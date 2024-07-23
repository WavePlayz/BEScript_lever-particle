import { system } from "@minecraft/server";

/**
 * Repeatedly executes a job at specified intervals.
 * @param {Function} callback - The job to execute. It must be a generator function.
 * @param {number} delayTicks - The interval in ticks between each job execution.
 */
export function jobInterval (callback, delayTicks) {
	/**
	 * The looping function that schedules the next job.
	 */
	function looper() {
		system.runJob(function* () {
			yield* callback();
			system.runTimeout(looper, delayTicks);
		}());
	}

	// Start the loop.
	looper();
}
