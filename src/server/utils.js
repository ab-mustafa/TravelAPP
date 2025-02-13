
const fetch = require('node-fetch');

async function getWeatherForTarget(latitude,longitude, tripDate, API_KEY) {
    const baseUrl = "https://api.weatherbit.io/v2.0";
    const today = new Date();
    const trip = new Date(tripDate);
    const timeDiff = (trip - today) / (1000 * 60 * 60 * 24); 
    
    try {    
        let endpoint = "";
        if (timeDiff <= 7) {
            endpoint = `${baseUrl}/current?lat=${latitude}&lon=${longitude}&key=${API_KEY}`;
        } else {
            endpoint = `${baseUrl}/forecast/daily?lat=${latitude}&lon=${longitude}&key=${API_KEY}`;
        }
        const response = await fetch(endpoint);
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}





async function getCityImage(query, API_KEY) {
    const BASE_URL = 'https://pixabay.com/api/';
    const formattedQuery = encodeURIComponent(query);
    const url = `${BASE_URL}?key=${API_KEY}&q=${formattedQuery}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true&min_width=1920&min_height=1080`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.hits.length > 0) {
            return data.hits[0]["webformatURL"]; // Return the first image URL
        } else {
            return 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'; // Fallback image
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        return 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    }
}


async function getCityGeoInfo(cityName, username){
    const url = `http://api.geonames.org/searchJSON?q=${encodeURIComponent(cityName)}&maxRows=1&username=${username}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data["geonames"].length == 0) {
            return {"message": "City not found" };
        }
        console.log(`City Geo details: ${JSON.stringify(data, null, 2)}`);
        return {
            latitude: data["geonames"][0].lat,
            longitude: data["geonames"][0].lng,
            country: data["geonames"][0].countryName
        };
    } catch (error) {
        console.error(`Error: Failed to get get City ${cityName} coordinates.\nDetails: ${error.message}`);
        return null;
    }
}


//export {getCityImage, getWeatherForTarget, getCityGeoInfo};
module.exports = { getCityImage, getWeatherForTarget, getCityGeoInfo };