
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
		{"name" : "Government", "goal" : "to enact and implement legislation. "},
		{"name" : "Political Opposition", "goal" : "to resist or replace those currently in power by essentially non-violent means. "},
		{"name" : "Sovereign Nation", "goal" : "to pursue their own leaders' agendas. "},
		{"name" : "Belligerent", "goal" : "to win victory in armed conflict. "},
		{"name" : "Manipulator", "goal" : "to influence their targets indirectly, by deception, subversion, infiltration or force. "},
		{"name" : "Corporation", "goal" : "to profit and to grow. "},
		{"name" : "Emergency Service", "goal" : "to serve their civic function without undue cost in money or lives. "},
		{"name" : "Criminal Band", "goal" : "to serve their leaders' interests in spite of the law. "}
	];
	
const EXTRA_TEAMTYPES = [
	{"name" : "Powerful Backer", "goal" : "to use their great wealth and power to pull strings from behind the scenes, without intervening directly. "},
	{"name" : "Press", "goal" : "to spread the news, but from their own ideological perspective. "}
]

// Based on Coup
const MAX_IDEOLOGY_EDGES_NUMBER = 6;

// const ALL_FORA = ["Map", "Marketplace", "Diplomatic Forum"];


	const IDEOLOGICAL_EDGES = [
		
		// Generic
		["Pacifist", "Militarist"],
		
		// WTS
		
		
		// Civil war
		["Religious", "Secular"], 
		["Socialist", "Fascist"],
		
		// Coup
		["Liberal", "Traditional"],
		["Liberal", "Radical"],
		["Radical", "Liberal"],
		
		// - economic
		["Statist", "Keynesian"],
		["Statist", "Neoliberal"],
		["Neoliberal", "Keynesian"],
		
		// (swingometer is a score not an ideology axis
		
		// horizons
		["Environmentalist", "Industrialist"],
	];
/*
		["Liberal", "Traditional"],
		["Liberal", "Conservative"],
		["Liberal", "Radical"],
		["Statist", "Keynesian"],
		["Statist", "Neoliberal"],
		["Neoliberal", "Keynesian"],
		["Religious", "Monarchical"],
		["Religious", "Atheist"],
		["Communist", "Fascist"],
		["Socialist", "Fascist"],
		["Socialist", "Conservative"],
		["Communist", "Conservative"],
		["Pacifist", "Militarist"],
		["Environmentalist", "Industrialist"],
		["Redistributionist", "Dedistributionist"],
		["Democratic", "Authoritarian"],
	]
	
	]

const ALL_IDEOLOGICAL_AXES =  [
	{"Redistributionist", "Adistributionist", "Dedistributionist"},
	{"Democratic", "Authoritarian"},
	{"Divine Right", "Secular Right"},
	{"Church Primacy"} 
	]
*/
	
const FORBIDDEN_NAMES = ["Watch the Skies", "Urban Nightmare", "A Very British Coup", "A Very British Civil War", "Infinite Horizons", "Blood and Thunder", "Dire Straits", "Hands of the Many"];

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
				
				console.log(mg.teamTypes + " team types");
				
				mg.teamTypes = pickFrom(CORE_TEAMTYPES, mg.teamTypes);
				
				// Iterate through each selected teamType
				for (refOrCopy of mg.teamTypes)
				{
					refOrCopy.cooperationLevel = d(3) - 2;
					console.log(refOrCopy.name + " are " + refOrCopy.cooperationLevel);
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
			
			function generateIdeologySpaces(mg) {
				
				var numIdeologyEdges = d(MAX_IDEOLOGY_EDGES_NUMBER);
				
				var ideologySpaces = [];
				
				var drainingIdeologyEdges = IDEOLOGICAL_EDGES;
				
				// TODO: INCREMENTAL
				
				ideologySpaces[0] = pick(drainingIdeologyEdges);
				
				console.log("Building " + numIdeologyEdges + " ideology edges");
				
			}			
			
			// DATA TO DESCRIPTION FUNCTIONS
			
			function describeMegagame(mg) {
				
				var description = "";
				
				description += describeSetting(mg);
				
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

					ttDesc += ["rivals, though with some common interests. ", "wary of one another, but willing to strike deals. ", "nominally allies, though with competing agendas. "][mg.teamTypes[tt].cooperationLevel + 1];		
					
					// Markup
					ttDesc = "<p>" + ttDesc + "</p>";
					
					description += ttDesc;
					
				}
				
				return description;
				
			}
			
			function describeSetting(mg) {
				var settingDescription = "The era is " 
				
				if(mg.isFiction) { settingDescription += "an alternative-history "; }
				
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
					
					console.log("Picking " + toPick);
					
					if (toPick > a.length) {console.log(" Not enough entries"); return null;}
					
					var drainingArray = a;
					var fillingArray = [];

					for (leftToPick = toPick; leftToPick > 0; leftToPick-- ) {
						console.log(" " + leftToPick + " left to pick");
						
						var choice = d(drainingArray.length) - 1;
						
						console.log(" choice is " + choice);
					
						fillingArray.push(drainingArray[choice]);
						console.log("Transferring " + drainingArray[choice]);
						drainingArray.splice(choice,1);
					}					
					
					return fillingArray;
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
