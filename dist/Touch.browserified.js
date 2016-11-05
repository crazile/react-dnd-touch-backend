(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reactDndTouchBackend = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))

},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
    try {
        cachedSetTimeout = setTimeout;
    } catch (e) {
        cachedSetTimeout = function () {
            throw new Error('setTimeout is not defined');
        }
    }
    try {
        cachedClearTimeout = clearTimeout;
    } catch (e) {
        cachedClearTimeout = function () {
            throw new Error('clearTimeout is not defined');
        }
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TouchBackend = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createTouchBackend;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getEventClientTouchOffset(e) {
    if (e.targetTouches.length === 1) {
        return getEventClientOffset(e.targetTouches[0]);
    }
}

function getEventClientOffset(e) {
    if (e.targetTouches) {
        return getEventClientTouchOffset(e);
    } else {
        return {
            x: e.clientX,
            y: e.clientY
        };
    }
}

var ELEMENT_NODE = 1;
function getNodeClientOffset(node) {
    var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;

    if (!el) {
        return null;
    }

    var _el$getBoundingClient = el.getBoundingClientRect();

    var top = _el$getBoundingClient.top;
    var left = _el$getBoundingClient.left;

    return { x: left, y: top };
}

var eventNames = {
    mouse: {
        start: 'mousedown',
        move: 'mousemove',
        end: 'mouseup'
    },
    touch: {
        start: 'touchstart',
        move: 'touchmove',
        end: 'touchend',
        cancel: 'touchcancel'
    }
};

var TouchBackend = exports.TouchBackend = function () {
    function TouchBackend(manager) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, TouchBackend);

        options.delayTouchStart = options.delayTouchStart || options.delay;

        options = _extends({
            enableTouchEvents: true,
            enableMouseEvents: false,
            delayTouchStart: 0,
            delayMouseStart: 0,
            minMoveTouchStart: 0,
            minMoveMouseStart: 0
        }, options);

        this.actions = manager.getActions();
        this.monitor = manager.getMonitor();
        this.registry = manager.getRegistry();

        this.minMoveTouchStart = options.minMoveTouchStart;
        this.minMoveMouseStart = options.minMoveMouseStart;
        this.delayTouchStart = options.delayTouchStart;
        this.delayMouseStart = options.delayMouseStart;
        this.sourceNodes = {};
        this.sourceNodeOptions = {};
        this.sourcePreviewNodes = {};
        this.sourcePreviewNodeOptions = {};
        this.targetNodeOptions = {};
        this.listenerTypes = [];
        this._mouseClientOffset = {};
        this._suppressContextMenu = false;

        if (options.enableMouseEvents) {
            this.listenerTypes.push('mouse');
        }

        if (options.enableTouchEvents) {
            this.listenerTypes.push('touch');
        }

        this.getSourceClientOffset = this.getSourceClientOffset.bind(this);
        this.handleTopMoveStart = this.handleTopMoveStart.bind(this);
        this.handleTopMoveStartDelay = this.handleTopMoveStartDelay.bind(this);
        this.handleTopMoveStartCapture = this.handleTopMoveStartCapture.bind(this);
        this.handleTopMoveCapture = this.handleTopMoveCapture.bind(this);
        this.handleTopMove = this.handleTopMove.bind(this);
        this.handleTopMoveEndCapture = this.handleTopMoveEndCapture.bind(this);
        this.handleTopMoveCancelCapture = this.handleTopMoveCancelCapture.bind(this);
        this.handleShowContextMenu = this.handleShowContextMenu.bind(this);
    }

    _createClass(TouchBackend, [{
        key: 'setup',
        value: function setup() {
            if (typeof window === 'undefined') {
                return;
            }

            (0, _invariant2.default)(!this.constructor.isSetUp, 'Cannot have two Touch backends at the same time.');
            this.constructor.isSetUp = true;

            this.addEventListener(window, 'start', this.getTopMoveStartHandler());
            this.addEventListener(window, 'start', this.handleTopMoveStartCapture, true);
            this.addEventListener(window, 'move', this.handleTopMove);
            this.addEventListener(window, 'move', this.handleTopMoveCapture, true);
            this.addEventListener(window, 'end', this.handleTopMoveEndCapture, true);
            this.addEventListener(window, 'cancel', this.handleTopMoveCancelCapture, true);

            window.addEventListener('contextmenu', this.handleShowContextMenu);
        }
    }, {
        key: 'teardown',
        value: function teardown() {
            if (typeof window === 'undefined') {
                return;
            }

            this.constructor.isSetUp = false;
            this._mouseClientOffset = {};

            this.removeEventListener(window, 'start', this.getTopMoveStartHandler());
            this.removeEventListener(window, 'start', this.handleTopMoveStartCapture, true);
            this.removeEventListener(window, 'move', this.handleTopMoveCapture, true);
            this.removeEventListener(window, 'move', this.handleTopMove);
            this.removeEventListener(window, 'end', this.handleTopMoveEndCapture, true);
            this.removeEventListener(window, 'cancel', this.handleTopMoveCancelCapture, true);

            window.removeEventListener('contextmenu', this.handleShowContextMenu);

            this.uninstallSourceNodeRemovalObserver();
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(subject, event, handler, capture) {
            this.listenerTypes.forEach(function (listenerType) {
                var eventName = eventNames[listenerType][event];
                if (eventName) {
                    subject.addEventListener(eventName, handler, capture);
                }
            });
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(subject, event, handler, capture) {
            this.listenerTypes.forEach(function (listenerType) {
                var eventName = eventNames[listenerType][event];
                if (eventName) {
                    subject.removeEventListener(eventName, handler, capture);
                }
            });
        }
    }, {
        key: 'connectDragSource',
        value: function connectDragSource(sourceId, node, options) {
            var _this = this;

            this.sourceNodes[sourceId] = node;

            var handleMoveStart = this.handleMoveStart.bind(this, sourceId);
            this.addEventListener(node, 'start', handleMoveStart);

            var handleClickDragSource = this.handleClickDragSource.bind(this, sourceId);
            node.addEventListener('click', handleClickDragSource, true);

            return function () {
                delete _this.sourceNodes[sourceId];
                _this.removeEventListener(node, 'start', handleMoveStart);
                node.removeEventListener('click', handleClickDragSource, true);
            };
        }
    }, {
        key: 'connectDragPreview',
        value: function connectDragPreview(sourceId, node, options) {
            var _this2 = this;

            this.sourcePreviewNodeOptions[sourceId] = options;
            this.sourcePreviewNodes[sourceId] = node;

            return function () {
                delete _this2.sourcePreviewNodes[sourceId];
                delete _this2.sourcePreviewNodeOptions[sourceId];
            };
        }
    }, {
        key: 'connectDropTarget',
        value: function connectDropTarget(targetId, node) {
            var _this3 = this;

            var handleMove = function handleMove(e) {
                var coords = getEventClientOffset(e);

                /**
                 * Use the coordinates to grab the element the drag ended on.
                 * If the element is the same as the target node (or any of it's children) then we have hit a drop target and can handle the move.
                 */
                var droppedOn = document.elementFromPoint(coords.x, coords.y);
                var childMatch = node.contains(droppedOn);

                if (droppedOn === node || childMatch) {
                    return _this3.handleMove(e, targetId);
                }
            };

            /**
             * Attaching the event listener to the body so that touchmove will work while dragging over multiple target elements.
             */
            this.addEventListener(document.querySelector('body'), 'move', handleMove);

            return function () {
                _this3.removeEventListener(document.querySelector('body'), 'move', handleMove);
            };
        }
    }, {
        key: 'handleShowContextMenu',
        value: function handleShowContextMenu(e) {
            if (this._suppressContextMenu) {
                e.preventDefault();
            } else {
                this.cancelDrag();
            }
        }
    }, {
        key: 'handleClickDragSource',
        value: function handleClickDragSource(sourceId, e) {
            if (this._lastDropEventTimeStamp && this._lastDropEventTimeStamp === e.timeStamp) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }, {
        key: 'getSourceClientOffset',
        value: function getSourceClientOffset(sourceId) {
            return getNodeClientOffset(this.sourceNodes[sourceId]);
        }
    }, {
        key: 'handleTopMoveStartCapture',
        value: function handleTopMoveStartCapture(e) {
            this.moveStartSourceIds = [];
        }
    }, {
        key: 'handleMoveStart',
        value: function handleMoveStart(sourceId) {
            this.moveStartSourceIds.unshift(sourceId);
        }
    }, {
        key: 'getTopMoveStartHandler',
        value: function getTopMoveStartHandler() {
            if (!this.delayTouchStart && !this.delayMouseStart) {
                return this.handleTopMoveStart;
            }

            return this.handleTopMoveStartDelay;
        }
    }, {
        key: 'handleTopMoveStart',
        value: function handleTopMoveStart(e) {
            // Allow other systems to prevent dragging
            if (e.defaultPrevented) {
                return;
            }

            // Don't prematurely preventDefault() here since it might:
            // 1. Mess up scrolling
            // 2. Mess up long tap (which brings up context menu)
            // 3. If there's an anchor link as a child, tap won't be triggered on link

            var clientOffset = getEventClientOffset(e);
            if (clientOffset) {
                this._mouseClientOffset = clientOffset;
            }
        }
    }, {
        key: 'handleTopMoveStartDelay',
        value: function handleTopMoveStartDelay(e) {
            var delay = e.type === eventNames.touch.start ? this.delayTouchStart : this.delayMouseStart;

            if (delay) {
                this._suppressContextMenu = true;
            }

            this.timeout = setTimeout(this.handleTopMoveStart.bind(this, e), delay);
        }
    }, {
        key: 'handleTopMoveCapture',
        value: function handleTopMoveCapture(e) {
            this.dragOverTargetIds = [];
        }
    }, {
        key: 'handleMove',
        value: function handleMove(e, targetId) {
            this.dragOverTargetIds.unshift(targetId);
        }
    }, {
        key: 'handleTopMove',
        value: function handleTopMove(e) {
            clearTimeout(this.timeout);

            var moveStartSourceIds = this.moveStartSourceIds;
            var dragOverTargetIds = this.dragOverTargetIds;

            var clientOffset = getEventClientOffset(e);

            if (!clientOffset) {
                return;
            }

            // Allow drag to be pre-empted
            if (e.defaultPrevented && !this.monitor.isDragging()) {
                this.cancelDrag();
            }

            var dragStartMinOffsetChange = e.type === eventNames.touch.move ? this.minMoveTouchStart : this.minMoveMouseStart;

            // If we're not dragging and we've moved a little, that counts as a drag start
            if (!this.monitor.isDragging() && this._mouseClientOffset.hasOwnProperty('x') && moveStartSourceIds && (Math.abs(this._mouseClientOffset.x - clientOffset.x) >= dragStartMinOffsetChange || Math.abs(this._mouseClientOffset.y - clientOffset.y) >= dragStartMinOffsetChange)) {
                this.moveStartSourceIds = null;
                this.actions.beginDrag(moveStartSourceIds, {
                    clientOffset: this._mouseClientOffset,
                    getSourceClientOffset: this.getSourceClientOffset,
                    publishSource: false
                });
            }

            if (!this.monitor.isDragging()) {
                return;
            }

            var sourceNode = this.sourceNodes[this.monitor.getSourceId()];
            this.installSourceNodeRemovalObserver(sourceNode);
            this.actions.publishDragSource();

            e.preventDefault();

            /*
            const matchingTargetIds = Object.keys(this.targetNodes)
                .filter((targetId) => {
                    const boundingRect = this.targetNodes[targetId].getBoundingClientRect();
                    return clientOffset.x >= boundingRect.left &&
                    clientOffset.x <= boundingRect.right &&
                    clientOffset.y >= boundingRect.top &&
                    clientOffset.y <= boundingRect.bottom;
                });
            */

            this.actions.hover(dragOverTargetIds, {
                clientOffset: clientOffset
            });
        }
    }, {
        key: 'handleTopMoveEndCapture',
        value: function handleTopMoveEndCapture(event) {
            this.endDrag(event);
        }
    }, {
        key: 'handleTopMoveCancelCapture',
        value: function handleTopMoveCancelCapture(event) {
            this.cancelDrag(event);
        }
    }, {
        key: 'cancelDrag',
        value: function cancelDrag(event) {
            this.endDrag(event, { cancelled: true });
        }
    }, {
        key: 'endDrag',
        value: function endDrag(event) {
            var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            var cancelled = _ref.cancelled;

            clearTimeout(this.timeout);

            this._mouseClientOffset = {};
            this._suppressContextMenu = false;

            if (!this.monitor.isDragging() || this.monitor.didDrop()) {
                this.moveStartSourceIds = null;
                return;
            }

            this.uninstallSourceNodeRemovalObserver();

            if (!cancelled) {
                if (event) {
                    this._lastDropEventTimeStamp = event.timeStamp;
                    event.preventDefault();
                }

                this.actions.drop();
            }

            this.actions.endDrag();
        }
    }, {
        key: 'installSourceNodeRemovalObserver',
        value: function installSourceNodeRemovalObserver(node) {
            var _this4 = this;

            this.uninstallSourceNodeRemovalObserver();

            this.draggedSourceNode = node;
            this.draggedSourceNodeRemovalObserver = new window.MutationObserver(function () {
                if (!node.parentElement) {
                    _this4.resurrectSourceNode();
                    _this4.uninstallSourceNodeRemovalObserver();
                }
            });

            if (!node || !node.parentElement) {
                return;
            }

            this.draggedSourceNodeRemovalObserver.observe(node.parentElement, { childList: true });
        }
    }, {
        key: 'resurrectSourceNode',
        value: function resurrectSourceNode() {
            this.draggedSourceNode.style.display = 'none';
            this.draggedSourceNode.removeAttribute('data-reactid');
            document.body.appendChild(this.draggedSourceNode);
        }
    }, {
        key: 'uninstallSourceNodeRemovalObserver',
        value: function uninstallSourceNodeRemovalObserver() {
            if (this.draggedSourceNodeRemovalObserver) {
                this.draggedSourceNodeRemovalObserver.disconnect();
            }

            this.draggedSourceNodeRemovalObserver = null;
            this.draggedSourceNode = null;
        }
    }]);

    return TouchBackend;
}();

function createTouchBackend() {
    var optionsOrManager = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var touchBackendFactory = function touchBackendFactory(manager) {
        return new TouchBackend(manager, optionsOrManager);
    };

    if (optionsOrManager.getMonitor) {
        return touchBackendFactory(optionsOrManager);
    } else {
        return touchBackendFactory;
    }
}

},{"invariant":1}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW52YXJpYW50L2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL1RvdWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Qix5REFBSixFQUFJOztBQUMvRCxRQUFNLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBVSxPQUFWLEVBQW1CO0FBQzNDLGVBQU8sSUFBSSxZQUFKLENBQWlCLE9BQWpCLEVBQTBCLGdCQUExQixDQUFQO0FBQ0gsS0FGRDs7QUFJQSxRQUFJLGlCQUFpQixVQUFyQixFQUFpQztBQUM3QixlQUFPLG9CQUFvQixnQkFBcEIsQ0FBUDtBQUNILEtBRkQsTUFFTztBQUNILGVBQU8sbUJBQVA7QUFDSDtBQUNKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFyaWFudCByZXF1aXJlcyBhbiBlcnJvciBtZXNzYWdlIGFyZ3VtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB2YXIgZXJyb3I7XG4gICAgaWYgKGZvcm1hdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgK1xuICAgICAgICAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IFthLCBiLCBjLCBkLCBlLCBmXTtcbiAgICAgIHZhciBhcmdJbmRleCA9IDA7XG4gICAgICBlcnJvciA9IG5ldyBFcnJvcihcbiAgICAgICAgZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJnc1thcmdJbmRleCsrXTsgfSlcbiAgICAgICk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTUsIFlhaG9vIEluYy5cbiAqIENvcHlyaWdodHMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLiBTZWUgdGhlIGFjY29tcGFueWluZyBMSUNFTlNFIGZpbGUgZm9yIHRlcm1zLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcblxuZnVuY3Rpb24gZ2V0RXZlbnRDbGllbnRUb3VjaE9mZnNldCAoZSkge1xuICAgIGlmIChlLnRhcmdldFRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBnZXRFdmVudENsaWVudE9mZnNldChlLnRhcmdldFRvdWNoZXNbMF0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0RXZlbnRDbGllbnRPZmZzZXQgKGUpIHtcbiAgICBpZiAoZS50YXJnZXRUb3VjaGVzKSB7XG4gICAgICAgIHJldHVybiBnZXRFdmVudENsaWVudFRvdWNoT2Zmc2V0KGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBlLmNsaWVudFgsXG4gICAgICAgICAgICB5OiBlLmNsaWVudFlcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmNvbnN0IEVMRU1FTlRfTk9ERSA9IDE7XG5mdW5jdGlvbiBnZXROb2RlQ2xpZW50T2Zmc2V0IChub2RlKSB7XG4gICAgY29uc3QgZWwgPSBub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREVcbiAgICAgICAgPyBub2RlXG4gICAgICAgIDogbm9kZS5wYXJlbnRFbGVtZW50O1xuXG4gICAgaWYgKCFlbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7IHRvcCwgbGVmdCB9ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHsgeDogbGVmdCwgeTogdG9wIH07XG59XG5cbmNvbnN0IGV2ZW50TmFtZXMgPSB7XG4gICAgbW91c2U6IHtcbiAgICAgICAgc3RhcnQ6ICdtb3VzZWRvd24nLFxuICAgICAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcbiAgICAgICAgZW5kOiAnbW91c2V1cCdcbiAgICB9LFxuICAgIHRvdWNoOiB7XG4gICAgICAgIHN0YXJ0OiAndG91Y2hzdGFydCcsXG4gICAgICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxuICAgICAgICBlbmQ6ICd0b3VjaGVuZCcsXG4gICAgICAgIGNhbmNlbDogJ3RvdWNoY2FuY2VsJ1xuICAgIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBUb3VjaEJhY2tlbmQge1xuICAgIGNvbnN0cnVjdG9yIChtYW5hZ2VyLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgb3B0aW9ucy5kZWxheVRvdWNoU3RhcnQgPSBvcHRpb25zLmRlbGF5VG91Y2hTdGFydCB8fCBvcHRpb25zLmRlbGF5O1xuXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBlbmFibGVUb3VjaEV2ZW50czogdHJ1ZSxcbiAgICAgICAgICAgIGVuYWJsZU1vdXNlRXZlbnRzOiBmYWxzZSxcbiAgICAgICAgICAgIGRlbGF5VG91Y2hTdGFydDogMCxcbiAgICAgICAgICAgIGRlbGF5TW91c2VTdGFydDogMCxcbiAgICAgICAgICAgIG1pbk1vdmVUb3VjaFN0YXJ0OiAwLFxuICAgICAgICAgICAgbWluTW92ZU1vdXNlU3RhcnQ6IDAsXG4gICAgICAgICAgICAuLi5vcHRpb25zXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5hY3Rpb25zID0gbWFuYWdlci5nZXRBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMubW9uaXRvciA9IG1hbmFnZXIuZ2V0TW9uaXRvcigpO1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5ID0gbWFuYWdlci5nZXRSZWdpc3RyeSgpO1xuXG4gICAgICAgIHRoaXMubWluTW92ZVRvdWNoU3RhcnQgPSBvcHRpb25zLm1pbk1vdmVUb3VjaFN0YXJ0O1xuICAgICAgICB0aGlzLm1pbk1vdmVNb3VzZVN0YXJ0ID0gb3B0aW9ucy5taW5Nb3ZlTW91c2VTdGFydDtcbiAgICAgICAgdGhpcy5kZWxheVRvdWNoU3RhcnQgPSBvcHRpb25zLmRlbGF5VG91Y2hTdGFydDtcbiAgICAgICAgdGhpcy5kZWxheU1vdXNlU3RhcnQgPSBvcHRpb25zLmRlbGF5TW91c2VTdGFydDtcbiAgICAgICAgdGhpcy5zb3VyY2VOb2RlcyA9IHt9O1xuICAgICAgICB0aGlzLnNvdXJjZU5vZGVPcHRpb25zID0ge307XG4gICAgICAgIHRoaXMuc291cmNlUHJldmlld05vZGVzID0ge307XG4gICAgICAgIHRoaXMuc291cmNlUHJldmlld05vZGVPcHRpb25zID0ge307XG4gICAgICAgIHRoaXMudGFyZ2V0Tm9kZU9wdGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5saXN0ZW5lclR5cGVzID0gW107XG4gICAgICAgIHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0ID0ge307XG4gICAgICAgIHRoaXMuX3N1cHByZXNzQ29udGV4dE1lbnUgPSBmYWxzZTtcblxuICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVNb3VzZUV2ZW50cykge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lclR5cGVzLnB1c2goJ21vdXNlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5lbmFibGVUb3VjaEV2ZW50cykge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lclR5cGVzLnB1c2goJ3RvdWNoJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdldFNvdXJjZUNsaWVudE9mZnNldCA9IHRoaXMuZ2V0U291cmNlQ2xpZW50T2Zmc2V0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0ID0gdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnREZWxheSA9IHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0RGVsYXkuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnRDYXB0dXJlID0gdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnRDYXB0dXJlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZUNhcHR1cmUgPSB0aGlzLmhhbmRsZVRvcE1vdmVDYXB0dXJlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZSA9IHRoaXMuaGFuZGxlVG9wTW92ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVFbmRDYXB0dXJlID0gdGhpcy5oYW5kbGVUb3BNb3ZlRW5kQ2FwdHVyZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVDYW5jZWxDYXB0dXJlID0gdGhpcy5oYW5kbGVUb3BNb3ZlQ2FuY2VsQ2FwdHVyZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVNob3dDb250ZXh0TWVudSA9IHRoaXMuaGFuZGxlU2hvd0NvbnRleHRNZW51LmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgc2V0dXAgKCkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGludmFyaWFudCghdGhpcy5jb25zdHJ1Y3Rvci5pc1NldFVwLCAnQ2Fubm90IGhhdmUgdHdvIFRvdWNoIGJhY2tlbmRzIGF0IHRoZSBzYW1lIHRpbWUuJyk7XG4gICAgICAgIHRoaXMuY29uc3RydWN0b3IuaXNTZXRVcCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ3N0YXJ0JywgIHRoaXMuZ2V0VG9wTW92ZVN0YXJ0SGFuZGxlcigpKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ3N0YXJ0JywgIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0Q2FwdHVyZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdtb3ZlJywgICB0aGlzLmhhbmRsZVRvcE1vdmUpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAnbW92ZScsICAgdGhpcy5oYW5kbGVUb3BNb3ZlQ2FwdHVyZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdlbmQnLCAgICB0aGlzLmhhbmRsZVRvcE1vdmVFbmRDYXB0dXJlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ2NhbmNlbCcsIHRoaXMuaGFuZGxlVG9wTW92ZUNhbmNlbENhcHR1cmUsIHRydWUpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIHRoaXMuaGFuZGxlU2hvd0NvbnRleHRNZW51KTtcbiAgICB9XG5cbiAgICB0ZWFyZG93biAoKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5pc1NldFVwID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0ID0ge307XG5cbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ3N0YXJ0JywgIHRoaXMuZ2V0VG9wTW92ZVN0YXJ0SGFuZGxlcigpKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ3N0YXJ0JywgIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0Q2FwdHVyZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdtb3ZlJywgICB0aGlzLmhhbmRsZVRvcE1vdmVDYXB0dXJlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ21vdmUnLCAgIHRoaXMuaGFuZGxlVG9wTW92ZSk7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdlbmQnLCAgICB0aGlzLmhhbmRsZVRvcE1vdmVFbmRDYXB0dXJlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ2NhbmNlbCcsIHRoaXMuaGFuZGxlVG9wTW92ZUNhbmNlbENhcHR1cmUsIHRydWUpO1xuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIHRoaXMuaGFuZGxlU2hvd0NvbnRleHRNZW51KTtcblxuICAgICAgICB0aGlzLnVuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoKTtcbiAgICB9XG5cbiAgICBhZGRFdmVudExpc3RlbmVyIChzdWJqZWN0LCBldmVudCwgaGFuZGxlciwgY2FwdHVyZSkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyVHlwZXMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXJUeXBlKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBldmVudE5hbWVzW2xpc3RlbmVyVHlwZV1bZXZlbnRdO1xuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIHN1YmplY3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW1vdmVFdmVudExpc3RlbmVyIChzdWJqZWN0LCBldmVudCwgaGFuZGxlciwgY2FwdHVyZSkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyVHlwZXMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXJUeXBlKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBldmVudE5hbWVzW2xpc3RlbmVyVHlwZV1bZXZlbnRdO1xuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICAgIHN1YmplY3QucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIsIGNhcHR1cmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25uZWN0RHJhZ1NvdXJjZSAoc291cmNlSWQsIG5vZGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zb3VyY2VOb2Rlc1tzb3VyY2VJZF0gPSBub2RlO1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZU1vdmVTdGFydCA9IHRoaXMuaGFuZGxlTW92ZVN0YXJ0LmJpbmQodGhpcywgc291cmNlSWQpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIobm9kZSwgJ3N0YXJ0JywgaGFuZGxlTW92ZVN0YXJ0KTtcblxuICAgICAgICBjb25zdCBoYW5kbGVDbGlja0RyYWdTb3VyY2UgPSB0aGlzLmhhbmRsZUNsaWNrRHJhZ1NvdXJjZS5iaW5kKHRoaXMsIHNvdXJjZUlkKTtcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZUNsaWNrRHJhZ1NvdXJjZSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNvdXJjZU5vZGVzW3NvdXJjZUlkXTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihub2RlLCAnc3RhcnQnLCBoYW5kbGVNb3ZlU3RhcnQpO1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZUNsaWNrRHJhZ1NvdXJjZSwgdHJ1ZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29ubmVjdERyYWdQcmV2aWV3IChzb3VyY2VJZCwgbm9kZSwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLnNvdXJjZVByZXZpZXdOb2RlT3B0aW9uc1tzb3VyY2VJZF0gPSBvcHRpb25zO1xuICAgICAgICB0aGlzLnNvdXJjZVByZXZpZXdOb2Rlc1tzb3VyY2VJZF0gPSBub2RlO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zb3VyY2VQcmV2aWV3Tm9kZXNbc291cmNlSWRdO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc291cmNlUHJldmlld05vZGVPcHRpb25zW3NvdXJjZUlkXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25uZWN0RHJvcFRhcmdldCAodGFyZ2V0SWQsIG5vZGUpIHtcbiAgICAgICAgY29uc3QgaGFuZGxlTW92ZSA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb29yZHMgPSBnZXRFdmVudENsaWVudE9mZnNldChlKTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBVc2UgdGhlIGNvb3JkaW5hdGVzIHRvIGdyYWIgdGhlIGVsZW1lbnQgdGhlIGRyYWcgZW5kZWQgb24uXG4gICAgICAgICAgICAgKiBJZiB0aGUgZWxlbWVudCBpcyB0aGUgc2FtZSBhcyB0aGUgdGFyZ2V0IG5vZGUgKG9yIGFueSBvZiBpdCdzIGNoaWxkcmVuKSB0aGVuIHdlIGhhdmUgaGl0IGEgZHJvcCB0YXJnZXQgYW5kIGNhbiBoYW5kbGUgdGhlIG1vdmUuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGNvbnN0IGRyb3BwZWRPbiA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoY29vcmRzLngsIGNvb3Jkcy55KTtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkTWF0Y2ggPSBub2RlLmNvbnRhaW5zKGRyb3BwZWRPbik7XG5cbiAgICAgICAgICAgIGlmIChkcm9wcGVkT24gPT09IG5vZGUgfHwgY2hpbGRNYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZU1vdmUoZSwgdGFyZ2V0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdHRhY2hpbmcgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBib2R5IHNvIHRoYXQgdG91Y2htb3ZlIHdpbGwgd29yayB3aGlsZSBkcmFnZ2luZyBvdmVyIG11bHRpcGxlIHRhcmdldCBlbGVtZW50cy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksICdtb3ZlJywgaGFuZGxlTW92ZSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksICdtb3ZlJywgaGFuZGxlTW92ZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaGFuZGxlU2hvd0NvbnRleHRNZW51IChlKSB7XG4gICAgICAgIGlmICh0aGlzLl9zdXBwcmVzc0NvbnRleHRNZW51KSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbERyYWcoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrRHJhZ1NvdXJjZSAoc291cmNlSWQsIGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX2xhc3REcm9wRXZlbnRUaW1lU3RhbXAgJiYgdGhpcy5fbGFzdERyb3BFdmVudFRpbWVTdGFtcCA9PT0gZS50aW1lU3RhbXApIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRTb3VyY2VDbGllbnRPZmZzZXQgKHNvdXJjZUlkKSB7XG4gICAgICAgIHJldHVybiBnZXROb2RlQ2xpZW50T2Zmc2V0KHRoaXMuc291cmNlTm9kZXNbc291cmNlSWRdKTtcbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlU3RhcnRDYXB0dXJlIChlKSB7XG4gICAgICAgIHRoaXMubW92ZVN0YXJ0U291cmNlSWRzID0gW107XG4gICAgfVxuXG4gICAgaGFuZGxlTW92ZVN0YXJ0IChzb3VyY2VJZCkge1xuICAgICAgICB0aGlzLm1vdmVTdGFydFNvdXJjZUlkcy51bnNoaWZ0KHNvdXJjZUlkKTtcbiAgICB9XG5cbiAgICBnZXRUb3BNb3ZlU3RhcnRIYW5kbGVyICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlbGF5VG91Y2hTdGFydCAmJiAhdGhpcy5kZWxheU1vdXNlU3RhcnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydERlbGF5O1xuICAgIH1cblxuICAgIGhhbmRsZVRvcE1vdmVTdGFydCAoZSkge1xuICAgICAgICAvLyBBbGxvdyBvdGhlciBzeXN0ZW1zIHRvIHByZXZlbnQgZHJhZ2dpbmdcbiAgICAgICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRG9uJ3QgcHJlbWF0dXJlbHkgcHJldmVudERlZmF1bHQoKSBoZXJlIHNpbmNlIGl0IG1pZ2h0OlxuICAgICAgICAvLyAxLiBNZXNzIHVwIHNjcm9sbGluZ1xuICAgICAgICAvLyAyLiBNZXNzIHVwIGxvbmcgdGFwICh3aGljaCBicmluZ3MgdXAgY29udGV4dCBtZW51KVxuICAgICAgICAvLyAzLiBJZiB0aGVyZSdzIGFuIGFuY2hvciBsaW5rIGFzIGEgY2hpbGQsIHRhcCB3b24ndCBiZSB0cmlnZ2VyZWQgb24gbGlua1xuXG4gICAgICAgIGNvbnN0IGNsaWVudE9mZnNldCA9IGdldEV2ZW50Q2xpZW50T2Zmc2V0KGUpO1xuICAgICAgICBpZiAoY2xpZW50T2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldCA9IGNsaWVudE9mZnNldDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVRvcE1vdmVTdGFydERlbGF5IChlKSB7XG4gICAgICAgIGNvbnN0IGRlbGF5ID0gKGUudHlwZSA9PT0gZXZlbnROYW1lcy50b3VjaC5zdGFydClcbiAgICAgICAgICAgID8gdGhpcy5kZWxheVRvdWNoU3RhcnRcbiAgICAgICAgICAgIDogdGhpcy5kZWxheU1vdXNlU3RhcnQ7XG5cbiAgICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgICAgICB0aGlzLl9zdXBwcmVzc0NvbnRleHRNZW51ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGltZW91dCA9IHNldFRpbWVvdXQodGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnQuYmluZCh0aGlzLCBlKSwgZGVsYXkpO1xuICAgIH1cblxuICAgIGhhbmRsZVRvcE1vdmVDYXB0dXJlIChlKSB7XG4gICAgICAgIHRoaXMuZHJhZ092ZXJUYXJnZXRJZHMgPSBbXTtcbiAgICB9XG5cbiAgICBoYW5kbGVNb3ZlKCBlLCB0YXJnZXRJZCApIHtcbiAgICAgICAgdGhpcy5kcmFnT3ZlclRhcmdldElkcy51bnNoaWZ0KCB0YXJnZXRJZCApO1xuICAgIH1cblxuICAgIGhhbmRsZVRvcE1vdmUgKGUpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cbiAgICAgICAgY29uc3QgeyBtb3ZlU3RhcnRTb3VyY2VJZHMsIGRyYWdPdmVyVGFyZ2V0SWRzIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBjbGllbnRPZmZzZXQgPSBnZXRFdmVudENsaWVudE9mZnNldChlKTtcblxuICAgICAgICBpZiAoIWNsaWVudE9mZnNldCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWxsb3cgZHJhZyB0byBiZSBwcmUtZW1wdGVkXG4gICAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQgJiYgIXRoaXMubW9uaXRvci5pc0RyYWdnaW5nKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRHJhZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHJhZ1N0YXJ0TWluT2Zmc2V0Q2hhbmdlID0gKGUudHlwZSA9PT0gZXZlbnROYW1lcy50b3VjaC5tb3ZlKVxuICAgICAgICAgICAgPyB0aGlzLm1pbk1vdmVUb3VjaFN0YXJ0XG4gICAgICAgICAgICA6IHRoaXMubWluTW92ZU1vdXNlU3RhcnQ7XG5cbiAgICAgICAgLy8gSWYgd2UncmUgbm90IGRyYWdnaW5nIGFuZCB3ZSd2ZSBtb3ZlZCBhIGxpdHRsZSwgdGhhdCBjb3VudHMgYXMgYSBkcmFnIHN0YXJ0XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLm1vbml0b3IuaXNEcmFnZ2luZygpICYmXG4gICAgICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldC5oYXNPd25Qcm9wZXJ0eSgneCcpICYmXG4gICAgICAgICAgICBtb3ZlU3RhcnRTb3VyY2VJZHMgJiZcbiAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICBNYXRoLmFicyh0aGlzLl9tb3VzZUNsaWVudE9mZnNldC54IC0gY2xpZW50T2Zmc2V0LngpID49IGRyYWdTdGFydE1pbk9mZnNldENoYW5nZSB8fFxuICAgICAgICAgICAgICAgIE1hdGguYWJzKHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0LnkgLSBjbGllbnRPZmZzZXQueSkgPj0gZHJhZ1N0YXJ0TWluT2Zmc2V0Q2hhbmdlXG4gICAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlU3RhcnRTb3VyY2VJZHMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLmJlZ2luRHJhZyhtb3ZlU3RhcnRTb3VyY2VJZHMsIHtcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQ6IHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0LFxuICAgICAgICAgICAgICAgIGdldFNvdXJjZUNsaWVudE9mZnNldDogdGhpcy5nZXRTb3VyY2VDbGllbnRPZmZzZXQsXG4gICAgICAgICAgICAgICAgcHVibGlzaFNvdXJjZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLm1vbml0b3IuaXNEcmFnZ2luZygpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzb3VyY2VOb2RlID0gdGhpcy5zb3VyY2VOb2Rlc1t0aGlzLm1vbml0b3IuZ2V0U291cmNlSWQoKV07XG4gICAgICAgIHRoaXMuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoc291cmNlTm9kZSk7XG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdWJsaXNoRHJhZ1NvdXJjZSgpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAvKlxuICAgICAgICBjb25zdCBtYXRjaGluZ1RhcmdldElkcyA9IE9iamVjdC5rZXlzKHRoaXMudGFyZ2V0Tm9kZXMpXG4gICAgICAgICAgICAuZmlsdGVyKCh0YXJnZXRJZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMudGFyZ2V0Tm9kZXNbdGFyZ2V0SWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGllbnRPZmZzZXQueCA+PSBib3VuZGluZ1JlY3QubGVmdCAmJlxuICAgICAgICAgICAgICAgIGNsaWVudE9mZnNldC54IDw9IGJvdW5kaW5nUmVjdC5yaWdodCAmJlxuICAgICAgICAgICAgICAgIGNsaWVudE9mZnNldC55ID49IGJvdW5kaW5nUmVjdC50b3AgJiZcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQueSA8PSBib3VuZGluZ1JlY3QuYm90dG9tO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICovXG5cbiAgICAgICAgdGhpcy5hY3Rpb25zLmhvdmVyKGRyYWdPdmVyVGFyZ2V0SWRzLCB7XG4gICAgICAgICAgICBjbGllbnRPZmZzZXQ6IGNsaWVudE9mZnNldFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlRW5kQ2FwdHVyZSAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbmREcmFnKGV2ZW50KTtcbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlQ2FuY2VsQ2FwdHVyZSAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxEcmFnKGV2ZW50KTtcbiAgICB9XG5cbiAgICBjYW5jZWxEcmFnIChldmVudCkge1xuICAgICAgICB0aGlzLmVuZERyYWcoZXZlbnQsIHsgY2FuY2VsbGVkOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIGVuZERyYWcgKGV2ZW50LCB7IGNhbmNlbGxlZCB9ID0ge30pIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cbiAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQgPSB7fTtcbiAgICAgICAgdGhpcy5fc3VwcHJlc3NDb250ZXh0TWVudSA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghdGhpcy5tb25pdG9yLmlzRHJhZ2dpbmcoKSB8fCB0aGlzLm1vbml0b3IuZGlkRHJvcCgpKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVTdGFydFNvdXJjZUlkcyA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoKTtcblxuICAgICAgICBpZiAoIWNhbmNlbGxlZCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdERyb3BFdmVudFRpbWVTdGFtcCA9IGV2ZW50LnRpbWVTdGFtcDtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMuZHJvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3Rpb25zLmVuZERyYWcoKTtcbiAgICB9XG5cbiAgICBpbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciAobm9kZSkge1xuICAgICAgICB0aGlzLnVuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoKTtcblxuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciA9IG5ldyB3aW5kb3cuTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIW5vZGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdXJyZWN0U291cmNlTm9kZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudW5pbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIW5vZGUgfHwgIW5vZGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlci5vYnNlcnZlKFxuICAgICAgICAgICAgbm9kZS5wYXJlbnRFbGVtZW50LFxuICAgICAgICAgICAgeyBjaGlsZExpc3Q6IHRydWUgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlc3VycmVjdFNvdXJjZU5vZGUgKCkge1xuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGUucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXJlYWN0aWQnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRyYWdnZWRTb3VyY2VOb2RlKTtcbiAgICB9XG5cbiAgICB1bmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGUgPSBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVG91Y2hCYWNrZW5kIChvcHRpb25zT3JNYW5hZ2VyID0ge30pIHtcbiAgICBjb25zdCB0b3VjaEJhY2tlbmRGYWN0b3J5ID0gZnVuY3Rpb24gKG1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUb3VjaEJhY2tlbmQobWFuYWdlciwgb3B0aW9uc09yTWFuYWdlcik7XG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zT3JNYW5hZ2VyLmdldE1vbml0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRvdWNoQmFja2VuZEZhY3Rvcnkob3B0aW9uc09yTWFuYWdlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRvdWNoQmFja2VuZEZhY3Rvcnk7XG4gICAgfVxufVxuIl19
