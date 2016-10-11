import {DataBaseInfo} from "../DataBaseInfo"
import {RecordDTO, RecordType} from "../RecordDTO"
import {RecordLoaderDAO} from "../RecordLoaderDAO"

import {Client} from "../../objects/client"

export class ClientLoader implements RecordLoaderDAO {
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

	private fillObject(record: any): Client {
		// console.log ("fillObject: ");
		var client = new Client();
		client.person = record.object.person;
		// console.log (emp);
		return client;
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

		var p = new Promise<Client[]>((resolve, reject) => {
			// var p = new Promise ((resolve, reject) => {
			this.db.find({
				recordType: RecordType.Client
			}, function (err, docs) {
				for (var doc of docs) {
					// load up the employees
					var emp = __this.fillObject(doc);

					list.push(emp);
				}
				resolve(list);
			})			
		})

		return p;
	}
	
	// not sure where to move this, but it doesn't make sense
	// to put it inside the loader... will make many of these
	// over and over.
	public cleanRegex (str:string) : string {
		return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}
	
	/**
	 * will only search when term is more than length of 1
	 */
	searchName(term: string) {
		var list = [];
		if (term.length < 2 || term == null) {
			return Promise.resolve(list);
		}
		var __this = this;
		
		var cleanString = this.cleanRegex (term);
		var regex = new RegExp(cleanString, "i"); // not working
		
		var p = new Promise<Client[]>((resolve, reject) => {
			// matches to first OR last names
			this.db.find({ $or:
				[{recordType: RecordType.Client,
				"object.person.last": regex},
				{recordType: RecordType.Client,
				"object.person.first": regex}]
			}, function (err, docs) {
				console.log (err);
				console.log ("Found "+docs.length+" records");
				for (var doc of docs) {
					// load up the employees
					var emp = __this.fillObject(doc);

					list.push(emp);
				}
				resolve(list);
			})			
		})

		return p;
	}
	
	/**
	 * Searches from a list of terms, using an OR method with matching
	 * first or last name fields
	 */
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


		var p = new Promise<Client[]>((resolve, reject) => {
			// matches to first OR last names
			this.db.find({
				$or:
				[{
					recordType: RecordType.Client,
					"object.person.last": regex
				},
					{
						recordType: RecordType.Client,
						"object.person.first": regex
					}]
			}).sort ({"object.person.last": 1}).exec ( function (err, docs) {
				console.log(err);
				console.log("Found " + docs.length + " records");
				for (var doc of docs) {
					// load up the employees
					var client = __this.fillObject(doc);

					list.push(client);
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