import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core';

import {Service} from "../../logic/objects/service"
import {ServiceGuiDTO} from '../../logic/objects/gui-dto/ServiceDTO';

import {StorageService} from '../../services/Storage.service';
import {UserService} from '../../services/User.service';

import {PersonEditComponent} from "./PersonEdit.component";
import {IncrementButtonComponent} from "../IncrementButton/IncrementButton.component"

@Component({
  selector: 'service-component',
  templateUrl: './views/ManageDialog/Service.html',
  styleUrls: ['./views/Dialog/Dialog.css'],
  directives: [IncrementButtonComponent], //
  providers: [] // register the service with the injector
})

export class ServiceComponent implements OnInit {
	serviceList: ServiceGuiDTO[]

	searchInput: string;

	employeeId: string;
	title: string;
	description: string;
	priceWholeNum: number;
	priceDecimal: number;
	unitSymbol: string;
	unitDescription: string;
	lengthMinutes: number;

	priceString: string; // whole thing with decimal
	outPriceString: string;
	lengthTimeObject: Date;
	timeString: string;
	delButtonLabel: string;

	// buttons
	showEditButton: boolean;
	showSubmitButton: boolean;
	showAddButton: boolean;
	canEditFields: boolean;
	showDeleteButton: boolean;
	showCancelDeleteButton: boolean;

	selectedService: Service;

	constructor(private storageService: StorageService) {
		this.priceString = "";
		this.showAddButton = true;
		this.canEditFields = false;
		this.showDeleteButton = false;
		this.showCancelDeleteButton = false;
		this.lengthMinutes = 0;
		this.lengthTimeObject = new Date(Date.now());
		this.lengthTimeObject.setHours(0);
		this.lengthTimeObject.setMinutes(this.lengthMinutes);
		this.loadAllServices();
		this.timeString = "0.00";
		this.delButtonLabel = "Delete";

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

	}





	searchInputChanged() {
		// this is the original search, which matches the whole thing
		// as one word
		
		// console.log("search: " + this.searchInput);
		// if (this.searchInput.length == 0) {
		// 	this.loadAllServices();
		// 	return;
		// }
		// var _this = this;
		// this.storageService.localStorage.serviceLoader.search(this.searchInput).then(
		// 	list => {
		// 		_this.serviceList = list;
		// 	},
		// 	error => {
		// 		console.log("Error loading all services");
		// 	}
		// );
		
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
				_this.serviceList = list;
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
				_this.serviceList = list;
			},
			error => {
				console.log("Error loading all services");
			}
		);
	}

	serviceClicked(service: Service) {
		this.showAddButton = true;
		this.showDeleteButton = true;
		this.canEditFields = false;
		this.showEditButton = true;
		this.fillFields(service);
		this.selectedService = service;
	}

	clearFields() {
		this.employeeId = "";
		this.title = "";
		this.description = "";
		this.priceWholeNum = 0;
		this.priceDecimal = 0;
		this.unitSymbol = "";
		this.unitDescription = "";
		this.lengthMinutes = 0;
		this.priceString = "";
		this.outPriceString = "";
	}

	addServiceButtonClicked() {
		if (this.canEditFields == false) {
			this.showEditButton = false;
			this.canEditFields = true;
			this.clearFields();
		} else {
			var service = this.getServiceFromFields();
			this.selectedService = service;

			// this.storageService.addRecord(service);
			this.submitClicked();

			this.clearFields();
			this.showEditButton = false;
			this.showAddButton = false;
			this.canEditFields = false;
		}
		this.showDeleteButton = false;
		this.loadAllServices();
		
	}

	editButtonClicked() {
		this.canEditFields = true;
		this.showSubmitButton = true;
		this.showEditButton = false;
	}

	// deletes the service, then writes the updated copy
	submitClicked() {
		var serviceId = this.selectedService.getId();
		this.storageService.deleteRecord(this.selectedService);
		var service = this.getServiceFromFields();
		service.id = serviceId;
		this.storageService.addRecord(service);
		this.showSubmitButton = false;
		this.clearFields();
		this.loadAllServices();
	}

	/**
	 * fills all of the fields in the form,
	 * called when clicked on a particular service
	 */
	fillFields(service: ServiceGuiDTO) {
		this.employeeId = service.getEmployeeId();
		this.title = service.getTitle();
		this.description = service.getDescription();
		this.priceWholeNum = service.getPriceWholeNum();
		this.priceDecimal = service.getPriceDecimal();
		this.unitSymbol = service.getUnitSymbol();
		this.unitDescription = service.getUnitDescription();
		this.lengthMinutes = service.getLengthMinutes();
		this.setLengthTimeObject(service.getLengthMinutes());
		this.priceInputChanged(); // just to update the displayed time
		this.priceString = this.priceWholeNum + "." + this.priceDecimal;
		this.timeString = (this.lengthTimeObject.getHours() + ":" +
			this.lengthTimeObject.getMinutes()).toString();
		if (this.priceWholeNum == null || this.priceDecimal == null) {
			this.priceString = "0.00";
		}
		this.outPriceString = this.priceString;
	}

	getServiceFromFields(): Service {
		var params = {
			employeeId: this.employeeId,
			title: this.title,
			description: this.description,
			priceWholeNum: this.priceWholeNum,
			priceDecimal: this.priceDecimal
		}

		var service = new Service(params);
		var hour = this.lengthTimeObject.getHours();
		var mins = (this.lengthTimeObject.getMinutes());
		service.lengthMinutes = ((hour * 60) + mins);

		// set the price
		if (new RegExp('.').test(this.outPriceString)) {
			console.log(this.outPriceString);
			var price = this.outPriceString.split(".");
			this.priceWholeNum = parseInt(price[0]);
			if (price.length > 1) {
				this.priceDecimal = parseInt(price[1]);
			} else {
				this.priceDecimal = 0;
			}
			service.priceWholeNum = this.priceWholeNum;
			service.priceDecimal = this.priceDecimal;
		} else {
			// does not contain period
			service.priceWholeNum = parseInt(this.outPriceString);
			service.priceDecimal = 0;
		}


		service.lengthMinutes = this.lengthMinutes;

		return service;
	}

	priceInputChanged() {
		// remove all strings except for dot
		// TODO: there is a way to do this natively using angular2

		var result = this.priceString.replace(/[^\d.-]/g, '');
		if (result == null) {
			this.outPriceString = "0.0";
		} else {
			this.outPriceString = result;
		}
		// console.log (result);

	}

	setLengthTimeObject(minutes: number) {
		this.lengthTimeObject.setHours(0);
		this.lengthTimeObject.setMinutes(minutes);
	}

	increaseTimeClicked() {
		this.lengthMinutes += 5;
		this.lengthTimeObject.setHours(0);
		this.lengthTimeObject.setMinutes(this.lengthMinutes);
		this.timeString = (this.lengthTimeObject.getHours() + ":" +
			this.lengthTimeObject.getMinutes()).toString();
	}

	decreaseTimeClicked() {
		this.lengthMinutes -= 5;
		if (this.lengthMinutes <= 0) {
			this.lengthMinutes = 0;
		}
		this.lengthTimeObject.setHours(0);
		this.lengthTimeObject.setMinutes(this.lengthMinutes);
		this.timeString = (this.lengthTimeObject.getHours() + ":" +
			this.lengthTimeObject.getMinutes()).toString();
	}

	deleteButtonClicked() {
		if (this.showCancelDeleteButton) {
			// confirm delete clicked, so delete here
			this.storageService.deleteRecord(this.selectedService);
			
			this.showCancelDeleteButton = false;
			this.delButtonLabel = "Delete";
			this.clearFields();
			this.loadAllServices();
		} else {
			this.delButtonLabel = "Confirm Delete";
			this.showCancelDeleteButton = true;
		}
	}


}