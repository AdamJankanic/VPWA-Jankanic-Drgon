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
    // NOTIFICATION TEST
    console.log(Notification.permission);
    const notification = new Notification('Ahoj priatel', {
      body: 'Ahoj priatelu, co robis?',
    });
    // --------------------------------------------------------------------------------------

    const isAuthenticated = await store.dispatch('auth/check');
    if (isAuthenticated) {
      // console.log('after each');
      const user = await authService.me();
      //comit user to store
      store.commit('auth/SET_USER', user);

      const array_channels = await store.dispatch(
        'channels/loadAllChannels',
        user?.id
      );
      // console.log(array_channels[0].name);
      // console.log('after fetching data');
      // for (let i = 0; i < array_channels.length; i++) {
      //   joinedChannels.push(array_channels[i].name);
      // }

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

    // route requires authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
      // check if logged in if not, redirect to login page
      return loginRoute(to);
    }

    // route is only for guests so redirect to home
    if (to.meta.guestOnly && isAuthenticated) {
      return { name: 'home' };
    }
  });
});
