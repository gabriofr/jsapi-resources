import Point from "@arcgis/core/geometry/Point";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Viewpoint from "@arcgis/core/Viewpoint";
import Bookmark from "@arcgis/core/webmap/Bookmark";

export type CustomBookmark = Bookmark & { uid: string };

export const CustomBookmarks = (): Bookmark[] => {
	return [
		new Bookmark({
			name: "My Location",
			viewpoint: new Viewpoint({
				targetGeometry: new Point({
					longitude: -118.805,
					latitude: 34.027,
					spatialReference: new SpatialReference({ wkid: 4326 }),
				}),
				scale: 5000,
			}),
			thumbnail: { url: "/assets/marker.svg" },
			timeExtent: null,
		}),
	];
};

export const bookmarkPoint = new Point({
	longitude: -118.805,
	latitude: 34.027,
	spatialReference: new SpatialReference({ wkid: 4326 }),
});
