import {RecordDTO, RecordType} from "./RecordDTO"

export class DataBaseInfo {
	curIndexList: any[];
	
	constructor () {
		this.curIndexList = [];
	}
	
	/**
	 * takes an array of {RecordType, lastIndex}
	 */
	public setIndices (params: any[]) {
		
		console.log ("setIndices: ")
		console.log (params);
		for (var item of params) {
			this.curIndexList.push(item);
		}
		// console.log ("loaded indices from db: ");
		console.log (this.curIndexList);
	}
	
	/**
	 * This just returns an array of lastIndex objects, for each type of
	 * RecordType, at 0.  meant for brand new local datastores
	 */
	getEmptyIndexList () {
		var client = {type : RecordType.Client, lastIndex: 0};
		var employee = {type : RecordType.Employee, lastIndex: 0};
		var appointment = {type : RecordType.Appointment, lastIndex: 0};
		var service = {type : RecordType.Service, lastIndex: 0};
		var product = {type : RecordType.Product, lastIndex: 0};
		var list = [];
		list.push(client, employee, appointment, service, product);
		return list;
	}
	
	/**
	 * Gets the current index of requested recordType
	 */
	getIndex (recordType: RecordType) : number {
		var index = 0;
		
		for (var item of this.curIndexList) {
			if (item.type == recordType) {
				index = item.lastIndex;
				return index;
			}
		}
		
		console.log ("DataBaseInfo ERROR: getIndex for record type failed, returning 0");
		return index;
	}
	
	setIndex (recordType: RecordType, index: number) {
		for (var item of this.curIndexList) {
			
			console.log (item);
			if (item.type == recordType) {
				
				item.lastIndex = index;
				return
			}
		}
		console.log ("DataBaseInfo ERROR: setIndex for record type failed");
	}
	
	incrementIndex (recordType: RecordType) {
		
		for (var item of this.curIndexList) {
			
			console.log (item);
			if (item.type == recordType) {
				item.lastIndex++;
				return
			}
		}
		console.log ("DataBaseInfo ERROR: incrementIndex for record type failed");
	}
}