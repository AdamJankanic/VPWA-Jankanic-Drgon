import axios from 'axios';

class UserService{
    async modifySettings(owner: number, onlineOffline: string, DNB: string, notifications: string) {           
        const user = await axios.patch('http://localhost:3333/modifySettings', {owner: owner, onlineOffline: onlineOffline, DNB: DNB, notifications: notifications})
        console.log('user servicee', user.data);
        
        return user.data
      }

      async loadUser(userId: number) {
        console.log('loaduser pred server ', userId);
        
        const user = await axios.patch('http://localhost:3333/loadUser', {userId: userId})
        return user.data
      }
}

export default new UserService()