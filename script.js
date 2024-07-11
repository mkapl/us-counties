/*
  This is your site JavaScript code - you can add interactivity!
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

function checkInput() {
  const userInput = document.getElementById("userInput").value;
  fetch("/check_csv?value=" + userInput)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("result").innerHTML = data.message;
    });
}


let totalPopulation = 0;
const guessedCounties = new Set(); // Use a Set to store unique county names (case-insensitive)
let completedCount = 0;

async function searchCounty() {
  const userInput = document
    .getElementById("userInput")
    .value.trim()
    .toLowerCase(); // Remove extra spaces and convert to lowercase
    
  document.getElementById("result").innerHTML = "&nbsp";
  
  if (guessedCounties.has(userInput)) {
    document.getElementById("result").innerHTML =
      "You already guessed that county!";
    return;
  }

  const response = await fetch("counties.json");
  const data = await response.json();

  let foundCounties = [];
  for (const county of data) {
    if (county.name.toLowerCase() === userInput) {
      foundCounties.push(county);
      totalPopulation += county.population;
    }
  }

  const usPopulation = 335893238;
  const populationPercentage = (totalPopulation / usPopulation) * 100;

  if (foundCounties.length > 0) {
    guessedCounties.add(userInput); // Add the guessed county to the set
    completedCount += foundCounties.length; // Increment completed count

    const fipsCodes = foundCounties.map((county) => county.id).join(","); // Comma-separated list of FIPS codes
    colorPolygons(fipsCodes);
    document.getElementById("completedCount").innerHTML = `Named: ${completedCount.toLocaleString()} out of 3,143 counties`;
    document.getElementById("populationPercentage").innerHTML = `A total population of ${totalPopulation.toLocaleString()} or ${populationPercentage.toFixed(2)}% of the US`;
    
    
    
  } else {
    document.getElementById("result").innerHTML = "County not found.";
  }
}

function colorPolygons(fipsCodes) {
  const polygons = fipsCodes
    .split(",")
    .map((FIPStxt) => document.getElementById(FIPStxt));
  for (const polygon of polygons) {
    if (polygon) {
      polygon.style.fill = "red";
    } else {
      console.warn(`Polygon with ID "${FIPStxt}" not found in SVG.`);
    }
  }
}


// Add event listener for the input field
document.getElementById("userInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    searchCounty();
    document.getElementById("userInput").value = "";
  }
});


// async function searchCounty() {
//   const userInput = document.getElementById("userInput").value;
//   const response = await fetch("counties.json");
//   const data = await response.json();
//   let found = false;
//   let fipsCode;
//   for (const county of data) {
//     if (county.name.toLowerCase() === userInput.toLowerCase()) {
//       // Case-insensitive search
//       found = true;
//       fipsCode = county.id;
//       totalPopulation += county.population;
//       break;
//     }
//   }
//   const usPopulation = 335893238;
//   const populationPercentage = (totalPopulation / usPopulation) * 100;

//   if (found) {
//     document.getElementById("result").innerHTML = "County found!";
//     colorPolygon(fipsCode);
//     document.getElementById(
//       "populationPercentage"
//     ).innerHTML = `Total Population: ${populationPercentage.toFixed(
//       2
//     )}% `;
//   } else {
//     document.getElementById("result").innerHTML = "County not found.";
//   }
// }

// function colorPolygon(FIPStxt) {
//   const polygon = document.getElementById(FIPStxt);
//   console.log("test");
//   if (polygon) {
//     polygon.style.fill = "red";
//   } else {
//     console.warn(`Polygon with ID "${FIPStxt}" not found in SVG.`);
//   }
// }
