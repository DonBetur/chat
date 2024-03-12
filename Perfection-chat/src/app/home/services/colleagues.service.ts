import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Colleague } from '../models/Colleague';
import { BehaviorSubject, Observable, catchError, map, of, skip } from 'rxjs';

@Injectable()
export class ColleaguesService {

	private stateColleagues: BehaviorSubject<Colleague[]> = new BehaviorSubject<Colleague[]>([]);
	public colleagues$ = this.stateColleagues.pipe(
		skip(1)
	);

  constructor(
		private readonly http: HttpClient
	) {
		this.init();
	}

	private getColleagues(): Observable<Colleague[]> {
		return this.http.get<Colleague[]>(`${environment.baseApiUrl}/user/colleagues/my`);
	}

	private init(): void {
		const colleaguesSubs = this.getColleagues()
		.pipe(
			catchError((err) => of([])),
			map((colleagues => colleagues.sort((a, b) => {
				if (a.isFriend === b.isFriend) {
						return 0;
					} else if (a.isFriend && !b.isFriend) {
						return -1;
					} else {
						return 1;
					}
			})))
		)
		.subscribe(colleagues => {
			this.stateColleagues.next(colleagues);
			colleaguesSubs.unsubscribe();
		});
	}
}
