let form = document.getElementById("form");
let inputValue = document.getElementById("country-input");
let submitBtn = document.getElementById("submit-search");
let randomBtn = document.getElementById("random-btn");
let output = document.getElementById("output");

form.addEventListener("submit", getCountry);

function getCountry(event) {
  event.preventDefault();

  let formData = new FormData(form);
  let value = formData.get("country")
  console.log(value);

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
      .then((data) => console.log(data))
      .catch((error) => console.log(error));

  inputValue.value = "";
}

      