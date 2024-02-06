var weatherInfoObj = {};
window.addEventListener('load',()=>{
    var lat;
    
    var long;
    var apikey='pHM8jXPM2CFK4Gr8evEHL08ZvJGYJVFR';
    var country, locationKey, timeZone, locationName
    navigator.geolocation.getCurrentPosition((position)=> {
        lat=position['coords']['latitude'];
        long=position['coords']['longitude']
        console.log(lat+'  '+long);
        var geolocationurl = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apikey}&q=${lat},${long}`;
        axios.get(geolocationurl)
        .then((response)=>{
          
            country = response.data.Country.EnglishName;
            locationKey=response.data.Key;
            timeZone=response.data.TimeZone;
            locationName=response.data.LocalizedName;
            
            weatherInfoObj['country'] = response.data.Country.EnglishName;
            weatherInfoObj['locationKey'] = response.data.Key;
            weatherInfoObj['timeZone'] = response.data.TimeZone;
            weatherInfoObj['locationName'] = response.data.LocalizedName;

           getWheatherData(apikey,weatherInfoObj.locationKey);
           
            
        })
        
    })
})

function getWheatherData(apikey,locationKey){


        var wheatherUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apikey}`;
     
        axios.get(wheatherUrl).then((response)=>{
        console.log(response);
        weatherInfoObj['today'] = response.data.DailyForecasts[0].Date;
        weatherInfoObj['day'] = response.data.DailyForecasts[0].Day;
        weatherInfoObj['night'] = response.data.DailyForecasts[0].Night;
        weatherInfoObj['temperature'] = response.data.DailyForecasts[0].Temperature;
        var today = new Date(weatherInfoObj['today']);
        var f = weatherInfoObj.temperature.Maximum.Value;
        var minTempF = weatherInfoObj.temperature.Minimum.Value;
        var minTempC = convertToFahrenheitToCelcius(minTempF);
        var temperatureInCelcius = convertToFahrenheitToCelcius(f);
        console.log("celcius",temperatureInCelcius);
        //var IconUrl = `https://developer.accuweather.com/sites/default/files/${01}-s.png`;
        //var nigntIconUrl = "";
       

        console.log("weather info",weatherInfoObj)
        returnId('country').textContent = weatherInfoObj['country']
        returnId('locationName').textContent = weatherInfoObj['locationName']
        returnId('date').textContent = today.getDate()+ '-' +( today.getMonth()+1)+'-'+today.getFullYear()+" "+weatherInfoObj.timeZone.Code;
        if(weatherInfoObj.day.Icon < 10){
            returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.day.Icon}-s.png`)

        }
        else{
            returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.day.Icon}-s.png`)
        }
        if(weatherInfoObj.night.Icon < 10){
            returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.night.Icon}-s.png`)

        }
        else{
            returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.night.Icon}-s.png`)
        }
        returnId('morning-desc').textContent = weatherInfoObj.day.IconPhrase;
        returnId('night-desc').textContent = weatherInfoObj.night.IconPhrase;
        returnId('max-temp').textContent = weatherInfoObj.temperature.Maximum.Unit;
        returnId('temp').textContent = temperatureInCelcius.toFixed(2);
        returnId('max-tempo').textContent =+ minTempC.toFixed(2) + '°C';
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var timeString = hours + ':' + (minutes < 10 ? '0' : '') + minutes;
    
        returnId('time').textContent = 'Time: ' + timeString;
        var maxTempF = weatherInfoObj.temperature.Maximum.Value;
        
        var maxTempC = convertToFahrenheitToCelcius(maxTempF);
        returnId('max-temp').textContent = '°C';
        

    })
}

function returnId(id) {
    return document.getElementById(id);
}


function convertToFahrenheitToCelcius(f){
    var celcius =(f-32) * 5/9;
    return parseFloat(celcius.toFixed(2));
}

