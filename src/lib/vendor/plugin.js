var postcss = require('postcss');

module.exports = postcss.plugin('namespace-css-module-loader', plugin);

function plugin(opts) {
  opts = opts || {}
  var id = opts.id || 'style'
  var local = '.' + opts.rootClass || ':local(.' + id + ')'
  var regex = new RegExp('^\\d+%');
  return function(root) {
    return root.walkRules(function(rule) {
      if (rule.selector.substr(0, 7) === ':global') return;

      rule.selectors = rule.selectors.map(selector => {
        let descendant;

        if (selector.indexOf(':export') !== -1) {
          descendant = selector;
        } else {
          descendant = local + ' ' + selector;
        }

        if (descendant.split(' ')[1] === 'from' || descendant.split(' ')[1] == 'to' || regex.test(descendant.split(' ')[1])) {
          descendant = selector;
        }

        const combined = ':global ' + selector.replace(/([\w-\.\#\*]+)(.*)/, '$1' + local + '$2')

        if (opts.combine && opts.descendant) {
          return [combined, descendant].join(', ');
        } else if (opts.combine) {
          return combined
        } else {
          return descendant
        }
      });
    })
  }
}
