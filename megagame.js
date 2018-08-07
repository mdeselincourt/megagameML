			
			$(document).ready(function(){
				
				main();
				
				// getAndRenderJson();
			});
			
			function main() {
				
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
