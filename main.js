document.getElementById('submit').addEventListener('click', getReport);


function getReport() {
   console.log('submit pressed');

   let zip = document.getElementById('zipCode').value;
   
   console.log(zip);

   const apiURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
   const apiKey = '&APPID=896a6875185f6799d82c2f0bda98e165';
   const zipURL = apiURL + zip + apiKey;

   console.log(zipURL);

   fetch(zipURL)
   .then(
    function (x) {
       console.log(x);
       if (x.status === 200) {
          return x.json();
       } else {

       }
    }
 ).then(
    function (response) {

       let city = response.name;
       document.getElementById('city').innerHTML = city;

       let tempK = response.main.temp;
       document.getElementById('kel').innerHTML = Math.round(tempK) + " K";

       let tempC = response.main.temp;
       document.getElementById('cel').innerHTML = Math.round(Number(tempC - 273.15)) + " C";

       let tempF = response.main.temp;
       document.getElementById('fahr').innerHTML = Math.round(Number((tempF - 273.15) * (9 / 5) + 32)) + " F";

       console.log(response);

    })
    
}