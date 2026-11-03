const fridgeCount = document.getElementById("fridge-count");
const fridgeList = document.getElementById("fridge-list");
const fridgeSearch = document.getElementById("fridge-search");
const fridgeSearchBtn = document.getElementById("fridge-search-btn");
const fridgeClearBtn = document.getElementById("fridge-clear-btn");

const fridgeItems = [
    { name: "Eggs", qty: 1, unit: "dozen"},
    { name: "Bread", qty: 1, unit: "item(s)"}
];

function renderFridge(items = fridgeItems) {
    fridgeList.innerHTML = "";

    items.forEach(function(item) {
        const li = document.createElement("li");

        const name = document.createElement("span");
        name.className = "name";
        name.textContent = item.name;

        const qty = document.createElement("span");
        qty.className = "qty";
        qty.textContent = item.qty + " " + item.unit; 

        const minusBtn = document.createElement("button");
        minusBtn.className = "minus-btn";
        minusBtn.textContent = "-";
        minusBtn.type = "button";

        const plusBtn = document.createElement("button");
        plusBtn.className = "plus-btn";
        plusBtn.textContent = "+";
        plusBtn.type = "button";

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "x";
        deleteBtn.type = "button";

        minusBtn.addEventListener("click", function() {
            if (item.qty > 0) {
                item.qty--;
                renderFridge(fridgeItems.filter(function(i) {
                    return i.name.toLowerCase().includes(
                        fridgeSearch.value.trim().toLowerCase()
                    );
                }));
            }
        });

        plusBtn.addEventListener("click", function() {
            item.qty++;
            renderFridge(fridgeItems.filter(function(i) {
                return i.name.toLowerCase().includes(
                    fridgeSearch.value.trim().toLowerCase()
                );
            }));
        });

        deleteBtn.addEventListener("click", function() {
            const index = fridgeItems.indexOf(item);

            if (index !== -1) {
                fridgeItems.splice(index, 1);
            }

            renderFridge();
        });

        li.appendChild(name);
        li.appendChild(qty);
        li.appendChild(minusBtn);
        li.appendChild(plusBtn);
        li.appendChild(deleteBtn);
        fridgeList.appendChild(li);
    });

    fridgeCount.textContent = fridgeItems.length + " items in fridge";
}

fridgeSearchBtn.addEventListener("click", function() {
    const searchText = fridgeSearch.value.trim().toLowerCase();

    const filteredItems = fridgeItems.filter(function(item) {
        return item.name.toLowerCase().includes(searchText);
    });

    renderFridge(filteredItems);
});

fridgeClearBtn.addEventListener("click", function() {
    fridgeSearch.value = "";
    renderFridge();
});

renderFridge();