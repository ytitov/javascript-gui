import {bootstrap} from 'angular2/platform/browser';
import {Component, OnInit} from 'angular2/core';
import {NgFor} from 'angular2/common';

import {UserGuiDTO} from './logic/objects/gui-dto/UserDTO'
import {Appointment} from './logic/objects/appointment';
import {Employee} from './logic/objects/employee';
import {ColumnItem} from './logic/calendar/columnitem';
import {RecordDTO} from "./logic/Data/RecordDTO";

// services
import {CalendarService} from './services/CalendarService';
import {UserService} from './services/User.service';
import {AppointmentService} from './services/Appointment.service';
import {StorageService} from './services/Storage.service';


// components
import {MainCalendarViewComponent}
from './views/CalendarView/MainCalendarView.component';
import {IncrementButtonComponent}
from './views/IncrementButton/IncrementButton.component';

// popup dialogs
import {DialogComponent}
  from "./views/Dialog/Dialog.component";
import {ManageDialogComponent}
  from "./views/ManageDialog/ManageDialog.component";
import {AddAppointmentDialogComponent}
  from './views/AddAppointmentDialog/AddAppointmentDialog.component';

// menus
import {CalendarMenuComponent}
from './views/Menus/CalendarMenu/CalendarMenu.component';



@Component({
  selector: 'app',
  templateUrl: './views/main/mainView.html',
  styleUrls: ['./views/Menus/menu.css'],
  directives: [
    DialogComponent,
    ManageDialogComponent,
    AddAppointmentDialogComponent, // replacing above
    MainCalendarViewComponent,
    IncrementButtonComponent,
    CalendarMenuComponent,
  ], //
  providers: [
    StorageService,
    UserService,
    AppointmentService,
    CalendarService,
  ] // register the services with the injector
})

export class App implements OnInit {

  displayedAppointmentList: ColumnItem[]; // this is what is fed into the calendar by
  // the service
  displayedEmployeesCalendar: Employee[];
  
  selectedDate: any;
  selectedTimeLabel: string;
  showAddApopintmentDialog: boolean;
  showCalendarMenu: boolean;
  
  showManagerDialog: boolean;
  showDialog: boolean; // testing the dialog

  // testing callbacks
  public callbackFunc: Function;

  constructor(
    private storageService: StorageService,
    private calendarService: CalendarService,
    private userService: UserService,
    private appointmentService: AppointmentService) {

    // the call back function for the initial loading of users from localStorage
    this.callbackFunc = this.updateMainView.bind(this);

    // load users, start is called after users are loaded.
    this.storageService.loadAllUsersTEMP(this.callbackFunc);

    this.displayedAppointmentList = [];
    this.displayedEmployeesCalendar = [];
    var date1 = new Date(2016, 5, 21, 0, 0, 0, 0);    

    this.selectedDate = {
      day: "0", month: "nevermonth", year: "neveryear"
    }

    this.showDialog = false;
    this.showManagerDialog = false;
    this.showAddApopintmentDialog = false;
    
    // menus found on the left on main page
    this.showCalendarMenu = true;



    /**
     * TESTING THE STORAGE
     */
    // this.storageService.localStorage.debugONLY_delAll();
    var name = new Date(Date.now()).toDateString() + " name";
    var record = new Employee();
    record.person.first = name;
    //this.storageService.addRecord (record);
    
    // var list = [];
    this.displayedEmployeesCalendar = this.userService.getDummyUsers();
    // console.log ("no promise list: ");
    // conssole.log(list);

  }

  /**
   * called after, initial data is loaded, like the employee list
   */
  updateMainView(): void {
    console.log("start:");
    this.displayedEmployeesCalendar = this.storageService.employeeList;
    this.calendarService.setUsers (this.storageService.employeeList);
    this.calendarService.drawView();
    this.userService.setUserList (this.storageService.employeeList)
  }

  /*
  these three are called by the mainCalendarComponent
  This function updates the current date, then opens the dialog for appointment
  creation
  */

  mainCalendarComponentTimeSelected(timeLabel: any) {
    if (this.calendarService.creatingAppointment) {
      //this.showAddAppointment = true; // shows the appointment dialog
      this.selectedTimeLabel = timeLabel;
      this.selectedDate = this.calendarService.getSelectedDate();
      this.handleShowAddAppointmentDialog();
      this.calendarService.creatingAppointment = false;
    }
  }

  mainCalendarComponentDateUpdate(data: any) {
    console.log("mainCalendarComponentDateUpdate");
    this.selectedDate = {
      day: data.date.getDate(),
      month: data.date.getMonth(),
      year: data.date.getFullYear(),
      hours: data.date.getHours(),
      minutes: data.date.getMinutes()
    }
  }

  mainCalendarComponentEmployeeUpdate(empId) {
    console.log("appt.ts: handleSelectedEmployee");
    console.log (empId);
    this.userService.setSelectedUser(empId);
  }


  /*
  Called from the CalendarMenu
  */
  handleNewAppointmentClick(params: any) {
    console.log(" remove this function ")
  }

  /**
   * called by multiple dialogs
   */
  handleAddRecord(record: RecordDTO) {
    this.storageService.addRecord(record);
  }
  
  /* dialog testing */
  
  handleShowDialogClicked() {
    this.showDialog = true;
  }
  
  handleCancelClicked() {
    this.showDialog = false;
  }
  
  handleAcceptClicked() {
    this.showDialog = false;
  }
  
  /* manage dialog */
  
  handleShowManageDialogClicked() {
    console.log ("show manage dialog")
    this.showManagerDialog = true;
  }
  
  handleManageCancelClicked() {
    console.log ("appt.ts: cancel");
    this.showManagerDialog = false;
  }
  
  handleManageAcceptClicked() {
    console.log ("appt.ts: cancel");
    this.showManagerDialog = false;
  }
  
  /* add appointment dialog */
  handleShowAddAppointmentDialog () {
    this.showAddApopintmentDialog = true;
  }
  
  handleAcceptAddAppointment () {
    
    this.calendarService.drawView();
    this.showAddApopintmentDialog = false;
  }
  
  handleCancelAddAppointment () {
    this.showAddApopintmentDialog = false;
  }


}
// bootstrap it to make it global to the whole app
bootstrap(App);