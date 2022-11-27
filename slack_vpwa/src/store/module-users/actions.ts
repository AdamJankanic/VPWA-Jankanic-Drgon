import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UsersStateInterface } from './state';
import { userService } from 'src/services';


const actions: ActionTree<UsersStateInterface, StateInterface> = {

  async loadUser(
    {commit},
    {userId}: {userId: number}

  ){
    try {            
      const user = await userService.loadUser(userId);
      
      commit('UPDATE_USER', user)    
      console.log('after commit', user);
       
            
    } catch(err) {
      throw err;
    }
  },

  async modifySettings(
    {commit},
    {owner, onlineOffline, DNB, notifications}: {owner: number, onlineOffline: string, DNB: string, notifications: string}
  ) {
    try {
      const user = await userService.modifySettings(owner, onlineOffline, DNB, notifications);
      
      commit('UPDATE_USER', user)      
            
    } catch(err) {
      throw err;
    }
  }
};

export default actions;
