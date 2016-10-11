import {Injectable, Output} from 'angular2/core';

import {UserService} from './User.service';
import {CalendarService} from './CalendarService';

import {LocalStorage} from '../logic/Data/LocalStorage/LocalStorage'
import {RecordDTO} from "../logic/Data/RecordDTO"
import {Employee} from "../logic/objects/employee"

@Injectable()
export class StorageService {
	
	localStorage: LocalStorage;
	employeeList: Employee[];
	
	constructor (private userService: UserService,
	private calendarService: CalendarService) {
		// console.log ("----initializing local storage")
		this.localStorage = new LocalStorage("test");
		// console.log ("local storage initialized----");
		this.employeeList = [];
	}
	
	public loadAllUsersTEMP (func: Function) : void {
		
		var list = [];
		var __this = this;
		
		this.localStorage.employeeLoader.getAll().then (
			list => {
				// notify changes to calendarService:
				__this.loadedEmployees(list);
				// execute the callback function
				func();
			},
			error => {
				console.log ("StorageService getAllUsers error");
			}
		);
		
		// console.log (this.localStorage.employeeLoader.getAll());
	}
	
	public init () {
		
	}
	
	private loadedEmployees(list: Employee[]) {
		console.log ("loadedEmployees called");
		console.log (list);
		this.employeeList = list;
	}
	
	public addRecord (record: RecordDTO) {
		console.log ("++++adding record", 'style = "background: red;"');
		console.log (record);
		this.localStorage.addRecord (record);
		// this.localStorage.debugONLY_showAll();
	}
	
	public deleteRecord (record: RecordDTO) {
		this.localStorage.deleteRecord(record);
	}
	
	/**
	 * Relies that the recordId and recordType are staying the same
	 */
	public updateRecord (record: RecordDTO) {
		this.localStorage.updateRecord(record);
	}
	
	
}