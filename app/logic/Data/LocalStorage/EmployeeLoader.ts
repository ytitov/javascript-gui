import {DataBaseInfo} from "../DataBaseInfo"
import {RecordDTO, RecordType} from "../RecordDTO"
import {RecordLoaderDAO} from "../RecordLoaderDAO"

import {Employee} from "../../objects/employee"

export class EmployeeLoader implements RecordLoaderDAO {
	db: any; // the nedb database
	prefix: string;

	constructor(db: any) {
		this.db = db;
		this.prefix = "EmployeeRecord"; // don't change, add and get functions
		// use this as a request to get employee related stuff from local db
	}


	/*
	RecordLoaderDAO interface functions
	*/

	private fillObject(record: any): Employee {
		// console.log ("fillObject: ");
		var emp = new Employee();
		emp.person = record.object.person;
		// console.log (emp);
		return emp;
	}

	/**
	 * For local storage, this returns the most resent
	 * index received from the remote database.  for now always returns
	 * zero because remote is not implemented
	 */
	getCurrentIndex(): number {
		return 0;
	}

	/**
 * Returns a promise
 */
	getAll() {
		var __this = this;
		var employeeList = [];
		// resolve = fulfilled
		// reject = error
		// use p.then(val => {},err=> {}) to get val or error
		// use p.then(...).catch(err=> {}) to catch error

		var p = new Promise<Employee[]>((resolve, reject) => {
			// var p = new Promise ((resolve, reject) => {
			this.db.find({
				recordType: RecordType.Employee
			}, function (err, docs) {
				for (var doc of docs) {
					// load up the employees
					var emp = __this.fillObject(doc);

					employeeList.push(emp);
				}
				resolve(employeeList);
			})			
		})

		return p;
	}

	getOne(recordIndex: number): RecordDTO {

	}

	delete(recordIndex: number) {

	}
}