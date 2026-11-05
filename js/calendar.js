const calendarMonth = document.getElementById("calendar-month");
const calendarGrid = document.getElementById("calendar-grid");
const calendarList = document.getElementById("calendar-list");

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

const Expirations = [
    { id: 1, name: "Milk", date: new Date(currentYear, currentMonth, 3) },
    { id: 2, name: "Spinach", date: new Date(currentYear, currentMonth, 6) },
    { id: 3, name: "Yogurt", date: new Date(currentYear, currentMonth, 8) },
    { id: 4, name: "Eggs", date: new Date(currentYear, currentMonth, 12) },
    { id: 5, name: "Bread", date: new Date(currentYear, currentMonth, 15) },
    { id: 6, name: "Tomatoes", date: new Date(currentYear, currentMonth, 20) },
    { id: 7, name: "Cheese", date: new Date(currentYear, currentMonth, 24) },
    { id: 8, name: "Avocados", date: new Date(currentYear, currentMonth, 27) },
    { id: 9, name: "Cucumber", date: new Date(currentYear, currentMonth, 29) },
    { id: 10, name: "Salad Mix", date: new Date(currentYear, currentMonth, 30) }
];

function removeExpiration(id) {
    const index = Expirations.findIndex((item) => item.id === id);
    if (index !== -1) {
        Expirations.splice(index, 1);
        buildCalendar();
        buildList();
    }
}

function formatMonthLabel(date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
    }).format(date);
}

function buildCalendar() {
    calendarMonth.textContent = formatMonthLabel(today);
    calendarGrid.innerHTML = "";

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const allCells = 42;

    for (let i = 0; i < allCells; i++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";

        const dayNumber = i - startOffset + 1;
        const isCurrentMonthDay = dayNumber > 0 && dayNumber <= totalDays;

        if (!isCurrentMonthDay) {
            cell.classList.add("empty");
            cell.innerHTML = "<span class='calendar-date'>&nbsp;</span>";
            calendarGrid.appendChild(cell);
            continue;
        }

        const date = new Date(currentYear, currentMonth, dayNumber);
        const itemsForDay = Expirations.filter((item) => {
            return item.date.getFullYear() === date.getFullYear() &&
                item.date.getMonth() === date.getMonth() &&
                item.date.getDate() === date.getDate();
        });

        if (date.toDateString() === today.toDateString()) {
            cell.classList.add("today");
        }

        const dateLabel = document.createElement("span");
        dateLabel.className = "calendar-date";
        dateLabel.textContent = dayNumber;
        cell.appendChild(dateLabel);

        itemsForDay.forEach((item) => {
            const itemBadge = document.createElement("button");
            itemBadge.type = "button";
            itemBadge.className = "calendar-item" + (item.date <= today ? " warn" : "");
            itemBadge.textContent = item.name;
            itemBadge.title = "Mark " + item.name + " as thrown away";
            itemBadge.addEventListener("click", function () {
                removeExpiration(item.id);
            });
            cell.appendChild(itemBadge);
        });

        calendarGrid.appendChild(cell);
    }
}

function buildList() {
    const sortedItems = [...Expirations].sort((a, b) => a.date - b.date);

    calendarList.innerHTML = "";

    sortedItems.forEach((item) => {
        const li = document.createElement("li");

        const name = document.createElement("span");
        name.textContent = item.name;

        const dateText = document.createElement("span");
        dateText.className = "date-pill";
        dateText.textContent = item.date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "throw-away-btn";
        removeButton.textContent = "Thrown away";
        removeButton.addEventListener("click", function () {
            removeExpiration(item.id);
        });

        li.appendChild(name);
        li.appendChild(dateText);
        li.appendChild(removeButton);
        calendarList.appendChild(li);
    });
}

buildCalendar();
buildList();
