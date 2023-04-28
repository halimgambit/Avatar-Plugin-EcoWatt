exports.action = function(data, callback){

	let client = setClient(data);
	info("EcoWatt from:", data.client, "To:", client);
	ecowatt (data, client);
	callback();
}

function ecowatt (data, client) {

	let url = 'https://www.monecowatt.fr/';
	let request = require('request');
	request({ 'uri' : url }, function (err, response, body){
	if(err || response.statusCode != 200) {
	Avatar.speak("je n'arrive pas acceder au site", data.client, () => {
	Avatar.Speech.end(data.client);
	});
	return;
	}
	else if(response) {
	let $ = require('cheerio').load(body, { xmlMode: true, ignoreWhitespace: false, lowerCaseTags: false });
	let watt = $('#InteractiveMapWithEcogestes > div.container_block > div.textSignal.mt-10.text-center.min-height-subtitle').text();
	Avatar.speak(watt, data.client, () => {
	Avatar.Speech.end(data.client);
	});
	}
	});
	}
	
	function setClient (data) {
	let client = data.client;
	if (data.action.room)
	client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	if (data.action.setRoom)
	client = data.action.setRoom;
	return client;
	}