export class ColumnItem {
	vertTopPos: number;
	vertBottomPos: number;
	object: any; // the object attached to this item
	titleLabel: string;
	id: string; // should be some sort of a unique id (even for multiples of same rep)
	parentId: string; // used to attach parent col ids, specificually used for
										// knowing which date to select when an employee is selected.
	
	// the actual location and dimensions
	pos: {x: number, y: number, width: number, height: number, subCol: number};
	
	// todo: must check for only positive #'s
	constructor (vTopPos: number, vBottomPos: number) {
		this.vertTopPos = vTopPos;
		this.vertBottomPos = vBottomPos;
		var height = vBottomPos - vTopPos;
		this.pos = { x: 0, y: vTopPos, width: 0, height: height, subCol: 0 };
		this.titleLabel = "Label not set";
		this.id = "Not set";
	}
}