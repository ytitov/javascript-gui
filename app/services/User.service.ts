import {Injectable} from 'angular2/core';

import {StorageService} from "./Storage.service";
import {UserGuiDTO} from '../logic/objects/gui-dto/UserDTO';
import {Employee} from '../logic/objects/employee';

/**
 * Used by the manage dialog to display appropriate menus
 */
export enum ManageMenu {
	Employee,
	Client,
	Product,
	Service,
	Schedule
}

/**
 * This service's job is to show the logged in user, the selected user, user list
 * to display for calendar is stored here.
 * 
 * Also: provide the list of manage menus here (not all will have access to all menus),
 * this will be loaded using the storageService prob.
 */

@Injectable()
export class UserService {

	userList: UserGuiDTO[];
	currentUser: UserGuiDTO; // the logged in user
	private selectedUser: UserGuiDTO; // the target user (ex making appointments for)

	constructor(private storageService: StorageService) {
		this.userList = [];

		var dummy = new Employee();
		dummy.person.last = "dummy user";
		dummy.person.first = "User Not Set";
		dummy.person.id = "dummyID";
		this.selectedUser = dummy;
	}

	addUser(user: UserGuiDTO) {
		this.userList.push(user);
	}

	addUsers(userList: UserGuiDTO[]) {
		for (var user of userList) {
			this.addUser(user);
		}
	}

	/**
	 * testing only, remove later
	 */
	private addDummyUsers() {
		console.log("ADDING DUMMY USERS");
		var emp1 = new Employee();
		emp1.person.id = "emp1ID";
		emp1.person.last = "Titova";
		emp1.person.first = "Melissa - Dummy user";
		this.addUser(emp1);

		this.currentUser = this.userList[0];
		if (this.selectedUser == null) {
			this.selectedUser = this.currentUser;
		}
	}
	
	public getDummyUsers () {
		var list = []
		
		var emp1 = new Employee();
		emp1.person.id = "emp1ID";
		emp1.person.last = "Titova";
		emp1.person.first = "Melissa - Dummy user";

		this.currentUser = emp1;
		if (this.selectedUser == null) {
			this.selectedUser = emp1;
		}
		
		list.push (emp1);
		
		return list;
	}

	setUserList(userList: UserGuiDTO[]) {
		this.userList = userList;
	}

	/** this should return multiple users based on some selection criteria,
	 * which isn't developed yet.  as of now returns literally all users.
	 * should really rename this whole thing to getEmployees... 
	 */
	// STOPPED HERE BECAUSE I HAVE NO IDEA WHY GET USERS GETS CALLED MULTIPLE TIMES
	// also, external entities should only be reading from the fields.  right now
	// calendar is causing loading of dummy users multiple times
	getUsers2() {
		this.userList = [];
		this.userList = this.storageService.employeeList;
		// this.storageService.getAllUsers();
		console.log("getUsers: " + this.userList.length)
		this.addDummyUsers();
	}

	loadAll() {
		this.userList = [];
		// this.storageService.loadAllUsers();
		console.log ("NORMALLY CALLING loadAllUsers here");
		this.userList = this.storageService.employeeList;
	}

	setSelectedUser(id: string) {
		console.log ("requesting to setSelectedUser id to : "+id);
		console.log (this.userList);
		for (var emp of this.userList) {
			if (emp.getId() == id) {
				console.log("UserService: selectedUser: " + emp.getId);
				this.selectedUser = emp;
				return;
			}
		}
	}

	getSelectedUser() {
		/*
		Note: before users are loaded, selected user is null.
		not sure how to fix that but will return a dummy user
		if selected user is null*/
		if (this.selectedUser == null) {
			var dummy = new Employee();
			dummy.person.last = "dummy user";
			dummy.person.first = "User Not Set";
			dummy.person.id = "dummyID";
			return dummy;
		}
		return this.selectedUser;
	}
	
	/**
	 * returns manage menus for the user.
	 * for now returns same menus always
	 */
	getManageMenus (user: UserGuiDTO) : ManageMenu[] {
		var list = [
			ManageMenu.Client,
			ManageMenu.Employee,
			ManageMenu.Product,
			ManageMenu.Service,
			ManageMenu.Schedule
		]
		return list;
	}
}