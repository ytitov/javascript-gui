import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';

import {UserGuiDTO} from '../../logic/objects/gui-dto/UserDTO';
import {ClientGuiDTO} from '../../logic/objects/gui-dto/ClientDTO';
import {Client} from '../../logic/objects/client';
import {Employee} from '../../logic/objects/employee';
import {Service} from '../../logic/objects/service';
import {Appointment} from '../../logic/objects/appointment';

import {CalendarService} from '../../services/CalendarService';
import {StorageService} from '../../services/Storage.service';
import {UserService, ManageMenu} from '../../services/User.service';
import {AppointmentService} from '../../services/Appointment.service';

import {IncrementButtonComponent} from '../IncrementButton/incrementButton.component';
import {DialogComponent} from '../Dialog/Dialog.component';
import {ClientComponent} from "../ManageDialog/Client.component";

/**
 * This is a shell for a dialog and provides only cancel and accept buttons.
 * 
 * Also, gives the ability to set the title, menu, and body using div tags like:
 * 	<div title>I render in title.</div>
    <div menu>I render in menu.</div>
    <div body>I render in body.</div>
 */

@Component({
  selector: 'add-appointment-dialog-component',
  templateUrl: './views/AddAppointmentDialog/AddAppointmentDialog.html',
  styleUrls: ['./views/Dialog/Dialog.css'],
  directives: [
		DialogComponent,
		ClientComponent,
		IncrementButtonComponent
		],
	//
  providers: [] // register the service with the injector
})

export class AddAppointmentDialogComponent implements OnInit {
	
	employeeList: UserGuiDTO[];

	@Input() selectedDate: any;
	@Input() timeLabel: string; // pointless can get this from selectedDate
	timeHoursLabel: string;
	timeMinutesLabel: string;
	lengthHoursLabel: string;
	lengthMinutesLabel: string;
	durationDateObject: Date;
	lengthMinutes: number;

	@Output() cancel = new EventEmitter<string>();
	@Output() accept = new EventEmitter<string>();

	selectedClient: Client;
	selectedEmployee: Employee;
	serviceList: Service[];

	mainMenuID = 1;
	serviceMenuID = 2;
	clientMenuID = 3;
	employeeMenuID = 4;

	activeMenu: number;

	selectedEmployeeLabel: string;
	selectedClientLabel: string;
	
	// service search stuff
	searchInput: string;
	loadedServiceList: Service[];
	selectedService: Service;

	constructor(private userService: UserService,
			private storageService: StorageService,
			private appointmentService: AppointmentService) {
		this.activeMenu = this.mainMenuID;
		this.selectedEmployeeLabel = "Not Selected";
		this.selectedClientLabel = "Not Selected";
		this.serviceList = [];
		this.timeHoursLabel = "";
		this.timeMinutesLabel = "";
		this.lengthHoursLabel = "";
		this.lengthMinutesLabel = "";
		this.durationDateObject = new Date(Date.now());
		this.lengthMinutes = 0;
		this.calcLengthDateObject();
		this.employeeList = this.userService.userList;
		
		// service search stuff
		this.searchInput = "";
		// just dummy service for initial
		var params = {
			employeeId: "-",
			title: "-",
			description: "-",
			priceWholeNum: "-",
			priceDecimal: "-"
		}
		this.selectedService = new Service(params);
	}

	ngOnInit() {
		console.log("selected date");
		console.log(this.selectedDate);
		var ret = this.setTimeLabel(this.selectedDate);
		this.timeHoursLabel = ret.hours;
		this.timeMinutesLabel = ret.minutes;
		var ret = this.setTimeLabel(this.durationDateObject);
		this.lengthHoursLabel = ret.hours;
		this.lengthMinutesLabel = ret.minutes;
	}
	
	/*
	re-route from bare dialog to the parent of this component*/

	cancelClicked() {
		console.log("Appointment: cancel")
		this.cancel.emit("");
	}

	acceptClicked() {
		
		var dateEnd = new Date(this.selectedDate)
		var dateStart = new Date(this.selectedDate);
		dateEnd.setHours(0);
		dateEnd.setMinutes(dateEnd.getMinutes() + this.lengthMinutes);
		dateEnd.setHours(dateEnd.getHours() + this.selectedDate.getHours());
		console.log ("start of appointment: ");
		console.log(this.selectedDate);
		console.log ("end of appointment: ");
		console.log(dateEnd);
		
		var appt = new Appointment(dateStart, dateEnd);
		appt.services = this.serviceList;
    // appt.userId = this.userService.currentUser.getId();
    // console.log (this.calendarService);
    appt.userId = this.userService.getSelectedUser().getId();
    this.appointmentService.addAppointment(appt);
		console.log ("appointment: ");
		console.log (appt);
		this.accept.emit("");
	}

	selectEmployeeClicked() {
		this.activeMenu = this.employeeMenuID;
	}

	selectClientClicked() {
		this.activeMenu = this.clientMenuID;
	}

	handleSelectClient(client: ClientGuiDTO) {
		console.log("handleSelectClient");
		this.selectedClientLabel = client.getLabel();
		this.activeMenu = this.mainMenuID;
	}

	increaseLengthClicked(amount: number) {
		if (this.lengthMinutes + amount >= 0) {
			var minutes = this.lengthMinutes + amount;
			this.lengthMinutes += amount;
			this.durationDateObject.setHours(0);
			this.durationDateObject.setMinutes(minutes)
			var ret = this.setTimeLabel(this.durationDateObject);
			this.lengthHoursLabel = ret.hours;
			this.lengthMinutesLabel = ret.minutes;
		} else {
			return;
		}
	}

	increaseTimeClicked() {
		var minutes = this.selectedDate.getMinutes();
		this.selectedDate.setMinutes(minutes + 5);
		var ret = this.setTimeLabel(this.selectedDate);
		this.timeHoursLabel = ret.hours;
		this.timeMinutesLabel = ret.minutes;
	}

	decreaseTimeClicked() {
		var minutes = this.selectedDate.getMinutes();
		this.selectedDate.setMinutes(minutes - 5);
		var ret = this.setTimeLabel(this.selectedDate);
		this.timeHoursLabel = ret.hours;
		this.timeMinutesLabel = ret.minutes;
	}

	setTimeLabel(date: Date) {
		var minutesLabel = "";
		var hoursLabel = "";
		console.log("setTimeLabel:")
		console.log(date);
		var minutes = date.getMinutes();
		var hours = date.getHours();

		if (minutes < 10) {
			minutesLabel = "0" + minutes.toString();
		} else {
			minutesLabel = minutes.toString();
		}

		if (hours < 10) {
			hoursLabel = "0" + hours.toString();
		} else {
			hoursLabel = hours.toString();
		}
		return { hours: hoursLabel, minutes: minutesLabel };
	}
	
	calcLengthDateObject() {
		this.durationDateObject.setHours(0);
		this.durationDateObject.setMinutes(this.lengthMinutes);
	}
	
	/**
	 * called when selecting an employee inside the employee menu
	 */
	employeeItemClicked (emp: Employee) {
		this.selectedEmployee = emp;
		this.selectedEmployeeLabel = emp.getLabel();
		this.activeMenu = this.mainMenuID;
	}
	
	/* SERVICE SEARCH STUFF */
	
	searchInputChanged() {
		
		var words = this.searchInput.split(" ");
		console.log ("searching for words: ");
		console.log (words);
		
		
		
		var filteredWords = [];
		
		for (var item of words) {
			if (item.length > 1) {
				filteredWords.push(item);
			}
		}
		
		if (filteredWords.length == 0) {
			this.loadAllServices();
			return;
		}
		
		var _this = this;
		this.storageService.localStorage.serviceLoader.searchTerms(filteredWords).then(
			list => {
				_this.loadedServiceList = list;
			},
			error => {
				console.log("Error loading all services");
			}
		);
	}
	
	loadAllServices() {
		var _this = this;
		this.storageService.localStorage.serviceLoader.getAll().then(
			list => {
				_this.loadedServiceList = list;
			},
			error => {
				console.log("Error loading all services");
			}
		);
	}
	
	/**
	 * adds the service to the appointment
	 */
	serviceClicked(service: Service) {
		this.serviceList.push(service);
		this.lengthMinutes += service.getLengthMinutes();
		this.increaseLengthClicked(0); // updates my labels without adding more time
	}


}