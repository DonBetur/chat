import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/models/user.model';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  userFullImagePath: string;
  user$: Observable<User> = this.authService.userStream;

  constructor(
    private authService: AuthService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    // this.userImagePathSubscription =
    //   this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
    //     this.userFullImagePath = fullImagePath;
    //   });
  }

  async onSignOut() {
    await this.popoverController.dismiss();
    this.authService.logout();
    location.reload();
  }

  // ngOnDestroy() {
  //   this.userImagePathSubscription.unsubscribe();
  // }
}
