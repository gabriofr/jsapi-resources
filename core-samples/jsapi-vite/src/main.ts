import "./style.css";
import Graphic from "@arcgis/core/Graphic";
import { bookmarkPoint } from "./data/customBookmarks";
import { markerSymbol } from "./graphics/symbols";
import { handleBookmarkSelection } from "./handlers/bookmarksSelection";
import { createView } from "./map/createView";
import { createWebMap } from "./map/createWebMap";
import { createBookmarksWidget } from "./widgets/bookmarksWidget";

const webMap = createWebMap();
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
