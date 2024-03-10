import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import {
  FriendRequestStatus,
} from '../../models/FriendRequest';
import { BannerColorService } from '../../services/banner-color.service';
import { ConnectionProfileService } from '../../services/connection-profile.service';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent {
	private id$: Observable<number | undefined> = this.getUserIdFromUrl();
	user$: Observable<User> = this.getUser();
  friendRequestStatus$: Observable<string> = this.getFriendRequestStatus();

  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    public connectionProfileService: ConnectionProfileService,
  ) {

	}


  getUser(): Observable<User> {
    return this.id$.pipe(
      switchMap((userId: number) => this.connectionProfileService.getConnectionUser(userId))
    );
  }

  addUser(): Subscription {
    return this.id$.pipe(
        switchMap((userId: number) => this.connectionProfileService.addConnectionUser(userId))
      )
      .pipe(take(1))
      .subscribe();
  }

  getFriendRequestStatus(): Observable<string> {
    return this.id$.pipe(
      switchMap((userId: number) => this.connectionProfileService.getFriendRequestStatus(userId)),
			map((friendRequestStatus) => friendRequestStatus.status)
    );
  }

  private getUserIdFromUrl(): Observable<number> {
    return this.route.params.pipe(
			map(params => params.id),
			map(id => {
				if (id === undefined) return undefined;
				const idNumber = Number(id);

				if (!isNaN(idNumber)) return idNumber;

				return undefined;
			})
		);;
  }
}
