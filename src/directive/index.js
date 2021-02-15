import Vue from 'vue';

let handleClickOutside;

// if (!String.prototype.contains) {
//   // eslint-disable-next-line no-extend-native
//   String.prototype.contains = (s) => this.indexOf(s) > -1;
// }

if (!String.prototype.includes) {
  // eslint-disable-next-line no-extend-native, func-names
  String.prototype.includes = function (search, start) {
    if (search instanceof RegExp) {
      throw TypeError('first argument must not be a RegExp');
    }
    if (start === undefined) {
      // eslint-disable-next-line no-param-reassign
      start = 0;
    }
    return this.indexOf(search, start) !== -1;
  };
}

const directive = new Vue.Directive('closable', {
  bind(el, binding, vnode) {
    handleClickOutside = (e) => {
      e.stopPropagation();
      const { handler, exclude } = binding.value;
      let clickedOnExcludedEl = false;

      // Gives you the ability to exclude certain elements if you want,
      // pass as array of strings to exclude
      if (exclude) {
        exclude.forEach((refName) => {
          if (!clickedOnExcludedEl) {
            const excludedEl = vnode.context.$refs[refName];
            let excludedDomEl = null;
            if (excludedEl) {
              // If it's a vue component grab the element, otherwise it is the element
              excludedDomEl = excludedEl.$el ? excludedEl.$el : excludedEl;
              console.log(excludedDomEl);
              clickedOnExcludedEl = excludedDomEl.includes(e.target);
            }
            clickedOnExcludedEl = excludedEl.includes(e.target);
          }
        });
      }

      if (!el.includes(e.target) && !clickedOnExcludedEl) {
        handler(e);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
  },

  unbind() {
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('touchstart', handleClickOutside);
  },
});

export default directive;
