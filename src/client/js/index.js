import { formatDate, capitalizeFirstLetter } from './utils.js';

const server_url = "http://localhost:8000";
const city_geo_path = "/get-city-geo";
const city_weather_path = "/get-city-weather";
const city_image_path = "/get-city-image";

// default setting
const def_city_img_url= "https://images.pexels.com/photos/13739807/pexels-photo-13739807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"

// UI Elements Reference
const travelDateInput = document.getElementById("departure-date");
const cityNameInput = document.getElementById("city");
const outputDev = document.getElementById("resultGrid");
const getTripButton = document.getElementById("getTripButton")
const weather_output = document.getElementById('weather');
const days_left_output = document.getElementById('days-left');
const resultFlex = document.getElementById('resultContainer');
const imageOutput = document.getElementById('city-image');
const title = document.getElementById('title')



function getUserInputs(){
  const travelDate = new Date(travelDateInput.value);
  const cityName = cityNameInput.value;
  const currentDate = new Date();
  const daysLeft = Math.floor((travelDate - currentDate) / (1000 * 60 * 60 * 24));
  return {
    "travelDate": travelDate,
    "cityName": cityName,
    "daysLeft": daysLeft
  }
}


async function get_city_geo_path(city){
  const params = {"city": city};
  try {
      const url = new URL(`${server_url}${city_geo_path}`);
      url.search = new URLSearchParams(params).toString();
      const response = await fetch(url);
      if (!response.ok) {throw new Error(`HTTP error! Status: ${response.status}`);}
      const result = await response.json();
      console.log('Result:', result);
      return result
  } catch (error) {
      console.error(`Error calling ${server_url}${city_geo_path}`, error);
     return null;
  }
}

async function get_city_weather_path(latitude,  longitude, date){
  const params = {
    "latitude": latitude,
    "longitude": longitude,
    "date": formatDate(date)
  };
  try {
      const url = new URL(`${server_url}${city_weather_path}`);
      url.search = new URLSearchParams(params).toString();
      const response = await fetch(url);
      const result = await response.json();
      console.log('Result: get_city_weather_path', result);
      return result;
  } catch (error) {
      console.error(`Error calling ${server_url}${city_weather_path}:`, error);
      return null;
  }
}


async function get_city_image_path(city) {
    const params = {"city": city};
    try {
        const url = new URL(`${server_url}${city_image_path}`);
        url.search = new URLSearchParams(params).toString();
        const response = await fetch(url);
        const result =  await response.json();
        console.log('Result: get_city_image_path ', result);
        return result;
      } 
    catch (error) {
        console.error(`Error calling ${server_url}${city_image_path}:`, error);
        return null;
    }
}


async function getData() {
  let user_inputs = getUserInputs();

  // Check if cityName and travelDate are provided
  if (user_inputs['cityName'] === "") {
    alert("City name required\nPlease enter it.");
    return; 
  }

  if (!travelDateInput.value) {
    alert("Date is required!\nPlease enter it.");
    return; 
  }

  let bundle = { 
    "city": user_inputs["cityName"],
    "date": user_inputs["travelDate"],
    "geoInfo": null,
    "weather": null,
    "cityImage": null 
  };

  try {
    // Fetch geo info for the city
    const geoInfo = await get_city_geo_path(user_inputs['cityName']);
    
    if (!geoInfo || geoInfo["message"] === "City not found") {
        clearAllFields();
        alert("No city found with this name. Check the city name!");
        return;
    }

    bundle.geoInfo = JSON.parse(JSON.stringify(geoInfo));
    console.log(`Geo Info: ${bundle.geoInfo}`);
    
    // Fetch weather information
    let weather = await get_city_weather_path(geoInfo.latitude, geoInfo.longitude, user_inputs['travelDate']);
    bundle.weather = JSON.parse(JSON.stringify(weather));
    console.log(`Weather: ${bundle.weather}`);

    // Fetch city image
    let cityImg = await get_city_image_path(user_inputs['cityName']);
    bundle.cityImage = cityImg["cityImage"];
    console.log(`City Image: ${bundle.cityImage}`);
    
    console.log(`Bundle: ${JSON.stringify(bundle)}`);
    
    // Display the data
    displayData(bundle);

  } catch (error) {
    console.error(`Error calling API:`, error);
  }
}

/*
 old version 
async function getData() {
  
  let user_inputs = getUserInputs();
  const params = {
    city: user_inputs['cityName'],
    date: user_inputs['travelDate'],
  };

  if (user_inputs['cityName'] == ""){
    alert("City name required\nPlease enter it.")
    return; 
  }

  if (!travelDateInput.value){
    alert("Date is required!\nPlease enter it.")
    return; 
  }
  
  try {
  

    const url = new URL(`${server_url}/trip-info`);
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url, {
      method: 'GET',
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Result:', result);
    
    if(result["message"] == "City not found"){
        clearAllFields();
        alert("No city found with this name, Check the city name!")
    }
    else{
      displayData(result);
    }
    

 } catch (error) {
  console.error(`Error calling ${server_url}:`, error);
}


}

*/

document.addEventListener("DOMContentLoaded", () => {

   // Disable selection of previous days in Calender.
   const currentDate = new Date().toISOString().split('T')[0];  // Convert to yyyy-mm-dd format
   travelDateInput.setAttribute("min", currentDate);


  if (getTripButton) {
    getTripButton.addEventListener("click", async () => {
          await getData();
      });
  } else {
      console.error("Button not found");
  }
});

function displayData(data){
     //data = JSON.stringify(data)
     console.log(`Logs: ${data}`)
     resultFlex.style.display = "block";
     imageOutput.src = data["cityImage"];
     days_left_output.textContent = `${data["geoInfo"]["country"]}, ${capitalizeFirstLetter(data["city"])} is ${getUserInputs()["daysLeft"]} days away.`
     title.innerHTML = `My trip to:${data["geoInfo"]["country"]}, ${capitalizeFirstLetter(data["city"])}<br> Departing: ${formatDate(data["date"])}`

    if (getUserInputs()["daysLeft"] > 7 ){
      let desc = data["weather"]["data"][data["weather"]["data"].length-1]["weather"]["description"]
      let max_temp = data["weather"]["data"][data["weather"]["data"].length-1]["max_temp"]
      let min_temp = data["weather"]["data"][data["weather"]["data"].length-1]["min_temp"]
      weather_output.innerHTML= `Typical weather for then is:<br> High ${max_temp} Low ${min_temp}<br>${desc}`

    }
    else {
          let desc = data["weather"]["data"][0]["weather"]["description"]
          let temp = data["weather"]["data"][0]["temp"]
          weather_output.innerHTML= `Typical weather for then is:<br> Temp: ${temp}<br>${desc}`
    }


}

function clearAllFields(){
  resultFlex.style.display = "none";
  imageOutput.src=def_city_img_url;
}



export {getData, capitalizeFirstLetter}
