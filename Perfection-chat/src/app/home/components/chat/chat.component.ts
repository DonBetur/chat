import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { Conversation } from '../../models/Conversation';
import { Message } from '../../models/Message';
import { ChatStateService } from '../../services/chat-state.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
	form = new FormGroup({
		message: new FormControl(null, [Validators.required])
	});

  // userFullImagePath: string;

	public conversations$: Observable<Conversation[]> = this.chatStateService.conversations$;
	public messages$: Observable<Message[]> = this.chatStateService.messages$;
	public currentDialog$: Observable<User | null> = this.chatStateService.currentDialog$;
	public friends$: Observable<User[]> = this.chatStateService.friends$;
	public selectedConversationIndex$: Observable<number> = this.chatStateService.selectedConversationIndex$;

  constructor(
    private readonly chatStateService: ChatStateService
  ) {}

  onSubmit() {
		const { message } = this.form.value;
    if (!message) return;

		const conversation: Conversation | null = this.chatStateService.sendMessage(message);

		if (conversation !== null) {
			this.form.reset();
		}
  }

  openConversation(friend: User, index: number): void {
		this.chatStateService.openConversation(friend, index);
  }

  // deriveFullImagePath(user: User): string {
  //   let url = 'http://localhost:3000/api-chat/feed/image/';

  //   if (user.id === this.userId) {
  //     return this.userFullImagePath;
  //   } else if (user.imagePath) {
  //     return url + user.imagePath;
  //   } else if (this.friend.imagePath) {
  //     return url + this.friend.imagePath;
  //   } else {
  //     return url + 'blank-profile-picture.png';
  //   }
  // }
}
