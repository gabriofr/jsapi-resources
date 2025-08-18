import Graphic from "@arcgis/core/Graphic";
import Circle from "@arcgis/core/geometry/Circle";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

import "./style.css";
import {bookmarkPoint, customBookmarks} from "./data/customBookmarks.ts";

const markerSymbol = new SimpleMarkerSymbol({
  color: [226, 119, 40],
  outline: {
    color: [255, 255, 255],
    width: 2,
  },
});

const bookmarkGraphic = new Graphic({
  geometry: bookmarkPoint,
  symbol: markerSymbol,
});

const webmap = new WebMap({
	portalItem: {
		id: "aa1d3f80270146208328cf66d022e09c",
	},
});

const view = new MapView({
	container: "viewDiv",
	map: webmap,
});

const bookmarks = new Bookmarks({
	view,
	bookmarks: customBookmarks,
});

const bkExpand = new Expand({
	view,
	content: bookmarks,
	expanded: true,
});

// Draw out an area around the selected bookmark
let areaGraphic: Graphic | null = null;
bookmarks.on("bookmark-select", (event) => {
	// Remove old area
	if (areaGraphic) {
		view.graphics.remove(areaGraphic);
    areaGraphic = null;
	}

	// Get the center point from the selected bookmark
	const { targetGeometry } = event.bookmark.viewpoint;
	if (targetGeometry && targetGeometry?.type === "point") {
		const circle = new Circle({
			center: targetGeometry,
      radiusUnit: "meters",
      geodesic: true,
			radius: 250, // meters
			spatialReference: { wkid: 4326 },
		});

		const fillSymbol = new SimpleFillSymbol({
			color: [226, 119, 40, 0.3], // semi-transparent orange
			outline: { color: [255, 255, 255], width: 2 },
		});

		areaGraphic = new Graphic({
			geometry: circle,
			symbol: fillSymbol,
		});

		view.graphics.add(areaGraphic);
	}
});

// Add the widget to the top-right corner of the view
view.ui.add(bkExpand, "top-right");

// bonus - how many bookmarks in the webmap?
view.when(() => {
	webmap.when(() => {
		// Combine webmap bookmarks with custom ones
		const allBookmarks = [...customBookmarks, ...(webmap.bookmarks || [])];
		bookmarks.bookmarks = allBookmarks;
	});
	view.graphics.add(bookmarkGraphic);
	if (webmap.bookmarks?.length) {
		console.log("Bookmarks: ", webmap.bookmarks.length);
	} else {
		console.log("No bookmarks in this webmap.");
	}
});
