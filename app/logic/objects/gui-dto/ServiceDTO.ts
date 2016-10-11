export interface ServiceGuiDTO {
	getId() : string;
	getEmployeeId() :string;
	getTitle() : string;
	getDescription () : string;
	getPriceWholeNum() : number;
	getPriceDecimal() : number;
	getUnitSymbol() : string;
	getUnitDescription() : string;
	getLengthMinutes() : number;
}