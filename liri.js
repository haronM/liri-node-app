var fs = require('fs');
var Twitter = require('twitter');
var Spotify = require('spotify-web-api-node');
var request = require('request');
//declare keys into a variable

var keys = require('./keys.js');

var arg2 = process.argv[2];
var arg3 = process.argv[3];

function changeCommands() {
    switch (arg2) {
        case "my-tweets":
            twitter();
            break;
        case "spotify-this-song":

            if (arg3 == undefined){
                arg3 = "The Sign";
            }
            spotify();
            break;
        case "movie-this":

            if(arg3 == undefined){
                arg3 = 'Mr. Nobody.';
            }
            movie();
             break;
        case "do-what-it-says":
            itSays();
            break;
        default:
            console.log('invalid entry');
    }
}

//url https://dev.twitter.com/overview/api/tweets
function twitter(){
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret:  keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    //twitter function parameters:
    var parameters = {
        twitterHandle: '@MADUT2017',
        count: 20
    };
    //get statuses from twitter
    client.get("statuses/user_timeline", parameters, function(error, tweets, response){
        if (!error && response.statusCode == 200) {
            for(var i = 0; i < tweets.length; i++){
                console.log("At : " + tweets[i].created_at + ", I tweeted --> "+ tweets[i].text + "\n");
            }
            console.log("--end of tweets--" + "\n");
        } else {
            console.log(error);
        }

    });
}

//https://developer.spotify.com/web-api/object-model/
function spotify() {
    console.log(arg3);
    var spotifyApi = new Spotify({            
        clientID: keys.spotifyKeys.client_id,
        clientSecret: keys.spotifyKeys.client_secret
    });


    spotifyApi.searchTracks(arg3, {limit: 1}).then(function (data) {
            var tracks = data.body.tracks.items;
            
            for (var i in tracks) {
                console.log("Artist: " + tracks[i].artists[0].name);
                console.log("Song: " + tracks[i].name);
                console.log("Preview: " + tracks[i].preview_url);
                console.log("Album: " + tracks[i].album.name);
            }
        console.log("--end of returned result--" + "\n");
    });
}


function movie() {
	
	if(arg3==""){
		arg3="Mr. Nobody";
		console.log("If you haven't watched 'Mr. Nobody,' then you should:http://www.imdb.com/title/tt0485947/It's on Netflix!");
	}else{
		arg3=arg3;
	}
        
		var api_key="6f4f98ff"
		var query_url = "http://www.omdbapi.com/?t=" + arg3 + "&y=&plot=long&tomatoes=true&r=json&apikey="+api_key;
		
        request(query_url, function (error, data, body) {
            if (error) {
                console.log(error)
            }
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Date: " + JSON.parse(body).Released);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language(s): " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
            console.log("--end of results--" + "\n");

        });
}


function itSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            console.log(error);
        } else {
            var dataArray = data.split(",");
            arg2 = dataArray[0];
            arg3 = dataArray[1];
        }
        changeCommands();

    }); //fs ends here
}
//call commands
changeCommands();
