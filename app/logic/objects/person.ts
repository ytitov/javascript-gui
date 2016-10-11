import {Note} from "./Note"

export class Person {
	id: string;
	last: string;
	first: string;
	email: string;
	phone: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	data: string; // other stuff like description or something
	noteList: Note[]

	constructor(id: string, last: string, first: string,
		email: string, phone: string, address1: string, address2: string,
		city: string, state: string, zip: string, data: string) {

		this.last = last;
		this.first = first;
		this.email = email;
		this.phone = phone;
		this.address1 = address1;
		this.address2 = address2;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.data = data;
		this.noteList = [];
	}
	
	
	getNotes () : Note[] {
		return this.noteList;
	}
}