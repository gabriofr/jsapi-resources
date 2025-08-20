import type Viewpoint from "@arcgis/core/Viewpoint";
import type MapView from "@arcgis/core/views/MapView";
import Bookmark from "@arcgis/core/webmap/Bookmark";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import { CustomBookmarks } from "../data/customBookmarks";

type CustomBookmark = Bookmark;

function createBookmarkListUI(
	bookmarks: CustomBookmark[],
	onAdd: (name: string) => void,
	onEdit: (id: string, name: string) => void,
	onRemove: (id: string) => void,
): HTMLElement {
	const container = document.createElement("div");
	const ul = document.createElement("ul");
	bookmarks.forEach((b) => {
		const li = document.createElement("li");
		li.textContent = b.name;

		const editBtn = document.createElement("button");
		editBtn.textContent = "Edit";
		editBtn.onclick = () => {
			const newName = prompt("Edit bookmark name:", b.name);
			if (newName) onEdit(b.uid, newName);
		};

		const removeBtn = document.createElement("button");
		removeBtn.textContent = "Remove";
		removeBtn.onclick = () => onRemove(b.uid);

		li.append(" ", editBtn, " ", removeBtn);
		ul.appendChild(li);
	});

	const addBtn = document.createElement("button");
	addBtn.textContent = "Add Bookmark";
	addBtn.onclick = () => {
		const name = prompt("New bookmark name:");
		if (name) onAdd(name);
	};

	container.appendChild(addBtn);
	container.appendChild(ul);
	return container;
}

export function createBookmarksWidget(
	view: MapView,
	webMapBookmarks: Bookmark[] = [],
) {
	let allBookmarks: CustomBookmark[] = [
		...CustomBookmarks(),
		...webMapBookmarks,
	];

	const bookmarksWidget = new Bookmarks({
		view,
		bookmarks: allBookmarks,
	});

	function updateWidget() {
		bookmarksWidget.bookmarks = allBookmarks;
	}

	const customUI = createBookmarkListUI(
		allBookmarks,
		(name) => {
			const newBookmark = new Bookmark({
				name,
				viewpoint: view.viewpoint.clone() as Viewpoint,
				thumbnail: null,
				timeExtent: null,
			});
			allBookmarks = [...allBookmarks, newBookmark];
			updateWidget();
		},
		(id, name) => {
			allBookmarks = allBookmarks.map((b) =>
				b.uid === id
					? new Bookmark({
							...b.toJSON(),
							name,
						})
					: b,
			);
			updateWidget();
		},
		(id) => {
			allBookmarks = allBookmarks.filter((b) => b.uid !== id);
			updateWidget();
		},
	);

	const container = document.createElement("div");
	if (bookmarksWidget.container instanceof Node) {
		container.appendChild(bookmarksWidget.container);
	}
	container.appendChild(customUI);

	const bkExpand = new Expand({
		view,
		content: container,
		expanded: true,
	});

	return { bookmarks: bookmarksWidget, bkExpand };
}
