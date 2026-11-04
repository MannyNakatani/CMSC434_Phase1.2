const shopForm = document.getElementById("shop-form");
const shopName = document.getElementById("shop-name");
const shopQty = document.getElementById("shop-qty");
const shopUnit = document.getElementById("shop-unit");
const shopError = document.getElementById("shop-error");
const shopList = document.getElementById("shop-list");
const shopCount = document.getElementById("shop-count");
const shopNotice = document.getElementById("shop-notice");
const shopDoneBtn = document.getElementById("shop-done-btn");
const shopSavedBtn = document.getElementById("shop-saved-btn");

const putawayList = document.getElementById("putaway-list");
const putawayLeftover = document.getElementById("putaway-leftover");
const putawayError = document.getElementById("putaway-error");
const putawayConfirm = document.getElementById("putaway-confirm");

const saveForm = document.getElementById("save-form");
const saveName = document.getElementById("save-name");
const saveLabel = document.getElementById("save-label");
const saveMsg = document.getElementById("save-msg");
const savedListsEl = document.getElementById("saved-lists");

const shoppingItems = [
    { name: "Milk", qty: 1, unit: "gallon", checked: false },
    { name: "Eggs", qty: 1, unit: "dozen", checked: false },
    { name: "Bread", qty: 1, unit: "item(s)", checked: true },
    { name: "Chicken breast", qty: 2, unit: "lb", checked: false },
    { name: "Spinach", qty: 1, unit: "pack", checked: false }
];

const householdMembers = ["Shared", "Me", "Alex", "Jordan", "Priya"];

const savedLists = [
    {
        name: "Weekly Friday groceries",
        items: [
            { name: "Milk", qty: 1, unit: "gallon" },
            { name: "Eggs", qty: 1, unit: "dozen" },
            { name: "Bread", qty: 1, unit: "item(s)" },
            { name: "Bananas", qty: 6, unit: "item(s)" },
            { name: "Chicken breast", qty: 2, unit: "lb" },
            { name: "Greek yogurt", qty: 4, unit: "item(s)" },
            { name: "Cereal", qty: 1, unit: "item(s)" }
        ]
    },
    {
        name: "Board game night",
        items: [
            { name: "Tortilla chips", qty: 2, unit: "pack" },
            { name: "Salsa", qty: 1, unit: "item(s)" },
            { name: "Soda", qty: 2, unit: "pack" },
            { name: "Frozen pizza", qty: 3, unit: "item(s)" }
        ]
    },
    {
        name: "Summer fruit",
        items: [
            { name: "Cherries", qty: 1, unit: "lb" },
            { name: "Watermelon", qty: 1, unit: "item(s)" },
            { name: "Peaches", qty: 2, unit: "lb" }
        ]
    }
];

const shelfLifeDays = {
    "chicken": 2, "beef": 2, "fish": 2, "salmon": 2,
    "spinach": 5, "lettuce": 7, "bread": 5, "berries": 5, "cherries": 7,
    "milk": 7, "yogurt": 14, "cheese": 21, "eggs": 21, "butter": 30,
    "salsa": 14, "bananas": 5, "peaches": 5, "watermelon": 7,
    "cereal": 90, "chips": 60, "soda": 180, "frozen": 90
};

function plural(n, word) {
    return n + " " + word + (n === 1 ? "" : "s");
}

function toDateValue(date) {
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return date.getFullYear() + "-" + m + "-" + d;
}

function todayValue() {
    return toDateValue(new Date());
}

function suggestedExpiration(name) {
    const key = name.toLowerCase();
    let days = 7;
    for (const word in shelfLifeDays) {
        if (key.includes(word)) {
            days = shelfLifeDays[word];
            break;
        }
    }
    const date = new Date();
    date.setDate(date.getDate() + days);
    return toDateValue(date);
}

function makeEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

function showShopView(id) {
    ["shop-main", "shop-done-view", "shop-saved-view"].forEach(function (viewId) {
        document.getElementById(viewId).hidden = viewId !== id;
    });
    document.querySelector(".screen").scrollTop = 0;
}

document.querySelectorAll("#tab6 .shop-back").forEach(function (btn) {
    btn.addEventListener("click", function () {
        showShopView("shop-main");
    });
});

function showNotice(message, action) {
    shopNotice.innerHTML = "";
    shopNotice.appendChild(makeEl("span", "", message));

    if (action) {
        const btn = makeEl("button", "notice-action", action.label);
        btn.type = "button";
        btn.addEventListener("click", action.onClick);
        shopNotice.appendChild(btn);
    }
    shopNotice.hidden = false;
}

function clearNotice() {
    shopNotice.hidden = true;
    shopNotice.innerHTML = "";
}

function renderList() {
    shopList.innerHTML = "";

    shoppingItems.forEach(function (item, index) {
        const li = document.createElement("li");
        if (item.checked) li.classList.add("checked");

        const name = makeEl("span", "name", item.name);
        const qty = makeEl("span", "qty", item.qty + " " + item.unit);

        const close = makeEl("span", "close", "×");
        close.setAttribute("aria-label", "Remove " + item.name);

        li.append(name, qty, close);
        li.dataset.index = index;
        shopList.appendChild(li);
    });

    if (shoppingItems.length === 0) {
        shopList.appendChild(makeEl("li", "shop-empty", "Your list is empty. Add an item above or start from a saved list."));
    }

    const left = shoppingItems.filter(function (i) { return !i.checked; }).length;
    const bought = shoppingItems.length - left;
    shopCount.textContent = left + " of " + shoppingItems.length + " items left to buy";

    shopDoneBtn.textContent = bought > 0
        ? "Done shopping (" + bought + " bought)"
        : "Done shopping";
}

shopList.addEventListener("click", function (e) {
    const li = e.target.closest("li");
    if (!li || li.classList.contains("shop-empty")) return;
    clearNotice();
    const index = Number(li.dataset.index);

    if (e.target.classList.contains("close")) {
        shoppingItems.splice(index, 1);
    } else {
        shoppingItems[index].checked = !shoppingItems[index].checked;
    }
    renderList();
});

shopForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearNotice();
    const text = shopName.value.trim();
    const qty = parseInt(shopQty.value, 10);

    if (!text) {
        shopError.textContent = "Type an item name first.";
        shopName.focus();
        return;
    }
    if (!qty || qty < 1) {
        shopError.textContent = "Quantity must be at least 1.";
        shopQty.focus();
        return;
    }

    shopError.textContent = "";
    shoppingItems.unshift({ name: text, qty: qty, unit: shopUnit.value, checked: false });
    shopName.value = "";
    shopQty.value = 1;
    shopUnit.selectedIndex = 0;
    shopName.focus();
    renderList();
});

shopDoneBtn.addEventListener("click", function () {
    const bought = shoppingItems.filter(function (i) { return i.checked; });

    if (bought.length === 0) {
        showNotice("Check off the items you bought first, then tap Done shopping.");
        return;
    }

    clearNotice();
    renderPutAway(bought);
    showShopView("shop-done-view");
});

function renderPutAway(bought) {
    putawayList.innerHTML = "";
    putawayError.textContent = "";

    bought.forEach(function (item) {
        const li = makeEl("li", "putaway-item");
        li.dataset.index = shoppingItems.indexOf(item);

        const title = makeEl("div", "putaway-title");
        title.append(
            makeEl("span", "name", item.name),
            makeEl("span", "qty", item.qty + " " + item.unit)
        );

        const fields = makeEl("div", "putaway-fields");

        const dateField = makeEl("label", "putaway-field");
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.className = "putaway-date";
        dateInput.value = suggestedExpiration(item.name);
        dateInput.min = todayValue();
        dateField.append(makeEl("span", "", "Expires (optional)"), dateInput);

        const ownerField = makeEl("label", "putaway-field");
        const ownerSelect = document.createElement("select");
        ownerSelect.className = "putaway-owner";
        householdMembers.forEach(function (member) {
            ownerSelect.appendChild(makeEl("option", "", member));
        });
        ownerField.append(makeEl("span", "", "Belongs to"), ownerSelect);

        fields.append(dateField, ownerField);
        li.append(title, fields);
        putawayList.appendChild(li);
    });

    const notBought = shoppingItems.filter(function (i) { return !i.checked; });
    putawayLeftover.textContent = notBought.length > 0
        ? "Not bought, staying on your list for next trip: " +
          notBought.map(function (i) { return i.name; }).join(", ")
        : "You got everything on your list!";

    putawayConfirm.textContent = "Move " + plural(bought.length, "item") + " to Fridge";
}

putawayConfirm.addEventListener("click", function () {
    if (typeof fridgeItems === "undefined") {
        putawayError.textContent = "The Fridge isn't available right now. Try again later.";
        return;
    }

    const rows = putawayList.querySelectorAll(".putaway-item");
    const today = todayValue();
    const entries = [];

    for (const row of rows) {
        const item = shoppingItems[Number(row.dataset.index)];
        const dateInput = row.querySelector(".putaway-date");
        row.classList.remove("has-error");

        if (dateInput.value && dateInput.value < today) {
            row.classList.add("has-error");
            putawayError.textContent = item.name +
                " has an expiration date in the past. Change the date or clear it.";
            dateInput.focus();
            return;
        }

        entries.push({
            item: item,
            expires: dateInput.value || null,
            owner: row.querySelector(".putaway-owner").value
        });
    }

    entries.forEach(function (entry) {
        addToFridge(entry.item, entry.expires, entry.owner);
    });

    for (let i = shoppingItems.length - 1; i >= 0; i--) {
        if (shoppingItems[i].checked) shoppingItems.splice(i, 1);
    }

    renderList();
    refreshFridge();
    showShopView("shop-main");

    let message = "Moved " + plural(entries.length, "item") + " to your Fridge.";
    if (shoppingItems.length > 0) {
        message += " " + shoppingItems.length + " still on your list for next trip.";
    }
    showNotice(message, { label: "View Fridge", onClick: goToFridge });
});

function addToFridge(item, expires, owner) {
    const match = fridgeItems.find(function (f) {
        return f.name.toLowerCase() === item.name.toLowerCase() &&
            f.unit === item.unit &&
            (f.owner || "Shared") === owner;
    });

    if (match) {
        match.qty += item.qty;
        if (expires && (!match.expires || expires < match.expires)) {
            match.expires = expires;
        }
    } else {
        fridgeItems.push({
            name: item.name,
            qty: item.qty,
            unit: item.unit,
            expires: expires,
            owner: owner
        });
    }
}

function refreshFridge() {
    if (typeof fridgeQuery !== "undefined") {
        fridgeQuery.dispatchEvent(new Event("input"));
    } else if (typeof renderFridge === "function") {
        renderFridge();
    }
}

function goToFridge() {
    const fridgeTab = document.querySelector('.tablink[onclick*="fridge"]');
    if (fridgeTab) fridgeTab.click();
}

shopSavedBtn.addEventListener("click", function () {
    clearNotice();
    saveMsg.textContent = "";
    saveMsg.className = "shop-msg";
    saveName.value = "";
    saveLabel.textContent = "Save your current list (" +
        plural(shoppingItems.length, "item") + ") as:";
    renderSavedLists();
    showShopView("shop-saved-view");
});

function renderSavedLists() {
    savedListsEl.innerHTML = "";

    if (savedLists.length === 0) {
        savedListsEl.appendChild(makeEl("li", "saved-empty", "No saved lists yet."));
        return;
    }

    savedLists.forEach(function (list, index) {
        const li = makeEl("li", "saved-card");
        li.dataset.index = index;

        const names = list.items.map(function (i) { return i.name; });
        let preview = names.slice(0, 3).join(", ");
        if (names.length > 3) preview += ", +" + (names.length - 3) + " more";

        const actions = makeEl("div", "saved-actions");
        const useBtn = makeEl("button", "shop-primary", "Add to my list");
        useBtn.type = "button";
        useBtn.dataset.action = "use";
        const deleteBtn = makeEl("button", "saved-delete", "Delete");
        deleteBtn.type = "button";
        deleteBtn.dataset.action = "delete";
        actions.append(useBtn, deleteBtn);

        li.append(
            makeEl("h3", "", list.name),
            makeEl("p", "saved-preview", plural(list.items.length, "item") + ": " + preview),
            actions
        );
        savedListsEl.appendChild(li);
    });
}

savedListsEl.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;
    const index = Number(btn.closest(".saved-card").dataset.index);
    const list = savedLists[index];

    if (btn.dataset.action === "use") {
        useSavedList(list);
    } else if (btn.dataset.action === "delete") {
        if (btn.dataset.confirm === "yes") {
            savedLists.splice(index, 1);
            renderSavedLists();
            saveMsg.className = "shop-msg success";
            saveMsg.textContent = "Deleted \"" + list.name + "\".";
        } else {
            btn.dataset.confirm = "yes";
            btn.textContent = "Tap again to delete";
            btn.classList.add("confirm");
        }
    }
});

function useSavedList(list) {
    let added = 0;
    let skipped = 0;

    list.items.forEach(function (saved) {
        const alreadyOnList = shoppingItems.some(function (i) {
            return !i.checked && i.name.toLowerCase() === saved.name.toLowerCase();
        });

        if (alreadyOnList) {
            skipped++;
        } else {
            shoppingItems.push({ name: saved.name, qty: saved.qty, unit: saved.unit, checked: false });
            added++;
        }
    });

    renderList();
    showShopView("shop-main");

    let message = "Added " + plural(added, "item") + " from \"" + list.name + "\".";
    if (skipped > 0) {
        message += " " + plural(skipped, "item") + (skipped === 1 ? " was" : " were") +
            " already on your list.";
    }
    showNotice(message);
}

saveForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = saveName.value.trim();
    saveMsg.className = "shop-msg error";

    if (shoppingItems.length === 0) {
        saveMsg.textContent = "Your list is empty. Add items before saving it.";
        return;
    }
    if (!name) {
        saveMsg.textContent = "Give this list a name first.";
        saveName.focus();
        return;
    }

    const items = shoppingItems.map(function (i) {
        return { name: i.name, qty: i.qty, unit: i.unit };
    });

    const existing = savedLists.find(function (l) {
        return l.name.toLowerCase() === name.toLowerCase();
    });

    if (existing) {
        existing.items = items;
        saveMsg.textContent = "Updated \"" + existing.name + "\".";
    } else {
        savedLists.unshift({ name: name, items: items });
        saveMsg.textContent = "Saved \"" + name + "\".";
    }

    saveMsg.className = "shop-msg success";
    saveName.value = "";
    renderSavedLists();
});

renderList();
