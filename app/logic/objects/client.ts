import {Person} from './person';
import {Note} from './Note'
import {ClientGuiDTO} from '../../logic/objects/gui-dto/clientDTO'; 
import {RecordDTO, RecordType} from "../Data/RecordDTO"; 

export class Client implements ClientGuiDTO, RecordDTO {
	person: Person
	index: number; // for RecordDTO
	employeeId: string;
	
	constructor () {
		this.person = new Person("","","","","","","","","","","");
		var id = new Date(Date.now()).getTime();
		this.person.id = id.toString();
		this.employeeId = "";
	}
	
	////////////////////////////////////////////
	// ClientGuiDTO interface functions
	////////////////////////////////////////////
	getId () : string {
		return this.person.id;
	}
	
	getEmployeeId () : string {
		return this.employeeId;
	}
	
	getLabel() {
		return this.person.first + " " + this.person.last;
	}
	
	getPhone() : string {
		return this.person.phone;
	}
	
	getFirstName() : string {
		return this.person.first;
	}
	
	getLastName() : string {
		return this.person.last;
	}
	
	getAddress1() : string {
		return this.person.address1;
	}
	
	getAddress2() : string {
		return this.person.address2;
	}
	
	getCity () : string {
		return this.person.city;
	}
	
	getState () : string {
		return this.person.state;
	}
	
	getZip () : string {
		return this.person.zip;
	}
	
	getEmail () : string {
		return this.person.email;
	}
	
	getNotes () : Note[] {
		return this.person.noteList;
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
			Employee: this
		}
	} // returns the object which is attached to the record
	
	getType () : RecordType {
		return RecordType.Client;
	}
	
	isSynced () : boolean {
		// todo implement this
		return true;
	}
}