let songCount = 1;

// Function to add more song input fields
function addSong() {
  songCount++;
  const songsContainer = document.getElementById('songsContainer');

  const newSong = document.createElement('div');
  newSong.classList.add('song');
  newSong.id = `song_${songCount}`;

  newSong.innerHTML = `
    <h2>Song ${songCount}</h2>
    <label for="title_${songCount}">Song Title:</label>
    <input type="text" id="title_${songCount}" name="title"><br>

    <label for="musicInfo_${songCount}">Music Info:</label>
    <input type="text" id="musicInfo_${songCount}" name="musicInfo"><br>

    <label for="lyrics_${songCount}">Lyrics (Raw):</label>
    <textarea id="lyrics_${songCount}" name="lyrics" rows="4"></textarea><br>

    <label for="taen_${songCount}">Lyrics (Phonetic):</label>
    <textarea id="taen_${songCount}" name="taen" rows="4"></textarea><br>

    <label for="videoUrl_${songCount}">Video URL:</label>
    <input type="url" id="videoUrl_${songCount}" name="videoUrl"><br>

    <label for="songwriter_${songCount}">Songwriter:</label>
    <input type="text" id="songwriter_${songCount}" name="songwriter"><br>

    <label for="playlists_${songCount}">Playlists (Comma-separated IDs):</label>
    <input type="text" id="playlists_${songCount}" name="playlists"><br>
  `;

  songsContainer.appendChild(newSong);

  // Setup auto-fill for title when lyrics are entered
  setupAutoFillTitle(songCount);
}

// Function to auto-fill the song title from the first line of lyrics if title is empty
function autoFillTitle(songIndex) {
  const titleField = document.getElementById(`title_${songIndex}`);
  const lyrics = document.getElementById(`lyrics_${songIndex}`).value;
  const firstLine = lyrics.split('\n')[0];

  // Only set the title if it's currently empty
  if (titleField.value.trim() === "") {
    titleField.value = firstLine;
  }
}

// Attach auto-fill title function to lyrics input for each song
function setupAutoFillTitle(songIndex) {
  const lyricsInput = document.getElementById(`lyrics_${songIndex}`);
  lyricsInput.addEventListener('input', () => autoFillTitle(songIndex));
}

// Initialize auto-fill for the first song
setupAutoFillTitle(1);

// Function to convert input to JSON
function convertToJson() {
  const allSongs = [];

  for (let i = 1; i <= songCount; i++) {
    const title = document.getElementById(`title_${i}`).value || "";
    const musicInfo = document.getElementById(`musicInfo_${i}`).value || "";
    const lyrics = document.getElementById(`lyrics_${i}`).value || "";
    const taen = document.getElementById(`taen_${i}`).value || "";
    const videoUrl = document.getElementById(`videoUrl_${i}`).value || "";
    const songwriter = document.getElementById(`songwriter_${i}`).value || "";
    const playlistsInput = document.getElementById(`playlists_${i}`).value;
    const playlists = playlistsInput ? playlistsInput.split(',').map(playlist => playlist.trim()) : [];

    // Create JSON structure for each song
    const songData = {
      "__typename": "Song",
      "_id": generateUniqueId(),
      "id": title.replace(/\s+/g, '-').toLowerCase(),
      "title": title,
      "musicInfo": musicInfo,
      "lyrics": lyrics,
      "taen": taen,
      "songwriter": songwriter,
      "videoUrl": videoUrl,
      "views": 0,  // Default value
      "playlists": playlists
    };

    // Add to allSongs array
    allSongs.push(songData);
  }

  // Output the JSON
  document.getElementById('jsonOutput').textContent = JSON.stringify(allSongs, null, 2);
}

// Function to generate a unique ID (for demo purposes)
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

// Function to copy JSON output to clipboard
function copyJson() {
  const jsonOutput = document.getElementById("jsonOutput").textContent;
  navigator.clipboard.writeText(jsonOutput).then(() => {
    alert("JSON copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy JSON: ", err);
  });
}
function generatePpt() {
  // Convert song data to JSON (this will also trigger the conversion and display in jsonOutput)
  convertToJson();

  // Retrieve the generated JSON from the jsonOutput area
  const jsonOutput = document.getElementById('jsonOutput').textContent;

  if (jsonOutput.trim() === "") {
    alert("No JSON data available. Please convert the songs to JSON first.");
    return;
  }

  // Store the generated JSON in localStorage
  localStorage.setItem('pptJsonData', jsonOutput);

  // Redirect to the JSON to PPT Converter page
  window.location.href = 'ppt_conv/index.html'; // Ensure this points to your correct PPT converter page
}

