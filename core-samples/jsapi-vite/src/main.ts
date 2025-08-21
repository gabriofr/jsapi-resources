import "./style.css";
import Graphic from "@arcgis/core/Graphic";
import { bookmarkPoint, CustomBookmarks } from "./data/customBookmarks";
import { markerSymbol } from "./graphics/symbols";
import { handleBookmarkSelection } from "./handlers/bookmarksSelection";
import { addCrosshairOverlay, createView } from "./map/createView";
import { createWebMap } from "./map/createWebMap";
import { createBookmarksWidget } from "./widgets/bookmarksWidget";
import "@arcgis/core/assets/esri/themes/light/main.css";

const webMap = createWebMap();
webMap.bookmarks.addMany(CustomBookmarks());
const view = createView(webMap);

const bookmarkGraphic = new Graphic({
	geometry: bookmarkPoint,
	symbol: markerSymbol,
});

webMap
	.when(() => {
		const defaultBookmarks = webMap.bookmarks ? webMap.bookmarks.toArray() : [];
		const { bookmarks, bkExpand } = createBookmarksWidget(
			view,
			defaultBookmarks,
		);

		handleBookmarkSelection(bookmarks, view);
		view.ui.add(bkExpand, "top-right");
		view.graphics.add(bookmarkGraphic);
	})
	.catch((error) => {
		console.error("Failed to load webMap:", error);
	});
addCrosshairOverlay(view);
