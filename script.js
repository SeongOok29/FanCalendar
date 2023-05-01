document.addEventListener("DOMContentLoaded", function() {
    // Generate calendar and populate artist selector
    initCalendar();
    initArtistSelector();

    // Add event listeners
    document.getElementById("artist-selector").addEventListener("change", displaySchedule);
    document.getElementById("background-selector").addEventListener("change", changeBackgroundImage);
});

function initCalendar() {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'month',
        events: [], // No events initially
        eventTextColor: 'white',
        eventColor: '#f00',
    });
}


async function initArtistSelector() {
    // Fetch artist data and populate the selector
    const artistData = await fetchArtistData();
    const artistSelector = document.getElementById("artist-selector");

    artistData.forEach(artist => {
        const option = document.createElement("option");
        option.value = artist.id;
        option.textContent = artist.name;
        artistSelector.appendChild(option);
    });
}

async function fetchArtistData() {
    const response = await fetch("http://localhost:3000/api/artists");
    const data = await response.json();
    return data;
}

async function displaySchedule() {
    const selectedArtistId = document.getElementById("artist-selector").value;
    const scheduleData = await fetchScheduleData(selectedArtistId);

    // Prepare events for FullCalendar
    const events = scheduleData.map(event => ({
        title: event.description,
        start: event.date,
    }));

    // Update the calendar with the new events
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar('addEventSource', events);
}


async function fetchScheduleData(artistId) {
    const response = await fetch(`http://localhost:3000/api/schedules/${artistId}`);
    const data = await response.json();
    return data;
}

function changeBackgroundImage(event) {
    // Change the background image based on user input
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
}
