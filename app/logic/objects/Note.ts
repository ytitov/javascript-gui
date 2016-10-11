export class Note {
	dateCreated: Date;
	employeeId: string;
	content: string;
	
	constructor () {
		this.dateCreated = new Date(Date.now());
		this.employeeId = "ID NOT SET";
	}
	
	getDateCreatedString() : string {
		return this.dateCreated.toDateString();
	}
}