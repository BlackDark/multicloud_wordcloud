export default class CollisionModule {

	static isInBounds(node, boundingArea) {
		return node.x >= boundingArea.x0 && node.y >= boundingArea.y0;
	}

	static hasCollision(node, area) {
		return node.x < area.x + area.width &&
			node.x + node.width > area.x &&
			node.y < area.y + area.height &&
			node.height + node.y > area.y;
	}

	static testOverlap(testNode, testArrayNodes) {
		for(var i = 0; i < testArrayNodes.length; i++) {
			if (testNode === testArrayNodes[i]) {
				continue;
			}

			if(CollisionModule.hasCollision(testNode, testArrayNodes[i])) {
				return true;
			}
		}

		return false;
	}

	static hasOverlap(node, nodes) {
		var overlap = false;

		nodes.forEach(function(checkNode){
			if (checkNode && (checkNode !== node)) {

				var xSpacing = (checkNode.width + node.width) / 2,
					ySpacing = (checkNode.height + node.height) / 2,
					absX = Math.abs(node.x - checkNode.x),
					absY = Math.abs(node.y - checkNode.y);

				if (absX < xSpacing && absY < ySpacing) {
					overlap = true;
				}
			}
		});

		return overlap;
	}

	// Collision not working that good
	static collide(node) {

		return function(quad, x1, y1, x2, y2) {
			var updated = false;
			if (quad.point && (quad.point !== node)) {

				var x = node.x - quad.point.x,
					y = node.y - quad.point.y,
					xSpacing = (quad.point.width + node.width) / 2,
					ySpacing = (quad.point.height + node.height) / 2,
					absX = Math.abs(x),
					absY = Math.abs(y),
					l,
					lx,
					ly;

				if (absX < xSpacing && absY < ySpacing) {
					l = Math.sqrt(x * x + y * y);

					lx = (absX - xSpacing) / l;
					ly = (absY - ySpacing) / l;

					// the one that's barely within the bounds probably triggered the collision
					if (Math.abs(lx) > Math.abs(ly)) {
						lx = 0;
					} else {
						ly = 0;
					}

					node.x -= x *= lx;
					node.y -= y *= ly;
					quad.point.x += x;
					quad.point.y += y;

					updated = true;
				}
			}
			return updated;
		};
	}

}
