
export default class MathUtil {

	static getPointOnCircle(radius, angle) {
		let radAngle = angle / 180 * Math.PI;

		return {
			"x": Math.cos(radAngle) * radius,
			"y": Math.sin(radAngle) * radius
		}
	}

	static getDistance(point1, point2) {
		return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
	}
}
