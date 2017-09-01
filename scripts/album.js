var setSong = function(songNumber) {
    if (currentSoundFile) {   //checks for defined sound file
      currentSoundFile.stop();    // stops sound and restarts from beginning
    }

    currentlyPlayingSongNumber = parseInt(songNumber);  // whatever the songnumber is, parseInt converts it to an integer
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];  // retrieves array of songs from currentAlbum, songnumber - 1 gets the appropriate index
    //# 1 created new object and passed audio file through audioUrl property
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      //#2  passed two properties
      formats: [ 'mp3' ],
      preload: true   // states we want mp3 loaded as soon as page loads
    });
    setVolume(currentVolume);
}; // closes setSong function
// change current song's playback location
var seek = function(time) {
    if (currentSoundFile) {
      currentSoundFile.setTime(time);
    }
}
var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
}; // closes setVolume function

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
}; // closes getSongNumberCell function

var createSongRow = function(songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">'
     +' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     +' <td class="song-item-title">' + songName + '</td>'
     +' <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
          setSong(songNumber);
          // user clicks song that isn't playing, play current file
          currentSoundFile.play();  // plays current file
          updateSeekBarWhileSongPlays();  // triggers method
          currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});

          // switch from play to pause button to indicate new song is playing.
          $(this).html(pauseButtonTemplate);
          updatePlayerBarSong();

       } else if (currentlyPlayingSongNumber === songNumber) {

            if (currentSoundFile.isPaused()) {  // checks if song is paused or not
              $(this).html(pauseButtonTemplate);  // reverts button to pause
              $('.main-controls .play-pause').html(playerBarPauseButton); // reverts button on bar to pause
                currentSoundFile.play();  // plays current file
                updateSeekBarWhileSongPlays();  // triggers method
            }  else {
                  $(this).html(playButtonTemplate);   //reverts to play button
                  $('.main-controls .play-pause').html(playerBarPlayButton);  // reverts to play on bar
                  currentSoundFile.pause();   // pauses current file
          }  // closes else conditional
       }  // closes else if conditional
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

var setCurrentTimeInPlayerBar = function(currentTime) {
    $('.seek-control .current-time').text(currentTime);

}; // closes currentTime function

var setTotalTimeInPlayerBar = function(totalTime) {
    $('.seek-control .total-time').text(totalTime);
}; // closes total time player

var filterTimeCode = function(timeInSeconds) {
    var timing = parseFloat(timeInSeconds);   // turns timing into floating number
    var minute = Math.floor(timing / 60);
    var second = Math.floor(timing % 60);   // remainder of time / 60 becomes seconds
    if (second < 10) {            // creates the y of seconds so x.xy
      second = '0' + second;
    }
    return minute + ':' + second;   // creates format x:xx
}; // closes time code function

var updateSeekBarWhileSongPlays = function() {


    if (currentSoundFile) {
      // #10
      currentSoundFile.bind('timeupdate', function(event) {   // timeupdate tracks time elapse while song playback
        // # 11
          var seekBarFillRatio = this.getTime() / this.getDuration(); // recalculate ratio with Buzz getTime and getDuration methods
          var $seekBar = $('.seek-control .seek-bar');

          updateSeekPercentage($seekBar, seekBarFillRatio);
          setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));    // .getTime grabs the current time of song that is playing
      }); // closes bind
    } // closes if statement
}; //closes updateSeekBarWhileSongPlays function



// makes seek bars move with a click
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);   // makes sure percentage isn't less than 0
    offsetXPercent = Math.min(100, offsetXPercent);   // makes sure percentage isn't more than 100

    //#2
    var percentageString = offsetXPercent + '%';    // converts percentage into a string
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};  // closes updateSeekPercentage function


var setupSeekBars = function() {
    //#6 finds all elements with class seek bar within class player-bar
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
      // #3
      var offsetX = event.pageX - $(this).offset().left;
      var barWidth = $(this).width();
      // #4 ratio calculated offsetX / by entire bar width(barWidth)
      var seekBarFillRatio = offsetX / barWidth;
      // conditional check which bar it is
      if($(this).parent().attr('class') == 'seek-control') {
          seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
          setVolume(seekBarFillRatio * 100);
      } // closes if statement
      // #5 (this) refers to seekBar argument in updateSeekPercentage function
      updateSeekPercentage($(this), seekBarFillRatio);
    });  // closes click event handler
      // # 7 finds elements with class thumb and adds event listener for mousedown event
      $seekBars.find('.thumb').mousedown(function(event) {
        // #8 this refers to thumb node clicked, use parentnode to clarify which bar was clicked
        var $seekBar = $(this).parent();
        // #9 binds events together that serve as a trigger for the event
        $(document).bind('mousemove.thumb', function(event) {
          var offsetX = event.pageX - $seekBar.offset().left;
          var barWidth = $seekBar.width();
          var seekBarFillRatio = offsetX / barWidth;

          if($(this).parent().attr('class') == 'seek-control') {
              seek(seekBarFillRatio * currentSoundFile.getDuration());
          } else {
              setVolume(seekBarFillRatio * 100);
          } // closes if statement

          updateSeekPercentage($seekBar, seekBarFillRatio);
        }); // document function
        // #10 bind last event mouseup
        $(document).bind('mouseup.thumb', function() {
          $(document).unbind('mousemove.thumb');    // removes previous event listeners
          $(document).unbind('mouseup.thumb');
        }); // closes mouseup document
      }); // mousedown function
}; // closes setupSeekBars function


var updatePlayerBarSong = function() {

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
}; // closes barsong function

// helps track index of current song
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
}; // closes trackIndex function

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // increase song
      currentSongIndex++;
    // finds previous song
    if (currentSongIndex >= currentAlbum.songs.length) {
      currentSongIndex = 0;
    }
    // saves last song number before changed
    var lastSongNumber = currentlyPlayingSongNumber;

    // set new current song
  setSong(currentSongIndex + 1);

    // play song while skipping
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();  // triggers method

  // update player bar
  updatePlayerBarSong();

  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  //updates html of next song
  $nextSongNumberCell.html(pauseButtonTemplate);  // turns to pause if hit next button
  $lastSongNumberCell.html(lastSongNumber);   // turns back to number if hit previous
}; // closes nextSong function

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // decrease song
      currentSongIndex--;
    // finds previous song
    if (currentSongIndex < 0) {
      currentSongIndex = currentAlbum.songs.length - 1;
    }
    // saves last song number before changed
    var lastSongNumber = currentlyPlayingSongNumber;

    // set new current song
    setSong(currentSongIndex + 1);
    // play song if skipping
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();  // triggers method
  // update player bar
  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);

  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);


  //updates html of previous song
  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
}; // closes previousSong function

var togglePlayFromPlayerBar = function() {
    var $currentSong = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        $currentSong.html(pauseButtonTemplate);
        $barButton.html(playerBarPauseButton);  // changes play in bar to pause
        currentSoundFile.play();    // plays the song
    } else if (currentSoundFile) {
        $currentSong.html(playButtonTemplate);
        $barButton.html(playerBarPlayButton);   // changes pause in bar to play
        currentSoundFile.pause();               // pauses the song
    } // closes else if conditional
}; // closes play from bar function


// Global variables set here

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
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $barButton = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $barButton.click(togglePlayFromPlayerBar);
}); // closes ready function
