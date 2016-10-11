/**
 * this is made for interacting with the gui
 */

import {Note} from '../Note'; 

export interface UserGuiDTO {
	getId() : string;
	getLabel() : string;
	
	getPhone() : string;
	getFirstName() : string;
	getLastName() : string;
	getAddress1() : string;
	getAddress2() : string;
	getCity () : string;
	getState () : string;
	getZip () : string;
	getEmail () : string;
}