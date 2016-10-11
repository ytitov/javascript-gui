import {RecordDTO, RecordType} from "./RecordDTO";

export interface RecordLoaderDAO {
	/**
	 * Returns the index of the last added item of this type
	 * pertains mainly to remote databases, where they increment
	 * as they add entries
	 */
	getCurrentIndex() : number;
	getAll() : RecordDTO [];
	getOne (recordIndex: number) : RecordDTO;
	delete (recordIndex: number);
}