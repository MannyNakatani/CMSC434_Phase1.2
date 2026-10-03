function openTab(event, tabId){
    var pages = document.getElementsByClassName("tab-page")

    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = "none"
    }

    var links = document.getElementsByClassName("tablink");

    for (var i = 0; i < links.length; i++) {
        links[i].classList.remove("active")
    }

    document.getElementById(tabId).style.display = "block"
    event.currentTarget.classList.add("active")

    document.querySelector(".screen").scrollTop = 0
}

document.getElementsByClassName("tablink")[0].click()