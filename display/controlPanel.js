let songs = []; // Array to hold song objects
let currentSong = null; // Store the current song being viewed
let displayWindow = null; // The display window that will show stanzas
let currentStanzaIndex = -1; // Track the index of the currently displayed stanza

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

  // Open a new blank window if it's not already open
  if (!displayWindow || displayWindow.closed) {
    displayWindow = window.open("", "Display Window", "width=800,height=600");
    
    // Write the initial HTML content of the window
    displayWindow.document.write(`
      <html>
        <head><title>${currentSong.title}</title></head>
        <body style="background-color: black; color: white; text-align: center; padding: 20px;">
          <div id="stanzaContainer"></div>
        </body>
      </html>
    `);

    // Populate the stanza container with clickable stanzas
    const stanzas = currentSong.lyrics.split("\n\n"); // Assuming stanzas are separated by double line breaks
    const stanzaContainer = displayWindow.document.getElementById("stanzaContainer");

    stanzas.forEach((stanza, index) => {
      const stanzaDiv = displayWindow.document.createElement("div");
      stanzaDiv.textContent = stanza;
      stanzaDiv.classList.add("stanza");
      stanzaDiv.onclick = () => showStanza(stanza, index);
      stanzaContainer.appendChild(stanzaDiv);
    });
  } else {
    displayWindow.focus(); // Focus on the already opened window if it's already open
  }
}

// Show the clicked stanza and highlight it
function showStanza(stanza, index) {
  // If there's already a displayed stanza, remove the highlight
  if (currentStanzaIndex !== -1) {
    const previousStanza = displayWindow.document.querySelectorAll(".stanza")[currentStanzaIndex];
    previousStanza.style.backgroundColor = ''; // Reset background
  }

  // Set the new stanza content in the display window
  const displayContainer = displayWindow.document.createElement("div");
  displayContainer.textContent = stanza;
  displayContainer.style.fontSize = "20px";
  displayContainer.style.marginTop = "20px";

  displayWindow.document.body.appendChild(displayContainer);

  // Highlight the clicked stanza
  const clickedStanza = displayWindow.document.querySelectorAll(".stanza")[index];
  clickedStanza.style.backgroundColor = "#ffcc00"; // Highlight with yellow

  currentStanzaIndex = index; // Track the currently displayed stanza
}

// Clear the lyrics display (Blank button)
function clearDisplay() {
  if (displayWindow) {
    const stanzaContainer = displayWindow.document.getElementById("stanzaContainer");
    stanzaContainer.innerHTML = ""; // Clear all the stanzas from the display window
  }
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

  reader.onload = function (event) {
    document.body.style.backgroundImage = `url(${event.target.result})`;
  };

  reader.readAsDataURL(file);
}
