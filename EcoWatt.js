exports.action = function(data, callback){

	let client = setClient(data);
	info("EcoWatt from:", data.client, "To:", client);
	ecowatt (data, client);
	callback();
}

function ecowatt (data, client) {

	fetch('https://www.monecowatt.fr/')
	.then(response => {
		if (response.status !== 200) {
			throw new Error(`Code erreur:${response.status}`);
		  }
		return response.text();
	})
		.then((html) => {
			const $ = cheerio.load(html);
			const cheerio = require("cheerio");
			let watt = $('#InteractiveMapWithEcogestes > div.container_block > div.textSignal.mt-10.text-center.min-height-subtitle').text();
			Avatar.speak(watt, data.client, () => {
				Avatar.Speech.end(data.client);
			});
		    })
		.catch(error => {
			Avatar.speak(`Je n'arrive pas a accédé au site, ${error}`, data.client, () => {
			Avatar.Speech.end(data.client);
			});
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