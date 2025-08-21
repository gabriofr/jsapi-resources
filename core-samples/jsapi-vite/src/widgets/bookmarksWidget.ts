import Collection from "@arcgis/core/core/Collection";
import type Viewpoint from "@arcgis/core/Viewpoint";
import type MapView from "@arcgis/core/views/MapView";
import Bookmark from "@arcgis/core/webmap/Bookmark";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import { CustomBookmarks } from "../data/customBookmarks";

export function createBookmarksWidget(
	view: MapView,
	webMapBookmarks: Bookmark[] = [],
) {
	// Single source of truth: a reactive Collection shared with the widget and the custom UI
	const bookmarks = new Collection<Bookmark>();
	bookmarks.addMany(CustomBookmarks());
	bookmarks.addMany(webMapBookmarks);

	// ArcGIS Bookmarks widget bound to the same Collection
	const bookmarksWidget = new Bookmarks({
		view,
		bookmarks,
	});

	// Ensure the widget actually renders by giving it a container
	const widgetHost = document.createElement("div");
	bookmarksWidget.container = widgetHost;

	// Custom UI
	const customContainer = document.createElement("div");
	const ul = document.createElement("ul");
	function renderList() {
		ul.innerHTML = "";
		bookmarks.forEach((b) => {
			const li = document.createElement("li");
			const link = document.createElement("a");
			link.href = "#";
			link.textContent = b.name;
			link.onclick = (e) => {
				e.preventDefault();
				view.goTo(b.viewpoint).catch(() => void 0);
			};

			const editBtn = document.createElement("button");
			editBtn.type = "button";
			editBtn.textContent = "Edit";
			editBtn.onclick = () => {
				const newName = prompt("Edit bookmark name:", b.name ?? "");
				if (newName && newName !== b.name) {
					b.name = newName;
					// Property changes do not emit Collection change events; re-render explicitly
					renderList();
				}
			};

			const removeBtn = document.createElement("button");
			removeBtn.type = "button";
			removeBtn.textContent = "Remove";
			removeBtn.onclick = () => {
				bookmarks.remove(b);
				// remove() triggers a Collection change; renderList will be called by the listener too.
			};
			const actions = document.createElement("span");
			actions.className = "bookmark-actions";
			actions.append(editBtn, removeBtn);

			li.append(link, actions);
			li.className = "bookmark-item";
			ul.appendChild(li);
			ul.className = "custom-bookmark-list";
		});
	}

	const addBtn = document.createElement("button");
	addBtn.type = "button";
	addBtn.textContent = "Add Bookmark";
	addBtn.className = "add-bookmark-button";

	addBtn.onclick = () => {
		const name = prompt("New bookmark name:");
		if (!name) return;
		const newBookmark = new Bookmark({
			name,
			viewpoint: view.viewpoint.clone() as Viewpoint,
			thumbnail: null,
			timeExtent: null,
		});
		bookmarks.add(newBookmark);
	};

	const bottomRow = document.createElement("ul");
	bottomRow.className = "bottom-row-button";

	bottomRow.appendChild(addBtn);
	customContainer.appendChild(ul);
	customContainer.append(bottomRow);
	renderList();

	// Combine ArcGIS widget and custom UI inside an Expand
	const content = document.createElement("div");
	// content.appendChild(widgetHost); // Uncomment if you want to show the ArcGIS widget default UI
	content.appendChild(customContainer);

	const bkExpand = new Expand({
		view,
		content,
		expanded: true,
	});

	// React to collection changes (add/remove/move)
	const handle = bookmarks.on("change", renderList);
	bkExpand.addHandles(handle);

	// Optional: cleanup helper if you ever need to destroy
	// (bkExpand as any)._cleanup = () => handle.remove();

	return {
		bookmarks: bookmarksWidget,
		bkExpand,
		dispose: () => {
			handle.remove();
			// optionally: bkExpand.destroy();
		},
	};
}
