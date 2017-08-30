var setSong = function(songNumber) {
    currentlyPlayingSongNumber = parseInt(songNumber);  // whatever the songnumber is, parseInt converts it to an integer
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];  // retrieves array of songs from currentAlbum, songnumber - 1 gets the appropriate index
}; // closes setSong function

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
}; // closes getSongNumberCell function

var createSongRow = function(songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">'
     +' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     +' <td class="song-item-title">' + songName + '</td>'
     +' <td class="song-item-duration">' + songLength + '</td>'
     +'</tr>'
     ;

     var $row = $(template);

     var clickHandler = function() {
       var songNumber = parseInt($(this).attr('data-song-number'));


       if (currentlyPlayingSongNumber !== null) {
         //revert to song number for currently playing song because user started playing new song.
          var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
              currentlyPlayingCell.html(currentlyPlayingSongNumber);
       }
       if (currentlyPlayingSongNumber !== songNumber) {
         // switch from play to pause button to indicate new song is playing.
          $(this).html(pauseButtonTemplate);
          setSong(songNumber);
          updatePlayerBarSong();

       } else if (currentlyPlayingSongNumber === songNumber) {
         // switch from pause to play button to pause currently playing song.
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton); // reverts html when song is paused
          currentlyPlayingSongNumber = null;
          currentSongFromAlbum = null;
       }
     }; // closes clickHandler function

     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

     if (songNumber !== currentlyPlayingSongNumber) {
         songNumberCell.html(playButtonTemplate);
        }
     }; // closes onHover function

     var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(songNumber);
        }
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     }; // closes offHover function

     // #1
     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;
}; // closes createSongRow function



var setCurrentAlbum = function(album) {
  currentAlbum = album;
  //#1
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  //#2
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  //#3
  $albumSongList.empty();

  //#4
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
}; // closes setCurrentAlbum function

var updatePlayerBarSong = function() {

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);
}; // closes barsong function

// helps track index of current song
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
}; // closes trackIndex function


var changeSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var nextSongCell = $(this).find(currentSongIndex);
    var nextSong = $(this).attr(currentSongIndex++);


      if (currentSongIndex >= currentSongFromAlbum.songs.length) {
          currentSongIndex = 0;
      }
// previous song
  var previousSongCell = $(this).find(currentSongIndex);
  var previousSong = currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
   };
   // saves last song number before changed
   var $lastSongNumber = $currentlyPlayingSongNumber;
   // set new song
   setSong(currentSongIndex + 1);
   // update player bar
   updatePlayerBarSong();
   var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
   var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

   // update html of next song
   $nextSongNumberCell.html(pauseButtonTemplate);
   $lastSongNumberCell.html(lastSongNumber);
   $('.main-controls .play-pause').html(playerBarPauseButton);
   var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);

}; //closes changeSong function

//var nextSong = function() {
//    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // increase song
//      currentSongIndex++;
    // finds previous song
//    if (currentSongIndex >= currentAlbum.songs.length) {
  //    currentSongIndex = 0;
  //  }
    // saves last song number before changed
  //  var lastSongNumber = currentlyPlayingSongNumber;

    // set new current song
//  setSong(currentSongIndex + 1);

  // update player bar
//  updatePlayerBarSong();

//  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
//  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  //updates html of next song
//  $nextSongNumberCell.html(pauseButtonTemplate);
//  $lastSongNumberCell.html(lastSongNumber);
//}; // closes nextSong function

//var previousSong = function() {
    //var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // decrease song
      //currentSongIndex--;
    // finds previous song
    //if (currentSongIndex < 0) {
    //  currentSongIndex = currentAlbum.songs.length - 1;
  //  }
    // saves last song number before changed
    //var lastSongNumber = currentlyPlayingSongNumber;

    // set new current song
    //setSong(currentSongIndex + 1);
  // update player bar
  //updatePlayerBarSong();

  //$('.main-controls .play-pause').html(playerBarPauseButton);

  //var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  //var $lastSongNumberCell = getSongNumberCell(lastSongNumber);


  //updates html of previous song
  //$previousSongNumberCell.html(pauseButtonTemplate);
  //$lastSongNumberCell.html(lastSongNumber);
//}; // closes previousSong function



//Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//store state of playing songs
// #1
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
}); // closes ready function
