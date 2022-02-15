let form = document.getElementById("form");
let inputValue = document.getElementById("country-input");
let submitBtn = document.getElementById("submit-search");
let randomBtn = document.getElementById("random-btn");
let resultsList = document.getElementById("results-list");
let output = document.getElementById("output");
let body = document.querySelector("body");
let movieName = document.getElementById("movie-title");
let voteAverage = document.getElementById("vote-average");
let plotSummary = document.getElementById("plot-summary");
let moviePoster = document.getElementById("movie-poster");

const edamamAppID = "605b1768";
const edamamAppKey = "d2159e6469acba495c81cdce12ad0bcd";

//fetch recipe and display the label, img, indgredients, and maybe health labels
function displayDish() {
  const cuisineType = countrieMapping[resultCountry] //access the mapped value of the countrieMapping object 
  console.log(cuisineType);

//handle output in case cuisineType is undefined, not do fetch

//
  fetch(`https://api.edamam.com/api/recipes/v2/?type=public&q=a&cuisineType=${cuisineType}&app_id=${edamamAppID}&app_key=${edamamAppKey}`)
  .then((res) =>
  res.json())
  .then((response) => {
    const recipe = response.hits[0].recipe;
    document.getElementById('dish-intro').innerText = `Here's a recipe from ${resultCountry}: ${recipe.label}`
    
    //do DOM manipulation to display recipe

  
  });
}

//function to generate random film in language of chosen country

function movieRecommender(data, index) {
  let langResults = data.flatMap(country => country.languages);
  let language = langResults[index];
  let languageCode = Object.keys(language);
  //chooses the first language listed if there are several for a country
  if (languageCode.length > 1){
    languageCode = languageCode[0];
  }
  let languageCodeString = languageCode.toString();
  //questionably converts one language code system to another
  let shortCode = `${languageCodeString[0]}${languageCodeString[1]}`;
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d60f7fcb15ec34d310ee95b2269f47&with_original_language=${shortCode}`)
  .then((response) => {
    if(!response.ok) {throw new Error ('bad choice');}
    return response.json();
  })
  .then((response) => {
    let filmResults = response.results;
    let randomIndex = Math.floor(Math.random() * filmResults.length);
    let resultFilm = filmResults[randomIndex];
    //display information for user
    if (resultFilm.backdrop_path){
    moviePoster.src=`https://image.tmdb.org/t/p/w500/${resultFilm.backdrop_path}`;
    }

    movieName.innerText = (`${resultFilm.original_title}`);
    voteAverage.innerText = (`Voter rating: ${resultFilm.vote_average}/10`);
    plotSummary.innerText = (`${resultFilm.overview}`); 
    return resultFilm;
  })
  .catch((error) => {
    console.log(error)});
}




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
        console.log(data);
        resultCountry = data[0].name.common;
        output.innerHTML = `${resultCountry} 
                            <img src=${data[0].flags.png} alt="flag of ${resultCountry}" id="flag">`;
        resultsList.innerHTML = "";   
        displayDish();
        movieRecommender(data, 0);    
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
        let randomIndex = Math.floor(Math.random() * nameResults.length);
        
        resultCountry = nameResults[randomIndex];
        
        output.innerHTML = `${resultCountry} 
                            <img src=${flagResults[randomIndex]} alt="flag of ${resultCountry}" id="flag">`;
        displayDish();
        movieRecommender(data, randomIndex);
        return resultCountry;
        
      })
      .catch((error) => {
        console.log(error)});
}


// ****************
// * Display Dish *
// ****************

//map countries to cuisine types 

const countrieMapping = {
  "Sweden": "Sweden",
  "Albania": "Albania",
  "Vanuatu": "Vanuatu",
  "Mauritius": "Mauritius",
  "United Kingdom": "British",
  "Portugal": "Portugal",
  "Ivory Coast": "Ivory Coast",
  "Georgia": "Georgia",
  "Bhutan": "Bhutan",
  "Namibia": "Namibia",
  "Netherlands": "Netherlands",
  "Uruguay": "Uruguay",
  "Belgium": "Belgium",
  "Guernsey": "Guernsey",
  "United States Virgin Islands": "United States Virgin Islands",
  "Uganda": "Uganda",
  "Liechtenstein": "Liechtenstein",
  "Guinea-Bissau": "Guinea-Bissau",
  "South Korea": "South Korea",
  "Cuba": "Cuba",
  "Montenegro": "Montenegro",
  "Norway": "Norway",
  "Saint Vincent and the Grenadines": "Saint Vincent and the Grenadines",
  "Mayotte": "Mayotte",
  "Latvia": "Latvia",
  "Paraguay": "Paraguay",
  "Jersey": "Jersey",
  "Laos": "South East Asian",
  "Qatar": "Qatar",
  "Dominican Republic": "Dominican Republic",
  "Bouvet Island": "Bouvet Island",
  "Slovakia": "Slovakia",
  "Bosnia and Herzegovina": "Bosnia and Herzegovina",
  "Panama": "Panama",
  "Myanmar": "South East Asian",
  "Barbados": "Barbados",
  "Cambodia": "South East Asian",
  "Antigua and Barbuda": "Antigua and Barbuda",
  "Kenya": "Kenya",
  "India": "Indian",
  "São Tomé and Príncipe": "São Tomé and Príncipe",
  "Faroe Islands": "Faroe Islands",
  "Czechia": "Czechia",
  "Montserrat": "Montserrat",
  "South Georgia": "South Georgia",
  "Ukraine": "Ukraine",
  "Djibouti": "Djibouti",
  "Greenland": "Greenland",
  "Tonga": "Tonga",
  "United States": "United States",
  "Norfolk Island": "Norfolk Island",
  "Republic of the Congo": "Republic of the Congo",
  "Lebanon": "Lebanon",
  "Uzbekistan": "Uzbekistan",
  "Guam": "Guam",
  "Estonia": "Estonia",
  "Tuvalu": "Tuvalu",
  "Bermuda": "Bermuda",
  "South Sudan": "South Sudan",
  "Costa Rica": "Costa Rica",
  "Finland": "Finland",
  "Gambia": "Gambia",
  "French Polynesia": "French Polynesia",
  "Belize": "Belize",
  "Kiribati": "Kiribati",
  "French Guiana": "French Guiana",
  "Andorra": "Andorra",
  "Kosovo": "Kosovo",
  "Mozambique": "Mozambique",
  "Puerto Rico": "Puerto Rico",
  "Australia": "Australia",
  "Azerbaijan": "Azerbaijan",
  "Sudan": "Sudan",
  "Chad": "Chad",
  "Eritrea": "Eritrea",
  "Malaysia": "South East Asian",
  "Kuwait": "Kuwait",
  "Northern Mariana Islands": "Northern Mariana Islands",
  "New Zealand": "New Zealand",
  "Morocco": "Mediterranean",
  "Somalia": "Somalia",
  "Singapore": "Singapore",
  "Timor-Leste": "Timor-Leste",
  "Greece": "Mediterranean",
  "Botswana": "Botswana",
  "Indonesia": "South East Asian",
  "North Macedonia": "North Macedonia",
  "Tanzania": "Tanzania",
  "Eswatini": "Eswatini",
  "Central African Republic": "Central African Republic",
  "Bolivia": "Bolivia",
  "Solomon Islands": "Solomon Islands",
  "Thailand": "South East Asian",
  "Réunion": "Réunion",
  "Croatia": "Croatia",
  "Burundi": "Burundi",
  "United Arab Emirates": "United Arab Emirates",
  "Palau": "Palau",
  "Falkland Islands": "Falkland Islands",
  "Malawi": "Malawi",
  "Bangladesh": "Bangladesh",
  "Canada": "Canada",
  "Jamaica": "Jamaica",
  "Luxembourg": "Luxembourg",
  "Monaco": "Monaco",
  "Tunisia": "Mediterranean",
  "Equatorial Guinea": "Equatorial Guinea",
  "Martinique": "Martinique",
  "Cape Verde": "Cape Verde",
  "Aruba": "Aruba",
  "American Samoa": "American Samoa",
  "Nigeria": "Nigeria",
  "Cocos (Keeling) Islands": "Cocos (Keeling) Islands",
  "Spain": "Mediterranean",
  "Iraq": "Iraq",
  "Tokelau": "Tokelau",
  "Zimbabwe": "Zimbabwe",
  "Guinea": "Guinea",
  "Ghana": "Ghana",
  "Wallis and Futuna": "Wallis and Futuna",
  "Kyrgyzstan": "Kyrgyzstan",
  "Macau": "Macau",
  "Bahrain": "Bahrain",
  "Ethiopia": "Ethiopia",
  "Gibraltar": "Gibraltar",
  "Isle of Man": "Isle of Man",
  "Pakistan": "Pakistan",
  "Åland Islands": "Åland Islands",
  "Honduras": "Honduras",
  "Haiti": "Haiti",
  "Caribbean Netherlands": "Caribbean Netherlands",
  "Nauru": "Nauru",
  "Trinidad and Tobago": "Trinidad and Tobago",
  "Saint Barthélemy": "Saint Barthélemy",
  "DR Congo": "DR Congo",
  "Denmark": "Denmark",
  "Venezuela": "Venezuela",
  "Ireland": "Ireland",
  "Dominica": "Dominica",
  "Benin": "Benin",
  "British Indian Ocean Territory": "British Indian Ocean Territory",
  "Mauritania": "Mauritania",
  "South Africa": undefined,
  "Saint Pierre and Miquelon": "Saint Pierre and Miquelon",
  "San Marino": "San Marino",
  "Egypt": "Mediterranean",
  "Tajikistan": "Tajikistan",
  "Marshall Islands": "Marshall Islands",
  "Japan": "Japanese",
  "Pitcairn Islands": "Pitcairn Islands",
  "Senegal": "Senegal",
  "Palestine": "Palestine",
  "Gabon": "Gabon",
  "Anguilla": "Anguilla",
  "Mexico": "Mexico",
  "Papua New Guinea": "Papua New Guinea",
  "Serbia": "Serbia",
  "Argentina": "Argentina",
  "Mali": "Mali",
  "Oman": "Oman",
  "Malta": "Malta",
  "Maldives": "Maldives",
  "Austria": "Austria",
  "Western Sahara": "Western Sahara",
  "North Korea": "North Korea",
  "British Virgin Islands": "British Virgin Islands",
  "Burkina Faso": "Burkina Faso",
  "Micronesia": "Micronesia",
  "Lithuania": "Lithuania",
  "Colombia": "Colombia",
  "Rwanda": "Rwanda",
  "Madagascar": "Madagascar",
  "France": "French",
  "Moldova": "Moldova",
  "Nepal": "Nepal",
  "Afghanistan": "Afghanistan",
  "Saudi Arabia": "Saudi Arabia",
  "Ecuador": "Ecuador",
  "Vatican City": "Vatican City",
  "Zambia": "Zambia",
  "Germany": "Germany",
  "Turkey": "Mediterranean",
  "Yemen": "Yemen",
  "Comoros": "Comoros",
  "Curaçao": "Curaçao",
  "Italy": "Italian",
  "Bulgaria": "Bulgaria",
  "Brazil": "Brazil",
  "Turks and Caicos Islands": "Turks and Caicos Islands",
  "Lesotho": "Lesotho",
  "Hungary": "Hungary",
  "Guatemala": "Guatemala",
  "Chile": "Chile",
  "Cyprus": "Cyprus",
  "Heard Island and McDonald Islands": "Heard Island and McDonald Islands",
  "Saint Kitts and Nevis": "Saint Kitts and Nevis",
  "Sierra Leone": "Sierra Leone",
  "Brunei": "Brunei",
  "Seychelles": "Seychelles",
  "Saint Helena, Ascension and Tristan da Cunha": "Saint Helena, Ascension and Tristan da Cunha",
  "Israel": "Mediterranean",
  "Peru": "Peru",
  "Romania": "Romania",
  "Svalbard and Jan Mayen": "Svalbard and Jan Mayen",
  "French Southern and Antarctic Lands": "French Southern and Antarctic Lands",
  "China": "Chinese",
  "Mongolia": "Mongolia",
  "Libya": "Mediterranean",
  "Hong Kong": "Hong Kong",
  "Algeria": "Mediterranean",
  "Guyana": "Guyana",
  "Philippines": "South East Asian",
  "Poland": "Poland",
  "Guadeloupe": "Guadeloupe",
  "Armenia": "Armenia",
  "Jordan": "Jordan",
  "Niger": "Niger",
  "Slovenia": "Slovenia",
  "Angola": "Angola",
  "Cook Islands": "Cook Islands",
  "Russia": "Russia",
  "Cayman Islands": "Cayman Islands",
  "Turkmenistan": "Turkmenistan",
  "Antarctica": "Antarctica",
  "Grenada": "Grenada",
  "El Salvador": "El Salvador",
  "Saint Lucia": "Saint Lucia",
  "Syria": "Mediterranean",
  "Kazakhstan": "Kazakhstan",
  "Belarus": "Belarus",
  "Sri Lanka": "Sri Lanka",
  "Saint Martin": "Saint Martin",
  "Liberia": "Liberia",
  "Iceland": "Iceland",
  "New Caledonia": "New Caledonia",
  "Bahamas": "Bahamas",
  "United States Minor Outlying Islands": "United States Minor Outlying Islands",
  "Niue": "Niue",
  "Samoa": "Samoa",
  "Vietnam": "South East Asian",
  "Cameroon": "Cameroon",
  "Fiji": "Fiji",
  "Sint Maarten": "Sint Maarten",
  "Nicaragua": "Nicaragua",
  "Taiwan": "Taiwan",
  "Iran": "Iran",
  "Suriname": "Suriname",
  "Togo": "Togo",
  "Switzerland": "Switzerland",
  "Christmas Island": "Christmas Island"
};


//display results


      
