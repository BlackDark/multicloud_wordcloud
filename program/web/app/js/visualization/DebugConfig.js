export default class DebugConfig {
	constructor() {
		this._collisionRemovalTimes = 200;
	}

	get collisionRemovalTimes() {
		return this._collisionRemovalTimes;
	}
}
