
const fullstop = ". ";

// Priorities order

// How many teams of each type
// Team activities/structure (UN? etc.)
// More name formats (everybody dies?)
// Draw?? ideology spaces
//
// Simple resources
//
// Economy balance
//

const NUMBERS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

const FUTURES = ["the Imminent Future", "the Future", "the Far Future"];
const PASTS = ["Ancient", "Medieval", "Early Modern", "Industrial Revolution", "1910s", "1930s-1940s", "Cold War", "Present Day"]; 

const NAME_START_IMPERATIVES = ["Watch the", "Rule the", "Fight the"];
const NAME_START_ADJECTIVES = ["A Very British", "Infinite", "Urban", "Dire", "Mirror"];
const NAME_START_NOUNS = ["Blood and", "Hands of the"];
const NAME_START_NOUN_PREPOSITIONS = ["of the", "and"];
const NAME_STARTS = [NAME_START_ADJECTIVES, NAME_START_IMPERATIVES];

const NAME_END_NOUNS = ["Skies", "Nightmare", "Horizons", "Civil War", "Coup", "Thunder", "Straits", "Many", "Shades"];

// Excluded from generation since these already exist
const FORBIDDEN_NAMES = ["Watch the Skies", "Urban Nightmare", "A Very British Coup", "A Very British Civil War", "Infinite Horizons", "Blood and Thunder", "Dire Straits", "Hands of the Many", "Mirror Shades"];

const CORE_TEAMTYPES = [
		{"name" : "Legislative"},
		{"name" : "Political Opposition"},
		{"name" : "Sovereign Nation"},
		{"name" : "Belligerent"},
		{"name" : "Manipulator"},
		{"name" : "Corporation"},
		{"name" : "Emergency Service"},
		{"name" : "Criminal Band"},
		{"name" : "House"}
	];
	
const CORE_TEAMTYPE_DESCRIPTIONS = {
	"Legislative": "to enact and implement legislation. ",
	"Political Opposition": "to resist or replace those currently in power by essentially non-violent means. ",
	"Sovereign Nation": "to pursue their own leaders' agendas. ",
	"Belligerent": "to win victory in armed conflict. ",
	"Manipulator": "to influence the more conventional teams indirectly, by deception, subversion, infiltration or, as a last resort, force. ",
	"Corporation": "to profit and to grow. ",
	"Emergency Service": "to serve their civic function without undue cost in money or lives. ",
	"Criminal Band": "to do as they wish in spite of the law. ",
	"House": "to protect and further the ambitions of their family, noble house, kinsmen, clan or vassals. "
};
	
const EXTRA_TEAMTYPES = [
	{"name" : "Powerful Backer", "goal" : "to use their great wealth and power to pull strings from behind the scenes, without intervening directly. "},
	{"name" : "Press", "goal" : "to spread the news, but from their own ideological perspective. "}
]

/* THERE are two ways to model ideologies. Independent-axes or Interdependent-vertices.

	You can have infinite independent axes. They are clearest displayed as independent trackers, except if there are 2 you 
could choose a plane.
	
	You can have infinite interdependent vertices. You could have this in any (hyper)space but to keep it comprehensible  you 
will want to limit yourself to a plane.
	
	With only one space possible (2D) the degree of interdependence scales directly with the number of vertices.
	
	The lowest interdependence example was the ideology triangles in AVBC. This interdependence was low enough that 
quantisation into hexes "rounded out" some interdependencies.
	
	If the layout of the polygon permits it a vertex MAY have an opposite; but if not the only definition of an opposite to a 
vertex will be the concept of "away from it"
	
	// Sane limits are two axes or maybe let's say theoretically SIX vertices (though six evenly distributed concepts will be 
rare I think!)
	
*/
	
// Based on Coup
const MAX_GAME_IDEOLOGIES_NUMBER = 6;

	// Not sure what these are for...
	const IDEOLOGIES = [
		"Pacifist", "Militarist", "Religious", "Secular", "Socialist", "Fascist", "Liberal", "Traditional", "Radical", 
			"Statist", "Keynesian", "Neoliberal", "Environmentalist", "Industrialist", "Democratic", "Authoritarian",
			"Xenophobic", "Multicultural", "Protectionist", "Communist", "Monarchist"
	];

	// Raw material - ideological edges that can be included in the game
	const IDEOLOGICAL_EDGES = 
		
		[
			// Pacifist-Militarist
			["Pacifist", "Militarist"],
			["Pacifist", "Fascist"],
			
			["Militarist", "Environmentalist"],
			["Militarist", "Monarchist"],
			
			// Religious
			["Religious", "Secular"],
			["Religious", "Radical"],
			["Religious", "Democratic"],
			["Religious", "Authoritarian"],
			["Religious", "Communist"],
			["Religious", "Monarchist"],
			
			//Secular
			
			//Socialist
			["Socialist", "Fascist"],
			["Socialist", "Industrialist"],
			["Socialist", "Authoritarian"],
			["Socialist", "Communist"],
			["Socialist", "Monarchist"],
			
			// Fascist
			["Fascist", "Liberal"],
			["Fascist", "Democratic"],
			["Fascist", "Multicultural"],
			["Fascist", "Communist"],
			["Fascist", "Monarchist"],
			
			// Authority
			["Democratic", "Imperial"],
			
			// Corporate
			["Industrial", "Scientific"],
			["Scientific", "Financial"],
			["Financial", "Industrial"]
			
			// And there can be many more...
		];
	
const MECHANICALNESSES = ["Political", "Political-Operational", "Operational"];

const MOODS = ["Comedic", "Light-hearted", "Authentic", "Sombre", "Dark"];

const RESOURCE_TYPES = ["Currency", "Commodities", "Knowledge", "Influence"];

const RESOURCE_FORM_FACTORS = ["Paper Slips", "Discs", "Cards", "Cubes"];

const MAX_GAME_RESOURCE_QUANTITY_TOTAL = 100;

const MAX_GAME_RESOURCE_QUANTITY_GROWTH = 10;

const FORA = ["Leadership", "Diplomatic", "Market", "Operational", "Scientific", "Political"]; 

/*
	Draw when document is ready	
*/
			
			$(document).ready(function(){
			
				main();
				
			});
						
			// Generate the megagame into a JavaScript Object, then describe that to HTML (and just print it out for reference)
			function main() {
				
				var megagame = {};
			
				generateName(megagame);

				generateSetting(megagame);
				
				generateTeams(megagame);
				
				generateIdeologySpaces(megagame);
				
				generateMapMechanics(megagame);
				
				generateMechanicalness(megagame);
				
				generateMood(megagame);
				
				generateEconomy(megagame);
				
				$("#mainContent").html(describeMegagame(megagame));
				
				$("#mainTitle h2").html(megagame.name);
				
				drawCharts();
			}
			
			// DATA GENERATION FUNCTIONS
			
			function generateSetting(mg) {
				
					mg.isFuture = coin();
					
					if (!mg.isFuture) { mg.isFiction = coin(); } else { mg.isFiction = true; }
					
					if (mg.isFuture) { mg.era = pick(FUTURES); } else { mg.era = pick(PASTS); }
					
				}
				
			function generateTeams(mg) {
				
				mg.teamTypes = d(3) + 1;
				
				console.log("NOW PICKING " + mg.teamTypes + " team types from CORE_TEAMTYPES");
				
				mg.teamTypes = pickFrom(CORE_TEAMTYPES, mg.teamTypes);
				
				// Iterate through each selected teamType
				for (teamType of mg.teamTypes)
				{
					// randomise -1 0 or 1
					teamType.cooperationLevel = d(3) - 2;
					
					teamType.count = d(5) + 1;
				}
								
			}
			
			function generateName(mg) {
				
				var name;
				
				do {
					
					var start = pick(pick(NAME_STARTS));
					var end = pick(NAME_END_NOUNS);
				
					name = start + " " + end;
				} while (FORBIDDEN_NAMES.includes(name))
				
				mg.name = name;
				
			}
			
			// This complex function works by choosing a "bag" of possible ideology edges
			// i.e. (pairs of opposing concepts) then assembling them into 'spaces' which are either
			// 2D spaces with two independent axes, or 2D polygons where each vertex is an "attractor"
			//
			// Passed an object (mg) it adds an array called ideologySpaces to it.
			//
			//  The algorithm is:
			//   Pick the bag of edges to be used. For debugging this might be all known but for a game might be 1-6
			//    For each edge left in the bag
			//		decide what to do with it
			//   		It could just be a 1D "tracker" in which case just put it in a space and push the space
			//			Or it could be a 2D grid
			// 
			//			Or it could be a polygon
			//			
			//
			//
			//
			function generateIdeologySpaces(mg) {
			
				var ideologySpaces = [];
					
				var bagOfEdges = pickFrom(IDEOLOGICAL_EDGES, d(MAX_GAME_IDEOLOGIES_NUMBER));
			
				console.log("Assembling spaces from a bag of " + bagOfEdges.length + " edges");
			
				// Go through the bag one by one, attempting to 
				while (bagOfEdges.length > 0) {
					
					console.log(" Next edge... edges remaining in the bag are now: " + bagOfEdges.length);
				
					if (coin()) 
					{
						ideologySpaces.push(buildGridSpace(bagOfEdges));
					}
					else
					{
						ideologySpaces.push(buildPolygonSpace(bagOfEdges));
					}
						
					console.log("Finished assembling space");
					
				} // End of while bag
				
				console.log("Finished bag of edges"); // So there's no more spaces to be built and we are done.
				
				mg.ideologySpaces = ideologySpaces;
				
			}// end of GenerateIdeologySpaces
			
			// Trivial for tidiness - creates a space of a single edge
			function buildTrackerSpace(edge) {
				
				var space = { "geometry": "tracker", "edges": [edge],  };
				space.score = coin();
				
				return space;
			}
			
			// Attempts to build a 2D space of 2 mutually exclusive edges. If it fails to find a second edge it will fall back to a tracker.
			function buildGridSpace(bagOfEdges) {
				console.log("buildGridSpace()");
				
				var newSpace = {"geometry" : "grid"};
				
				// Pick an Xaxis
				var xAxis = popRandomFrom(bagOfEdges);
				var yAxis = null;
				
				// Check through the possible Y axes for an INDEPENDENT edge
				for (candidateY of bagOfEdges)
				{								
					console.log("   Considering " + candidateY + " to oppose " + xAxis);
					
					if(!xAxis.includes(candidateY[0]) && !xAxis.includes(candidateY[1])) 
					{
						console.log("  Suitable Y axis found!");
						yAxis = candidateY;
						break; // Stop looking
					}
					else
					{
						console.log("   edge not suitable. Next.");
					}
				}
				// Handle result of search

				
				if (yAxis == null) 
				{
					console.log("  No independent Y axis found in remaining bag. Making this a tracker instead.");
					// We couldn't find an independent Y axis
					
					newSpace = {"geometry": "tracker", "edges" : [xAxis]}
				}
				else
				{
					// Put the chosen edges into the space
					newSpace["edges"] = [xAxis,yAxis];
					
					bagOfEdges.splice(bagOfEdges.indexOf(yAxis),1); // This erases the Y axis from the bag too so it also doesn't get used again later
				}
				
				newSpace.score = coin();
				return newSpace;
			}
			
			function buildPolygonSpace(bagOfEdges) {
				console.log("buildPolygonSpace()");
				
				// Try to assemble a polygon perimeter.
				
				// Seeding it with a first edge.
				var newSpace = { 
					"geometry" : "polygon",
					"edges" : [] 
				};
				
				newSpace["edges"].push(popRandomFrom(bagOfEdges));

				// Loop up to 6 times seeking new edges
				
				for (freeEdgeIndex = 0; freeEdgeIndex < 6; freeEdgeIndex++) {
				
					console.log("  Seeking edge to add to polygon after [" + freeEdgeIndex + "] of up to [5]");
				
					var freeEdge = newSpace["edges"][freeEdgeIndex]; // Get a reference to the free edge

					console.log("   free edge is now " + freeEdge);

					var freeNode = freeEdge[1]; // Get a reference to the free edge's free node
					
					console.log("  ([" + freeEdgeIndex + "] of " + newSpace["edges"].length + ")");
			
					// Keep track as we search of whether we've found what we want...
					var nextEdgeFound = false;
					
					console.log("  Starting to iterate through bag of " + bagOfEdges.length + " remaining edges"); 
					
					// Search each remainder in the bag for a suitable edge to add
					for (candidateNext of bagOfEdges) {
						
						console.log("  Considering " + freeEdge + " <--?--< " + candidateNext + " from a bag of " + bagOfEdges.length);
						
						if(candidateNext.includes(freeNode)) {
						
							// We can add this edge; but which way around?
							console.log("   Found a suitable edge");
							
							nextEdgeFound = true;
							
							if (freeNode == candidateNext[0])
							{
								console.log("    " + freeEdge + " <--- " + candidateNext);
								// Attach this the right way around
								newSpace.edges[freeEdgeIndex+1] = candidateNext;
							}
							else
							{
								console.log("    " + freeEdge + " <--- " + candidateNext[1] + "'" + candidateNext[0]);
								newSpace.edges[freeEdgeIndex+1] = [candidateNext[1],candidateNext[0]];
							}

							// Remove chosen edge from bag
							bagOfEdges.splice(bagOfEdges.indexOf(candidateNext),1);
							
							// We can stop searching for a child!
							break; 
							
						}
						else
						{
							console.log("   Cannot add this edge"); // Because neither of its nodes match the free node.
						}
						
					} // End of search for a successor edge
				
					console.log("Finished going through bag in attempt to add edge " + freeEdgeIndex + ", nextEdgeFound = " + nextEdgeFound);
					
					// We are done going through the bag, did we find anything?
					if (nextEdgeFound == false) { break; }// Do not attempt to find another edge
					
				} // End of loop attempting to add another edge
				
				console.log("Finished space assembly, setting final properties and pushing");

				// Complete configuring the space
				
				// Randomise whether this is a scoring space or just a political one
				newSpace.score = coin();
					
				if (newSpace.edges.length == 1) { newSpace.geometry = "tracker"; }
					
				return newSpace;
			}
			
			
			
			function generateMapMechanics(mg) {
				
				mg.hasMap = coin();
				
				mg.openMap = coin();
				
			}
			
			function generateMechanicalness(mg) {
				
				mg.mechanicalness = MECHANICALNESSES[d(MECHANICALNESSES.length) - 1]
				
			}
				
			function generateMood(mg) {
				
				mg.mood = MOODS[d(MOODS.length) - 1]
				
				if (mg.mood == "Authentic" && mg.isFuture == true) { mg.mood = "realist"; }
				
			}
			
			function generateEconomy(mg) {
				
				var gameResources = [];
				
				var gameResourceTypes = pickFrom(RESOURCE_TYPES, d(RESOURCE_TYPES.length));
				//var gameResourceForms = pickFrom(RESOURCE_FORM_FACTORS, d(RESOURCE_FORM_FACTORS.length));
				
				for (i in gameResourceTypes)
				{
					gameResources.push(
						{
							"type": gameResourceTypes[i],
							"form": pick(RESOURCE_FORM_FACTORS) 
							
							// "total": d(MAX_GAME_RESOURCE_QUANTITY_TOTAL),
							// "growth": d(MAX_GAME_RESOURCE_QUANTITY_GROWTH)
						
						}
					);
						
				}
				
				mg.resources = gameResources;
			}
				
			///////////////////////////////////
			// DATA TO DESCRIPTION FUNCTIONS
			
			function describeMegagame(mg) {
				
				console.log(mg);
				
				var description = "";
				
				description += describeSetting(mg);
				
				// Play Emphasis & Mood
				
				description += "<p>The tone of the material is " + mg.mood.toLowerCase() + ", and the emphasis of play is " + mg.mechanicalness.toLowerCase() + ".</p>";
					
					
				// Map description
					
				var mapDesc = "";
					
				if (mg.hasMap) 
				{
					mapDesc = "The game map is ";
					
					if (mg.openMap) {
						mapDesc += "accessible";				
					}
					else
					{
						mapDesc += "inaccessible";
					}
				
				mapDesc = mapDesc + " to the players.";
				}
				else
				{
					mapDesc = "The game has central state trackers, but no map.";
				}
				
				description += "<p>" + mapDesc + "</p>";
				
				// console.log("There are " + mg.teamTypes.length + " types of team.");
				
				// Describe team types (and the teams within them)
				for (tt = 0; tt < mg.teamTypes.length; tt++)
				{
					
					var ttDesc = "";
					
					teamType = mg.teamTypes[tt];
					
					var n = teamType.count;
					var countWord = NUMBERS[n];
					
					// Name
					ttDesc += "<strong>" + countWord + " " + teamType.name + " team" + s(n) + ":</strong> ";
					
					// Goal
					ttDesc += "These teams want " + CORE_TEAMTYPE_DESCRIPTIONS[teamType.name];
					
					// Cooperation
					ttDesc += "They are ";

					ttDesc += ["rivals, though with some common interests. ", "wary of one another, but willing to strike deals. ", "nominally allies, though with competing agendas. "][teamType.cooperationLevel + 
1];		
					
					// Markup
					ttDesc = "<p>" + ttDesc + "</p>";
					
					description += ttDesc;
					
				}
				
				description += "<h2>MegagameML:</h2><p><pre>" + syntaxHighlight(mg) + "</pre></p>";
				
				return description;
				
			}
			
			function describeSetting(mg) {
				var settingDescription = "The era is " 
				
				settingDescription += mg.era;
				
			if(mg.isFiction && !mg.isFuture) { settingDescription += ", but in a world different to our own."; } else { settingDescription += "."; }
				
				settingDescription = "<p>" + settingDescription + "</p>";
				
				return settingDescription;
			}
				
			function drawCharts(mg) {
				
				//for (space in mg.ideologySpaces) 
				//{					
					
					// Add canvases to the page
					var newCanvas = document.createElement('canvas1');
					newCanvas.id = 'canvas1';

					document.getElementById('mainContent').appendChild(newCanvas); // adds the canvas to #someBox
					
					// Draw onto canvas using Charts.js
					var data = {
						labels: ["Scientific", "Industrial", "Financial"],
					};
					
					var ctx = document.getElementById("canvas1"); // ctx is the suggested variable name for the canvas reference
					
					var options = {
						responsive: false, // I don't want the canvas to be resized.
						scale: {
							display: true,
							ticks: {
								display: false,
							  // But if you DID show them:
								beginAtZero: true, // Zero at centre
								max: 1, // Value of outermost edge
										maxTicksLimit: 1, // Number of subdivisions/scale lines
							  stepSize: 1 
							},
							pointLabels: 
							{}
						}
					};
					
					var myRadarChart = new Chart(ctx, {
						type: 'radar',
						data: data,
						options: options
					});
				//}
			}
				
				// UTILITY FUNCTIONS
				
				function pick(a) {
					return a[Math.floor(Math.random() * a.length)];
				}
				
				
				function pickAndTransfer(aFrom, aTo, toPick) {
					
					var moveIndex = d(aFrom.length - 1);
					
					if(toPick > aFrom.length) {console.log(" Not enough entries in aFrom"); return null;}
					
					for (leftToPick = toPick; leftToPick > 0; leftToPick--) {
						var choice = d(aFrom.length) - 1;
					}
					
					aTo.push(aFrom[choice]);
					aFrom.splice(choice,1);
					
				}
				

				function pickFrom(a, toPick) {
					
					if (toPick > a.length) {console.log(" Not enough entries in array"); return null;}
					
					var drainingArray = a;
					var fillingArray = [];

					for (leftToPick = toPick; leftToPick > 0; leftToPick-- ) {
						//console.log(" " + leftToPick + " left to pick");
						
						var choice = d(drainingArray.length) - 1;
						
						// console.log(" pickFrom() choice is " + choice);
					
						fillingArray.push(drainingArray[choice]);

						drainingArray.splice(choice,1);
					}					
					
					return fillingArray;
				}
				
				function popRandomFrom(a) {
					
					if (popRandomFrom.length < 1) { console.severe("Can't pop from empty array"); return null;} 
					
					console.log( "Attempting to pop random from " + a);
					
					var choice = d(a.length) - 1;
					console.log(" Chosen [" + choice + "] of " + a.length + " for random popping");
					
					var popped = a[choice];
					a.splice(choice,1);
					console.log(" randomly popping " + popped);
					return popped;
				}
				
				function d(n) {
					return Math.floor(Math.random() * n) + 1;
				}
				
				function coin() {
					if (Math.round(Math.random()) == 0) {return false;} else {return true;}
				}
				
				
			function displayData(dataString) {

				var dataObject = JSON.parse(dataString); // turn the retrieved JSON into an object

				$("#output").html(JSON.stringify(dataObject.rounds[1]));
				
			}
			
			function displayObject(obj) {
				$("#output").html(Object.stringify(obj));
				
			}
			
			function s(n)
			{
				if (n == 1) { return ""; } else { return "s"; }
			}
			
			// From https://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
			function syntaxHighlight(json) {
			if (typeof json != 'string') {
				 json = JSON.stringify(json, undefined, 2);
			}
			json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
				var cls = 'number';
				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						cls = 'key';
					} else {
						cls = 'string';
					}
				} else if (/true|false/.test(match)) {
					cls = 'boolean';
				} else if (/null/.test(match)) {
					cls = 'null';
				}
				return '<span class="' + cls + '">' + match + '</span>';
			});
}
