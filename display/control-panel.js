let songs = [];  // Array to hold songs
let selectedFontColor = '#ffffff'; // Default font color
let selectedBgImage = null; // Variable for storing background image
let displayWindow = null; // Reference for display window
let textSize = 40;  // Default text size
let currentStanza = null; // To keep track of the current displayed stanza

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
    const song = songs[index];
    const songLyrics = document.getElementById("songLyrics");
    songLyrics.innerHTML = '';  // Clear previous lyrics

    const stanzas = song.lyrics.split("\n\n");  // Assuming stanzas are separated by double line breaks

    stanzas.forEach((stanza, stanzaIndex) => {
        const stanzaDiv = document.createElement("div");
        stanzaDiv.classList.add("stanza");
        stanzaDiv.textContent = stanza;
        stanzaDiv.onclick = () => openDisplayPage(stanza);
        songLyrics.appendChild(stanzaDiv);

        // Add line between each stanza
        const lineBreak = document.createElement("hr");
        songLyrics.appendChild(lineBreak);
    });
}

// Open the display window
// Open the display window
function openDisplayWindow() {
    if (displayWindow) {
        displayWindow.focus(); // If already opened, just focus it
    } else {
        displayWindow = window.open('', 'displayWindow', 'width=600,height=400');
        displayWindow.document.write(`
            <html>
            <head><title>Display Lyrics</title><style>
                body {
                    text-align: center;
                    padding: 20px;
                    background-color: black;
                    color: white;
                    font-size: 40px;
                    font-weight: bold;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }
                #stanzaDisplay { 
                    padding: 20px; 
                    font-size: 40px;
                    margin-top: 20px;
                    text-align: center;
                }
            </style></head>
            <body>
            <div id="stanzaDisplay"></div>
            </body></html>
        `);
        displayWindow.document.close();
    }
}


// Update the display window with the selected stanza
function updateDisplayWindow(stanza) {
    if (displayWindow) {
        const stanzaDisplay = displayWindow.document.getElementById('stanzaDisplay');
        stanzaDisplay.textContent = stanza;
    }
}

// Change background color in Control Panel
function changeBackgroundColor(color) {
    if (displayWindow) {
        displayWindow.document.body.style.backgroundColor = color;
    }
}

// Change font color in Control Panel
function changeFontColor(color) {
    selectedFontColor = color;  // Save font color globally
    if (displayWindow) {
        displayWindow.document.body.style.color = color;
    }
}

// Set background image with proper scaling
function setBackgroundImage() {
    const fileInput = document.getElementById('bgImage');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            selectedBgImage = e.target.result; // Store the image data URL
            if (displayWindow) {
                displayWindow.document.body.style.backgroundImage = `url(${selectedBgImage})`;
                displayWindow.document.body.style.backgroundSize = 'cover'; // Ensuring correct image scaling
                displayWindow.document.body.style.backgroundPosition = 'center'; // Center the image
            }
        };
        reader.readAsDataURL(file);
    }
}

// Ensure font size changes are applied correctly in both control panel and display window
// Ensure font size changes are applied correctly in both control panel and display window
// Ensure font size changes are applied correctly in both control panel and display window

/// Update font size in the display window only
function setTextSize(value) {
    textSize = value; // Update global text size value
    document.getElementById("fontSizeValue").textContent = `${value}px`; // Display current font size value

    // Apply font size change to the #stanzaDisplay inside the display window
    if (displayWindow) {
        const stanzaDisplay = displayWindow.document.getElementById('stanzaDisplay');
        if (stanzaDisplay) {
            stanzaDisplay.style.fontSize = `${value}px`; // Change font size of the stanza content
        }
    }
}

// Apply font size in display window after confirmation
function setTextSizeConfirmed() {
    if (displayWindow) {
        displayWindow.document.body.style.fontSize = `${textSize}px`;
    }
}



// Clear display (Blank button)
function clearDisplay() {
    if (displayWindow) {
        displayWindow.document.getElementById('stanzaDisplay').textContent = ''; // Clear content
        currentStanza = null; // Reset the current stanza
    }
}

// Open display page and display selected stanza
function openDisplayPage(stanza) {
    currentStanza = stanza; // Set the current stanza to be displayed
    updateDisplayWindow(stanza); // Update the display window with the stanza
}
