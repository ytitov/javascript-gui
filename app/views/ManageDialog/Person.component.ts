/*
this is replacing personedit, and combines shared functions of
client and employeeId, like the adding and modifying buttons
*/

import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';

import {Note} from "../../logic/objects/Note"
import {Person} from "../../logic/objects/Person";

@Component({
  selector: 'person-component',
  templateUrl: './views/ManageDialog/Person.html',
  styleUrls: ['./views/Dialog/Dialog.css'],
  directives: [], //
  providers: [] // register the service with the injector
})

export class PersonComponent implements OnInit {

	@Input() userId: string;
	@Input() phone: string;
	@Output() phoneChange: EventEmitter<string> = new EventEmitter();
	@Input() firstName: string;
	@Output() firstNameChange: EventEmitter<string> = new EventEmitter();
	@Input() lastName: string;
	@Output() lastNameChange: EventEmitter<string> = new EventEmitter();
	@Input() address1: string;
	@Output() address1Change: EventEmitter<string> = new EventEmitter();
	@Input() address2: string;
	@Output() address2Change: EventEmitter<string> = new EventEmitter();
	@Input() city: string;
	@Output() cityChange: EventEmitter<string> = new EventEmitter();
	@Input() state: string;
	@Output() stateChange: EventEmitter<string> = new EventEmitter();
	@Input() zip: string;
	@Output() zipChange: EventEmitter<string> = new EventEmitter();
	@Input() email: string;
	@Output() emailChange: EventEmitter<string> = new EventEmitter();
	@Input() noteString: string;
	@Output() noteStringChange: EventEmitter<string> = new EventEmitter();
	
	@Input() canEditFields: boolean;
	@Input() noteList: Note[];

	@Output() newNote: EventEmitter<string> = new EventEmitter();
	@Output() newPerson: EventEmitter<any> = new EventEmitter();
	@Output() updatePerson: EventEmitter<string> = new EventEmitter();

	constructor() {
		this.noteString = "";
	}

	ngOnInit() {

	}


	phoneChanged() {
		this.phoneChange.emit(this.phone);
	}
	
	firstNameChanged() {
		this.firstNameChange.emit(this.firstName);
	}
	
	lastNameChanged() {
		this.lastNameChange.emit(this.lastName);
	}
	
	address1Changed() {
		this.address1Change.emit(this.address1);
	}
	
	address2Changed() {
		this.address2Change.emit(this.address2);
	}
	
	cityChanged() {
		this.cityChange.emit(this.city);
	}
	
	stateChanged() {
		this.stateChange.emit(this.state);
	}
	
	zipChanged() {
		this.zipChange.emit(this.zip);
	}
	
	emailChanged() {
		this.emailChange.emit(this.email);
	}

	noteStringChanged() {
		this.noteStringChange.emit(this.noteString);
	}

	addNoteButtonClicked() {
		this.newNote.emit (this.noteString);
	}

deleteNoteButtonClicked (note: Note) {
	note.content = null; // null notes should not be recorded
	this.updatePerson.emit ("");
}

}