// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrlLogin: 'http://127.0.0.1:5000/login/',
  baseUrlPlayer: 'http://127.0.0.1:5000/player/',
  baseUrlDeck: 'http://127.0.0.1:5000/deck/',
  baseUrlMarket: 'http://127.0.0.1:5000/market/',
  baseUrlNotifier: 'http://127.0.0.1:5000/notifier/',
  baseUrlDatabase: 'http://127.0.0.1:5000/database/',
  baseUrlTrade: 'http://127.0.0.1:5000/trade/',
  baseUrlService: 'http://localhost:5001/service/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
