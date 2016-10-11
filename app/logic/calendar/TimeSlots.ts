

export class PixelLocation {
	vertLoc: number;
	label: string;
	constructor(vLoc: number, label: string) {
		this.vertLoc = vLoc; this.label = label;
	}
}

/**This is a utility class to obtain pixel locations for the appointments--
 * primarily used by the ColumnItem object.
 */

export class TimeSlots {
	startHr: number;
	startMin: number;
	endHr: number;
	endMin: number;
	interval: number; // minutes b/w each tick
	pixelLocations: PixelLocation[];
	vSpace: number; // height up top
	lineHeight: number;

	constructor(startHr: number, startMin: number,
		endHr: number, endMin: number,
		interval: number, vSpace: number, lineHeight: number) {
		// TODO: dissallow crazy numbers
		this.startHr = startHr; this.startMin = startMin;
		this.endHr = endHr; this.endMin = endMin;
		this.interval = interval; this.vSpace = vSpace;
		this.pixelLocations = [];
		this.lineHeight = lineHeight;

		var x = 0;

		var curHr = 0;
		var minIndex = 0;

		for (var _hrIndex = this.startHr; _hrIndex < this.endHr; _hrIndex++) {
			var hrString = _hrIndex + "";
			if (_hrIndex < 10) {
				hrString = "0" + _hrIndex;
			}
			for (var _minIndex = 0; _minIndex < 60; _minIndex += this.interval) {
				var minString = _minIndex + "";
				if (_minIndex < 10) {
					minString = "0" + _minIndex;
				}
				this.pixelLocations.push(new PixelLocation(x, hrString + ":" + minString));
				x += this.lineHeight;
			}
		}
		
		var hr = this.endHr;
		var hrString = "";
		if (hr < 10) {
			hrString = "0" + hr;
		} else {
			hrString = "" + hr;
		}
		// console.log(hrString + ":00");
		this.pixelLocations.push(new PixelLocation(x, hrString + ":00"));
	}

	/**
	 * returns the pixel offset of the specified time.  Not sure if this is more efficient
	 * than just multiplying it each time, but it saves an extra multiply, but instead
	 * has to fetch from array.  one day I will time this, but not today.
	 */
	getVLoc(hr: number, min: number) {
		console.log ("requesting time: "+hr+":"+min);
		// how many times interval fits into given minute
		var count = 0;
		var _min = min;
		while (_min >= 0) {
			_min -= this.interval;
			count++;
		}

		var rem = _min + this.interval;

		// handle when number doesn't fall exactly on interval
		if (rem == 0) {
			var val = this.pixelLocations[(hr - this.startHr) * (60 / this.interval) + count - 1].vertLoc;
			val += this.vSpace;
			// console.log("getVLoc: "+val);
			return val;
		} else {
			// handle odd minutes (remainder)
			var ref = this.pixelLocations[(hr - this.startHr) * (60 / this.interval) + count - 1].vertLoc;
			return ref + rem + this.vSpace;
		}
	}
}