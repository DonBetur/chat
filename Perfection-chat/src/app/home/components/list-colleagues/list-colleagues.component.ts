import { Component, OnInit } from '@angular/core';
import { ColleaguesService } from '../../services/colleagues.service';
import { Observable, map, tap } from 'rxjs';
import { Colleague } from '../../models/Colleague';
import { User } from 'src/app/auth/models/user.model';

@Component({
  selector: 'list-colleagues',
  templateUrl: './list-colleagues.component.html',
  styleUrls: ['./list-colleagues.component.scss'],
	providers: [
		ColleaguesService
	]
})
export class ListColleaguesComponent implements OnInit {

	public colleagues$: Observable<Colleague[]> = this.colleaguesService.colleagues$;

  constructor(
		private readonly colleaguesService: ColleaguesService
	) { }

  ngOnInit() {

	}

	public getColleagueUrl(colleague: User): string {
		return `/home/id/${colleague.id}`;
	}

}
