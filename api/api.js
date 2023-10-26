export const cityPrevision = async (lat,long) =>{
	const TOKEN = "0ce0e533d4fa99e7121f6c5af857c68e"
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

