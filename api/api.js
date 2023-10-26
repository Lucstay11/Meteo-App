export const cityPrevision = async (lat,long) =>{
    //ADD HERE YOUR TOKEN API FROM OPEN WHEATHER https://openweathermap.org/
    const TOKEN = ""
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${TOKEN}&lang=fr&units=metric`;
    const options = {
	method: 'GET',
    };

try {
	const response = await fetch(url, options);
	const result = await response.json();
	return result;
} catch (error) {
	console.error(error);
}
}

