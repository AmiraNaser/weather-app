/* Global Variables */
//data entry variables
const zipcode = document.getElementById('zip');
const feelings = document.getElementById('feelings');
const generate = document.getElementById('generate');
//ui variables
const date = document.getElementById('date');
const temp = document.getElementById('temp');
const content = document.getElementById('content');
//split API url to the API_key and API_base
const api_key = '&appid=058cbe13a692adae3f8e744e9a8c321a&units=metric';
const api_base = 'http://api.openweathermap.org/data/2.5/weather?zip=';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+ 1 + '.'+ d.getDate()+'.'+ d.getFullYear();
//click event callback function
const clickFunction = (e) => {
  e.preventDefault;
  //get values user entered
  const user_zip_code = zipcode.value;
  const user_feelings = feelings.value;
  //check if the user entered zip code
  if (!user_zip_code ) {
    alert("Please enter valid zip code");
  }
  //call the getdata function only if button was clicked then
  getData(api_base, user_zip_code, api_key)
  .then((data) => {
    postData('/addData', {date: newDate, temp: data.main.temp, feelings: user_feelings})
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
    date.innerHTML = getAllData.date;
    temp.innerHTML = getAllData.temp;
    content.innerHTML = getAllData.feelings;
  } catch (e) {
    console.log(`Caught error ${e}`);
  }
}
