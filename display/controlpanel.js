let songs = []; // Array to hold song objects
let currentSong = null; // Store the current song being viewed

// Add songs from pasted JSON
function addSongs() {
  const jsonInput = document.getElementById("jsonInput").value;
  try {
    const parsedSongs = JSON.parse(jsonInput);
    if (Array.isArray(parsedSongs)) {
      songs = parsedSongs;
      displaySongList();
    } else {
      alert("Invalid JSON format. Please make sure the data is correct.");
    }
  } catch (error) {
    alert("Failed to parse JSON. Please ensure it's valid.");
  }
}

// Display song titles on the left
function displaySongList() {
  const songList = document.getElementById("songList");
  songList.innerHTML = ''; // Clear existing list
  
  songs.forEach((song, index) => {
    const songDiv = document.createElement("div");
    songDiv.classList.add("song-item");
    songDiv.textContent = song.title;
    songDiv.onclick = () => displayLyrics(index);
    songList.appendChild(songDiv);
  });
}

// Display lyrics of the selected song
function displayLyrics(index) {
  currentSong = songs[index];
  document.getElementById("songTitle").textContent = currentSong.title;
  document.getElementById("songLyrics").textContent = currentSong.lyrics;
}

// Open a new window to display stanzas
function openDisplayWindow() {
  if (!currentSong) {
    alert("Please select a song first.");
    return;
  }
  
  const displayWindow = window.open("", "Display Window", "width=800,height=600");
  const stanzas = currentSong.lyrics.split("\n\n"); // Assuming stanzas are separated by double line breaks
  
  displayWindow.document.write('<html><head><title>' + currentSong.title + '</title></head><body style="background-color: black; color: white; text-align: center;">');
  
  stanzas.forEach((stanza, index) => {
    const stanzaDiv = displayWindow.document.createElement("div");
    stanzaDiv.innerHTML = `<p onclick="this.style.display='none'">${stanza}</p>`;
    displayWindow.document.body.appendChild(stanzaDiv);
  });
  
  displayWindow.document.write('</body></html>');
}

// Clear the lyrics display (Blank button)
function clearDisplay() {
  document.getElementById("songTitle").textContent = 'Select a song to view lyrics';
  document.getElementById("songLyrics").textContent = 'Lyrics will appear here';
}

// Change font color
function changeFontColor() {
  const fontColor = document.getElementById("fontColor").value;
  document.getElementById("songLyrics").style.color = fontColor;
}

// Change background color
function changeBgColor() {
  const bgColor = document.getElementById("bgColor").value;
  document.body.style.backgroundColor = bgColor;
}

// Change background image
function changeBackgroundImage() {
  const file = document.getElementById("bgImage").files[0];
  const reader = new FileReader();
  
  reader.onload = function(event) {
    document.body.style.backgroundImage = `url(${event.target.result})`;
  };
  
  reader.readAsDataURL(file);
}
