/**
 * start working on the service, and move the logic of adding out of the component
 */

import {Injectable, Output, EventEmitter} from 'angular2/core';

import {Calendar} from '../logic/calendar/calendar';
import {Column} from '../logic/calendar/column';
import {ColumnItem} from '../logic/calendar/columnitem';
import {TimeBlock} from '../logic/calendar/TimeBlock';
import {TimeSlots} from '../logic/calendar/TimeSlots';

import {UserGuiDTO} from '../logic/objects/gui-dto/UserDTO';

import {AppointmentService} from './Appointment.service';
import {UserService} from './User.service';

/**
 * Helper class to help keep track of the main columns
 */
class MainCol {
	date: Date;
	id: number;

	constructor(date) {
		this.date = date;
		this.id = this.date.valueOf();
	}
}

@Injectable()
export class CalendarService {
	/*
	Contains a list of calendars, each calendar is for one calendar day.
	In turn each calendar contains main columns corresponding to each user
	to be presented.  Then each of those columns has the appropriate appointments
	to be displayed.  This is all abstracted out of the actual calendar.  The only
	thing that the calendar is aware of is that it is only displaying info
	for one day.
	*/

	dateStart: Date;
	dateNumDays: number;
	dateEnd: Date;
	dateStartString: string;
	dateEndString: string; // is always updated to today + 7 days (because of my week view button)
	dateList: Date[];
	mainColumns: MainCol[]; // main column for each date

	monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	calendar: Calendar;
	totalWidth: number;

	itemList: ColumnItem[]; // the actual appointment blocks to draw
	labelList: ColumnItem[]; // the date super columns (if viewing more than one day)
	userLabelList: ColumnItem[]; // all selected users
	timeLabelList: ColumnItem[]; // these are the labels for the times

	// state variables
	private showDayView: boolean;
	private showWeekView: boolean;
	private showUserApptsOnly: boolean;
	private showAllUserAppts: boolean;
	creatingAppointment: boolean;

	private selectedDate: Date;

	// selectedUser: UserGuiDTO;

	// appearance variables
	defaultColWidth: number;
	timeLabelFontSize: number;
	verticalOffset: number;

	userList: UserGuiDTO[]; // the displayed user list, links to UserService

	constructor(private userService: UserService,
		private appointmentService: AppointmentService) {
		console.log("Calendar defaulting to 0900 to 2000 with 15 min intervals");
		this.mainColumns = []; // contains all dates which are displayed
		this.defaultColWidth = 100;
		this.timeLabelFontSize = 12;
		this.dateStartString = "";
		this.dateEndString = "";
		this.dateStart = new Date(Date.now());
		this.selectedDate = this.dateStart;
		this.verticalOffset = 80;

		this.creatingAppointment = false;
	}

	/** sets up calendar, and draws up the labels for the time slots,
	 * draw column headers must be called separately
	 */
	init() {
		// TODO: move all params in here for calendar, so its clearer what they are.
		var calParams = {
			timeLabelHeight: this.timeLabelFontSize + 10,
			mainHorizOffset: 60,
			vSpace: this.verticalOffset,
			dateLabelHeight: 40,
			userLabelHeight: 40
		}

		this.calendar = new Calendar(calParams, this.defaultColWidth, 9, 0, 20, 0, 15);
		this.calendar.userLabelPadding.left = 0;
		this.calendar.userLabelPadding.right = 0;

		// get the times labels
		this.timeLabelList = this.calendar.getTimeLabels();

		// set up the defaults for state variables
		// show today, and all users
		this.showDayView = true;
		this.showWeekView = false;
		this.showUserApptsOnly = false; // going away
		this.showAllUserAppts = true; // going away, purely depending on input user list
		// this.updateView();
	}

	setDate(date: Date) {
		this.dateStart = date;
	}

	public setUsers(userList: UserGuiDTO[]) {
		this.userList = userList;
	}

	/**
	 * this replaces updateView_OLD, and showAllUsers_OLD
	 */
	public drawView() {
		console.log ("draw view, userList: ");
		console.log (this.userList);
		this.calendar.clearMainColumns();
		this.calendar.deleteMainColumns();
		if (this.showDayView) {
			this.dateNumDays = 0;
		} else if (this.showWeekView) {
			this.dateNumDays = 7;
		}
		this.genDateList();
		this.itemList = [];
		this.fillCalendar_NEW();
		this.updateItemList();
	}

	/**
	 * creates the main date columns according to dateStart and dateEnd, then it creates
	 * the displayed user sub columns according to the userList.
	 * Also loops through all of the main columns, and requests all of the appointments
	 * that belong to displayed users from the AppointmentService.
	 * This is run last when all column headers are set up.
	 */
	private updateItemList() {
		var itemList = [];
		var mainColOffset = 0;
		var usrColOffset = 0 + this.calendar.mainHorizOffset;
		var offset = 0 + this.calendar.mainHorizOffset;

		for (var mainCol of this.calendar.rootCol.getSubCols()) {
			mainCol.width = 0;
			for (var userCol of mainCol.getSubCols()) {
				var returnedWidth = 0;
				returnedWidth = userCol.getAll(itemList, offset, this.defaultColWidth);
				userCol.width = returnedWidth;

				usrColOffset += userCol.width;
				offset = mainColOffset + usrColOffset;
				mainCol.width += returnedWidth;
			}
			// mainCol.width += returnedWidth;
			// console.log ("mainCol.width: "+mainCol.width);
			usrColOffset = 0 + this.calendar.mainHorizOffset;
			mainColOffset += mainCol.width;
			this.totalWidth += mainCol.width;
		}
		this.itemList = itemList;
		this.labelList = this.calendar.getMainColumnLabels();
		this.userLabelList = this.calendar.getUserColumnLabels();
		this.totalWidth = this.calendar.totalWidth;
	}

	/**
	 * Generates a list of Date objects starting on @date, and ending numDays after that date
	 */
	genDateList() {
		// console.log ("generating date list: dateStart is: ");
		// console.log (this.dateStart);
		
		var date = this.dateStart;
		var numDays = this.dateNumDays;
		this.dateList = [];
		this.dateList.push(date);
		for (var x = 1; x <= numDays; x++) {
			var nextDay = new Date(date.getFullYear(), date.getMonth(),
				date.getDate() + x);
			this.dateList.push(nextDay);
		}
		// console.log (this.dateList);
		this.dateEnd = this.dateList[this.dateList.length - 1];
		this.dateStartString = this.dateStart.toDateString();
		// console.log ("end date: ")
		// console.log(this.dateEnd);
		var x = 7;
		var nextDay = new Date(date.getFullYear(), date.getMonth(),
			date.getDate() + x);
		this.dateEndString = nextDay.toDateString();
	}

	/**
	 * assumes blank calendar, creates the main columns from dateList, then
	 * fills each of those with subCols according to userList, and finally
	 * as it does that, calls AppointmentService.getAppointmentList to fill each of those columns
	 * another thing to note is, these are holder columns, only contain
	 * subColumns (why onlySubCols is true), and must have their width
	 * set to actual values (this is needed to compute coordinates for appointments)
	 */

	fillCalendar_NEW() {
		for (var date of this.dateList) {
			var dateCol = new Column();
			dateCol.onlySubCols = true;
			dateCol.id = date.toDateString();
			dateCol.titleLabel = date.toDateString();
			dateCol.width = 0;
			this.calendar.rootCol.subCols.push(dateCol);
			var dateColWidth = 0;
			// generate main sub column here
			for (var userDTO of this.userList) {
				var userCol = new Column();
				userCol.onlySubCols = true;
				userCol.id = userDTO.getId();
				userCol.titleLabel = userDTO.getLabel();
				userCol.width = this.defaultColWidth;
				dateCol.subCols.push(userCol);
				dateColWidth += this.defaultColWidth;
				// generate user sub column here
				for (var timeBlock of this.appointmentService.getAppointmentList(userDTO.getId(), date)) {
					// then fill it with appointments
					this.calendar.addToUserCol(userCol, dateCol, timeBlock);
				}
			}
			dateCol.width = dateColWidth;
		}
	}

	increaseDay(days: number) {
		var prevDay = new Date(this.dateStart.getFullYear(), this.dateStart.getMonth(),
			this.dateStart.getDate() + days);
		this.dateStart = prevDay;
		this.genDateList();
		this.drawView();
	}

	decreaseDay(days: number) {
		var prevDay = new Date(this.dateStart.getFullYear(), this.dateStart.getMonth(),
			this.dateStart.getDate() - days);
		this.dateStart = prevDay;
		this.genDateList();
		this.drawView();
	}

	changeMonth(num: number) {
		console.log("changeMonth");
		var prevDate = new Date(this.dateStart.getFullYear(), this.dateStart.getMonth() + num,
			this.dateStart.getDate());
		// if cur month day is 31, going to next month will skip (because there are 30 days)
		// and sense cur day is 31, 30+1 days ends up in yet the next month over skipping
		// the immediately next month.
		if (this.dateStart.getDate() == 31) {
			prevDate = new Date(this.dateStart.getFullYear(), this.dateStart.getMonth() + num,
				this.dateStart.getDate() - 1);
		}
		this.dateStart = prevDate;
		this.genDateList();
		this.drawView();
	}

	changeYear(num: number) {
		var prevDate = new Date(this.dateStart.getFullYear() + num, this.dateStart.getMonth(),
			this.dateStart.getDate());
		this.dateStart = prevDate;
		this.genDateList();
		this.drawView();
	}

	setSelectedDate(date: Date) {
		this.selectedDate.setFullYear(date.getFullYear());
		this.selectedDate.setMonth(date.getMonth());
		this.selectedDate.setDate(date.getDate());
		this.selectedDate.setHours(date.getHours());
		this.selectedDate.setMinutes(date.getMinutes());

	}

	setShowDayView() {
		this.showDayView = true;
		this.showWeekView = false;
		this.drawView();
	}

	setShowWeekView() {
		this.showWeekView = true;
		this.showDayView = false;
		this.drawView();
	}

	setShowUserApptsOnly() {
		this.showUserApptsOnly = true;
		this.showAllUserAppts = false;
		this.drawView();
	}

	setShowAllUserAppts() {
		this.showUserApptsOnly = false;
		this.showAllUserAppts = true;
		this.drawView();
	}

	getShowUserApptsOnly(): boolean {
		return this.showUserApptsOnly;
	}

	getShowDayView() {
		return this.showDayView;
	}

	getSelectedDate() {
		return this.selectedDate;
	}

	getStartDate() {
		return this.dateStart;
	}

	getSelectedMonthString() {
		return this.monthNames[this.selectedDate.getMonth()];
	}
}