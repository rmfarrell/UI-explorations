module.exports = ctx => ({
  map: ctx.options.map,
  plugins: [
    require('postcss-nested'),
    require('autoprefixer'),
    require('postcss-custom-selectors'),
    require('postcss-custom-media'),
    require('postcss-import'),
    require('lost')
  ]
});
