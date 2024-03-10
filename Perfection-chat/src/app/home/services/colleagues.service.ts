import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Colleague } from '../models/Colleague';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColleaguesService {

  constructor(
		private readonly http: HttpClient
	) { }

	public getColleagues(): Observable<Colleague[]> {
		return this.http.get<Colleague[]>(`${environment.baseApiUrl}/user/colleagues/my`);
	}
}
