import { User } from 'src/app/auth/models/user.model';

export interface Colleague extends User {
	isFriend: boolean;
}
