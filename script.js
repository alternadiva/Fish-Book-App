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
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
      