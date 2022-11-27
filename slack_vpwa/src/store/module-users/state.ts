import { User } from 'src/contracts';

export interface UsersStateInterface {
  user: User | null;
}

function state(): UsersStateInterface {
  return {
    user: null,
  };
}

export default state;
