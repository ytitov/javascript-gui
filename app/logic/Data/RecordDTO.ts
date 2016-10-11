export enum RecordType {
	Client,
	Employee,
	Appointment,
	Service,
	Product
}

export interface RecordDTO {
	/**
	 * field setter for the record
	 */
	// indices are used to keep track where we are in relation
	// to remote (which provides these indices, so we can request
	// new information based on the indices we have.)
	setIndex(index: number);
	getIndex() : number;
	// this must be unique for any entry in its class
	getRecordId() : string;
	getObject () : any; // gets you the actual object
	getType () : RecordType;
	isSynced () : boolean; // is it synced to remote
}