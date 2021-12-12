/* Global Variables */
//data entry variables
const zipcode = document.getElementById('zip');
const feelings = document.getElementById('feelings');
const generate = document.getElementById('generate');
//ui variables
const day = document.getElementById('day');
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const content = document.getElementById('content');
//extra variables
const description = document.getElementById('description');
const country = document.getElementById('country');
const temp_max = document.getElementById('temp_max');
const temp_min = document.getElementById('temp_min');
const humidity = document.getElementById('humidity');
//split API url to the API_key and API_base
const api_key = '&appid=614b5036702d44c19b8b28f220550441&units=metric';
const api_base = 'http://api.openweathermap.org/data/2.5/weather?zip=';
// Create a new date instance dynamically with JS
let d = new Date();
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
let newDay = weekday[d.getDay()];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
let newDate = month[d.getMonth()] + ' '+ d.getDate()+',  '+ d.getFullYear();
let hour = d.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
//display current hour only on page load;
document.getElementById('hourcontainer').innerHTML = hour;
//click event callback function month[d.getMonth()]
const clickFunction = (e) => {
  e.preventDefault;
  //get values user entered
  const user_zip_code = zipcode.value;
  const user_feelings = feelings.value;
  //add zipcode to the ui
  document.getElementById('code').innerHTML = user_zip_code;
  //check if the user entered zip code
  if (!user_zip_code ) {
    alert("Please enter valid zip code");
  }
  //call the getdata function only if button was clicked then
  getData(api_base, user_zip_code, api_key)
  .then((data) => {
    //post data to the server
    postData('/addData', {day: newDay, date: newDate, temp: data.main.temp, temp_min: data.main.temp_min, temp_max: data.main.temp_max, humidity: data.main.humidity, country: data.sys.country, description: data.weather[0].main , feelings: user_feelings})
  }).then((updateData) => {
    updateUI();
  });
}
//get the data from url
const getData = async (api_base, user_zip_code, api_key) => {
  //fetch data from api
  //wait for data to be loaded from the api with await
  const res = await fetch(api_base + user_zip_code + api_key);
  try {
    //parse response to js object
    const newUserdata = await res.json();
    //return parsed js data
    return newUserdata;
  } catch (e) {
    console.log(`Caught Error ${e}`);
  }
}
//post data
const postData = async(url = '', data= {}) => {//default call back values
 //fetch route url
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
   // convert js object to json to match content type
   body: JSON.stringify(data),
  });
  try {
    const newData = await response.json();
    // console.log(newData);
    return newData;
  } catch (e) {
    console.log(`Caught Error ${e}`);
  }
}
// add click event to get user data entry
generate.addEventListener('click', clickFunction);
//automatically update the UI
const updateUI = async () => {
  const request = await fetch('/allData')
  try {
    const getAllData = await request.json();
    console.log(getAllData);
    //write down date, temp and user feelings
    day.innerHTML = getAllData.day;
    date.innerHTML = getAllData.date;
    temp.innerHTML = getAllData.temp;
    content.innerHTML = getAllData.feelings;
    description.innerHTML = getAllData.description;
    humidity.innerHTML = getAllData.humidity + " " + "<span style='color: #f1c858'>%</span>"
    temp_max.innerHTML = getAllData.temp_max + " " + "<span style='color: #f1c858'>&#176;C</span>";
    temp_min.innerHTML = getAllData.temp_min + " " + "<span style='color: #f1c858'>&#176;C</span>";
    country.innerHTML = getAllData.country + ", ";
    //change image according to status
    if (getAllData.description == "Clouds") {
      document.getElementById('descriptionImage').innerHTML = "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Antu_weather-many-clouds.svg/128px-Antu_weather-many-clouds.svg.png\">";
    } else if (getAllData.description == "Clear") {
      document.getElementById('descriptionImage').innerHTML = "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Antu_weather-clouds.svg/128px-Antu_weather-clouds.svg.png\"/>";
    }else if (getAllData.description == "Rain") {
      document.getElementById('descriptionImage').innerHTML = "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Antu_weather-showers-scattered.svg/128px-Antu_weather-showers-scattered.svg.png\">";
    }else if (getAllData.description == "Snow") {
      document.getElementById('descriptionImage').innerHTML = "<img src=\"https://upload.wikimedia.org/wikipedia/commons/4/49/Emoji_u1f328.svg\"/>";
    }else if (getAllData.description == "Thunderstorm") {
      document.getElementById('descriptionImage').innerHTML = "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Antu_weather-storm-day.svg/128px-Antu_weather-storm-day.svg.png\"/>";
    }else if (getAllData.description == "Drizzle") {
      document.getElementById('descriptionImage').innerHTML = "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Antu_weather-snow-scattered.svg/128px-Antu_weather-snow-scattered.svg.png\"/>";
    }else {
      document.getElementById('descriptionImage').innerHTML = "<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Antu_weather-mist.svg/128px-Antu_weather-mist.svg.png\"/>";
    }
  } catch (e) {
    console.log(`Caught error ${e}`);
  }
}
