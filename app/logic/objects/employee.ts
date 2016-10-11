import {Person} from './person';
import {UserGuiDTO} from './gui-dto/UserDTO';
import {RecordDTO, RecordType} from "../Data/RecordDTO";
import {Note} from './Note';

export class Employee implements UserGuiDTO, RecordDTO {
	person: Person;
	index: number; // for RecordDTO
	
	// create empty
	constructor() {
		this.person = new Person("","","","","","","","","","","");
		var id = new Date(Date.now()).getTime();
		this.person.id = id.toString();
	}
	
	////////////////////////////////////////////
	// UserGuiDTO interface functions
	////////////////////////////////////////////
	getId () {
		return this.person.id;
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
		return RecordType.Employee;
	}
	
	isSynced () : boolean {
		// todo implement this
		return true;
	}
}