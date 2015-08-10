
export default class TimingHelper {
	constructor(message) {
		this.message = message;
	}

	startRecording() {
		this._start = new Date().getTime();
	}

	endRecording() {
		this._end = new Date().getTime();
		console.log(this.message + this.elapsedTime);
	}

	get elapsedTime() {
		return this._end - this._start;
	}
}
