// WHAT I AM TRYING TO DO: 

// when the user logs in using spotify, present them with a list of their playlists
// let the user click on a list of their playlists
// then render the iframe with their songs
// probably using jquery to do this without refreshing the page.

// console.log(req.session.access_token);



      // (function() {

      //   /**
      //    * Obtains parameters from the hash of the URL
      //    * @return Object
      //    * YOU NEED THIS BECAUSE WHEN SPOTIFY.COM SENT YOU TO /CALLBACK, IT ADDED ALL THE SALIENT DATA IN 
      //    * THE QUERY STRING
      //    */
      //   function getHashParams() {
      //     var hashParams = {};
      //     var e, r = /([^&;=]+)=?([^&;]*)/g,
      //         q = window.location.hash.substring(1);
      //     while ( e = r.exec(q)) {
      //        hashParams[e[1]] = decodeURIComponent(e[2]);
      //     }
      //     return hashParams;
      //   }
      //   var params = getHashParams();



      //   // this is just for showing user data in tutorial page (handlebars partial)
      //   // var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      //   //     userProfileTemplate = Handlebars.compile(userProfileSource),
      //   //     userProfilePlaceholder = document.getElementById('user-profile');

      //   // // this is for display oAuth token info in tutorial page (handlebars partial)
      //   // var oauthSource = document.getElementById('oauth-template').innerHTML,
      //   //     oauthTemplate = Handlebars.compile(oauthSource),
      //   //     oauthPlaceholder = document.getElementById('oauth');




      //   // this will pull the tokens from the query string once the entire authentication process is completed... which'll be how you are even looking at this page now
      //   var access_token = req.session.access_token,
      //       refresh_token = req.session.refresh_token
      //       // error = params.error;

      //   if (error) {
      //     alert('There was an error during the authentication');
      //   } else {

      //     /************
      //      *
      //      * THIS IS WHERE YOU ACTUALLY USE THE TOKEN ON THE CLIENT SIDE TO GET STUFF FROM SPOTIFY
      //      *
      //      *************/
      //     if (access_token) {
      //       // render oauth info
      //       oauthPlaceholder.innerHTML = oauthTemplate({
      //         access_token: access_token,
      //         refresh_token: refresh_token
      //       });

      //       //...for example in an ajax request like this
      //       $.ajax({
      //           url: 'https://api.spotify.com/v1/me/',
      //           headers: {
      //             'Authorization': 'Bearer ' + access_token
      //           },

      //           success: function(response) {

      //             // EXAMPLE of having used token to get stuff from spotify
      //             console.log(response, "THIS IS THE STUFF") /// THIS IS THE "stuff"
      //             userProfilePlaceholder.innerHTML = userProfileTemplate(response);

      //             $('#login').hide();
      //             $('#loggedin').show();
      //           }
      //       });
      //     } else {
      //         // render initial screen
      //         $('#login').show();
      //         $('#loggedin').hide();
      //     }

      //     if (access_token) {
      //       // render oauth info
      //       oauthPlaceholder.innerHTML = oauthTemplate({
      //         access_token: access_token,
      //         refresh_token: refresh_token
      //       });

      //       //...GET THE PLAYLISTS
      //       $.ajax({
      //           url: 'https://api.spotify.com/v1/me/playlists/',
      //           headers: {
      //             "Accept": "application/json", 
      //             "Content-Type" : "application/json",
      //             'Authorization': 'Bearer ' + access_token
      //           },
      //           type: "GET",

      //           success: function(response) {

      //             // EXAMPLE of having used token to get stuff from spotify
      //             console.log(response, "THIS IS THE STUFF") /// THIS IS THE "stuff"
      //             userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                
      //           },
      //           fail: function(err) {
      //             console.log(err, "THIS SHIT DID NOT WORK.");
      //           }
      //       });
      //     }
      //     // curl -X "GET" "https://api.spotify.com/v1/me/playlists" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQB5YA4qYqfklUCLO_UTeyYh4542toyfUDZ-09KALJNJ5uSAE8gNulycfiHmTl3JRa3ieXvsx_fq3QUT6iuIh2k3kprRsyMkk9vVM3yEIoJZQJ-XVeKEGUKaDSTPn68EW7AZtK2I3m9UqTWr9qhpJ-7Zky-vh47r"

      //     // refresh token stuff
      //   //   document.getElementById('obtain-new-token').addEventListener('click', function() {
      //   //     $.ajax({
      //   //       url: '/refresh_token',
      //   //       data: {
      //   //         'refresh_token': refresh_token
      //   //       }
      //   //     }).done(function(data) {
      //   //       access_token = data.access_token;
      //   //       oauthPlaceholder.innerHTML = oauthTemplate({
      //   //         access_token: access_token,
      //   //         refresh_token: refresh_token
      //   //       });
      //   //     });
      //   //   }, false);
      //   // }
        
      // })();