import {TimeBlock} from '../calendar/timeblock';
import {Service} from './service';

/*
TimeBlock is the DTO for the appointment objects inside the gui
*/
export class Appointment implements TimeBlock {
	timeBlock: TimeBlock[];
	notes: string;
	services: Service[];
	
	dateTimeStart: Date;
	dateTimeEnd: Date;
	
	userId : string;
	
	constructor (start: Date, end: Date) {
		this.dateTimeStart = start;
		this.dateTimeEnd = end;
		this.userId = "Not Set";
	}
	
	/////////////////////////////////////////
	// TimeBlock interface functions
	/////////////////////////////////////////
	
	getUserId () : string {
		return this.userId;	
	}
	
	getStart() : Date {
		return this.dateTimeStart;
	}
	
	getEnd() : Date {
		return this.dateTimeEnd;
	}
	
	getTitleLabel () : string {
		return "No Label Set";
	}
	
	getStartLabel () 	: string {
		return this.dateTimeStart.getHours()+":"+this.dateTimeStart.getMinutes();
	}

	getEndLabel () : string {
		return this.dateTimeEnd.getHours()+":"+this.dateTimeEnd.getMinutes();
	}
	
}