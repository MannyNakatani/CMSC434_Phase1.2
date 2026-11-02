const shopForm = document.getElementById("shop-form");
const shopName = document.getElementById("shop-name");
const shopQty = document.getElementById("shop-qty");
const shopUnit = document.getElementById("shop-unit");
const shopError = document.getElementById("shop-error");
const shopList = document.getElementById("shop-list");
const shopCount = document.getElementById("shop-count");

const shoppingItems = [
    { name: "Eggs", qty: 1, unit: "dozen", checked: false },
    { name: "Bread", qty: 1, unit: "item(s)", checked: true }
];

function renderList() {
    shopList.innerHTML = "";

    shoppingItems.forEach(function (item, index) {
        const li = document.createElement("li");
        if (item.checked) li.classList.add("checked");

        const name = document.createElement("span");
        name.className = "name";
        name.textContent = item.name;

        const qty = document.createElement("span");
        qty.className = "qty";
        qty.textContent = item.qty + " " + item.unit;

        const close = document.createElement("span");
        close.className = "close";
        close.textContent = "×";
        close.setAttribute("aria-label", "Remove " + item.name);

        li.append(name, qty, close);
        li.dataset.index = index;
        shopList.appendChild(li);
    });

    const left = shoppingItems.filter(function (i) { return !i.checked; }).length;
    shopCount.textContent = left + " of " + shoppingItems.length + " items left to buy";
}

shopList.addEventListener("click", function (e) {
    const li = e.target.closest("li");
    if (!li) return;
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

renderList();
