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
  user$: Observable<User> = this.getUser();
  friendRequestStatus$: Observable<string> = this.getFriendRequestStatus();

  constructor(
    public bannerColorService: BannerColorService,
    private route: ActivatedRoute,
    public connectionProfileService: ConnectionProfileService,
  ) {}


  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => this.connectionProfileService.getConnectionUser(userId))
    );
  }

  addUser(): Subscription {
    return this.getUserIdFromUrl()
      .pipe(
        switchMap((userId: number) => this.connectionProfileService.addConnectionUser(userId))
      )
      .pipe(take(1))
      .subscribe();
  }

  getFriendRequestStatus(): Observable<string> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => this.connectionProfileService.getFriendRequestStatus(userId)),
			map((friendRequestStatus) => friendRequestStatus.status)
    );
  }
  private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => +urlSegment[0].path)
    );
  }
}
