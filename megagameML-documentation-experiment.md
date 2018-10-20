* Megagame {
	* name
	* isFiction
	* isFuture
	* epoch
	* teamTypesNumber
	* teamTypes [
		* name
		* cooperationLevel (-1 to 1)
		* count
	* ideologySpaces [
		* geometry (tracker, grid or polygon)
		* edges [
			* Ideology 1
			* Ideology 2
		]
	* hasMap
	* openMap
	* mechanicalness
	* mood
	* fora [
		* (from: Market, Diplomatic, Operational,...)
	]
	* resources [
		* type (from: commodities, knowledge...)
		* form (from: cubes, discs...)
		* inputDynamic (from: Closed, Finite, Infinite)
		* outputDynamic (from: Closed, Finite, Infinite)
	]
}