import {ColumnItem} from './columnitem';

export class Column {
	id: string;
	titleLabel: string; // meant to be one line
	labels: string[]; // just the labels
	subCols: Column[];
	items: ColumnItem[];
	width: number; // total width including sub columns
	vPadding: number; // vertical padding, for titles and such

	onlySubCols: boolean; // means it is a container only, no items

	/**Takes a single column width, and vertical offset */
	constructor() {
		this.labels = [];
		this.subCols = [];
		this.items = [];
		this.onlySubCols = false;
		this.titleLabel = "Label not set";
	}
	
	getSubCols () : Column[] {
		return this.subCols;
	}

	setLabels(labelList: string[]) {
		this.labels = labelList;
	}

	addSubCol(col: Column) {
		this.subCols.push(col);
	}

	addColItem(itemInserting: ColumnItem, baseColumn: Column) {
		
		// console.log("addColItem called to: " + this.id);
		// terminate recursion when no sub cols, but check to make sure
		// this column contains no intersections
		if (this.subCols.length == 0) {
			var intersection = false;
			for (var item of this.items) {
				intersection = this.doIntersect(itemInserting, item);
			}
			// console.log("intersection value: " + intersection);
			if (!intersection) {
				this.items.push(itemInserting);
				// console.log("Inserted into column id: " + this.id);
				return { addedCol: false };
			} else {
				// add a subCol, then add to it
				this.subCols.push(new Column());
				this.subCols[0].items.push(itemInserting);
				return { addedCol: true };
			}
		} else {
			var intersection = false;
			for (var item of this.items) {
				intersection = this.doIntersect(itemInserting, item);
			}
			if (!intersection) {
				this.items.push(itemInserting);
				// console.log("Inserted into column id: " + this.id);
				return { addedCol: false };
			}
			var wasColAdded = false;
			for (var subCol of this.subCols) {
				wasColAdded = subCol.addColItem(itemInserting, baseColumn).addedCol;
			}
			return { addedCol: wasColAdded };
		}
		
	}

	// /**
	//  * depth: keeps track of subCol number starting from zero
	//  * returns: totalWidth: total column width, including its sub columns
	//  */
	// getAll(itemList: ColumnItem[], depth: number, colWidth: number, totalWidth: number,
	// 	offset: number) {
	// 	// stop recursion when reach last column (will have no subCols)
	// 	var curWidth = 0;

	// 	// depth is used to compute the x coord of subcolumns
	// 	// here we don't count depth when traversing subcolumns which are
	// 	// placeholders for other columns, and not items


	// 	if (this.subCols.length == 0) {
	// 		if (this.items.length > 0) {
	// 			for (var _item of this.items) {
	// 				_item.pos.subCol = depth;
	// 				_item.pos.x = (depth * colWidth) + offset;
	// 				_item.pos.width = colWidth;
	// 				itemList.push(_item);
	// 			}
	// 			return { totalWidth: (totalWidth) };
	// 		}

	// 	} else {

	// 		// so it has subCols, means add the items into our list
	// 		if (this.items.length > 0) {
	// 			for (var _item of this.items) {
	// 				_item.pos.subCol = depth;
	// 				_item.pos.x = (depth * colWidth) + offset;
	// 				_item.pos.width = colWidth;
	// 				itemList.push(_item);
	// 			}
	// 		}
	// 		// then loop through subCols
	// 		for (var _subCol of this.subCols) {
	// 			if (!this.onlySubCols) {
	// 				depth++;
	// 			}

	// 			totalWidth += colWidth;
	// 			curWidth = _subCol.getAll(itemList, depth, colWidth, totalWidth, offset).totalWidth;
	// 		}
	// 	}

	// 	// this.width = depth*colWidth; // update the width of this column
	// 	return { totalWidth: (this.width) };
	// }

	getAll(itemList: ColumnItem[], offset: number, colWidth: number) {

		if (this.subCols.length == 0) {
			for (var _item of this.items) {
				
				_item.pos.x = offset;
				_item.pos.width = colWidth;
				this.width = colWidth;
				itemList.push(_item);
			}
			
			return this.width;
		} else {
			// handle the subCols
			// grab all the items in this column also
			if (this.items.length > 0) {
				
				for (var _item of this.items) {
					
					_item.pos.x = offset;
					_item.pos.width = colWidth;
					this.width = colWidth;
					itemList.push(_item);
				}
				offset += colWidth;
			}

			for (var _subCol of this.subCols) {
				
				var retWidth = _subCol.getAll(itemList, offset, colWidth);
				
				offset += retWidth;
				// handle container columns differently
				if (_subCol.onlySubCols == false) {
					
					offset += colWidth; // expand the width of this col for every subCol
					this.width += retWidth;
				} else {
					// this is a container column so update the offset appropriately
					// console.log(_subCol.width);
					offset += _subCol.width;
					// this.width += colWidth;
					
					// console.log("OFFSET: "+offset);
				}
			}
			// console.log ("reached end of column: "+ this.id + " and width is: "+this.width);
			return this.width;
		}
		
	}

	computeWidth(itemList: ColumnItem[], depth: number, colWidth: number, totalWidth: number) {
		if (this.subCols.length == 0) {
			// were done
			return colWidth;
		} else {
			// loop through every column and add up the width.
			for (var subCol of this.subCols) {
				if (!this.onlySubCols) {
					totalWidth += colWidth;

					subCol.computeWidth(itemList, depth, colWidth, totalWidth);
				}
			}
			console.log("total width: " + totalWidth);
		}
	}
	
	setColWidth (w: number) {
		this.width = w;
	}

	private doIntersect(item1: ColumnItem, item2: ColumnItem): boolean {

		// see if item1 completely encompasses item2
		if (item1.vertTopPos <= item2.vertTopPos && item1.vertBottomPos >= item2.vertBottomPos) {
			// console.log (" intersection");
			return true;
		}

		// see if item1 top is inside item2
		if (item1.vertTopPos > item2.vertTopPos && item1.vertTopPos < item2.vertBottomPos) {
			// console.log (" intersection");
			return true;
		}

		// see if item1 bottom is inside item2
		if (item1.vertBottomPos > item2.vertTopPos && item1.vertBottomPos < item2.vertBottomPos) {
			// console.log (" intersection");
			return true;
		}

		// console.log ("no intersection");
		return false;
	}
}