import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';

import {UserGuiDTO} from '../../logic/objects/gui-dto/UserDTO';

import {CalendarService} from '../../services/CalendarService';
import {UserService, ManageMenu} from '../../services/User.service';

import {IncrementButtonComponent} from '../IncrementButton/incrementButton.component';
import {DialogComponent} from '../Dialog/Dialog.component';
import {EmployeeComponent} from "./Employee.component";
import {ClientComponent} from "./Client.component";
import {ServiceComponent} from "./Service.component";

/**
 * This is a shell for a dialog and provides only cancel and accept buttons.
 * 
 * Also, gives the ability to set the title, menu, and body using div tags like:
 * 	<div title>I render in title.</div>
    <div menu>I render in menu.</div>
    <div body>I render in body.</div>
 */

@Component({
  selector: 'manage-dialog-component',
  templateUrl: './views/ManageDialog/ManageDialog.html',
  styleUrls: ['./views/Dialog/Dialog.css'],
  directives: [
		DialogComponent,
		EmployeeComponent,
		ClientComponent,
		ServiceComponent],
		 //
  providers: [] // register the service with the injector
})

export class ManageDialogComponent implements OnInit {

	@Output() cancel = new EventEmitter<string>();
	@Output() accept = new EventEmitter<string>();
	
	@Input() showEmployeeButton: boolean;
	@Input() showClientButton: boolean;
	@Input() showProductButton: boolean;
	@Input() showServiceButton: boolean;
	@Input() showScheduleButton: boolean;
	
	employeeMenuID = ManageMenu.Employee;
	clientMenuID = ManageMenu.Client;
	productMenuID = ManageMenu.Product;
	serviceMenuID = ManageMenu.Service;
	scheduleMenuID = ManageMenu.Schedule;
	
	activeMenu: number;
	cancelText = "Exit";

	constructor() {
		this.activeMenu = -1;
	}

	ngOnInit() {

	}
	
	employeeClicked() {
		this.activeMenu = ManageMenu.Employee;
	}
	
	clientClicked() {
		this.activeMenu = ManageMenu.Client;
	}
	
	productClicked() {
		this.activeMenu = ManageMenu.Product;
	}
	
	serviceClicked () {
		this.activeMenu = ManageMenu.Service;
	}
	
	scheduleClicked () {
		this.activeMenu = ManageMenu.Schedule;
	}
	
	/*
	re-route from bare dialog to the parent of this component*/
	
	cancelClicked () {
		console.log ("MD: cancel")
		this.cancel.emit("");
	}
	
	acceptClicked () {
		this.accept.emit("");
	}
	
	


}