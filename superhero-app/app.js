function CORSSolve(heroName) {
    const xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            const displayArea = document.getElementById("data");

            if (this.status == 200) {
                const data = JSON.parse(xhttp.responseText);

                if (data.response === "error" || !data.results) {
                    displayArea.innerHTML = '<p style="color:red;">Superhero not found!</p>';
                    return;
                }

                let hero = data.results.find(h => h.name.toLowerCase() === heroName.toLowerCase()) || data.results[0];

                if (!hero.name || !hero.image?.url || !hero.powerstats || !hero.biography || !hero.appearance || !hero.work || !hero.connections) {
                    displayArea.innerHTML = '<p style="color:red;">Incomplete superhero data. Please try again.</p>';
                    return;
                }

                displayArea.innerHTML = `
                    <div class="hero-container">
                        <h2 class="hero-name">${hero.name}</h2>
                        <img src="${hero.image.url}" alt="${hero.name}" class="hero-image">
                        
                        <h3>Power Stats:</h3>
                        <p><strong>Intelligence:</strong> ${hero.powerstats.intelligence || "N/A"}</p>
                        <p><strong>Strength:</strong> ${hero.powerstats.strength || "N/A"}</p>
                        <p><strong>Speed:</strong> ${hero.powerstats.speed || "N/A"}</p>
                        <p><strong>Durability:</strong> ${hero.powerstats.durability || "N/A"}</p>
                        <p><strong>Power:</strong> ${hero.powerstats.power || "N/A"}</p>
                        <p><strong>Combat:</strong> ${hero.powerstats.combat || "N/A"}</p>
                        
                        <h3>Biography:</h3>
                        <p><strong>Full Name:</strong> ${hero.biography["full-name"] || "Unknown"}</p>
                        <p><strong>Alter Egos:</strong> ${hero.biography["alter-egos"] || "None"}</p>
                        <p><strong>Aliases:</strong> ${hero.biography.aliases?.join(", ") || "None"}</p>
                        <p><strong>Place of Birth:</strong> ${hero.biography["place-of-birth"] || "Unknown"}</p>
                        <p><strong>First Appearance:</strong> ${hero.biography["first-appearance"] || "Unknown"}</p>
                        <p><strong>Publisher:</strong> ${hero.biography.publisher || "Unknown"}</p>
                        <p><strong>Alignment:</strong> ${hero.biography.alignment || "Unknown"}</p>
                        
                        <h3>Appearance:</h3>
                        <p><strong>Gender:</strong> ${hero.appearance.gender || "Unknown"}</p>
                        <p><strong>Race:</strong> ${hero.appearance.race || "Unknown"}</p>
                        <p><strong>Height:</strong> ${hero.appearance.height?.join(" / ") || "Unknown"}</p>
                        <p><strong>Weight:</strong> ${hero.appearance.weight?.join(" / ") || "Unknown"}</p>
                        <p><strong>Eye Color:</strong> ${hero.appearance["eye-color"] || "Unknown"}</p>
                        <p><strong>Hair Color:</strong> ${hero.appearance["hair-color"] || "Unknown"}</p>

                        <h3>Work:</h3>
                        <p><strong>Occupation:</strong> ${hero.work.occupation || "Unknown"}</p>
                        <p><strong>Base:</strong> ${hero.work.base || "Unknown"}</p>

                        <h3>Connections:</h3>
                        <p><strong>Affiliation:</strong> ${hero.connections["group-affiliation"] || "Unknown"}</p>
                        <p><strong>Relatives:</strong> ${hero.connections.relatives || "Unknown"}</p>
                    </div>
                `;
            } else {
                displayArea.innerHTML = '<p style="color:red;">There was an issue fetching data.</p>';
            }
        }
    };

    const apiUrl = `https://cors-anywhere.herokuapp.com/https://superheroapi.com/api/ad9faa498eb191d054d3a77b192a51f8/search/${heroName}`;
    xhttp.open("GET", apiUrl, true);
    xhttp.send();
}

document.getElementById("submit").addEventListener("click", function (event) {
    event.preventDefault();
    const heroName = document.getElementById("text").value.trim();
    const displayArea = document.getElementById("data");

    if (!heroName) {
        displayArea.innerHTML = '<p style="color:red;">Please enter a superhero name!</p>';
        return;
    }

    if (!/^[a-zA-Z0-9\s-]+$/.test(heroName)) {
        displayArea.innerHTML = '<p style="color:red;">Please enter a valid superhero name!</p>';
        return;
    }

    CORSSolve(heroName);
});
