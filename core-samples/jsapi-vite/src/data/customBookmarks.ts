import Point from "@arcgis/core/geometry/Point";

// Adding custom bookmarks
export const customBookmarks = [
  {
    name: "My Location",
    viewpoint: {
      targetGeometry: {
        type: "point" as const,
        longitude: -118.805,
        latitude: 34.027,
        spatialReference: { wkid: 4326 },
      },
      scale: 5000,
    },
    thumbnail: {url: "/assets/marker.svg"},
  },
];

// Create a marker for the custom bookmark
export const bookmarkPoint = new Point({
  longitude: -118.805,
  latitude: 34.027,
  spatialReference: { wkid: 4326 },
});


