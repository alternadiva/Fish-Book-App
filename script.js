let form = document.getElementById("form");
let inputValue = document.getElementById("country-input");
let submitBtn = document.getElementById("submit-search");
let randomBtn = document.getElementById("random-btn");
let resultsList = document.getElementById("results-list");
let output = document.getElementById("output");

// Submit input and show result

form.addEventListener("submit", getCountry);


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
        let resultCountry = data[0].name.common;
        output.innerText = resultCountry;
        resultsList.innerHTML = "";
        return resultCountry;
      })
      .catch((error) => {
        resultsList.innerHTML = "<li>No result found</li>";
        console.log(error)});
  inputValue.value = "";
}


// Show search results before submitting

let timeout = 0;

window.addEventListener("load", searchResults);

function searchResults() {
  inputValue.onkeyup = () => {
    fetch(`https://restcountries.com/v3.1/name/${inputValue.value}`)
      .then((response) => response.json())
      .then((data) => {
        const results = data.map(result => result.name.common);
        resultsList.innerHTML = "";
        
        clearTimeout(timeout);

        if (inputValue.value.trim().length === 0) {
          return;
        }

        timeout = setTimeout(() => {
          results.forEach(result => {
            let listItem = document.createElement("li");
            listItem.innerText = result;
            listItem.addEventListener("click", function() {
                inputValue.value = result;
                resultsList.innerHTML = "";})
            resultsList.appendChild(listItem);
          });
        }, 400);
        
      })
      .catch(() => {
        resultsList.innerHTML = "<li>No result found</li>";
      });
  }
  }

      