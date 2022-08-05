let port, reader, writer;

let maxData = 50;
let counter = 0;
let dataStack = Array(maxData).fill({});
let divStack = Array(maxData).fill({});

let googlemap;
let infoWindow;
let cluster;
let markers = [];


async function setup() {
	// document.getElementById("monitor").style.display = "none";
	// document.getElementById("gmap").style.display = "none";
	createCanvas(windowWidth, windowHeight);
	noLoop();
	({ port, reader, writer } = await getPort(115200));
    console.log("CONNECTED");
	document.getElementById("defaultCanvas0").style.display = "none";
	// document.getElementById("gmap").style.display = "block"
	loop();
}

async function draw() {
    
	try {
		while (true) {
			const { value, done } = await reader.read();

			if (done) {
				// Allow the serial port to be closed later.
				reader.releeasLock();
				break;
			}
			if (value) {
				// console.log(value);
				
                if (value[0] == "Ü"){
                    removedStr = value.substr(1 , value.length);
                    // console.log(removedStr)
                    parsedData = JSON.parse(removedStr);
					
					let {
						name, gender, ICnumber, 
						WhatHappened, Description,
						longitude, latitude,
					} = parsedData;
					
					console.log(`Name: ${name.replaceAll("+"," ")}\nGender: ${gender.replaceAll("+"," ")}\nIC Number: ${ICnumber.replaceAll("+"," ")}\nIncident: ${WhatHappened.replaceAll("+"," ")}\nDescription: ${Description.replaceAll("+"," ")}\nlong: ${longitude}\nlat: ${latitude}`)  

					let position = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
          let label = `${markers.length+1}`;
					let content =     
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    `<h1 id="firstHeading" class="firstHeading">${WhatHappened.replaceAll("+"," ")}</h1>`+
    '<div id="bodyContent">' +
    `<p>Name: ${name.replaceAll("+"," ")}</p>` +
    `<p>Gender: ${gender.replaceAll("+"," ")}</p>` +
    `<p>IC Number: ${ICnumber.replaceAll("+"," ")}</p>` +
    `<p>Incident: ${WhatHappened.replaceAll("+"," ")}</p>` +
    `<p>Description: ${Description.replaceAll("+"," ")}</p>`+
    "</div>" +
    "</div>";

					let marker = new google.maps.Marker({
						position, label
					});
					marker.addListener("click", () => {
						infoWindow.setContent(content);
						infoWindow.open(googlemap, marker);
					})
          marker.setVisible(true);
          marker.setMap(googlemap)

          // initMap()

					markers.push(marker);

					cluster = new markerClusterer.MarkerClusterer({ markers, googlemap });
					
					// let d = makeNewDiv(
					// 	`Name: ${name}`, `Gender: ${gender}`, `IC Number: ${ICnumber}`,
					// 	`What Happened: ${WhatHappened}`, `Description: ${Description}`,`___________________________`
					// );

					// if (Object.keys(dataStack[counter]).length != 0) {
					// 	// current counter has stuff in it; remove div from DOM
					// 	divStack[counter].remove();
					// }
					
					// document.getElementById("monitor").appendChild(d);
					// dataStack[counter] = parsedData;
					// divStack[counter] = d;
					// counter = (counter+1)%maxData;
				}
			}
		}
	} catch (e) { console.error(e) }
}


// function makeNewDiv() {
// 	let d = document.createElement("div");
// 	for (let i=0; i<arguments.length; i++) {
// 		let n = document.createElement("div");
// 		n.innerHTML = arguments[i];
// 		d.appendChild(n);
// 	}
// 	return d;
// }


function initMap() {
	
	googlemap = new google.maps.Map(document.getElementById("gmap"), {
	  zoom: 3,
	  center: { lat: -28.024, lng: 140.887 },
	});  
	
	infoWindow = new google.maps.InfoWindow({
	  content: "",
	  disableAutoPan: true,
	});

}
	
	
window.initMap = initMap;



// function initMap() {
// 	const locations = [
// 		{ lat: x, lng: y },
// 	  ];	
//     const googlemap = new google.maps.Map(document.getElementById("map"), {
//       zoom: 3,
//       center: { lat: -28.024, lng: 140.887 },
//     });
//     const infoWindow = new google.maps.InfoWindow({
//       content: "",
//       disableAutoPan: true,
//     });
//     // Create an array of alphabetical characters used to label the markers.
//     const labels = name;
//     let data = `Name: ${name}\nGender: ${gender}\nIC Number: ${ICnumber}\nIncident: ${WhatHappened}\nDescription: ${Description}`
//     // Add some markers to the map.
//     const markers = locations.map((position, i) => {
//       const label = labels[i % labels.length];
//       const marker = new google.maps.Marker({
//         position,
//         label,
//       });
  
//       // markers can only be keyboard focusable when they have click listeners
//       // open info window when marker is clicked
//       marker.addListener("click", () => {
//         infoWindow.setContent(data);
//         infoWindow.open(map, marker);
//       });
//       return marker;
//     });
  
//     // Add a marker clusterer to manage the markers.
  
//     const markerCluster = new markerClusterer.MarkerClusterer({ map, markers });
//   }
  
  
//   window.initMap = initMap;
