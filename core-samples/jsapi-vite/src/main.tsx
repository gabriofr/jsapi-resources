import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";

import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";

import Circle from "@arcgis/core/geometry/Circle";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";

import "./style.css";


// Adding custom bookmarks
const customBookmarks = [
  {
    name: "My Location",
    viewpoint: {
      targetGeometry: {
        type: "point",
        longitude: -118.805,
        latitude: 34.027,
        spatialReference: { wkid: 4326 }
      },
      scale: 5000
    },
    thumbnail: {
      url: "https://kagi.com/proxy/31-318635_goals-clipart-best-practice-best-practices-icon-png.png"
    }
  }
];

// Create a marker for the custom bookmark
const bookmarkPoint = new Point({
  longitude: -118.805,
  latitude: 34.027,
  spatialReference: { wkid: 4326 }
});

const markerSymbol: __esri.SimpleMarkerSymbolProperties = {
  type: "simple-marker",
  color: [226, 119, 40], // orange
  outline: {
    color: [255, 255, 255], // white
    width: 2
  }
};

const bookmarkGraphic = new Graphic({
  geometry: bookmarkPoint,
  symbol: markerSymbol
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
  bookmarks: customBookmarks
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
  }

  // Get the center point from the selected bookmark
  const { targetGeometry } = event.bookmark.viewpoint;
  if (targetGeometry.type === "point") {
    const circle = new Circle({
      center: targetGeometry,
      radius: 250, // meters
      spatialReference: { wkid: 4326 }
    });

    const fillSymbol = new SimpleFillSymbol({
      color: [226, 119, 40, 0.3], // semi-transparent orange
      outline: { color: [255, 255, 255], width: 2 }
    });

    areaGraphic = new Graphic({
      geometry: circle,
      symbol: fillSymbol
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
    const allBookmarks = [
      ...customBookmarks,
      ...(webmap.bookmarks || [])
    ];
    bookmarks.bookmarks = allBookmarks;
  });
  view.graphics.add(bookmarkGraphic);
  if (webmap.bookmarks && webmap.bookmarks.length) {
    console.log("Bookmarks: ", webmap.bookmarks.length);
  } else {
    console.log("No bookmarks in this webmap.");
  }
});
