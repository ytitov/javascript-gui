import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';
import {NgFor, NgClass} from 'angular2/common';

import {UserGuiDTO} from '../../logic/objects/gui-dto/UserDTO';

import {Calendar} from '../../logic/calendar/calendar';

import {StorageService} from "../../services/Storage.service";
import {CalendarService} from '../../services/CalendarService';
import {UserService} from '../../services/User.service';

import {ColumnItem} from '../../logic/calendar/columnitem';
import {Appointment} from '../../logic/objects/appointment';

import {IncrementButtonComponent}
from '../IncrementButton/IncrementButton.component';

@Component({
  selector: 'main-calendar-view-component',
  templateUrl: './views/CalendarView/MainCalendarView.html',
  styleUrls: ['./views/CalendarView/CalendarView.css'],
  directives: [IncrementButtonComponent], //
  providers: [] // register the service with the injector
})

export class MainCalendarViewComponent implements OnInit {



	selectedDateLabel: string;
	selectedTimeLabel: string;
	selectedEmployeeID: string;

	selectedEmployeeLabel: string;
	
	employeeList: UserGuiDTO[];

	@Output() selectDateOutput = new EventEmitter();
	@Output() selectEmployeeOutput = new EventEmitter();
	@Output() selectTimeOutput = new EventEmitter();

	mouseX: number; mouseY: number;
	mouseInTimeLabel: string;
	mouseInTimeLabelHide: boolean;
	scrollXPosition: number; // for positioning the labels as you scroll horizontally
	scrollYPosition: number;
	widthOfTimeLabels: number;
	hoveringTimeLabel: string;
	disableAppointmentMouseInputs: boolean;

	constructor(
		private storageService: StorageService,
		private calendarService: CalendarService,
		private userService: UserService) {

		// this is a place holder before real users get loaded
		// due to promise
		this.employeeList = userService.getDummyUsers();
				
		this.calendarService.init();
		this.calendarService.setDate(new Date(Date.now()));
		
		this.selectedEmployeeID = this.userService.getSelectedUser().getId();
		this.selectedEmployeeLabel = this.userService.getSelectedUser().getLabel();
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseInTimeLabel = "";
		this.mouseInTimeLabelHide = true;

		this.scrollXPosition = 0;
		this.scrollYPosition = 0;
		this.widthOfTimeLabels = this.calendarService.calendar.mainHorizOffset;
		this.hoveringTimeLabel = "";
		this.disableAppointmentMouseInputs = false;

		/* This shouldn't be called here, no reason to, but the calendar menu
		causes a bunch of errors, due to some things not being ready, so FIXME: later*/
		this.updateView(); 
	}

	ngOnInit() {
	}

	selectTimeClicked(timeLabel: string) {
		var newDate = this.calendarService.getSelectedDate();
		var hours = timeLabel.slice(0, 2);
		var minutes = timeLabel.slice(3, 5);

		this.calendarService.getSelectedDate().setHours(Number(hours))
		this.calendarService.getSelectedDate().setMinutes(Number(minutes));
		this.selectedTimeLabel = timeLabel;
		this.selectTimeOutput.next(timeLabel);
	}

	selectDateClicked(dateId: string) {
		// had to go to using the date title string, because couldn't reconstruct
		// from the dateID

		this.selectedDateLabel = dateId;
		var date = new Date(dateId);
		console.log("select date clicked: " + date.toDateString());
		this.calendarService.setSelectedDate(date);
		this.selectDateOutput.next({
			date: date,
			monthString: this.calendarService.getSelectedMonthString()
		});

		// because this.selectedEmployeeID is "employeeId,dateId" must split these
		// and switch the highlighted employee from the previous date sub col, to the
		// newly selected
		var split = this.selectedEmployeeID.split(",");
		this.selectedEmployeeID = split[0] + "," + dateId;
	}

	selectEmployeeClicked(empId: string, parentId: string) {
		console.log ("------------selectedEmployeeId: "+empId);
		this.selectedEmployeeID = empId; // id for the GUI
		var actualId = empId.split(",")[0];
		this.selectedEmployeeLabel = this.userService.getSelectedUser().getLabel();
		this.selectDateClicked(parentId);

		this.selectEmployeeOutput.next(actualId);
	}

	mouseHoverTime(event: any, label: string) {
		this.mouseX = event.pageX + 50;
		this.mouseY = event.pageY - this.calendarService.verticalOffset;
		this.mouseInTimeLabel = label;
		this.mouseInTimeLabelHide = false;
	}

	mouseHoverAppointment(event: any, id: string) {
		this.mouseInTimeLabel = "Appt Id: " + id;
	}

	mouseLeftCalendar() {
		this.mouseInTimeLabel = "left";
		this.mouseInTimeLabelHide = true;
		this.hoveringTimeLabel = ""; // turn off the highlight
	}

	viewPosition(event: any) {
		// console.log (event.srcElement.scrollingElement.scrollLeft);
		// console.log (event.target.scrollingElement.scrollLeft);
		// console.log (event);
		this.scrollXPosition = event.target.scrollingElement.scrollLeft;
		this.scrollYPosition = event.target.scrollingElement.scrollTop;

	}

	highlightTitleLabel(titleLabel: string) {
		this.hoveringTimeLabel = titleLabel;
	}

	/**
	 * Redraws the calendar according to which users are loaded
	 */
	updateView() {
		this.calendarService.setUsers(this.employeeList);
		this.calendarService.drawView();
	}

}