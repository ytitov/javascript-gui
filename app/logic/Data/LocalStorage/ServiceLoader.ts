import {DataBaseInfo} from "../DataBaseInfo"
import {RecordDTO, RecordType} from "../RecordDTO"
import {RecordLoaderDAO} from "../RecordLoaderDAO"

import {Service} from "../../objects/service"

export class ServiceLoader implements RecordLoaderDAO {
	db: any; // the nedb database
	prefix: string;

	constructor(db: any) {
		this.db = db;
		this.prefix = "ClientRecord"; // don't change, add and get functions
		// use this as a request to get employee related stuff from local db
	}


	/*
	RecordLoaderDAO interface functions
	*/

	private fillObject(record: any): Service {

		var service = new Service({
			employeeId: record.object.employeeId,
			title: record.object.title,
			description: record.object.description,
			priceWholeNum: record.object.priceWholeNum,
			priceDecimal: record.object.priceDecimal
		});

		service.id = record.object.id;
		service.lengthMinutes = record.object.lengthMinutes;

		return service;
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
		var list = [];
		// resolve = fulfilled
		// reject = error
		// use p.then(val => {},err=> {}) to get val or error
		// use p.then(...).catch(err=> {}) to catch error

		var p = new Promise<Service[]>((resolve, reject) => {
			// var p = new Promise ((resolve, reject) => {
			this.db.find({
				recordType: RecordType.Service
			}).sort ({"object.title":1}).exec (function (err, docs) {
				console.log("ERROR: " + err);
				for (var doc of docs) {
					// load up the employees
					var service = __this.fillObject(doc);

					list.push(service);
				}
				resolve(list);
			})
		})

		return p;
	}

	// not sure where to move this, but it doesn't make sense
	// to put it inside the loader... will make many of these
	// over and over.
	public cleanRegex(str: string): string {
		return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	searchTerms(termList: string[]) {
		var list = [];
		var index = 0;
		var __this = this;
		var regexString = "("
		for (var item of termList) {
			// ignore anything shorter than 3 letters
			if (item.length > 0) {
				var cleanString = this.cleanRegex(item);
				regexString += cleanString;
				if (index < termList.length - 1) {
					regexString += "|";
				}
			}
			index++;
		}
		regexString += ")";
		// the i sets the ignore case flag
		var regex = new RegExp(regexString, "i");

		console.log("regex: " + regex);


		var p = new Promise<Service[]>((resolve, reject) => {
			// matches to first OR last names
			this.db.find({
				$or:
				[{
					recordType: RecordType.Service,
					"object.title": regex
				},
					{
						recordType: RecordType.Service,
						"object.description": regex
					}]
			}).sort ({"object.title": 1}).exec ( function (err, docs) {
				console.log(err);
				console.log("Found " + docs.length + " records");
				for (var doc of docs) {
					// load up the employees
					var service = __this.fillObject(doc);

					list.push(service);
				}
				resolve(list);
			})
		}) // end of promise

		return p;
	}

	getOne(recordIndex: number): RecordDTO {

	}

	delete(recordIndex: number) {

	}
}