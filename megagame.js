
const SETTINGS = ["Contemporary sci-fi", "1940s", "1980s", "Hard sci-fi", "High sci-fi", "Age of Piracy"];
			
			
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
					
					mg.setting = pick(SETTINGS);
					
				}
				
			function generateTeams(mg) {
				
				var coreFactions = d(3) + 1;
				
				mg.coreFactions = coreFactions;
				
			}
			
			// DATA TO DESCRIPTION FUNCTIONS
			
			function describeMegagame(mg) {
				
				var description = "";
				
				description += describeSetting(mg);
				
				description += "Core factions = " + mg.coreFactions;
				
				return description;
				
			}
			
			function describeSetting(mg) {
				return "The game's setting is " + mg.setting + ".";
			}
				
				
				// UTILITY FUNCTIONS
				
				function pick(a) {
					return a[Math.floor(Math.random() * a.length)];
				}
				
				function d(n) {
					return Math.floor(Math.random() * n) + 1;
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
