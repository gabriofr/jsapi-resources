import "./style.css";
import Graphic from "@arcgis/core/Graphic";
import { bookmarkPoint } from "./data/customBookmarks";
import { markerSymbol } from "./graphics/symbols";
import { handleBookmarkSelection } from "./handlers/bookmarksSelection";
import { createView } from "./map/createView";
import { createWebMap } from "./map/createWebMap";
import { createBookmarksWidget } from "./widgets/bookmarksWidget";

//
// To implement a "create new bookmark" feature, you would:
//
//
//   Add a UI control (e.g., button or form) to trigger bookmark creation.
//   Let the user select a point on the map (using a map click event).
//   Prompt the user for a bookmark title.
//   Create a new bookmark object and add it to your bookmarks collection.
//   Update the bookmarks widget to reflect the new bookmark.
//
// This involves UI work, map interaction, and updating the widget’s data source.
//

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
