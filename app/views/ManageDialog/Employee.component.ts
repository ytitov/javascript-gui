import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';

import {Employee} from "../../logic/objects/employee";
import {Note} from "../../logic/objects/Note";
import {UserGuiDTO} from '../../logic/objects/gui-dto/UserDTO';

import {StorageService} from '../../services/Storage.service';
import {UserService} from '../../services/User.service';

import {PersonComponent} from "./Person.component";

@Component({
  selector: 'employee-component',
  templateUrl: './views/ManageDialog/Employee.html',
  styleUrls: ['./views/Dialog/Dialog.css'],
  directives: [PersonComponent], //
  providers: [] // register the service with the injector
})

export class EmployeeComponent implements OnInit {

	@Output() newEmployeeOutput = new EventEmitter();

	selectedEmployee: Employee;
	canEditFields: boolean;
	showEditButton: boolean;
	showSubmitButton: boolean;
	showAddButton: boolean;
	showDeleteButton: boolean;
	showCancelDeleteButton: boolean;
	showCancelButton: boolean; // cancel everything type button
	areWeEditing: boolean;

	delButtonLabel: string;

	// fields
	userId: string;
	phone: string;
	firstName: string;
	lastName: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	email: string;
	noteList: Note[];
	noteString: string;

	// states
	curState: number;
	stateDefault = 0;
	stateAddingEmployee = 1;
	stateModifyingEmployee = 2;
	stateDeletingEmployee = 3;


	constructor(
		private userService: UserService,
		private storageService: StorageService) {

		this.defaultState();

		this.delButtonLabel = "Delete"
	}

	ngOnInit() {

	}

	clearFields() {
		this.userId = "";
		this.phone = "";
		this.firstName = "";
		this.lastName = "";
		this.address1 = "";
		this.address2 = "";
		this.city = "";
		this.state = "";
		this.zip = "";
		this.email = "";
		this.noteList = [];
		this.noteString = "";
	}

	employeeClicked(emp: Employee) {
		console.log(emp);
		this.employeeSelectedState();
		this.selectedEmployee = emp;

		this.userId = emp.getId();
		this.phone = emp.getPhone();
		this.firstName = emp.getFirstName();
		this.lastName = emp.getLastName();
		this.address1 = emp.getAddress1();
		this.address2 = emp.getAddress2();
		this.city = emp.getCity();
		this.state = emp.getState();
		this.zip = emp.getZip();
		this.email = emp.getEmail();
		this.noteList = emp.person.noteList; // note getNotes won't work for some reason
		// maybe wrong interface... check later
	}

	addEmployeeButtonClicked() {
		/* enables the fields to be edited, then shows the submit button */

		console.log("addEmployeeButtonClicked");
		if (this.curState == this.stateDefault) {
			this.curState = this.stateAddingEmployee;
			// in this case, we are viewing an employee so we don't 
			// just want to add, we just clear the fields
			this.canEditFields = true;
			this.clearFields();
			this.showSubmitButton = true;
		}
	}


	// this is the new implementation coming from the 
	// person component, so delete addNoteButtonClicked later
	handleAddNoteClicked(noteText: string) {
		this.noteString = noteText;
		console.log("attempting to add note: ");
		console.log(noteText);
		this.submitButtonClicked();
		// just to bring up the employee again
		this.employeeClicked(this.selectedEmployee);
	}

	handleDelNoteClicked(note: Note) {
		var newNoteList = []
		for (var item of this.noteList) {
			if (note.dateCreated != item.dateCreated) {
				newNoteList.push(item);
			} else {
				console.log("ignoring the note: ");
				console.log(note);
			}
		}

		this.noteList = newNoteList;
		this.noteString = "";
		this.submitButtonClicked();
		// just to bring up the employee again
		this.employeeClicked(this.selectedEmployee);
	}

	handleUpdatePerson () {
		var newNoteList = [];
		for (var item of this.selectedEmployee.person.noteList) {
			if (item.content != null) {
				newNoteList.push(item);
			}
		}
		this.selectedEmployee.person.noteList = newNoteList;
		this.storageService.updateRecord(this.selectedEmployee);
		this.employeeClicked(this.selectedEmployee);
	}


	/**
	 * for submiting changes
	 */
	submitButtonClicked() {
		switch (this.curState) {
			case this.stateDefault:
				//
				break;
			case this.stateAddingEmployee:
				// create the employee
				var emp = this.getEmployeeFromFields();
				this.storageService.addRecord(emp);
				this.storageService.loadAllUsersTEMP(this.employeeListUpdated);
				this.clearFields();
				this.showSubmitButton = false;
				this.showEditButton = false;
				this.showAddButton = true;
				this.canEditFields = false;
				this.curState = this.stateDefault;
				break;
			case this.stateModifyingEmployee:
				// modify employee
				var actualId = this.userId;
				var emp = this.getEmployeeFromFields();
				// see if the user is putting in a note
				if (this.noteString.length > 0) {
					var note = new Note();
					note.content = this.noteString;
					note.employeeId = this.userService.currentUser.getId();
					emp.person.noteList.push(note);
				}
				emp.person.noteList = this.noteList; // for the case when the note gets removed
				emp.person.id = actualId; // because we must replace the autogenerated id
				this.selectedEmployee = emp; // kind of a hack, should really have a function which
				// is something like selectEmployeeById(id) instead of keeping the object around
				// but it works...
				this.storageService.updateRecord(emp);
				this.storageService.loadAllUsersTEMP(this.employeeListUpdated);
				this.clearFields();
				this.showSubmitButton = false;
				this.showAddButton = true;
				this.areWeEditing = false;
				this.curState = this.stateDefault;
				this.employeeClicked(this.selectedEmployee);
				break;
			default:
				console.log("unknown state");
				break;
		}
	}

	editButtonClicked() {
		this.showAddButton = false;
		this.canEditFields = true;
		this.showSubmitButton = true;
		this.curState = this.stateModifyingEmployee;
	}

	deleteButtonClicked() {
		if (this.showCancelDeleteButton) {
			// hitting delete for the second time
			console.log("Deleting employee (not implemented)");
			this.storageService.deleteRecord(this.selectedEmployee);
			this.storageService.loadAllUsersTEMP(this.employeeListUpdated);
			this.showCancelDeleteButton = false;
			this.delButtonLabel = "Delete";
			this.clearFields();
			this.defaultState();
		} else {
			this.showAddButton = false;
			this.showCancelButton = false;
			this.showCancelDeleteButton = true;
			this.showEditButton = false;
			this.delButtonLabel = "Confirm Delete";
		}
	}

	cancelDeleteButtonClicked() {
		this.showCancelDeleteButton = false;
		this.showDeleteButton = false;
		this.delButtonLabel = "Delete";
		this.defaultState();
	}

	cancelButtonClicked() {
		this.defaultState();
	}

	defaultState() {
		this.curState = this.stateDefault;
		this.canEditFields = false;
		this.clearFields();
		this.showEditButton = false;
		this.showSubmitButton = false;
		this.showAddButton = true;
		this.showDeleteButton = false;
		this.showCancelDeleteButton = false;
		this.areWeEditing = false;
		this.showCancelButton = true;
	}

	employeeSelectedState() {
		// reset delete process
		this.showDeleteButton = true;
		this.showCancelDeleteButton = false;
		this.delButtonLabel = "Delete";
		//
		this.showSubmitButton = false;
		this.showAddButton = true;
		this.showEditButton = true;
		this.canEditFields = false;
	}

	/**
	 * callback function for when employee list gets updated.
	 * not necessary to do anything here at this point as the 
	 * screen is updated automatically.  The function requires a callback
	 * so its here.
	 */
	employeeListUpdated() {

	}

	private getEmployeeFromFields(): Employee {
		var emp = new Employee();
		emp.person.phone = this.phone;
		emp.person.first = this.firstName;
		emp.person.last = this.lastName;
		emp.person.address1 = this.address1;
		emp.person.address2 = this.address2;
		emp.person.city = this.city;
		emp.person.state = this.state;
		emp.person.zip = this.zip;
		emp.person.email = this.email;
		emp.person.noteList = this.noteList;

		console.log ("getEmployeeFromFields: ");
		console.log (emp);
		return emp;
	}

	handleNewNote (str: string) {
		console.log ("handleNewNote not implemented: "+str);

		var emp = this.getEmployeeFromFields();
		var actualId = this.userId; // preserves the id
		if (str.length > 0) {
			var note = new Note();
			note.content = str;
			note.employeeId = this.userService.currentUser.getId();
			emp.person.noteList.push(note);
		}
		emp.person.id = actualId; // set to the right id
		this.storageService.updateRecord(emp);
		this.defaultState();
	}
}