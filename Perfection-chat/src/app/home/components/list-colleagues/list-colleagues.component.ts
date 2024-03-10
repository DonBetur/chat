import { Component, OnInit } from '@angular/core';
import { ColleaguesService } from '../../services/colleagues.service';
import { map } from 'rxjs';

@Component({
  selector: 'list-colleagues',
  templateUrl: './list-colleagues.component.html',
  styleUrls: ['./list-colleagues.component.scss'],
})
export class ListColleaguesComponent implements OnInit {

  constructor(
		private readonly colleaguesService: ColleaguesService
	) { }

  ngOnInit() {
		this.colleaguesService.getColleagues()
		.pipe(
			map(colleagues => colleagues.filter(colleague => colleague.isFriend))
		)
		.subscribe(console.log);
	}

}
