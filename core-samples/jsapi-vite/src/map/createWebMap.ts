import WebMap from "@arcgis/core/WebMap";

export const createWebMap = (): WebMap => {
	return new WebMap({
		portalItem: {
			id: "aa1d3f80270146208328cf66d022e09c",
		},
	});
};
