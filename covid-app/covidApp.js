document.getElementById("searchForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  const country = document.getElementById("text").value.trim();
  if (country) {
      fetchCovidData(country);
  }
});

let chartInstance = null; 

async function fetchCovidData(country) {
  try {
      const response = await fetch('https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=7');
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      const countryData = data.find(item => item.country.toLowerCase() === country.toLowerCase());

      if (!countryData) {
          document.getElementById("display").innerHTML = "Country not found or no data available.";
          return;
      }

      document.getElementById("display").innerHTML = `Country: ${countryData.country} <br> Latest Vaccination Coverage: ${Object.values(countryData.timeline)[0]}`;

      updateChart(country, countryData.timeline);
  } catch (error) {
      document.getElementById("display").innerHTML = error.message;
  }
}

function updateChart(country, timeline) {
  const labels = Object.keys(timeline);
  const values = Object.values(timeline);

  const ctx = document.getElementById('covidChart').getContext('2d');

  if (chartInstance) {
      chartInstance.destroy(); 
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: `Vaccination Coverage in ${country}`,
            data: values,
            borderColor: 'blue',
            borderWidth: 3,
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: 'blue',
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { title: { display: true, text: "Date", font: { size: 16 } } },
            y: { 
                title: { display: true, text: "Vaccination Coverage", font: { size: 16 } },
                beginAtZero: false
            }
        },
        plugins: {
            legend: {
                labels: { font: { size: 14 } }
            }
        }
    }
});
}