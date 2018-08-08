
const x = ". ";

const FUTURES = ["Imminent Future", "2100s", "Far Future"];
const PASTS = ["Prehistoric", "Ancient", "Medieval", "Early Modern", "Industrial Revolution", "1910s", "1930s-1940s", "Cold War", "Present Day"]; 



const ALL_FACTION_ARCHETYPES = ["Government", "Legislative", "Establishment Opposition", "Radical Opposition", "Outsiders", "Leftists", "Rightists", "Monarchy", "Religion", "Nation", "Corporation"];

/*

	Faction flavours:
		

*/

/*
	Faction descriptions...
	
		Coup:
			Government
			Establishment-Opposition
		WTS:
			Human Nations
			Alien Factions
		Civil War:
			Leftist Belligerent
			Rightist Belligerent 
			Monarchy Belligerent
			Religion Belligerent
		Horizons:
			Government
			Nations
			Corporations

*/
			
			$(document).ready(function(){
			
				main();
				
				// getAndRenderJson();
			});
						
			function main() {
				
				var megagame = {};
			
				generateSetting(megagame);
				
				generateTeams(megagame);
				
				$("#output").html(describeMegagame(megagame));
			}
			
			// DATA GENERATION FUNCTIONS
			
			function generateSetting(mg) {
				
					mg.isFuture = coin();
					
					if (!mg.isFuture) { mg.isFiction = coin(); } else { mg.isFiction = false; }
					
					if (mg.isFuture) { mg.era = pick(FUTURES); } else { mg.era = pick(PASTS); }
					
				}
				
			function generateTeams(mg) {
				
				mg.coreFactions = d(3) + 1;
				
				mg.hasHeterogenousCoreFactions = true;//coin();
				
				if (mg.hasHeterogenousCoreFactions) {
					mg.coreFactions = pickFrom(ALL_FACTION_ARCHETYPES, mg.coreFactions);
				}
				
			}
			
			// DATA TO DESCRIPTION FUNCTIONS
			
			function describeMegagame(mg) {
				
				var description = "";
				
				description += describeSetting(mg);
				
				description += "There are " + mg.coreFactions + " core factions."
				
				return description;
				
			}
			
			function describeSetting(mg) {
				return "The era is " + mg.era + x;
			}
				
				
				// UTILITY FUNCTIONS
				
				function pick(a) {
					return a[Math.floor(Math.random() * a.length)];
				}

				function pickFrom(a, n) {
					
					console.log("Picking " + n);
					
					if (n > a.length) {console.log("Not enough entries"); return null;}
					
					var workingArray = a;
					var newArray = [];

					for (i = n; i > 0; i-- ) {
						console.log("Cycle " + i);
						
						var choice = d(i+1) - 1;
						
						newArray.push(workingArray[choice]);
						console.log("Transferring " + workingArray[choice]);
						workingArray.splice(choice,1);
					}					
					
					return newArray;
				}
				
				function d(n) {
					return Math.floor(Math.random() * n) + 1;
				}
				
				function coin() {
					if (Math.round(Math.random()) == 0) {return false;} else {return true;}
				}
				
				
				
				/*
				
				var AVBC = {
					"currencies": [
						{
							"name": "influence",
							"type": "valueCards"
						}
					],
					"worldspaces": [
						{
							"name": "swingometer",
							"axes": [
								{
									"name": "Labour Swing",
									"inverse": "Conservative Swing",
									"length": 18									
								}
							]
						},
						{
							"name": "social",
							"axes": [
								{
									"name": "Liberal",
									"inverse": null,
									"length": 11
								},
								{
									"name": "Traditional"
									"inverse": null,
									"length": 11
								},
								{
									"name": "Radical"
									"inverse": null,
									"length": 11
								}							
							]
						},
						{
							"name": "Stakeholder Impact",
							"independentAxes": true,
							"axes": [
								{
									"name": "Party Members"
									"inverse": null,
									"length": 40
									
								},
								{
									"name": "Members of Parliament"
									"inverse": null,
									"length": 40
								},
								{
									"name": "Trade Unions",
									"inverse": null,
									"length": 40
								}
							]
						}
					],
					"acts": [
						
					]
				}
				
			}
			
			*/
			
			/*
			function getAndRenderJson() {
				
				
				$.get(
					"https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.json", 
					function(data, status){ displayData(data) }
					// Not using status...
				)
				
			};
			*/
			
			function displayData(dataString) {

				var dataObject = JSON.parse(dataString); // turn the retrieved JSON into an object

				$("#output").html(JSON.stringify(dataObject.rounds[1]));
				
			}
			
			function displayObject(obj) {
				$("#output").html(Object.stringify(obj));
				
			}
