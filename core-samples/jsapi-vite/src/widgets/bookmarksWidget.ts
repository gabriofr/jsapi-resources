// src/widgets/bookmarksWidget.ts
import type MapView from "@arcgis/core/views/MapView";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import { customBookmarks } from "../data/customBookmarks";

export function createBookmarksWidget(
	view: MapView,
	webmapBookmarks: __esri.Bookmark[] = [],
) {
	const allBookmarks = [...customBookmarks, ...webmapBookmarks];
	const bookmarks = new Bookmarks({
		view,
		bookmarks: allBookmarks,
	});

	const bkExpand = new Expand({
		view,
		content: bookmarks,
		expanded: true,
	});

	return { bookmarks, bkExpand };
}
