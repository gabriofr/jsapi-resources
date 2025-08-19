import Circle from "@arcgis/core/geometry/Circle";
import type Point from "@arcgis/core/geometry/Point";

export function createCircle(center: Point, radius = 250) {
	return new Circle({
		center,
		radius,
		radiusUnit: "meters",
		geodesic: true,
		spatialReference: { wkid: 4326 },
	});
}
