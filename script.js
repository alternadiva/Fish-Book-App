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
const dishIntro = document.getElementById('dish-intro');
const dishImgElem = document.getElementById('dish-img');
const ingredientsElem = document.getElementById('ingredients');
const recipeURLelem = document.getElementById('recipe-url');
const ingredientsList = document.getElementById('ingredients-list')

// ****************************
// * Display Dish Information *
// ****************************

function displayDish() {
  const cuisineType = countryMapping[resultCountry] //access the mapped value of the countrieMapping object 
  console.log(cuisineType);

  if (cuisineType) {
    fetch(`https://api.edamam.com/api/recipes/v2/?type=public&q=&cuisineType=${cuisineType}&app_id=${edamamAppID}&app_key=${edamamAppKey}`)
      .then((response) => {
        if (!response.ok) {
          const error = new Error(response.status);
          throw error;
        }
        else {
          return response.json();
        }
      })
      .then((response) => {
        const randomRecipe = Math.floor(Math.random() * response.hits.length);
        const recipe = response.hits[randomRecipe].recipe;
        const mealType = recipe.mealType[0];
        dishIntro.innerText = `Not sure what to have for ${mealType}? Here's some inspiration from ${resultCountry}: ${recipe.label}!`

        const dishImg = recipe.image;
        dishImgElem.src = dishImg;

        const ingredients = recipe.ingredientLines;
        ingredientsElem.innerText = `Want to have the best ${recipe.label}? Here's what you need:`;

        //ingredients appear as a list    
        for (let item of ingredients) { 
          // console.log(item);
          const li = document.createElement("li");
          li.append(item);
          ingredientsList.append(li);
        }
             
        //create link
        const a = document.createElement('a');
        a.innerText = "Try out this wonderful recipe!";
        a.href = recipe.url;
        a.target = "_blank"
        recipeURLelem.appendChild(a);
      })
      .catch(() => dishIntro.innerText = "Oops, something went wrong.")
  } else { //handle output in case cuisineType is undefined
    dishIntro.innerText = `Sorry, couldn't find a recipe from ${resultCountry}. Try another country!`
  }
}

//function to hide previous results 
function clearResults() {
  dishImgElem.src = "";
  ingredientsList.innerHTML = "";
  recipeURLelem.innerHTML = "";
}

//function to generate random film in language of chosen country

function movieRecommender(data, index=0) {
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
  console.log(shortCode);
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=11d60f7fcb15ec34d310ee95b2269f47&with_original_language=${shortCode}&include_adult=false`)
  .then((response) => {
    console.log(response);
    if(!response.ok) {throw new Error ('problem calling API');}
    return response.json();
  })
  .then((response) => {
    console.log(response);
    if (response.total_pages == 0) {
      moviePoster.src="";
      movieName.innerText = `No film found for this language`;
      voteAverage.innerText = ("");
      plotSummary.innerText = "";
      throw new Error ('no films found')
    };
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
    console.log(error.message)});
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
        clearResults();
        resultCountry = data[0].name.common;
        output.innerHTML = `${resultCountry} 
                            <img src=${data[0].flags.png} alt="flag of ${resultCountry}" id="flag">`;
        resultsList.innerHTML = "";   
        displayDish();
        movieRecommender(data);    
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
        clearResults();
        displayDish();
        movieRecommender(data, randomIndex);
        return resultCountry;
        
      })
      .catch((error) => {
        console.log(error)});
}



//map countries to cuisine types 

const countryMapping = {
  "Sweden": "Nordic",
  "Albania": undefined,
  "Vanuatu": undefined,
  "Mauritius": undefined,
  "United Kingdom": "British",
  "Portugal": "Mediterranean",
  "Ivory Coast": undefined,
  "Georgia": "Eastern Europe",
  "Bhutan": undefined,
  "Namibia": undefined,
  "Netherlands": "Central Europe",
  "Uruguay": "South American",
  "Belgium": "Central Europe",
  "Guernsey": undefined,
  "United States Virgin Islands": "Caribbean",
  "Uganda": undefined,
  "Liechtenstein": "Central Europe",
  "Guinea-Bissau": undefined,
  "South Korea": "Asian",
  "Cuba": "Caribbean",
  "Montenegro": undefined,
  "Norway": "Nordic",
  "Saint Vincent and the Grenadines": "Caribbean",
  "Mayotte": undefined,
  "Latvia": undefined,
  "Paraguay": "South American",
  "Jersey": undefined,
  "Laos": "South East Asian",
  "Qatar": "Middle Eastern",
  "Dominican Republic": "Caribbean",
  "Bouvet Island": undefined,
  "Slovakia": "Eastern Europe",
  "Bosnia and Herzegovina": undefined,
  "Panama": "Caribbean",
  "Myanmar": "South East Asian",
  "Barbados": "Caribbean",
  "Cambodia": "South East Asian",
  "Antigua and Barbuda": "Caribbean",
  "Kenya": undefined,
  "India": "Indian",
  "São Tomé and Príncipe": undefined,
  "Faroe Islands": "Nordic",
  "Czechia": "Central Europe",
  "Montserrat": "Caribbean",
  "South Georgia": undefined,
  "Ukraine": "Eastern Europe",
  "Djibouti": undefined,
  "Greenland": "Nordic",
  "Tonga": undefined,
  "United States": "American",
  "Norfolk Island": undefined,
  "Republic of the Congo": undefined,
  "Lebanon": "Middle Eastern",
  "Uzbekistan": undefined,
  "Guam": undefined,
  "Estonia": undefined,
  "Tuvalu": undefined,
  "Bermuda": "Caribbean",
  "South Sudan": undefined,
  "Costa Rica": undefined,
  "Finland": "Nordic",
  "Gambia": undefined,
  "French Polynesia": undefined,
  "Belize": "Caribbean",
  "Kiribati": undefined,
  "French Guiana": "South American",
  "Andorra": undefined,
  "Kosovo": undefined,
  "Mozambique": undefined,
  "Puerto Rico": undefined,
  "Australia": undefined,
  "Azerbaijan": undefined,
  "Sudan": undefined,
  "Chad": undefined,
  "Eritrea": undefined,
  "Malaysia": "South East Asian",
  "Kuwait": "Middle Eastern",
  "Northern Mariana Islands": undefined,
  "New Zealand": undefined,
  "Morocco": "Mediterranean",
  "Somalia": undefined,
  "Singapore": undefined,
  "Timor-Leste": undefined,
  "Greece": "Mediterranean",
  "Botswana": undefined,
  "Indonesia": "South East Asian",
  "North Macedonia": "Eastern Europe",
  "Tanzania": undefined,
  "Eswatini": undefined,
  "Central African Republic": undefined,
  "Bolivia": "South American",
  "Solomon Islands": undefined,
  "Thailand": "South East Asian",
  "Réunion": undefined,
  "Croatia": "Central Europe",
  "Burundi": undefined,
  "United Arab Emirates": "Middle Eastern",
  "Palau": undefined,
  "Falkland Islands": undefined,
  "Malawi": undefined,
  "Bangladesh": undefined,
  "Canada": undefined,
  "Jamaica": "Caribbean",
  "Luxembourg": "Central Europe",
  "Monaco": undefined,
  "Tunisia": "Mediterranean",
  "Equatorial Guinea": undefined,
  "Martinique": "Caribbean",
  "Cape Verde": "Cape Verde",
  "Aruba": "Caribbean",
  "American Samoa": undefined,
  "Nigeria": undefined,
  "Cocos (Keeling) Islands": undefined,
  "Spain": "Mediterranean",
  "Iraq": "Middle Eastern",
  "Tokelau": undefined,
  "Zimbabwe": undefined,
  "Guinea": undefined,
  "Ghana": undefined,
  "Wallis and Futuna": undefined,
  "Kyrgyzstan": undefined,
  "Macau": undefined,
  "Bahrain": "Middle Eastern",
  "Ethiopia": undefined,
  "Gibraltar": undefined,
  "Isle of Man": undefined,
  "Pakistan": undefined,
  "Åland Islands": "Nordic",
  "Honduras": "Caribbean",
  "Haiti": "Caribbean",
  "Caribbean Netherlands": "Caribbean",
  "Nauru": undefined,
  "Trinidad and Tobago": "Caribbean",
  "Saint Barthélemy": "Caribbean",
  "DR Congo": undefined,
  "Denmark": "Nordic",
  "Venezuela": "South American",
  "Ireland": undefined,
  "Dominica": "Caribbean",
  "Benin": undefined,
  "British Indian Ocean Territory": undefined,
  "Mauritania": undefined,
  "South Africa": undefined,
  "Saint Pierre and Miquelon": undefined,
  "San Marino": undefined,
  "Egypt": "Middle Eastern",
  "Tajikistan": undefined,
  "Marshall Islands": undefined,
  "Japan": "Japanese",
  "Pitcairn Islands": undefined,
  "Senegal": undefined,
  "Palestine": "Middle Eastern",
  "Gabon": undefined,
  "Anguilla": "Caribbean",
  "Mexico": "Mexican",
  "Papua New Guinea": "Caribbean",
  "Serbia": "Central Europe",
  "Argentina": "South American",
  "Mali": undefined,
  "Oman": "Middle Eastern",
  "Malta": "Mediterranean",
  "Maldives": undefined,
  "Austria": "Central Europe",
  "Western Sahara": undefined,
  "North Korea": undefined,
  "British Virgin Islands": "Caribbean",
  "Burkina Faso": undefined,
  "Micronesia": undefined,
  "Lithuania": undefined,
  "Colombia": "South American",
  "Rwanda": undefined,
  "Madagascar": undefined,
  "France": "French",
  "Moldova": "Eastern Europe",
  "Nepal": undefined,
  "Afghanistan": undefined,
  "Saudi Arabia": "Middle Eastern",
  "Ecuador": "South American",
  "Vatican City": undefined,
  "Zambia": undefined,
  "Germany": "Central Europe",
  "Turkey": "Middle Eastern",
  "Yemen": "Middle Eastern",
  "Comoros": undefined,
  "Curaçao": "Caribbean",
  "Italy": "Italian",
  "Bulgaria": "Eastern Europe",
  "Brazil": "South American",
  "Turks and Caicos Islands": "Caribbean",
  "Lesotho": undefined,
  "Hungary": "Central Europe",
  "Guatemala": undefined,
  "Chile": "South American",
  "Cyprus": "Mediterranean",
  "Heard Island and McDonald Islands": undefined,
  "Saint Kitts and Nevis": "Caribbean",
  "Sierra Leone": undefined,
  "Brunei": undefined,
  "Seychelles": undefined,
  "Saint Helena, Ascension and Tristan da Cunha": undefined,
  "Israel": "Kosher",
  "Peru": "South American",
  "Romania": "Eastern Europe",
  "Svalbard and Jan Mayen": undefined,
  "French Southern and Antarctic Lands": undefined,
  "China": "Chinese",
  "Mongolia": undefined,
  "Libya": undefined,
  "Hong Kong": undefined,
  "Algeria": "Mediterranean",
  "Guyana": "South American",
  "Philippines": "South East Asian",
  "Poland": "Eastern Europe",
  "Guadeloupe": "Caribbean",
  "Armenia": undefined,
  "Jordan": "Middle Eastern",
  "Niger": undefined,
  "Slovenia": "Central Europe",
  "Angola": undefined,
  "Cook Islands": undefined,
  "Russia": "Eastern Europe",
  "Cayman Islands": "Caribbean",
  "Turkmenistan": undefined,
  "Antarctica": undefined,
  "Grenada": "Caribbean",
  "El Salvador": undefined,
  "Saint Lucia": "Caribbean",
  "Syria": "Middle Eastern",
  "Kazakhstan": undefined,
  "Belarus": "Eastern Europe",
  "Sri Lanka": "Asian",
  "Saint Martin": "Caribbean",
  "Liberia": undefined,
  "Iceland": "Nordic",
  "New Caledonia": undefined,
  "Bahamas": "Caribbean",
  "United States Minor Outlying Islands": undefined,
  "Niue": undefined,
  "Samoa": undefined,
  "Vietnam": "South East Asian",
  "Cameroon": undefined,
  "Fiji": undefined,
  "Sint Maarten": "Caribbean",
  "Nicaragua": undefined,
  "Taiwan": undefined,
  "Iran": "Middle Eastern",
  "Suriname": "South American",
  "Togo": undefined,
  "Switzerland": "Central Europe",
  "Christmas Island": undefined
};



      