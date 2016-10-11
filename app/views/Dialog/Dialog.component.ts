import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';

import {UserGuiDTO} from '../../logic/objects/gui-dto/UserDTO';

import {CalendarService} from '../../services/CalendarService';
import {UserService} from '../../services/User.service';

import {IncrementButtonComponent} from '../IncrementButton/incrementButton.component';

/**
 * This is a shell for a dialog and provides only cancel and accept buttons.
 * 
 * Also, gives the ability to set the title, menu, and body using div tags like:
 * 	<div title>I render in title.</div>
    <div menu>I render in menu.</div>
    <div body>I render in body.</div>
 */

@Component({
  selector: 'dialog-component',
  templateUrl: './views/Dialog/Dialog.html',
  styleUrls: ['./views/Dialog/Dialog.css'],
  directives: [], //
  providers: [] // register the service with the injector
})

export class DialogComponent implements OnInit {

	@Output() cancel = new EventEmitter<string>();
	@Output() accept = new EventEmitter<string>();
	
	@Input() cancelText: string;
	@Input() acceptText: string;
	
	@Input() showAccept: boolean;

	constructor() {
		this.cancelText = "Cancel";
		this.acceptText = "Accept";
		this.showAccept = true;
	}

	ngOnInit() {

	}
	
	cancelClicked () {
		this.cancel.emit("");
	}
	
	acceptClicked () {
		this.accept.emit("");
	}


}