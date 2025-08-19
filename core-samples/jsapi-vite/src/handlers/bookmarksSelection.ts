// src/handlers/bookmarkSelection.ts
import Circle from "@arcgis/core/geometry/Circle";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import type Bookmarks from "@arcgis/core/widgets/Bookmarks";
import type MapView from "@arcgis/core/views/MapView";
import Graphic from "@arcgis/core/Graphic";

export function handleBookmarkSelection(bookmarks: Bookmarks, view: MapView) {
  let areaGraphic: Graphic | null = null;

  bookmarks.on("bookmark-select", (event) => {
    // Remove old area
    if (areaGraphic) {
      view.graphics.remove(areaGraphic);
      areaGraphic = null;
    }

    // Get the center point from the selected bookmark
    const { targetGeometry } = event.bookmark.viewpoint;
    if (targetGeometry && targetGeometry.type === "point") {
      const circle = new Circle({
        center: targetGeometry,
        radiusUnit: "meters",
        geodesic: true,
        radius: 250,
        spatialReference: { wkid: 4326 },
      });

      const fillSymbol = new SimpleFillSymbol({
        color: [226, 119, 40, 0.3],
        outline: { color: [255, 255, 255], width: 2 },
      });

      areaGraphic = new Graphic({
        geometry: circle,
        symbol: fillSymbol,
      });

      view.graphics.add(areaGraphic);
    }
  });
}
