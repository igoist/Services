exports.common = () => {
  let c = 0;

  return async (ctx, next) => {
    if (c < 5) {
      c++;
      await next();
      setTimeout(() => {
        c--;
      }, 60);
    } else {
      console.log(`Intercept this request: ${ctx.request.url}`);
    }
  };
};
