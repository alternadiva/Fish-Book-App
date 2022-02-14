let form = document.getElementById("form");
let inputValue = document.getElementById("country-input");
let submitBtn = document.getElementById("submit-search");
let randomBtn = document.getElementById("random-btn");
let resultsList = document.getElementById("results-list");
let output = document.getElementById("output");

// Show search results before submitting

let timeout = 0;

window.addEventListener("load", searchResults);

function searchResults() {
  inputValue.onkeyup = () => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        resultsList.innerHTML = "";
        
        clearTimeout(timeout);

        if (inputValue.value.trim().length === 0) {
          return;
        }

        let nameResults = data.flatMap(country => country.name.common);
        
        timeout = setTimeout(() => {
          nameResults.forEach(result => {
            if (result.toLowerCase().includes(inputValue.value.toLowerCase())) {
              let listItem = document.createElement("li");
              listItem.id = "country-list-item";
              listItem.innerText = result;
              listItem.addEventListener("click", function() {
                inputValue.value = result;
                resultsList.innerHTML = "";})
              resultsList.appendChild(listItem);
            }
          });
        }, 200);
      })
      .catch(() => {
        resultsList.innerHTML = "<li>No result found</li>";
      });
  }
  }


// Submit input and show final result

form.addEventListener("submit", getCountry);

let resultCountry;

function getCountry(event) {
  event.preventDefault();

  let formData = new FormData(form);
  let value = formData.get("country");

  fetch(`https://restcountries.com/v3.1/name/${value}`)
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status);
          throw error;
        }
        else {
          return response.json();
        }
      })
      .then((data) => {
        resultCountry = data[0].name.common;
        output.innerHTML = `${resultCountry} 
                            <img src=${data[0].flags.png} alt="flag of ${resultCountry}" id="flag">`;
        resultsList.innerHTML = "";
        return resultCountry;
      })
      .catch((error) => {
        resultsList.innerHTML = "<li>No result found</li>";
        output.innerText = "";
        console.log(error)});
  inputValue.value = "";
}

// Generate a random country

randomBtn.addEventListener("click", randomCountry);

function randomCountry() {

  fetch("https://restcountries.com/v3.1/all")
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status);
          throw error;
        }
        else {
          return response.json();
        }
      })
      .then((data) => {
        let nameResults = data.flatMap(country => country.name.common);
        let flagResults = data.flatMap(country => country.flags.png);
        let randomIndex = Math.floor(Math.random() * nameResults.length)
        resultCountry = nameResults[randomIndex];
        output.innerHTML = `${resultCountry} 
                            <img src=${flagResults[randomIndex]} alt="flag of ${resultCountry}" id="flag">`;
        return resultCountry;
        
      })
      .catch((error) => {
        console.log(error)});
}

      