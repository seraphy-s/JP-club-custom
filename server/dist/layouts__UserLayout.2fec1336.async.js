(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  [3],
  {
    BOD2: function(e, t, a) {
      e.exports = {
        container: 'antd-pro-layouts-user-layout-container',
        lang: 'antd-pro-layouts-user-layout-lang',
        content: 'antd-pro-layouts-user-layout-content',
        top: 'antd-pro-layouts-user-layout-top',
        header: 'antd-pro-layouts-user-layout-header',
        logo: 'antd-pro-layouts-user-layout-logo',
        title: 'antd-pro-layouts-user-layout-title',
        desc: 'antd-pro-layouts-user-layout-desc',
      };
    },
    'nsf+': function(e, t, a) {
      'use strict';
      var l = a('mZ4U');
      Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0);
      var o = l(a('mK77')),
        u = a('KEjf'),
        n = l(a('Cjad')),
        d = l(a('YjOg')),
        r = l(a('FQm9')),
        s = a('LneV'),
        c = a('+91m'),
        f = l(a('L40f')),
        i = l(a('BOD2')),
        m = function(e) {
          var t = e.route,
            a = void 0 === t ? { routes: [] } : t,
            l = a.routes,
            s = void 0 === l ? [] : l,
            m = e.children,
            p = e.location,
            y = void 0 === p ? { pathname: '' } : p,
            g = (0, u.getMenuData)(s),
            v = g.breadcrumb;
          return r.default.createElement(
            n.default,
            {
              title: (0, u.getPageTitle)(
                (0, o.default)(
                  { pathname: y.pathname, breadcrumb: v, formatMessage: c.formatMessage },
                  e,
                ),
              ),
            },
            r.default.createElement(
              'div',
              { className: i.default.container },
              r.default.createElement(
                'div',
                { className: i.default.content },
                r.default.createElement(
                  'div',
                  { className: i.default.top },
                  r.default.createElement(
                    'div',
                    { className: i.default.header },
                    r.default.createElement(
                      d.default,
                      { to: '/' },
                      r.default.createElement('img', {
                        alt: 'logo',
                        className: i.default.logo,
                        src:
                          'http://club.shitouboy.com/club/logo/5db166f31cee01684247201f1581159881342logo',
                      }),
                      r.default.createElement(
                        'span',
                        { className: i.default.title, style: { color: '#EE4949' } },
                        'MK\u4ff1\u4e50\u90e8',
                      ),
                    ),
                  ),
                  r.default.createElement(
                    'div',
                    { className: i.default.desc },
                    'MK\u4ff1\u4e50\u90e8',
                  ),
                ),
                m,
              ),
              r.default.createElement(f.default, null),
            ),
          );
        },
        p = (0, s.connect)(function(e) {
          var t = e.settings;
          return (0, o.default)({}, t);
        })(m);
      t.default = p;
    },
  },
]);
