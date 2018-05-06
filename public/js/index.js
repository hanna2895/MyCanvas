console.log("linked");

const testFunction = (stuff) => {
	console.log("test worked");
	console.log(stuff, 'this is the access token');
}

let userData, playlistData;

const getPlaylistData = (access_token, refresh_token) => {
	
		// using the token on the client side
		if (access_token) {
			$.ajax({
				url: 'https://api.spotify.com/v1/me/',
				headers: {
					'Authorization': 'Bearer ' + access_token
				}, 
				type: "GET",
				dataType: 'json',

				success: function(response) {

					console.log(response, "this is the stuff that came back from the ajax call to the user data");
					userData = response;
					greetUser();
				}
			});


			$.ajax({
				url: 'https://api.spotify.com/v1/me/playlists/?limit=20',
				headers: {
					'Accept': "application/json",
					"Content-Type": "application/json",
					'Authorization': 'Bearer ' + access_token
				},
				type: 'GET',
				success: function(response) {
					console.log(response, "this is the playlist data from the ajax request");
					playlistData = response;
					showPlaylists();
				},
				fail: function(err) {
					console.log(err, "THIS DID NOT WORK.");
				}
			});
		} else {
			// figure out how to redirect to a different route from the client side
		}
};


function greetUser () {
	console.log(userData);
	const name = userData.display_name;
	const greeting = $('<h3>').text("Hi, " + name).appendTo($('.spotify'))
	$('<p>').addClass('instructions').text("Please select one of your spotify playlists as a soundtrack for your canvas.").appendTo('.spotify')
}

function showPlaylists () {
	console.log(playlistData);
	// loop through this array, print all the playlist titles in a list, link to each playlist or at least be able to grab the target of the link so that I can render the iframe widget
	$('<ul>').addClass('playlist-list').appendTo($('.spotify'))
	for (let i = 0; i < playlistData.items.length; i ++) {
		const playlist = $('<li>').addClass('playlist').text(playlistData.items[i].name)
		playlist.appendTo('.playlist-list')
		const button = $('<button>').text('select').addClass(i)
		button.appendTo(playlist);
		button.on('click', () => {
			generatePlayWidget(i)
			$('.playlist-list').detach();
			$('.instructions').detach();
		})
		// add a button for each of these, and create an event listener that somehow is able to grab the id or the uri of this playlist in order to generate the iframe widget
	}
	
}

function generatePlayWidget (i) {
	const playlistUri = playlistData.items[i].uri
	const iframe = $('<iframe>').attr({
		'src': 'https://open.spotify.com/embed?uri=' + playlistUri.toString(), 
		'width': '300',
		'height': '300',
		'frameborder': '0',
		'allowtransparency': 'true',
		'allow': 'encrypted-media'
	})
	iframe.appendTo('.spotify')
}
