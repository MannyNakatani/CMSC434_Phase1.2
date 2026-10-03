function showChoices() {
            var meal = document.querySelector('input[name="meal"]:checked').value;
            var food = document.getElementById("choiceSelect").value;
            document.getElementById("choiceResult").innerHTML = 
                "You're having " + food + " for " + meal + "!";
}