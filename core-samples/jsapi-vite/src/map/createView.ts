import MapView from "@arcgis/core/views/MapView";
import type WebMap from "@arcgis/core/WebMap";

export function createView(webmap: WebMap) {
	return new MapView({
		container: "viewDiv",
		map: webmap,
	});
}
