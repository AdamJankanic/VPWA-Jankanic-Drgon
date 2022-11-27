import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UsersStateInterface } from './state';

const getters: GetterTree<UsersStateInterface, StateInterface> = {
  getAccount(context) {
    console.log('conteeext', context);
    console.log('getter user', context.user);
    
    
    return context.user;
  },
};

export default getters;
