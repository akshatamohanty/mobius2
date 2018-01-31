import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ConsoleService } from '../../global-services/console.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  _messages = [];
  _subscription; 

  constructor(private consoleService: ConsoleService) { 
  		this._subscription = this.consoleService.getMessage().subscribe(message => { 
			this.notify();
		});
  }

  ngAfterViewChecked() {        
      this.scrollToBottom();        
  } 

  ngOnInit() {
  	this._messages = this.consoleService.getContent();
    this.scrollToBottom();
  }

  scrollToBottom(): void {
      try {
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }                 
  }

  notify(){ 
  	this._messages = this.consoleService.getContent();
  }

  clearConsole(): void{
    this.consoleService.clearConsole();
  }

}
