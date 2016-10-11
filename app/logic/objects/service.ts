import {ServiceGuiDTO} from './gui-dto/ServiceDTO';
import {RecordDTO, RecordType} from "../Data/RecordDTO";

/**
 * Describes a service performed by some employee.
 * Params: employeeId, title, description, priceWholeNum,
 * priceDecimal are required
 */
export class Service implements ServiceGuiDTO, RecordDTO {
	index: number;
	id: string;
	
	employeeId: string;
	title: string;
	description: string;
	priceWholeNum: number;
	priceDecimal: number;
	unitSymbol: string;
	unitDescription: string;
	lengthMinutes: number;
	
	constructor (params: any) {
		this.id = new Date(Date.now()).getTime().toString();
		this.employeeId = params.employeeId;
		this.title = params.title;
		this.description = params.description;
		this.priceWholeNum = params.priceWholeNum;
		this.priceDecimal = params.priceDecimal;
		this.unitSymbol = "$";
		this.unitDescription = "dollars";
		this.lengthMinutes = 15;
	}
	
	////////////////////////////////////////////
	// ServiceGuiDTO interface functions
	////////////////////////////////////////////
	getId() : string {
		return this.id;
	}
	
	getEmployeeId() : string {
		return this.employeeId;
	}
	
	getTitle () : string {
		return this.title;
	}
	
	getDescription () : string {
		return this.description;
	}
	
	getPriceWholeNum() : number {
		return this.priceWholeNum;
	}
	
	getPriceDecimal() : number {
		return this.priceDecimal;
	}
	
	getUnitSymbol() : string {
		return this.unitSymbol;
	}
	
	getUnitDescription() : string {
		return this.unitDescription;
	}
	
	getLengthMinutes() : number {
		return this.lengthMinutes;
	}
	
	
	////////////////////////////////////////////
	// RecordDTO interface functions
	////////////////////////////////////////////
	
	setIndex (num: number) {
		this.index = num;
	}
	
	getIndex () : number {
		return this.index;
	}
	
	getRecordId () : string {
		return this.getId();
	}
	
	getObject () : any {
		return {
			Service: this
		}
	} // returns the object which is attached to the record
	
	getType () : RecordType {
		return RecordType.Service;
	}
	
	isSynced () : boolean {
		// todo implement this
		return true;
	}
}