function hasCollision(node, area) {
	return node.x < area.x + area.width &&
		node.x + node.width > area.x &&
		node.y < area.y + area.height &&
		node.height + node.y > area.y;
}

QUnit.test( "hello test", function( assert ) {
	assert.equal(hasCollision({x:0, y:0, width: 10, height: 10}, {x:5, y:5, width: 10, height: 10}), true, "Collision" );
	assert.equal(hasCollision({x:0, y:0, width: 4, height: 4}, [{x:5, y:5, width: 10, height: 10}]), false, "No collision" );
});
