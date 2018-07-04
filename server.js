const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const queryString = require('querystring');
const expressLayouts = require('express-ejs-layouts');
const session = require ('express-session');
// const bootstrap = require('bootstrap');

require('./db/db')

// use ejs templates
app.set('view engine', 'ejs');
app.use(expressLayouts);

// set up session

app.use(session ({
	secret: "here's a random string",
	resave: false,
	saveUnitialized: false,
	cookie: {secure: false}
}))

// --------------- middleware ----------------------

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.use(cookieParser());

// ----------------- controllers ---------------------

const authController = require('./controllers/auth');
app.use('/', authController);

const userController = require('./controllers/users');
app.use('/users', userController);

const photoController = require('./controllers/photos');
app.use('/photos', photoController)


// -------------- OAuth stuff from Spotify --------------------


const client_id = '2e515a4f16a649439535ae617669aba1'; // Your client id
const client_secret = '777e5b2080bf465ca9afc75f6ef7bb87'; // Your secret
const redirect_uri = 'http://localhost:3000/callback'; // Your redirect uri

const generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

 // GET ROUTE
app.get('/login', function(req, res) {

  // ???? leaves record of this interaction in the user's browser before doing the code below
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application connects to spotify.com to request authorization
  // hey, spotify.com, this app that belongs to developer registered at client_id
  // who is about to hit you up for an auth token
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    queryString.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri, // this is where you should send user once you have made
                                    //  a note of this upcoming transaction
      state: state // ps, spotify.com, the real user will have a cookie that corresponds to this
                    // that's how u know they're legit
    })
  );

});


app.get('/callback', function(req, res) {
  // console.log("HERE IS REQ.QUERY FROM THE CALLBACK ROUNTE------------------------");
  // console.log(req.query)
  // your application requests refresh and access tokens
  // after checking the state parameter

  // this was attached by spotify abvoe beofre it redirected us here
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  // if user cookie doesn't match what they are claiming, then say heyell no
  if (state === null || state !== storedState) {
    res.redirect('/#' +
      queryString.stringify({
        error: 'state_mismatch'
      })
    );

  } else {

    res.clearCookie(stateKey);


    // GET THE TOKEN
    // prepare auth stuff based on
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      // hey i'm who login said i was
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true // you get JSON back
    };
    // make a post request to [described above] with options [described above]
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        // the tokens we seek are now available in "body" (presumably part of the response)

        req.session.access_token = body.access_token;
        req.session.refresh_token = body.refresh_token;

        let access_token = req.session.access_token;
        let refresh_token = req.session.refresh_token;

        // console.log(req.session, "THIS IS REQ.SESSION -----------------------------");

        // now you have the token and you could use it to do other stuff
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };
        /// like maybe this for example????
        // use the access token to access the Spotify Web API
        // HANNAH figure out what this does and/or why/if it is even necessary
        request.get(options, function(error, response, body) {
          // console.log("THIS IS BODY FROM THE GET REQ IN THE POST REQ IN CALLBACK-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
          // console.log(body)
        });

        // ***we can also pass the token to the browser to make requests from there
        res.redirect('/home');


        // res.redirect('/#' +
        //   queryString.stringify({
        //     access_token: access_token,
        //     refresh_token: refresh_token
        //   }));
      }
      // there was an error when you tried to make the request to get the token
      else {
      	console.log("THERE IS AN ERROR: INVALID TOKEN");
      	// res.redirect('/home', {
      	// 	message: "invalid_token"
      	// })

        // res.redirect('/#' +
        //   queryString.stringify({
        //     error: 'invalid_token'
        //   }));
      }

    }); // end request.post




  }
});


app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});



// listeners

app.listen(3000, () => {
	console.log("listening on port 3000");
})
