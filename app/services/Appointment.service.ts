import {Injectable} from 'angular2/core';

import {UserGuiDTO} from '../logic/objects/gui-dto/UserDTO';
import {Employee} from '../logic/objects/employee';
import {Appointment} from '../logic/objects/appointment';

import {CalendarService} from './CalendarService';

@Injectable()
export class AppointmentService {

	appointments: Appointment[];

	constructor(private calendarService: CalendarService) {
		this.appointments = [];		
	}

	/**
	 * temporary implementation, and not very efficient because on the other end
	 * it is being called for every calendar day, and in turn here, would
	 * run over and over.  better thing to do is have the external
	 * function request a sorted list (by date at least)
	 */
	getAppointmentList(empID: string, date: Date): Appointment[] {

		var list = [];
		for (var apt of this.appointments) {
			if ((empID == apt.getUserId()) &&
				(date.getFullYear() == apt.dateTimeStart.getFullYear() &&
					date.getDate() == apt.dateTimeStart.getDate() &&
					date.getMonth() == apt.dateTimeEnd.getMonth())) {

				list.push(apt);
			}
		}
		return list;
	}

	getAppointmentList2(empID: string, date: Date) {
		return this.appointments;
	}

	addAppointment(app: Appointment) {
		console.log ("addAppointment() app.userID: "+app.getUserId());
		this.appointments.push(app);
	}
}