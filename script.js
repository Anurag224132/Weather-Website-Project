// console.log('Hello jee app');
// const API_KEY = "d7dd9fe116efbe1e9c2349bdecf4739b";
// function renderWeatherInfo(data) {
//     let newPara = document.createElement("p");
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
//     document.body.appendChild(newPara);
// }
// async function showWeather() {
//     try {
//         let city = "goa"
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//         const data = await response.json();
//         console.log("Weather data:->", data);

//         renderWeatherInfo(data);
//     }
//     catch (err) {
//         //handle the error
//     }
// }

// async function getCustomWeather(latitude,longitude) {
//     try {
//         // let latitude = 24.0667;
//         // let longitude = 75.0667;

//         let result =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
//         let data = await result.json();
//         console.log(data);
//         renderWeatherInfo(data);
//     }
//     catch (err) {
//         console.log("Error found", err);
//     }
// }

// function getLocation() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         console.log("No geolocation Support");
//     }


// }

// function showPosition(position) {
//     let lat = position.coords.latitude;
//     let log = position.coords.longitude;

//     // console.log(lat);
//     // console.log(log);
//     getCustomWeather(lat,log);
// }


const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initally variables needs ????
const API_KEY = "d7dd9fe116efbe1e9c2349bdecf4739b";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionsStorage();



function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab par the, ab your weather tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            //ab main your weather tab me aa gya hu, toh weather bhi display karna padega, so let's check local storage first
            // for coordinates,if we have save them there.
            getFromSessionsStorage();
        }
    }
}
userTab.addEventListener("click", () => {
    //pass clicked tba as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tba as input parameter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage
function getFromSessionsStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinate");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fectchUserWeatherInfo(coordinates);
    }
}

async function fectchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // make grantcontainer Invisible

    grantAccessContainer.classList.remove("active");

    //make loader visible
    loadingScreen.classList.add("active");

    //API call
    try {
        const response = await fetch(`https:api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
    }
}


function renderWeatherInfo(weatherInfo) {
    // firstly, we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //fetch value from weathInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;

}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("No geolocation support available");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fectchUserWeatherInfo(userCoordinates);

}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


const searchInput=document.querySelector("[data-serachInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName==="")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`

        );

        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data); 
    }
    catch(err){

    }
}