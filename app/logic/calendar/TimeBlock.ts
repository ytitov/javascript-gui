export interface TimeBlock {
	getStart () : Date;
	getEnd () : Date;
	
	getTitleLabel () : string;
	
	getStartLabel () : string;
	getEndLabel () : string;
}