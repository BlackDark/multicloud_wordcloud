export default class DebugConfig {
	constructor() {
		this._collisionRemovalTimes = 200;
		this._drawLinksD3Force = false;
		this._drawLinksColaForce = false;
		this._applyBorderConstraints = true;
	}

	get collisionRemovalTimes() {
		return this._collisionRemovalTimes;
	}

	get drawLinksD3Force() {
		return this._drawLinksD3Force;
	}

	get drawLinksColaForce() {
		return this._drawLinksColaForce;
	}

	get applyBorderConstraints() {
		return this._applyBorderConstraints;
	}

}
