import { boot } from 'quasar/wrappers';

import Keycloak from 'keycloak-js';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $keycloak: Keycloak;
  }
}
const keycloak = new Keycloak({
  url: 'https://auth.kemary.de',
  realm: 'kemary',
  clientId: 'web-app',
});
export default boot(({ app }) => {
  keycloak
    .init({ onLoad: 'check-sso', checkLoginIframe: false, enableLogging: true })
    .then(() => {
      if (keycloak.authenticated) {
        console.log('Authenticated');
        setInterval(() => {
          keycloak.updateToken(70);
        }, 6000);
      }
      window.history.replaceState(null, '', window.location.pathname);

      app.config.globalProperties.$keycloak = keycloak;
    })
    .catch((error) => {
      console.error(console.error(error));
    });
});
export { keycloak };
