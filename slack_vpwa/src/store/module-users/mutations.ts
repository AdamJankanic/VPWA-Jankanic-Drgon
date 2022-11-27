import { MutationTree } from 'vuex';
import { UsersStateInterface } from './state';
import { User } from 'src/contracts';

const mutation: MutationTree<UsersStateInterface> = {
  UPDATE_USER(state, user: User | null) {
    state.user = user;
    console.log('mutaaaacia', state.user);
    
  },
};

export default mutation;
