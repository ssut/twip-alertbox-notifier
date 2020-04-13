(() => {
  window.A = new Proxy(window.A, {
    get(target, propertyKey) {
      const fn = Reflect.get(target, propertyKey);
      if (propertyKey !== 'playMedia' && !propertyKey.startsWith('make')) {
        return fn;
      }

      return (...args) => {
        switch (propertyKey) {
          case 'playMedia':
            console.info('playMedia');
            break;

          case 'makeDonateAlert':
            const [now] = args;
            console.info('donate', now.amount);
            break;

          case 'makeCheerAlert':
            console.info('cheer');
            break;

          case 'makeFollowAlert':
            console.info('follow');
            break;

          case 'makeSubscribeAlert':
            console.info('subscribe');
            break;

          case 'makeHostingAlert':
            console.info('hosting');
            break;

          case 'makeRedemptionAlert':
            console.info('redemption');
            break;
        }

        fn.call(target, ...args);
      };
    },
  });
})();
