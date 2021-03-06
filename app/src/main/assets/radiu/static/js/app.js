var audio = new Audio('static/etc/calicomp_startup.mp3');
$(document).ready(function () {
  if(radiu.hasWelcomePlayed().toUpperCase != "TRUE") {
    audio.play();
    radiu.setWelcomePlayed(true);
  }
  setTimeout(function () {radioTitle();}, 2000);
  // we're going to update our html elements / player every 15 seconds
  setInterval(function () {radioTitle();}, 15000);
  $('#vol_slider').on("change", function() {
      console.log($(this).val());
      //document.getElementById('track').volume = $(this).val() / 100;
      radiu.set_volume(($(this).val() / 100).toString());
  });
  updatePlayerState();
});


function radioTitle() {
  // this is the URL of the json.xml file located on your server.
  var url = 'http://radio.dangeru.us:8000/json.xsl';
  // this is your mountpoint's name, mine is called /radio
  var mountpoint = '/stream.ogg';

  $.ajax({  type: 'GET',
        url: url,
        async: true,
        jsonpCallback: 'parseMusic',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (json) {
          // this is the element we're updating that will hold the track title
          $('#track-title').text(json[mountpoint].title + ".ogg");
          document.title = "radi/u/ - " + json[mountpoint].title;
          // this is the element we're updating that will hold the listeners count
          $('#listeners').text("listening_" + json[mountpoint].listeners + ".rtf");
          radiu.update_notif(json[mountpoint].title, json[mountpoint].listeners);
        },
        error: function (e) {
          console.log(e.message);
        }
  });
}
function togglePlayer() {
  if(document.getElementById("player").style.display == "none") {
    document.getElementById("player").style.display = "block";
  }
  else {
    document.getElementById("player").style.display = "none";
  }
}
function updatePlayerState() {
  if (radiu.is_playing().toUpperCase() == "TRUE") {
    document.getElementById('is-playing').innerHTML = "stop.exe";
  } else {
    document.getElementById('is-playing').innerHTML = "play.exe";
  }
}
function switchPlayerState() {
  if (radiu.is_playing().toUpperCase() == "TRUE") {
    radiu.pause_stream();
  } else {
    audio.stop();
    radiu.play_stream();
  }
  updatePlayerState()
}
