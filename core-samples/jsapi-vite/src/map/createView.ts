import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import MapView from "@arcgis/core/views/MapView";
import type WebMap from "@arcgis/core/WebMap";

export function createView(webmap: WebMap) {
	return new MapView({
		container: "viewDiv",
		map: webmap,
	});
}

export const addCrosshairOverlay = (view: __esri.MapView): void => {
	// Assuming your map container has id 'viewDiv'
	if (!document.getElementById("viewDiv")) return;
	//
	// Remove any existing crosshair
	const old = view.container.querySelector(".crosshair");
	if (old) old.remove();

	// Create crosshair overlay
	const crosshair = document.createElement("div");
	crosshair.style.position = "absolute";
	crosshair.style.top = "50%";
	crosshair.style.left = "50%";
	crosshair.style.transform = "translate(-50%, -50%)";
	crosshair.style.pointerEvents = "none";
	crosshair.className = "crosshair";

	crosshair.innerHTML = `
    <img src="/assets/crosshair.png" alt="Crosshair" style="width:64px;height:64px;pointer-events:none;" />
    <div id="crosshair-coords" style="position:absolute;top:76px;left:50%;transform:translateX(-50%);background:#fff;padding:4px 8px;border-radius:4px;box-shadow:0 2px 8px #0002;white-space:nowrap;"></div>
`;
	view.ui.add(crosshair, "manual");
	const coordsDiv = crosshair.querySelector(
		"#crosshair-coords",
	) as HTMLDivElement;

	// mapContainer.appendChild(crosshair);

	// Update coordinates on map navigation
	reactiveUtils.watch(
		() => view.center,
		(center) => {
			if (coordsDiv && center) {
				coordsDiv.textContent = `${center.latitude.toFixed(5)}, ${center.longitude.toFixed(5)}`;
			}
		},
		{ initial: true },
	);

	// Initialize coordinates
	const center = view.center;
	if (coordsDiv) {
		coordsDiv.textContent = `${center.latitude.toFixed(5)}, ${center.longitude.toFixed(5)}`;
	}
};
