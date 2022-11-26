import { User } from 'src/contracts';
import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  AUTH_START(state) {
    state.status = 'pending';
    state.errors = [];
  },
  AUTH_SUCCESS(state, user: User | null) {
    state.status = 'success';
    state.user = user;
  },
  AUTH_ERROR(state, errors) {
    state.status = 'error';
    state.errors = errors;
  },
  //set user
  SET_USER(state, user: User | null) {
    state.user = user;
    console.log('set user  ', state.user);
  },
};

export default mutation;
