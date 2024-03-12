import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { User } from 'src/app/auth/models/user.model';

@Injectable({
	providedIn: 'root'
})
export class ChatStateService {

	private stateConversations: BehaviorSubject<Conversation[]> = new BehaviorSubject<Conversation[]>([]);
	private stateMessages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);
	private stateCurrentDialog: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
	private stateFriends: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
	private stateSelectedConversationIndex: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	private stateConversation: BehaviorSubject<Conversation | null> = new BehaviorSubject<null | Conversation>(null);
	private subscription: Subscription = new Subscription();
	private isInit = false;
	public conversations$: Observable<Conversation[]> = this.stateConversations.asObservable();
	public messages$: Observable<Message[]> = this.stateMessages.asObservable();
	public currentDialog$: Observable<User | null> = this.stateCurrentDialog.asObservable();
	public friends$: Observable<User[]> = this.stateFriends.asObservable();
	public selectedConversationIndex$: Observable<number> = this.stateSelectedConversationIndex.asObservable();

  constructor(
		private readonly chatService: ChatService,
		private readonly authService: AuthService
	) {
		this.init();
	}

	public init(): void {
		if (this.isInit === true) return;

		const conversationSubs = this.chatService
			.getConversations()
			.subscribe((conversations) => {
				this.stateConversations.next([...this.stateConversations.value, conversations[0]]);
			});

		const messagesSubs = this.chatService
      .getConversationMessages()
      .subscribe((messages) => {
				this.stateMessages.next(
					messages.filter(message => !this.stateMessages.value.includes(message))
				);
      });

		const newMessagesSubs = this.chatService
			.getNewMessage()
			.subscribe((message: Message) => {
				const formatedMessage = { ...message, createdAt: new Date() };
				const allMessageIds = this.stateMessages.value.map(message1 => message1.id);
				if (!allMessageIds.includes(formatedMessage.id)) {
					this.stateMessages.next([...this.stateMessages.value, formatedMessage]);
				}
			});

		const friendsSubs = this.chatService
      .getFriends()
      .subscribe((friends: User[]) => {
				this.stateFriends.next(friends);

        if (friends.length > 0) {
					this.stateCurrentDialog.next(friends[0]);

          friends.forEach((friend: User) => {
            this.chatService.createConversation(friend);
          });
          this.chatService.joinConversation(this.stateCurrentDialog.value.id);
        }
      });

		const friendSubs = this.currentDialog$.subscribe((friend: any) => {
			if (friend && Object.keys(friend).length > 0) {
				this.chatService.joinConversation(friend.id);
			}
		});

		this.subscription.add(conversationSubs);
		this.subscription.add(messagesSubs);
		this.subscription.add(newMessagesSubs);
		this.subscription.add(friendsSubs);
		this.subscription.add(friendSubs);
		this.isInit = true;
	}

	public openConversation(friend: User, index: number): void {
		this.stateSelectedConversationIndex.next(index);
    this.chatService.leaveConversation();
		this.stateCurrentDialog.next(friend);
		this.stateMessages.next([]);
	}

	public sendMessage(message: string): Conversation | null {
		const currentUser = this.authService.syncUser;
		const currentDialog = this.stateCurrentDialog.value;
		const conversationUserIds = [currentUser.id, currentDialog.id].sort();

		const currentConversation: Conversation | null = this.stateConversations.value.find((conversation) => {
      const userIds = conversation.users.map((user: User) => user.id);
      return JSON.stringify(conversationUserIds.sort()) === JSON.stringify(userIds.sort());
    }) || null;

		if (currentConversation !== null) {
      this.chatService.sendMessage(message, currentConversation);
    }

		this.stateConversation.next(currentConversation);

		return currentConversation;
	}

	public destroy(): void {
		this.subscription.unsubscribe();

		this.chatService.leaveConversation();

		this.stateSelectedConversationIndex.next(0);
		this.stateConversations.next([]);
		this.stateConversation.next(null);
		this.stateMessages.next([]);
		this.stateFriends.next([]);
		this.stateCurrentDialog.next(null);

		this.isInit = false;
	}
}
