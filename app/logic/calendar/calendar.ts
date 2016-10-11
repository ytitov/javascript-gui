import {Column} from './column';
import {ColumnItem} from './columnitem';
import {TimeSlots} from './TimeSlots'
import {TimeBlock} from './TimeBlock';

export class Calendar {
	width: number; // total width
	height: number; // total height
	rootCol: Column;
	timeSlots: TimeSlots;
	newColWidth: number;
	vSpace: number; // vertical height of top header space
	mainHorizOffset: number;
	totalWidth: number;
	userLabelPadding: any;
	dateLabelHeight: number;
	userLabelHeight: number;

	weekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thirsday", "Friday",
		"Saturday"
	];

	constructor(params: any, colWidth: number, startHr: number, startMin: number,
		endHr: number, endMin: number, interval: number) {
		this.timeSlots = new TimeSlots(startHr, startMin, endHr, endMin, interval,
			params.vSpace,
			params.timeLabelHeight);
		this.rootCol = new Column(); // holds all columns
		this.rootCol.id = "rootCol";
		this.rootCol.onlySubCols = true;
		this.newColWidth = colWidth;
		this.vSpace = params.vSpace;
		this.mainHorizOffset = params.mainHorizOffset;
		this.totalWidth = this.mainHorizOffset;
		this.userLabelPadding = { left: 0, top: 0, right: 0, bottom: 0 };
		this.dateLabelHeight = params.dateLabelHeight;
		this.userLabelHeight = params.userLabelHeight;
	}

	/**
	 * This adds a TimeBlock by looping through main columns which are the date columns
	 * and inserts the appointment into the column which matches the date
	 */
	public addTimeBlock(date: Date, userID: string, timeBlock: TimeBlock) {
		// this gets the id of the column where the appointment should go
		// reason for this is because, there is a time in the input date,
		// and it must be taken out because date column id's have the time 00-00-00
		var dateID = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();

		var startHr = timeBlock.getStart().getHours();
		var startMin = timeBlock.getStart().getMinutes();
		var endHr = timeBlock.getEnd().getHours();
		var endMin = timeBlock.getEnd().getMinutes();
		var vPosTop = this.timeSlots.getVLoc(startHr, startMin);
		var vPosBottom = this.timeSlots.getVLoc(endHr, endMin);
		var colItem = new ColumnItem(vPosTop, vPosBottom);
		colItem.object = timeBlock;

		var dateColumn = null;
		for (var dateCol of this.getMainColumns()) {
			// first match the date
			var addWidthToMainCol = false;
			if (dateCol.id == dateID.toString()) {
				// console.log("**input dateID: " + dateID + " dateCol.id: " + dateCol.id);
				// then find the user subColumn under that date
				for (var userCol of dateCol.getSubCols()) {

					if (userCol.id == userID) {
						var addWidthToUserCol = false;
						// console.log ("found matching column, attempting to insert");
						addWidthToUserCol = userCol.addColItem(colItem, userCol).addedCol;
						// console.log("addWidthToUserCol: " + addWidthToUserCol);
						if (addWidthToUserCol) {
							userCol.width += this.newColWidth;
						}
						addWidthToMainCol = addWidthToUserCol;
					}
				}
				if (addWidthToMainCol) {
					dateCol.width += this.newColWidth;
				}
			}
		}
	}

	/**
	 * Only add to the first level of columns, according to id
	 */
	addToSubCol(colId: string, colItem: ColumnItem) {
		for (var col of this.rootCol.subCols) {
			if (col.id == colId) {
				col.addColItem(colItem, col);
			}
		}
	}

	addToUserCol(userCol: Column, dateCol: Column, timeBlock: TimeBlock) {
		var startHr = timeBlock.getStart().getHours();
		var startMin = timeBlock.getStart().getMinutes();
		var endHr = timeBlock.getEnd().getHours();
		var endMin = timeBlock.getEnd().getMinutes();
		var vPosTop = this.timeSlots.getVLoc(startHr, startMin);
		var vPosBottom = this.timeSlots.getVLoc(endHr, endMin);
		var colItem = new ColumnItem(vPosTop, vPosBottom);
		colItem.object = timeBlock;
		userCol.addColItem(colItem, dateCol);
	}

	/**
	 * Adds a main column, then returns it.
	 */
	addCol(colId: string): Column {
		var col = new Column();
		col.id = colId;
		this.rootCol.addSubCol(col);
		return col;
	}

	getTimeLabels(): ColumnItem[] {
		var itemList = [];

		for (var item of this.timeSlots.pixelLocations) {
			var vloc = item.vertLoc + this.vSpace;
			var vloc_bottom = vloc + this.timeSlots.lineHeight;
			var colItem = new ColumnItem(vloc, vloc_bottom);
			colItem.titleLabel = item.label;
			itemList.push(colItem)
		}
		return itemList;
	}

	getMainColumnLabels(): ColumnItem[] {
		var colItems = [];
		var currentPosition = 0;
		for (var mainCol of this.getMainColumns()) {
			var item = new ColumnItem(0, this.dateLabelHeight);
			item.id = mainCol.id;
			item.pos.x = currentPosition + this.mainHorizOffset;
			item.pos.width = mainCol.width;
			item.titleLabel = mainCol.titleLabel;
			colItems.push(item);
			currentPosition += mainCol.width;
		}
		this.totalWidth = currentPosition + this.mainHorizOffset;
		return colItems;
	}

	getUserColumnLabels(): ColumnItem[] {
		var colItems = [];
		var currentPosition = 0;
		var userPosition = 0;
		for (var mainCol of this.getMainColumns()) {
			userPosition = currentPosition;
			for (var userCol of mainCol.subCols) {
				var item = new ColumnItem(0, this.userLabelHeight);
				item.pos.x = userPosition + this.mainHorizOffset + this.userLabelPadding.left;
				item.pos.y = this.dateLabelHeight;
				item.pos.width = userCol.width - (2 * this.userLabelPadding.right);
				item.titleLabel = userCol.titleLabel;
				item.id = userCol.id+","+mainCol.id; // unique for GUI purposes
				item.parentId = mainCol.id;
				colItems.push(item);
				userPosition += userCol.width;
			}
			currentPosition += mainCol.width;
		}
		return colItems;
	}

	getMainColumns(): Column[] {
		return this.rootCol.subCols;
	}

	clearMainColumns() {
		for (var col of this.getMainColumns()) {
			col.subCols = [];
		}
	}

	deleteMainColumns() {
		this.rootCol.subCols = [];
	}

	//

	getWeekDayName(date: Date): string {
		return this.weekDayNames[date.getDay()];
	}
}