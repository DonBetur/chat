import { User } from '../models/user.class';

export interface ColleagueDto extends User {
	isFriend: boolean;
}
