import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary.component';
import { StartPostComponent } from './components/start-post/start-post.component';
import { AdvertisingComponent } from './components/advertising/advertising.component';
import { ModalComponent } from './components/start-post/modal/modal.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ConnectionProfileComponent } from './components/connection-profile/connection-profile.component';
import { PopoverComponent } from './components/header/popover/popover.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FriendRequestsPopoverComponent } from './components/header/friend-requests-popover/friend-requests-popover.component';
import { ChatComponent } from './components/chat/chat.component';
import { FullNamePipe } from '../auth/pipes/full-name.pipe';
import { ListColleaguesComponent } from './components/list-colleagues/list-colleagues.component';
import { PageColleaguesComponent } from './pages/page-colleagues/page-colleagues.component';

@NgModule({
  imports: [
		CommonModule,
		ReactiveFormsModule,
		IonicModule,
		HomePageRoutingModule
	],
  declarations: [
    HomePage,
    HeaderComponent,
    ProfileSummaryComponent,
    StartPostComponent,
    AdvertisingComponent,
    ModalComponent,
    AllPostsComponent,
    TabsComponent,
    ConnectionProfileComponent,
    PopoverComponent,
    UserProfileComponent,
    FriendRequestsPopoverComponent,
    ChatComponent,
		FullNamePipe,
		ListColleaguesComponent,
		PageColleaguesComponent
  ],
})
export class HomePageModule {}
