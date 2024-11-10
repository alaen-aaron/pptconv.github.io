document.getElementById('convertBtn').addEventListener('click', convertJsonToPPT);

function convertJsonToPPT() {
    const input = document.getElementById('jsonInput').value;
    const textColor = document.getElementById('textColor').value.replace("#", "");
    const bgColor = document.getElementById('bgColor').value.replace("#", "");
    const bgImageInput = document.getElementById('bgImage').files[0];

    if (!input) {
        alert("Please paste your JSON data first!");
        return;
    }

    let json;
    try {
        json = JSON.parse(input);
        
        if (!Array.isArray(json)) {
            alert("JSON data is not in an array format. Please ensure you have an array of song objects.");
            return;
        }

        json.forEach((song, index) => {
            if (!song.title || !song.lyrics) {
                alert(`Song at index ${index} is missing the "title" or "lyrics" field.`);
                throw new Error(`Invalid JSON format at index ${index}: title or lyrics missing.`);
            }
        });

    } catch (error) {
        alert("Invalid JSON format. Please make sure your JSON is properly formatted.");
        console.error("Error parsing JSON: ", error);
        return;
    }

    function generateSlides(song, bgImageBase64) {
        let pptx = new PptxGenJS(); // Create a new PPTX for each song
        let sections = song.lyrics.split('\n\n');

        sections.forEach(section => {
            let slide = pptx.addSlide();

            slide.background = bgImageBase64 
                ? { data: bgImageBase64 }
                : { color: bgColor };

            slide.addText(section.trim(), {
                x: 0.5, y: '20%', w: '90%', h: '60%',
                fontSize: 36,
                color: textColor,
                align: 'center',
                valign: 'middle',
                bold: true,
                autoFit: true,
            });
        });

        const fileName = song.title ? `${song.title}.pptx` : "Song.pptx";
        pptx.writeFile({ fileName }).catch(error => {
            alert(`Error saving PPT file for song "${song.title}". Please check your data and try again.`);
            console.error("Error saving PPT: ", error);
        });
    }

    // Function to handle background image and initiate slide generation
    function processSongs(bgImageBase64) {
        json.forEach(song => {
            generateSlides(song, bgImageBase64);
        });
    }

    if (bgImageInput) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const bgImageBase64 = event.target.result;
            processSongs(bgImageBase64);
        };
        reader.readAsDataURL(bgImageInput);
    } else {
        processSongs(null);
    }
}
document.addEventListener('DOMContentLoaded', () => {
  const jsonData = localStorage.getItem('pptJsonData');
  if (jsonData) {
    document.getElementById('jsonInput').value = jsonData;
    localStorage.removeItem('pptJsonData'); // Clear data after loading
  }
});

