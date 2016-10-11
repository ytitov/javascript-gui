import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';

import {Appointment} from '../../../logic/objects/appointment';

// components imported
import {IncrementButtonComponent}
  from '../../IncrementButton/IncrementButton.component';
import {MainCalendarViewComponent}
  from '../../CalendarView/MainCalendarView.component';
	
// services used
import {CalendarService}
	from '../../../services/CalendarService';

@Component({
  selector: 'calendar-menu',
  templateUrl: './views/Menus/CalendarMenu/CalendarMenu.html',
  styleUrls: ['./views/Menus/menu.css'],
  directives: [IncrementButtonComponent], //
  providers: [] // 
})

export class CalendarMenuComponent implements OnInit {
	
	@Input() date: Date; // where the calendar starts
	@Input() selectedDate: any; // what the user actually selects
	startHr: number;
	startMin: number;
	@Input() userID: string;
	@Input() isShown: boolean;
	
	@Output() appointment = new EventEmitter();
	
	// state variables
	isDayViewSelected: boolean;
	isWeekViewSelected: boolean;
	viewOnlyMe: boolean;
	viewEveryone: boolean;
	creatingAppointmentState: boolean;
	
	//move to own menu later
	addingEmployeeState: boolean;
	
	menuHeight: number;
	
	constructor (private calendarService: CalendarService) {
		this.date = new Date(Date.now());
		this.selectedDate = this.date;
		this.startHr = this.date.getHours();
		this.startMin = this.date.getMinutes();
		this.isDayViewSelected = false;
		this.isWeekViewSelected = false;
		this.viewOnlyMe = false;
		this.viewEveryone = false;
		this.dayViewClicked();
		this.viewEveryoneClicked ();
		
		this.addingEmployeeState = false;
	}
	
	onInit () {
		
	}
	
	// click handlers
	dayViewClicked () {
		this.isDayViewSelected = true;
		this.isWeekViewSelected = false;
		this.calendarService.setShowDayView();
	}
	
	dayViewMinusClicked() {
		if (this.isWeekViewSelected) {
			this.dayViewClicked();
			return;
		}
		this.calendarService.decreaseDay(1);
	}
	
	dayViewPlusClicked () {
		if (this.isWeekViewSelected) {
			this.dayViewClicked();
			return;
		}
		this.calendarService.increaseDay(1);
	}
	
	weekViewClicked () {
		this.isDayViewSelected = false;
		this.isWeekViewSelected = true;
		this.calendarService.setShowWeekView();
	}
	
	weekViewMinusClicked () {
		if (this.isDayViewSelected) {
			this.weekViewClicked();
			return;
		}
		this.calendarService.decreaseDay(7);
	}
	
	weekViewPlusClicked () {
		if (this.isDayViewSelected) {
			this.weekViewClicked();
			return;
		}
		this.calendarService.increaseDay(7);
	}
	
	viewOnlyMeClicked () {
		this.calendarService.setShowUserApptsOnly();
		this.viewEveryone = false;
		this.viewOnlyMe = true;
	}
	
	viewEveryoneClicked () {
		this.calendarService.setShowAllUserAppts();
		this.viewEveryone = true;
		this.viewOnlyMe = false;
	}
	
	/* calendar adjustments, these alter the calendar start date
	and have nothing to do with which date is selected */ 
	
	minusDayClicked () {
		this.calendarService.decreaseDay(1);
	}
	
	plusDayClicked () {
		this.calendarService.increaseDay(1);
	}
	
	monthClicked () {
		
	}
	
	minusMonthClicked () {
		this.calendarService.changeMonth (-1);
	}
	
	plusMonthClicked () {
		this.calendarService.changeMonth (1);
	}
	
	
	yearClicked () {
		
	}
	
	minusYearClicked () {
		this.calendarService.changeYear (-1);
	}
	
	plusYearClicked () {
		this.calendarService.changeYear (1);
	}
	
	/* OUTPUTS */
	addAppointmentClicked () {
		// this.appointment.next ({param: 'params'});
		this.calendarService.creatingAppointment = true;
		
		console.log ("clicked add appointment");
	}
	
	cancelAddAppointmentClicked () {
		// TODO: ONLY REFER to the calendar service state variables
		// remove later, but only keep the 2nd one
		
		this.calendarService.creatingAppointment = false;
		console.log ("canceled");
	}
	
	
	/**
	 * this is meant to be moved 
	 */
	addEmployeeClicked () {
		this.addingEmployeeState = true;
	}
}