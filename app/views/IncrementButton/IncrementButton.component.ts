import {Component, OnInit, Input, Output, EventEmitter} from 'angular2/core'; 

@Component ({
	selector: 'increment-button',
	templateUrl: './views/IncrementButton/incrementButton.html',
	directives: [],
	providers: [],
	styleUrls: ['./views/IncrementButton/incrementButton.css'],
})

export class IncrementButtonComponent implements OnInit {
	object: any; // the attached object. ie date or something
	
	@Input() width: number;
	centerWidthMM: string;
	adjustWidth: number; // the plus and minus buttons
	adjustWidthMM: string;
	totalWidthMM: string;
	
	@Input () titleLabel: string;
	@Input () isSelected: boolean;
	@Output() plusClicked = new EventEmitter();
	@Output() minusClicked = new EventEmitter();
	@Output() clicked = new EventEmitter();
	
	onInit () {
		
	}
	
	constructor () {
		this.width = 50;
		this.adjustWidth = 10;
		this.adjustWidthMM = this.adjustWidth.toString() + "mm";
		this.centerWidthMM = (this.width-(this.adjustWidth*2)).toString()+"mm";
		this.totalWidthMM = this.width.toString() + "mm";
	}
	
	public onPlusClicked () {
		this.plusClicked.next('');
	}
	
	public onMinusClicked () {
		this.minusClicked.next('');
	}
	
	public onClicked () {
		this.clicked.next(this.object);
	}
}