import {RecordLoaderDAO} from "../RecordLoaderDAO";
import {RecordDTO, RecordType} from "../RecordDTO";
import {DataBaseInfo} from "../DataBaseInfo";
import {EmployeeLoader} from "./EmployeeLoader";
import {ClientLoader} from "./ClientLoader";
import {ServiceLoader} from "./ServiceLoader";

declare var require: any;

export class LocalStorage {


	Datastore = require('nedb');
	db: any;

	dataBaseInfo: DataBaseInfo;
	employeeLoader: EmployeeLoader;
	clientLoader: ClientLoader;
	serviceLoader: ServiceLoader;

	constructor(dataFileName: string) {

		this.dataBaseInfo = new DataBaseInfo();
		this.db = new this.Datastore({ filename: 'datastore-employees', autoload: true });

		// initialize all of the loaders
		this.employeeLoader = new EmployeeLoader(this.db);
		this.clientLoader = new ClientLoader(this.db);
		this.serviceLoader = new ServiceLoader(this.db);
		// this.debugONLY_delAll();
		// this.debugONLY_showAll();

		// retrieve information about the database.  Checks if last index exists, if not
		// then it adds that entry to the embedded database		
		var _this = this; // so the inline functions can get to the right "this"
		this.db.find({
			"dataBaseInfo": { $exists: true }
		},
			function (err, docs) {

				if (docs.length == 0) {
					// initialize and set all indices to zero
					console.log("inserting lastAddedIndexObject")
					_this.dataBaseInfo.curIndexList = _this.dataBaseInfo.getEmptyIndexList();

					// and record in the local db
					_this.db.insert({ dataBaseInfo: _this.dataBaseInfo });
				} else {
					// load up the stored lastIndex;
					if (docs.length > 1) {
						console.log("LocalStorage: Warning: DataInfo has more than 1 occurence.");
						// _this.delAll();
					} else {
						// grab the current index
						console.log("Loading local storage database info entry");
						// _this.dataBaseInfo.lastAddedIndexObjects = docs[0].lastAddedIndexObjects;
						console.log (docs[0]);
						_this.dataBaseInfo.setIndices(docs[0].dataBaseInfo.curIndexList);
						// _this.DEBUG_ONLY_testDB();
					}
				}
			});


	}

	DEBUG_ONLY_testDB() {
		console.log("local storage database info: ");
		console.log(this.dataBaseInfo);
		this.debugONLY_showAll();

		console.log("incrementing index ");
		var newindex = this.dataBaseInfo.getIndex(RecordType.Client) + 1;
		console.log("new index for client: " + newindex);
		this.dataBaseInfo.incrementIndex(RecordType.Client);
		console.log("database info to be written: ")
		console.log(this.dataBaseInfo);
		this.updateDataBaseInfo();
		this.debugONLY_showAll();
	}

	addRecord(record: RecordDTO) {
		if (record == null) {
			this.printError ("LocalStorage ERROR: attempting to create null record");
			return;
		}
		var recordType = record.getType();
		var object = record;
		var isSynced = record.isSynced();  // has to do with syncing with remote
		var recordId = record.getRecordId();
		this.db.insert({
			recordType: recordType,
			object: object,
			isSynced: isSynced,
			recordId: recordId
		});
	}

	deleteRecord(record: RecordDTO) {

		this.db.remove({
			recordType: record.getType(),
			recordId: record.getRecordId()
		},
			{},
			function (error, numRemoved) {
				console.log("deleteRecrd: number removed: " + numRemoved);
			})
	}
	
	/**
	 * relies that recordType and recordId are staying constant
	 * for remote, this will obviously need to be an update
	 * here its easy because its not a relational database
	 */
	updateRecord(record: RecordDTO) {
		this.deleteRecord (record);
		this.addRecord (record);
	}

	// writes the current database class to disk.  sees if dataBaseInfo exists,
	// then replaces it with what is in memory.
	updateDataBaseInfo() {
		this.db.update({ dataBaseInfo: { $exists: true } },
			{ dataBaseInfo: this.dataBaseInfo },
			{},
			function (err, numReplaced) {
				if (numReplaced != 1) {
					console.log("updateDataBaseInfo: ERROR: either dataBaseInfo " +
						"doesn't exist or there are multiples.  Num replaced: " + numReplaced);
				}
			})

	}

	delIndexObjects() {

	}

	debugONLY_delAll() {
		console.log("debug only: deleting whole local storage db");
		this.db.remove({}, { multi: true }, function (err, docs) { });
	}

	debugONLY_showAll() {
		this.db.find({}, {}, function (err, docs) {
			console.log("debugONLY_showAll: printing whole database contents:");
			console.log(docs);
		});
	}
	
	printError (str: string) {
		console.log ("LocalStorage Error: ", "'background: red; color: white'");
		console.log (str);
	}

}