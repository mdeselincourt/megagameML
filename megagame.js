
const x = ". ";

const FUTURES = ["the Imminent Future", "the Future", "the Far Future"];
const PASTS = ["Ancient", "Medieval", "Early Modern", "Industrial Revolution", "1910s", "1930s-1940s", "Cold War", "Present Day"]; 

const NAME_START_IMPERATIVES = ["Watch the", "Rule the", "Fight the"];
const NAME_START_ADJECTIVES = ["A Very British", "Infinite", "Urban", "Dire"];
const NAME_START_NOUNS = ["Blood and", "Hands of the"];
const NAME_START_NOUN_PREPOSITIONS = ["of the", "and"];
const NAME_STARTS = [NAME_START_ADJECTIVES, NAME_START_IMPERATIVES];

const NAME_END_NOUNS = ["Skies", "Nightmare", "Horizons", "Civil War", "Coup", "Thunder", "Straits", "Many"];

const CORE_TEAMTYPES = [
		{"name" : "Legislative", "goal" : "to enact and implement legislation. "},
		{"name" : "Political Opposition", "goal" : "to resist or replace those currently in power by essentially non-violent means. "},
		{"name" : "Sovereign Nation", "goal" : "to pursue their own leaders' agendas. "},
		{"name" : "Belligerent", "goal" : "to win victory in armed conflict. "},
		{"name" : "Manipulator", "goal" : "to influence their targets indirectly, by deception, subversion, infiltration or, as a last resort, force. "},
		{"name" : "Corporation", "goal" : "to profit and to grow. "},
		{"name" : "Emergency Service", "goal" : "to serve their civic function without undue cost in money or lives. "},
		{"name" : "Criminal Band", "goal" : "to serve their leaders' interests in spite of the law. "}
	];
	
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
const IDEOLOGIES_NUMBER = 10;
console.warn("Using excessively high ideology number for debugging");

	const IDEOLOGIES = [
		"Pacifist", "Militarist", "Religious", "Secular", "Socialist", "Fascist", "Liberal", "Traditional", "Radical", 
			"Statist", "Keynesian", "Neoliberal", "Environmentalist", "Industrialist", "Democratic", "Authoritarian",
			"Xenophobic", "Multicultural", "Protectionist", "Communist", "Monarchist"
	];

	const IDEOLOGICAL_EDGES = 
		
		[
			// Pacifist
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
			
		// TBC
		];
	
const FORBIDDEN_NAMES = ["Watch the Skies", "Urban Nightmare", "A Very British Coup", "A Very British Civil War", "Infinite Horizons", "Blood and Thunder", "Dire Straits", "Hands of the Many"];

const MECHANICALNESSES = ["Political", "Political-Operational", "Operational"];

const MOODS = ["Comedy", "Light-hearted", "Authentic", "Sombre", "Dark"];

/*
	Faction flavours:	
*/
			
			$(document).ready(function(){
			
				main();
				
			});
						
			function main() {
				
				var megagame = {};
			
				generateSetting(megagame);
				
				generateTeams(megagame);
				
				generateName(megagame);

				generateIdeologySpaces(megagame);
				
				generateMapMechanics(megagame);
				
				generateMechanicalness(megagame);
				
				generateMood(megagame);
				
				$("#mainContent").html(describeMegagame(megagame));
				
				$("#mainTitle h2").html(megagame.name);
			}
			
			// DATA GENERATION FUNCTIONS
			
			function generateSetting(mg) {
				
					mg.isFuture = coin();
					
					if (!mg.isFuture) { mg.isFiction = coin(); } else { mg.isFiction = false; }
					
					if (mg.isFuture) { mg.era = pick(FUTURES); } else { mg.era = pick(PASTS); }
					
				}
				
			function generateTeams(mg) {
				
				mg.teamTypes = d(4);
				
				console.log("NOW PICKING " + mg.teamTypes + " team types from CORE_TEAMTYPES");
				
				mg.teamTypes = pickFrom(CORE_TEAMTYPES, mg.teamTypes);
				
				// Iterate through each selected teamType
				for (refOrCopy of mg.teamTypes)
				{
					refOrCopy.cooperationLevel = d(3) - 2;
					// console.log(refOrCopy.name + " are coop-level " + refOrCopy.cooperationLevel);
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
			function generateIdeologySpaces(mg) {
			
				var ideologySpaces = [];
					
				//var bagOfEdges = pickFrom(IDEOLOGICAL_EDGES, d(MAX_IDEOLOGY_EDGES_NUMBER));
				// var bagOfEdges = pickFrom(IDEOLOGICAL_EDGES, d(MAX_IDEOLOGY_EDGES_NUMBER));
			
				// console.warn("Always picking big bag of edges for debugging");
				var bagOfEdges = IDEOLOGICAL_EDGES;
			
			
				console.log("Assembling spaces from " + bagOfEdges.length + " edges");
			
				// Go through the bag one by one
				while (bagOfEdges.length > 0) {
					
					console.log(" Next edge... edges remaining in the bag are now: " + bagOfEdges.length);
				
					var newSpace = [];
				
					// 50% chance: build a new tracker
					if (false) 
					// if (coin());
					{
						console.log(" Building Tracker");
						var edge = popRandomFrom(bagOfEdges);

						var space = { "edges": [edge] };
						space.score = coin();
						
						ideologySpaces.push(space);
					}
					else
					{
						// 50% (25%) try to build a grid
						if (coin()) 
						{
							console.log(" Building axes... ");
						
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
									console.log("   no... next...");
								}
							}
							// Handle result of search
							
							if (yAxis == null) 
							{
								console.log("  No independent Y axis found in remaining bag. Making tracker instead.");
								// We couldn't find an independent Y axis
								
								var n = {"edges" : [xAxis]}
								n.score = coin();
								
								ideologySpaces.push(n);
							}
							else
							{
								console.log("  Assembling space");
								// Assemble the space
								var n = {};
								n["edges"] = [xAxis,yAxis];
								n["score"] = coin();
								
								ideologySpaces.push(n);
																
								bagOfEdges.splice(bagOfEdges.indexOf(yAxis),1);
							}
						}
						else
						{
							// Try to assemble a polygon perimeter.
							// Seeding it with a first edge.
							console.log("  Attempting to build a new polygon space");
							var newSpace = { "edges" : [] };
							newSpace["edges"].push(popRandomFrom(bagOfEdges));

							// Seeking more edges
							
							for (freeEdgeIndex = 0; freeEdgeIndex < 6; freeEdgeIndex++) {
							
								console.log("  Seeking edge to add to polygon after " + freeEdgeIndex);
							

							
								var freeEdge = newSpace["edges"][freeEdgeIndex];

								console.log("   free edge is now " + freeEdge);

								var freeNode = freeEdge[1];
								
								console.log("  ([" + freeEdgeIndex + " of " + newSpace["edges"].length + "])");
						
								// Keep track as we search of whether we've found what we want...
								var nextEdgeFound = false;
								
								console.log("  Starting to iterate through bag of " + bagOfEdges.length + " edges"); 
								
								// Search each remainder in the bag for a suitable edge
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
										console.log("   Cannot add this edge");
										// This edge cannot be added.
									}
									
								} // End of search for a successor edge
							
								console.log("  No longer looking for edges to connect");
							
								// Time to end the polygon
								break;
								
								
							// Complete configuring the space
							
							// Randomise whether this is a scoring space or just a political one
							newSpace.score = coin();
								
							// Store the new space
							ideologySpaces.push(newSpace);
							
							} // End of polygon assembly option.
							
							console.log("Finished polygon assembly");
							
								
						} // End of if-grid-else-polygon
						
						console.log("Finished multi-edge space generation");
						
					}// End of if-tracker-else-space
					
					console.log("Finished assembling space");
					
					// OK that's the entire bag used up
					
				}// End of while bag
				
				console.log("Finished bag of edges");
				
				mg.ideologySpaces = ideologySpaces;
				
			}// end of GenerateIdeologySpaces
			
			function generateMapMechanics(mg) {
				
				mg.openMap = coin();
				
			}
			
			function generateMechanicalness(mg) {
				
				mg.mechanicalness = MECHANICALNESSES[d(MECHANICALNESSES.length) - 1]
				
			}
				
			function generateMood(mg) {
				
				mg.mood = MOODS[d(MOODS.length) - 1]
				
			}
				
			///////////////////////////////////
			// DATA TO DESCRIPTION FUNCTIONS
			
			function describeMegagame(mg) {
				
				console.log(mg);
				
				var description = "";
				
				description += describeSetting(mg);
				
				// Play Emphasis & Mood
				
				description += "<p>The emphasis of play is " + mg.mechanicalness.toLowerCase() + 
					", and the mood of the material is " + mg.mood.toLowerCase() + ". ";
					
				// Map description
					
				var mapDesc = "The game map is ";
				
				if (mg.openMap) {
					mapDesc += "accessible";				
				}
				else
				{
					mapDesc += "inaccessible";
				}
				
				mapDesc = "<p>" + mapDesc + " to the players.</p>";
				
				description += mapDesc;
				
				// console.log("There are " + mg.teamTypes.length + " types of team.");
				
				for (tt = 0; tt < mg.teamTypes.length; tt++)
				{
					
					var ttDesc = "";
					
					// Name
					ttDesc += "<strong>" + mg.teamTypes[tt].name + " teams:</strong> ";
					
					// Goal
					ttDesc += "These teams want " + mg.teamTypes[tt].goal;
					
					// Cooperation
					ttDesc += "They are ";

					ttDesc += ["rivals, though with some common interests. ", "wary of one another, but willing to strike deals. ", "nominally allies, though with competing agendas. "][mg.teamTypes[tt].cooperationLevel + 
1];		
					
					// Markup
					ttDesc = "<p>" + ttDesc + "</p>";
					
					description += ttDesc;
					
				}
				
				return description;
				
			}
			
			function describeSetting(mg) {
				var settingDescription = "The era is " 
				
				if(mg.isFiction) { settingDescription += "a parallel-world "; }
				
				settingDescription += mg.era + x;
				
				settingDescription = "<p>" + settingDescription + "</p>";
				
				return settingDescription;
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
