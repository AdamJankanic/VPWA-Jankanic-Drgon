import { boot } from 'quasar/wrappers';
import { authManager, authService } from 'src/services';
import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

// --------------------------------------------------------------------------------

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
  }
}

const loginRoute = (from: RouteLocationNormalized): RouteLocationRaw => {
  return {
    name: 'login',
    query: { redirect: from.fullPath },
  };
};

// this boot file wires together authentication handling with router
export default boot(({ router, store }) => {
  // if the token was removed from storage, redirect to login
  authManager.onLogout(() => {
    router.push(loginRoute(router.currentRoute.value));
  });

  //after each route load channels
  // let joinedChannels: string[];
  router.afterEach(async () => {
    const isAuthenticated = await store.dispatch('auth/check');
    if (isAuthenticated) {
      const user = await authService.me();
      //comit user to store
      store.commit('auth/SET_USER', user);
    
      const array_channels = await store.dispatch(
        'channels/loadAllChannels',
        user?.id
      );

      if (user !== null) {
        console.log(user['id']);
      }

      if (user?.id !== store.state.user?.id) {
        for (let i = 0; i < array_channels.length; i++) {
          await store.dispatch('channels/join', array_channels[i].name, {
            root: true,
          });
        }
      }
    }
  });

  // add route guard to check auth user
  router.beforeEach(async (to) => {
    console.log('skuska');
    // -------------------------------------------------------------------------------------
    // store.dispatch('channels/loadAllChannels');

    const isAuthenticated = await store.dispatch('auth/check');
    console.log('isauthid', isAuthenticated);
    
    if(isAuthenticated){
      const user2 = await store.dispatch('users/loadUser', {userId: isAuthenticated?.id});
    }
    

    // route requires authentication
    if (to.meta.requiresAuth && !(isAuthenticated !== null)) {
      // check if logged in if not, redirect to login page
      return loginRoute(to);
    }

    // route is only for guests so redirect to home
    if (to.meta.guestOnly && isAuthenticated) {
      return { name: 'home' };
    }
  });
});
