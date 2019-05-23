!(function(e, t) {
	'object' == typeof exports && 'object' == typeof module
		? (module.exports = t(require('react'), require('prop-types'), require('react-dom')))
		: 'function' == typeof define && define.amd
			? define(['react', 'prop-types', 'react-dom'], t)
			: 'object' == typeof exports
				? (exports.ReactContexify = t(
						require('react'),
						require('prop-types'),
						require('react-dom')
				  ))
				: (e.ReactContexify = t(e.react, e['prop-types'], e['react-dom']));
})(window, function(e, t, n) {
	return (function(e) {
		var t = {};
		function n(r) {
			if (t[r]) return t[r].exports;
			var o = (t[r] = { i: r, l: !1, exports: {} });
			return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
		}
		return (
			(n.m = e),
			(n.c = t),
			(n.d = function(e, t, r) {
				n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
			}),
			(n.r = function(e) {
				'undefined' != typeof Symbol &&
					Symbol.toStringTag &&
					Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
					Object.defineProperty(e, '__esModule', { value: !0 });
			}),
			(n.t = function(e, t) {
				if ((1 & t && (e = n(e)), 8 & t)) return e;
				if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
				var r = Object.create(null);
				if (
					(n.r(r),
					Object.defineProperty(r, 'default', { enumerable: !0, value: e }),
					2 & t && 'string' != typeof e)
				)
					for (var o in e)
						n.d(
							r,
							o,
							function(t) {
								return e[t];
							}.bind(null, o)
						);
				return r;
			}),
			(n.n = function(e) {
				var t =
					e && e.__esModule
						? function() {
								return e.default;
						  }
						: function() {
								return e;
						  };
				return n.d(t, 'a', t), t;
			}),
			(n.o = function(e, t) {
				return Object.prototype.hasOwnProperty.call(e, t);
			}),
			(n.p = ''),
			n((n.s = 7))
		);
	})([
		function(t, n) {
			t.exports = e;
		},
		function(e, t, n) {
			'use strict';
			Object.defineProperty(t, '__esModule', { value: !0 }),
				(t.styles = {
					menu: 'react-contexify',
					submenu: 'react-contexify react-contexify__submenu',
					submenuArrow: 'react-contexify__submenu-arrow',
					separator: 'react-contexify__separator',
					item: 'react-contexify__item',
					itemDisabled: 'react-contexify__item--disabled',
					itemContent: 'react-contexify__item__content',
					itemIcon: 'react-contexify__item__icon',
					theme: 'react-contexify__theme--',
					animationWillEnter: 'react-contexify__will-enter--',
					animationWillLeave: 'react-contexify__will-leave--'
				}),
				(t.theme = { light: 'light', dark: 'dark' }),
				(t.animation = { fade: 'fade', flip: 'flip', pop: 'pop', zoom: 'zoom' });
		},
		function(e, n) {
			e.exports = t;
		},
		function(e, t, n) {
			var r;
			/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
			/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
			!(function() {
				'use strict';
				var n = {}.hasOwnProperty;
				function o() {
					for (var e = [], t = 0; t < arguments.length; t++) {
						var r = arguments[t];
						if (r) {
							var i = typeof r;
							if ('string' === i || 'number' === i) e.push(r);
							else if (Array.isArray(r) && r.length) {
								var s = o.apply(null, r);
								s && e.push(s);
							} else if ('object' === i)
								for (var a in r) n.call(r, a) && r[a] && e.push(a);
						}
					}
					return e.join(' ');
				}
				e.exports
					? ((o.default = o), (e.exports = o))
					: void 0 ===
							(r = function() {
								return o;
							}.apply(t, [])) || (e.exports = r);
			})();
		},
		function(e, t, n) {
			'use strict';
			Object.defineProperty(t, '__esModule', { value: !0 }),
				(t.HIDE_ALL = 0),
				(t.DISPLAY_MENU = function(e) {
					return 'DISPLAY_' + e;
				});
		},
		function(e, t, n) {
			'use strict';
			Object.defineProperty(t, '__esModule', { value: !0 });
			var r = {
				eventList: new Map(),
				on: function(e, t) {
					var n = this;
					return (
						this.eventList.has(e) || this.eventList.set(e, new Set()),
						this.eventList.get(e).add(t),
						function() {
							return n.eventList.get(e).delete(t);
						}
					);
				},
				emit: function(e) {
					for (var t = this, n = [], r = 1; r < arguments.length; r++)
						n[r - 1] = arguments[r];
					return this.eventList.has(e)
						? (this.eventList.get(e).forEach(function(e) {
								return e.call.apply(e, [t].concat(n));
						  }),
						  !0)
						: (console.warn(
								'<' +
									e +
									'> Event is not registered. Did you forgot to bind the event ?'
						  ),
						  !1);
				}
			};
			t.eventManager = r;
		},
		function(e, t, n) {
			'use strict';
			Object.defineProperty(t, '__esModule', { value: !0 });
			var r = n(0);
			t.cloneItem = function(e, t) {
				return r.Children.map(
					r.Children.toArray(e).filter(function(e) {
						return Boolean(e);
					}),
					function(e) {
						return r.cloneElement(e, t);
					}
				);
			};
		},
		function(e, t, n) {
			'use strict';
			Object.defineProperty(t, '__esModule', { value: !0 });
			var r = n(8);
			t.Menu = r.Menu;
			var o = n(11);
			t.Item = o.Item;
			var i = n(12);
			t.Separator = i.Separator;
			var s = n(13);
			t.IconFont = s.IconFont;
			var a = n(14);
			t.Submenu = a.Submenu;
			var u = n(15);
			t.MenuProvider = u.MenuProvider;
			var l = n(16);
			t.contextMenu = l.contextMenu;
			var c = n(1);
			(t.theme = c.theme), (t.animation = c.animation);
		},
		function(e, t, n) {
			'use strict';
			var r,
				o =
					(this && this.__extends) ||
					((r = function(e, t) {
						return (r =
							Object.setPrototypeOf ||
							({ __proto__: [] } instanceof Array &&
								function(e, t) {
									e.__proto__ = t;
								}) ||
							function(e, t) {
								for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
							})(e, t);
					}),
					function(e, t) {
						function n() {
							this.constructor = e;
						}
						r(e, t),
							(e.prototype =
								null === t
									? Object.create(t)
									: ((n.prototype = t.prototype), new n()));
					}),
				i =
					(this && this.__assign) ||
					function() {
						return (i =
							Object.assign ||
							function(e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
								return e;
							}).apply(this, arguments);
					},
				s =
					(this && this.__importStar) ||
					function(e) {
						if (e && e.__esModule) return e;
						var t = {};
						if (null != e)
							for (var n in e) Object.hasOwnProperty.call(e, n) && (t[n] = e[n]);
						return (t.default = e), t;
					},
				a =
					(this && this.__importDefault) ||
					function(e) {
						return e && e.__esModule ? e : { default: e };
					};
			Object.defineProperty(t, '__esModule', { value: !0 });
			var u = s(n(0)),
				l = a(n(2)),
				c = a(n(3)),
				f = n(6),
				d = n(9),
				p = n(4),
				h = n(1),
				v = n(5),
				y = {
					ENTER: 13,
					ESC: 27,
					ARROW_UP: 38,
					ARROW_DOWN: 40,
					ARROW_LEFT: 37,
					ARROW_RIGHT: 39
				},
				m = (function(e) {
					function t() {
						var t = (null !== e && e.apply(this, arguments)) || this;
						return (
							(t.state = {
								x: 0,
								y: 0,
								visible: !1,
								nativeEvent: {},
								propsFromTrigger: {}
							}),
							(t.unsub = []),
							(t.bindWindowEvent = function() {
								window.addEventListener('resize', t.hide),
									window.addEventListener('contextmenu', t.hide),
									window.addEventListener('mousedown', t.hide),
									window.addEventListener('click', t.hide),
									window.addEventListener('scroll', t.hide),
									window.addEventListener('keydown', t.handleKeyboard);
							}),
							(t.unBindWindowEvent = function() {
								window.removeEventListener('resize', t.hide),
									window.removeEventListener('contextmenu', t.hide),
									window.removeEventListener('mousedown', t.hide),
									window.removeEventListener('click', t.hide),
									window.removeEventListener('scroll', t.hide),
									window.removeEventListener('keydown', t.handleKeyboard);
							}),
							(t.onMouseEnter = function() {
								return window.removeEventListener('mousedown', t.hide);
							}),
							(t.onMouseLeave = function() {
								return window.addEventListener('mousedown', t.hide);
							}),
							(t.hide = function(e) {
								var n = e;
								(void 0 === n ||
									(2 !== n.button && !0 !== n.ctrlKey) ||
									'contextmenu' === n.type) &&
									(t.unBindWindowEvent(), t.setState({ visible: !1 }));
							}),
							(t.handleKeyboard = function(e) {
								(e.keyCode !== y.ENTER && e.keyCode !== y.ESC) ||
									(t.unBindWindowEvent(), t.setState({ visible: !1 }));
							}),
							(t.setRef = function(e) {
								t.menuRef = e;
							}),
							(t.show = function(e, n) {
								e.stopPropagation(), v.eventManager.emit(p.HIDE_ALL);
								var r = t.getMousePosition(e),
									o = r.x,
									i = r.y;
								t.setState(
									{
										visible: !0,
										x: o,
										y: i,
										nativeEvent: e,
										propsFromTrigger: n
									},
									t.setMenuPosition
								);
							}),
							t
						);
					}
					return (
						o(t, e),
						(t.prototype.componentDidMount = function() {
							this.unsub.push(
								v.eventManager.on(p.DISPLAY_MENU(this.props.id), this.show)
							),
								this.unsub.push(v.eventManager.on(p.HIDE_ALL, this.hide));
						}),
						(t.prototype.componentWillUnmount = function() {
							this.unsub.forEach(function(e) {
								return e();
							}),
								this.unBindWindowEvent();
						}),
						(t.prototype.setMenuPosition = function() {
							var e = window.innerWidth,
								t = window.innerHeight,
								n = this.menuRef,
								r = n.offsetWidth,
								o = n.offsetHeight,
								i = this.state,
								s = i.x,
								a = i.y;
							s + r > e && (s -= s + r - e),
								a + o > t && (a -= a + o - t),
								this.setState({ x: s, y: a }, this.bindWindowEvent);
						}),
						(t.prototype.getMousePosition = function(e) {
							var t = { x: e.clientX, y: e.clientY };
							return (
								'touchend' === e.type &&
									(!t.x || !t.y) &&
									e.changedTouches &&
									e.changedTouches.length > 0 &&
									((t.x = e.changedTouches[0].clientX),
									(t.y = e.changedTouches[0].clientY)),
								(!t.x || t.x < 0) && (t.x = 0),
								(!t.y || t.y < 0) && (t.y = 0),
								t
							);
						}),
						(t.prototype.render = function() {
							var e,
								t = this.props,
								n = t.theme,
								r = t.animation,
								o = t.style,
								s = t.className,
								a = t.children,
								l = this.state,
								p = l.visible,
								v = l.nativeEvent,
								y = l.propsFromTrigger,
								m = l.x,
								_ = l.y,
								b = c.default(
									h.styles.menu,
									s,
									(((e = {})[h.styles.theme + n] = n),
									(e[h.styles.animationWillEnter + r] = r),
									e)
								),
								g = i({}, o, { left: m, top: _ + 1, opacity: 1 });
							return u.default.createElement(
								d.Portal,
								null,
								p &&
									u.default.createElement(
										'div',
										{
											className: b,
											style: g,
											ref: this.setRef,
											onMouseEnter: this.onMouseEnter,
											onMouseLeave: this.onMouseLeave,
											role: 'menu'
										},
										u.default.createElement(
											'div',
											null,
											f.cloneItem(a, { nativeEvent: v, propsFromTrigger: y })
										)
									)
							);
						}),
						(t.propTypes = {
							id: l.default.oneOfType([l.default.string, l.default.number])
								.isRequired,
							children: l.default.node.isRequired,
							theme: l.default.string,
							animation: l.default.string,
							className: l.default.string,
							style: l.default.object
						}),
						t
					);
				})(u.Component);
			t.Menu = m;
		},
		function(e, t, n) {
			'use strict';
			var r,
				o =
					(this && this.__extends) ||
					((r = function(e, t) {
						return (r =
							Object.setPrototypeOf ||
							({ __proto__: [] } instanceof Array &&
								function(e, t) {
									e.__proto__ = t;
								}) ||
							function(e, t) {
								for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
							})(e, t);
					}),
					function(e, t) {
						function n() {
							this.constructor = e;
						}
						r(e, t),
							(e.prototype =
								null === t
									? Object.create(t)
									: ((n.prototype = t.prototype), new n()));
					});
			Object.defineProperty(t, '__esModule', { value: !0 });
			var i = n(0),
				s = n(10),
				a = (function(e) {
					function t() {
						var t = (null !== e && e.apply(this, arguments)) || this;
						return (t.state = { canRender: !1 }), (t.container = {}), t;
					}
					return (
						o(t, e),
						(t.prototype.componentDidMount = function() {
							(this.container = document.createElement('div')),
								document.body.appendChild(this.container),
								this.setState({ canRender: !0 });
						}),
						(t.prototype.componentWillUnmount = function() {
							document.body.removeChild(this.container);
						}),
						(t.prototype.render = function() {
							return (
								this.state.canRender &&
								s.createPortal(this.props.children, this.container)
							);
						}),
						t
					);
				})(i.PureComponent);
			t.Portal = a;
		},
		function(e, t) {
			e.exports = n;
		},
		function(e, t, n) {
			'use strict';
			var r,
				o =
					(this && this.__extends) ||
					((r = function(e, t) {
						return (r =
							Object.setPrototypeOf ||
							({ __proto__: [] } instanceof Array &&
								function(e, t) {
									e.__proto__ = t;
								}) ||
							function(e, t) {
								for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
							})(e, t);
					}),
					function(e, t) {
						function n() {
							this.constructor = e;
						}
						r(e, t),
							(e.prototype =
								null === t
									? Object.create(t)
									: ((n.prototype = t.prototype), new n()));
					}),
				i =
					(this && this.__assign) ||
					function() {
						return (i =
							Object.assign ||
							function(e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
								return e;
							}).apply(this, arguments);
					},
				s =
					(this && this.__importStar) ||
					function(e) {
						if (e && e.__esModule) return e;
						var t = {};
						if (null != e)
							for (var n in e) Object.hasOwnProperty.call(e, n) && (t[n] = e[n]);
						return (t.default = e), t;
					},
				a =
					(this && this.__importDefault) ||
					function(e) {
						return e && e.__esModule ? e : { default: e };
					};
			Object.defineProperty(t, '__esModule', { value: !0 });
			var u = s(n(0)),
				l = a(n(2)),
				c = a(n(3)),
				f = n(1),
				d = function() {},
				p = (function(e) {
					function t(t) {
						var n = e.call(this, t) || this;
						n.handleClick = function(e) {
							n.isDisabled
								? e.stopPropagation()
								: n.props.onClick({
										event: n.props.nativeEvent,
										props: i({}, n.props.propsFromTrigger, n.props.data)
								  });
						};
						var r = n.props,
							o = r.disabled,
							s = r.nativeEvent,
							a = r.propsFromTrigger,
							u = r.data;
						return (
							(n.isDisabled =
								'function' == typeof o ? o({ event: s, props: i({}, a, u) }) : o),
							n
						);
					}
					return (
						o(t, e),
						(t.prototype.render = function() {
							var e,
								t = this.props,
								n = t.className,
								r = t.style,
								o = t.children,
								i = c.default(
									f.styles.item,
									n,
									(((e = {})['' + f.styles.itemDisabled] = this.isDisabled), e)
								);
							return u.default.createElement(
								'div',
								{
									className: i,
									style: r,
									onClick: this.handleClick,
									role: 'presentation'
								},
								u.default.createElement(
									'div',
									{ className: f.styles.itemContent, role: 'menuitem' },
									o
								)
							);
						}),
						(t.propTypes = {
							children: l.default.node.isRequired,
							data: l.default.object,
							disabled: l.default.oneOfType([l.default.func, l.default.bool]),
							onClick: l.default.func,
							nativeEvent: l.default.object,
							propsFromTrigger: l.default.object,
							className: l.default.string,
							style: l.default.object
						}),
						(t.defaultProps = { disabled: !1, onClick: d }),
						t
					);
				})(u.Component);
			t.Item = p;
		},
		function(e, t, n) {
			'use strict';
			var r =
				(this && this.__importDefault) ||
				function(e) {
					return e && e.__esModule ? e : { default: e };
				};
			Object.defineProperty(t, '__esModule', { value: !0 });
			var o = r(n(0)),
				i = n(1);
			t.Separator = function() {
				return o.default.createElement('div', { className: i.styles.separator });
			};
		},
		function(e, t, n) {
			'use strict';
			var r =
				(this && this.__importDefault) ||
				function(e) {
					return e && e.__esModule ? e : { default: e };
				};
			Object.defineProperty(t, '__esModule', { value: !0 });
			var o = r(n(0)),
				i = r(n(2)),
				s = r(n(3)),
				a = n(1),
				u = function(e) {
					var t = e.className,
						n = e.style,
						r = e.children;
					return o.default.createElement(
						'i',
						{ className: s.default(a.styles.itemIcon, t), style: n },
						r || ''
					);
				};
			(t.IconFont = u),
				(u.propTypes = {
					children: i.default.node,
					className: i.default.string,
					style: i.default.object
				});
		},
		function(e, t, n) {
			'use strict';
			var r,
				o =
					(this && this.__extends) ||
					((r = function(e, t) {
						return (r =
							Object.setPrototypeOf ||
							({ __proto__: [] } instanceof Array &&
								function(e, t) {
									e.__proto__ = t;
								}) ||
							function(e, t) {
								for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
							})(e, t);
					}),
					function(e, t) {
						function n() {
							this.constructor = e;
						}
						r(e, t),
							(e.prototype =
								null === t
									? Object.create(t)
									: ((n.prototype = t.prototype), new n()));
					}),
				i =
					(this && this.__assign) ||
					function() {
						return (i =
							Object.assign ||
							function(e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
								return e;
							}).apply(this, arguments);
					},
				s =
					(this && this.__importStar) ||
					function(e) {
						if (e && e.__esModule) return e;
						var t = {};
						if (null != e)
							for (var n in e) Object.hasOwnProperty.call(e, n) && (t[n] = e[n]);
						return (t.default = e), t;
					},
				a =
					(this && this.__importDefault) ||
					function(e) {
						return e && e.__esModule ? e : { default: e };
					};
			Object.defineProperty(t, '__esModule', { value: !0 });
			var u = s(n(0)),
				l = a(n(2)),
				c = a(n(3)),
				f = n(6),
				d = n(1),
				p = (function(e) {
					function t() {
						var t = (null !== e && e.apply(this, arguments)) || this;
						return (
							(t.state = { left: '100%', top: 0, bottom: 'initial' }),
							(t.setRef = function(e) {
								t.menu = e;
							}),
							t
						);
					}
					return (
						o(t, e),
						(t.prototype.componentDidMount = function() {
							var e = window.innerWidth,
								t = window.innerHeight,
								n = this.menu.getBoundingClientRect(),
								r = {};
							n.right < e
								? ((r.left = '100%'), (r.right = void 0))
								: ((r.right = '100%'), (r.left = void 0)),
								n.bottom > t
									? ((r.bottom = 0), (r.top = 'initial'))
									: ((r.bottom = 'initial'), (r.top = 0)),
								this.setState(r);
						}),
						(t.prototype.handleClick = function(e) {
							e.stopPropagation();
						}),
						(t.prototype.render = function() {
							var e,
								t = this.props,
								n = t.arrow,
								r = t.disabled,
								o = t.className,
								s = t.style,
								a = t.label,
								l = t.nativeEvent,
								p = t.children,
								h = t.propsFromTrigger,
								v = c.default(
									d.styles.item,
									o,
									(((e = {})['' + d.styles.itemDisabled] =
										'function' == typeof r
											? r({ event: l, props: i({}, h) })
											: r),
									e)
								),
								y = i({}, s, this.state);
							return u.default.createElement(
								'div',
								{ className: v, role: 'presentation' },
								u.default.createElement(
									'div',
									{ className: d.styles.itemContent, onClick: this.handleClick },
									a,
									u.default.createElement(
										'span',
										{ className: d.styles.submenuArrow },
										n
									)
								),
								u.default.createElement(
									'div',
									{ className: d.styles.submenu, ref: this.setRef, style: y },
									f.cloneItem(p, { propsFromTrigger: h, nativeEvent: l })
								)
							);
						}),
						(t.propTypes = {
							label: l.default.node.isRequired,
							children: l.default.node.isRequired,
							nativeEvent: l.default.object,
							arrow: l.default.node,
							disabled: l.default.oneOfType([l.default.func, l.default.bool]),
							className: l.default.string,
							style: l.default.object
						}),
						(t.defaultProps = { arrow: '▶', disabled: !1, nativeEvent: {} }),
						t
					);
				})(u.Component);
			t.Submenu = p;
		},
		function(e, t, n) {
			'use strict';
			var r,
				o =
					(this && this.__extends) ||
					((r = function(e, t) {
						return (r =
							Object.setPrototypeOf ||
							({ __proto__: [] } instanceof Array &&
								function(e, t) {
									e.__proto__ = t;
								}) ||
							function(e, t) {
								for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
							})(e, t);
					}),
					function(e, t) {
						function n() {
							this.constructor = e;
						}
						r(e, t),
							(e.prototype =
								null === t
									? Object.create(t)
									: ((n.prototype = t.prototype), new n()));
					}),
				i =
					(this && this.__assign) ||
					function() {
						return (i =
							Object.assign ||
							function(e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
								return e;
							}).apply(this, arguments);
					},
				s =
					(this && this.__rest) ||
					function(e, t) {
						var n = {};
						for (var r in e)
							Object.prototype.hasOwnProperty.call(e, r) &&
								t.indexOf(r) < 0 &&
								(n[r] = e[r]);
						if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
							var o = 0;
							for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
								t.indexOf(r[o]) < 0 && (n[r[o]] = e[r[o]]);
						}
						return n;
					},
				a =
					(this && this.__importDefault) ||
					function(e) {
						return e && e.__esModule ? e : { default: e };
					};
			Object.defineProperty(t, '__esModule', { value: !0 });
			var u = n(0),
				l = a(n(2)),
				c = n(4),
				f = n(5),
				d = (function(e) {
					function t() {
						var t = (null !== e && e.apply(this, arguments)) || this;
						return (
							(t.childrenRefs = []),
							(t.handleEvent = function(e) {
								e.preventDefault(),
									f.eventManager.emit(
										c.DISPLAY_MENU(t.props.id),
										e.nativeEvent,
										i(
											{
												ref:
													1 === t.childrenRefs.length
														? t.childrenRefs[0]
														: t.childrenRefs
											},
											t.props.data
										)
									);
							}),
							(t.setChildRef = function(e) {
								return null === e || t.childrenRefs.push(e);
							}),
							t
						);
					}
					return (
						o(t, e),
						(t.prototype.getChildren = function() {
							var e = this,
								t = this.props,
								n = (t.id, t.component, t.event, t.children),
								r = (t.className, t.style, t.storeRef),
								o = (t.data,
								s(t, [
									'id',
									'component',
									'event',
									'children',
									'className',
									'style',
									'storeRef',
									'data'
								]));
							return (
								(this.childrenRefs = []),
								u.Children.map(n, function(t) {
									return u.isValidElement(t)
										? u.cloneElement(
												t,
												i({}, o, r ? { ref: e.setChildRef } : {})
										  )
										: t;
								})
							);
						}),
						(t.prototype.render = function() {
							var e,
								t = this.props,
								n = t.component,
								r = t.render,
								o = t.event,
								s = t.className,
								a = t.style,
								l = (((e = {})[o] = this.handleEvent),
								(e.className = s),
								(e.style = a),
								e);
							return 'function' == typeof r
								? r(i({}, l, { children: this.getChildren() }))
								: u.createElement(n, l, this.getChildren());
						}),
						(t.propTypes = {
							id: l.default.oneOfType([l.default.string, l.default.number])
								.isRequired,
							children: l.default.node.isRequired,
							component: l.default.oneOfType([l.default.node, l.default.func]),
							render: l.default.func,
							event: l.default.string,
							className: l.default.string,
							style: l.default.object,
							storeRef: l.default.bool,
							data: l.default.object
						}),
						(t.defaultProps = {
							component: 'div',
							event: 'onContextMenu',
							storeRef: !0
						}),
						t
					);
				})(u.Component);
			t.MenuProvider = d;
		},
		function(e, t, n) {
			'use strict';
			Object.defineProperty(t, '__esModule', { value: !0 });
			var r = n(5),
				o = n(4),
				i = {
					show: function(e) {
						var t = e.id,
							n = e.event,
							i = e.props;
						r.eventManager.emit(o.DISPLAY_MENU(t), n.nativeEvent || n, i);
					},
					hideAll: function() {
						r.eventManager.emit(o.HIDE_ALL);
					}
				};
			t.contextMenu = i;
		}
	]);
});
//# sourceMappingURL=ReactContexify.js.map
