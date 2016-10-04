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
        end: 'touchend'
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
            delayMouseStart: 0
        }, options);

        this.actions = manager.getActions();
        this.monitor = manager.getMonitor();
        this.registry = manager.getRegistry();

        this.delayTouchStart = options.delayTouchStart;
        this.delayMouseStart = options.delayMouseStart;
        this.sourceNodes = {};
        this.sourceNodeOptions = {};
        this.sourcePreviewNodes = {};
        this.sourcePreviewNodeOptions = {};
        this.targetNodeOptions = {};
        this.listenerTypes = [];
        this._mouseClientOffset = {};

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

            this.uninstallSourceNodeRemovalObserver();
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(subject, event, handler, capture) {
            this.listenerTypes.forEach(function (listenerType) {
                subject.addEventListener(eventNames[listenerType][event], handler, capture);
            });
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(subject, event, handler, capture) {
            this.listenerTypes.forEach(function (listenerType) {
                subject.removeEventListener(eventNames[listenerType][event], handler, capture);
            });
        }
    }, {
        key: 'connectDragSource',
        value: function connectDragSource(sourceId, node, options) {
            var _this = this;

            var handleMoveStart = this.handleMoveStart.bind(this, sourceId);
            this.sourceNodes[sourceId] = node;

            this.addEventListener(node, 'start', handleMoveStart);

            return function () {
                delete _this.sourceNodes[sourceId];
                _this.removeEventListener(node, 'start', handleMoveStart);
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
                var coords = void 0;

                /**
                 * Grab the coordinates for the current mouse/touch position
                 */
                switch (e.type) {
                    case eventNames.mouse.move:
                        coords = { x: e.clientX, y: e.clientY };
                        break;

                    case eventNames.touch.move:
                        coords = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                        break;
                }

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

            // If we're not dragging and we've moved a little, that counts as a drag start
            if (!this.monitor.isDragging() && this._mouseClientOffset.hasOwnProperty('x') && moveStartSourceIds && (this._mouseClientOffset.x !== clientOffset.x || this._mouseClientOffset.y !== clientOffset.y)) {
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
        value: function handleTopMoveEndCapture(e) {
            clearTimeout(this.timeout);

            if (!this.monitor.isDragging() || this.monitor.didDrop()) {
                this.moveStartSourceIds = null;
                return;
            }

            e.preventDefault();

            this._mouseClientOffset = {};

            this.uninstallSourceNodeRemovalObserver();
            this.actions.drop();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW52YXJpYW50L2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL1RvdWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFiLEVBRko7QUFJSDs7OzhDQUVzQjtBQUNuQixpQkFBSyxpQkFBTCxDQUF1QixLQUF2QixDQUE2QixPQUE3QixHQUF1QyxNQUF2QztBQUNBLGlCQUFLLGlCQUFMLENBQXVCLGVBQXZCLENBQXVDLGNBQXZDO0FBQ0EscUJBQVMsSUFBVCxDQUFjLFdBQWQsQ0FBMEIsS0FBSyxpQkFBL0I7QUFDSDs7OzZEQUVxQztBQUNsQyxnQkFBSSxLQUFLLGdDQUFULEVBQTJDO0FBQ3ZDLHFCQUFLLGdDQUFMLENBQXNDLFVBQXRDO0FBQ0g7O0FBRUQsaUJBQUssZ0NBQUwsR0FBd0MsSUFBeEM7QUFDQSxpQkFBSyxpQkFBTCxHQUF5QixJQUF6QjtBQUNIOzs7Ozs7QUFHVSxTQUFTLGtCQUFULEdBQW9EO0FBQUEsUUFBdkIsZ0JBQXVCLHlEQUFKLEVBQUk7O0FBQy9ELFFBQU0sc0JBQXNCLFNBQXRCLG1CQUFzQixDQUFVLE9BQVYsRUFBbUI7QUFDM0MsZUFBTyxJQUFJLFlBQUosQ0FBaUIsT0FBakIsRUFBMEIsZ0JBQTFCLENBQVA7QUFDSCxLQUZEOztBQUlBLFFBQUksaUJBQWlCLFVBQXJCLEVBQWlDO0FBQzdCLGVBQU8sb0JBQW9CLGdCQUFwQixDQUFQO0FBQ0gsS0FGRCxNQUVPO0FBQ0gsZUFBTyxtQkFBUDtBQUNIO0FBQ0oiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgWWFob28gSW5jLlxuICogQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuXG5mdW5jdGlvbiBnZXRFdmVudENsaWVudFRvdWNoT2Zmc2V0IChlKSB7XG4gICAgaWYgKGUudGFyZ2V0VG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGdldEV2ZW50Q2xpZW50T2Zmc2V0KGUudGFyZ2V0VG91Y2hlc1swXSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRFdmVudENsaWVudE9mZnNldCAoZSkge1xuICAgIGlmIChlLnRhcmdldFRvdWNoZXMpIHtcbiAgICAgICAgcmV0dXJuIGdldEV2ZW50Q2xpZW50VG91Y2hPZmZzZXQoZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IGUuY2xpZW50WCxcbiAgICAgICAgICAgIHk6IGUuY2xpZW50WVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY29uc3QgRUxFTUVOVF9OT0RFID0gMTtcbmZ1bmN0aW9uIGdldE5vZGVDbGllbnRPZmZzZXQgKG5vZGUpIHtcbiAgICBjb25zdCBlbCA9IG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERVxuICAgICAgICA/IG5vZGVcbiAgICAgICAgOiBub2RlLnBhcmVudEVsZW1lbnQ7XG5cbiAgICBpZiAoIWVsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4geyB4OiBsZWZ0LCB5OiB0b3AgfTtcbn1cblxuY29uc3QgZXZlbnROYW1lcyA9IHtcbiAgICBtb3VzZToge1xuICAgICAgICBzdGFydDogJ21vdXNlZG93bicsXG4gICAgICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxuICAgICAgICBlbmQ6ICdtb3VzZXVwJ1xuICAgIH0sXG4gICAgdG91Y2g6IHtcbiAgICAgICAgc3RhcnQ6ICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgbW92ZTogJ3RvdWNobW92ZScsXG4gICAgICAgIGVuZDogJ3RvdWNoZW5kJ1xuICAgIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBUb3VjaEJhY2tlbmQge1xuICAgIGNvbnN0cnVjdG9yIChtYW5hZ2VyLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgb3B0aW9ucy5kZWxheVRvdWNoU3RhcnQgPSBvcHRpb25zLmRlbGF5VG91Y2hTdGFydCB8fCBvcHRpb25zLmRlbGF5O1xuXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBlbmFibGVUb3VjaEV2ZW50czogdHJ1ZSxcbiAgICAgICAgICAgIGVuYWJsZU1vdXNlRXZlbnRzOiBmYWxzZSxcbiAgICAgICAgICAgIGRlbGF5VG91Y2hTdGFydDogMCxcbiAgICAgICAgICAgIGRlbGF5TW91c2VTdGFydDogMCxcbiAgICAgICAgICAgIC4uLm9wdGlvbnNcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBtYW5hZ2VyLmdldEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5tb25pdG9yID0gbWFuYWdlci5nZXRNb25pdG9yKCk7XG4gICAgICAgIHRoaXMucmVnaXN0cnkgPSBtYW5hZ2VyLmdldFJlZ2lzdHJ5KCk7XG5cbiAgICAgICAgdGhpcy5kZWxheVRvdWNoU3RhcnQgPSBvcHRpb25zLmRlbGF5VG91Y2hTdGFydDtcbiAgICAgICAgdGhpcy5kZWxheU1vdXNlU3RhcnQgPSBvcHRpb25zLmRlbGF5TW91c2VTdGFydDtcbiAgICAgICAgdGhpcy5zb3VyY2VOb2RlcyA9IHt9O1xuICAgICAgICB0aGlzLnNvdXJjZU5vZGVPcHRpb25zID0ge307XG4gICAgICAgIHRoaXMuc291cmNlUHJldmlld05vZGVzID0ge307XG4gICAgICAgIHRoaXMuc291cmNlUHJldmlld05vZGVPcHRpb25zID0ge307XG4gICAgICAgIHRoaXMudGFyZ2V0Tm9kZU9wdGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5saXN0ZW5lclR5cGVzID0gW107XG4gICAgICAgIHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0ID0ge307XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlTW91c2VFdmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJUeXBlcy5wdXNoKCdtb3VzZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlVG91Y2hFdmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJUeXBlcy5wdXNoKCd0b3VjaCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nZXRTb3VyY2VDbGllbnRPZmZzZXQgPSB0aGlzLmdldFNvdXJjZUNsaWVudE9mZnNldC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydCA9IHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0RGVsYXkgPSB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydERlbGF5LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0Q2FwdHVyZSA9IHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0Q2FwdHVyZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVDYXB0dXJlID0gdGhpcy5oYW5kbGVUb3BNb3ZlQ2FwdHVyZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmUgPSB0aGlzLmhhbmRsZVRvcE1vdmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlRW5kQ2FwdHVyZSA9IHRoaXMuaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBzZXR1cCAoKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52YXJpYW50KCF0aGlzLmNvbnN0cnVjdG9yLmlzU2V0VXAsICdDYW5ub3QgaGF2ZSB0d28gVG91Y2ggYmFja2VuZHMgYXQgdGhlIHNhbWUgdGltZS4nKTtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5pc1NldFVwID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAnc3RhcnQnLCB0aGlzLmdldFRvcE1vdmVTdGFydEhhbmRsZXIoKSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdzdGFydCcsIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0Q2FwdHVyZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdtb3ZlJywgIHRoaXMuaGFuZGxlVG9wTW92ZSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdtb3ZlJywgIHRoaXMuaGFuZGxlVG9wTW92ZUNhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAnZW5kJywgICB0aGlzLmhhbmRsZVRvcE1vdmVFbmRDYXB0dXJlLCB0cnVlKTtcbiAgICB9XG5cbiAgICB0ZWFyZG93biAoKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5pc1NldFVwID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0ID0ge307XG5cbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ3N0YXJ0JywgdGhpcy5nZXRUb3BNb3ZlU3RhcnRIYW5kbGVyKCkpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnc3RhcnQnLCB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydENhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnbW92ZScsICB0aGlzLmhhbmRsZVRvcE1vdmVDYXB0dXJlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ21vdmUnLCAgdGhpcy5oYW5kbGVUb3BNb3ZlKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ2VuZCcsICAgdGhpcy5oYW5kbGVUb3BNb3ZlRW5kQ2FwdHVyZSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy51bmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKCk7XG4gICAgfVxuXG4gICAgYWRkRXZlbnRMaXN0ZW5lciAoc3ViamVjdCwgZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lclR5cGVzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyVHlwZSkge1xuICAgICAgICAgICAgc3ViamVjdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZXNbbGlzdGVuZXJUeXBlXVtldmVudF0sIGhhbmRsZXIsIGNhcHR1cmUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW1vdmVFdmVudExpc3RlbmVyIChzdWJqZWN0LCBldmVudCwgaGFuZGxlciwgY2FwdHVyZSkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyVHlwZXMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXJUeXBlKSB7XG4gICAgICAgICAgICBzdWJqZWN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lc1tsaXN0ZW5lclR5cGVdW2V2ZW50XSwgaGFuZGxlciwgY2FwdHVyZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbm5lY3REcmFnU291cmNlIChzb3VyY2VJZCwgbm9kZSwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCBoYW5kbGVNb3ZlU3RhcnQgPSB0aGlzLmhhbmRsZU1vdmVTdGFydC5iaW5kKHRoaXMsIHNvdXJjZUlkKTtcbiAgICAgICAgdGhpcy5zb3VyY2VOb2Rlc1tzb3VyY2VJZF0gPSBub2RlO1xuXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihub2RlLCAnc3RhcnQnLCBoYW5kbGVNb3ZlU3RhcnQpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zb3VyY2VOb2Rlc1tzb3VyY2VJZF07XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIobm9kZSwgJ3N0YXJ0JywgaGFuZGxlTW92ZVN0YXJ0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25uZWN0RHJhZ1ByZXZpZXcgKHNvdXJjZUlkLCBub2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc291cmNlUHJldmlld05vZGVPcHRpb25zW3NvdXJjZUlkXSA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuc291cmNlUHJldmlld05vZGVzW3NvdXJjZUlkXSA9IG5vZGU7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNvdXJjZVByZXZpZXdOb2Rlc1tzb3VyY2VJZF07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zb3VyY2VQcmV2aWV3Tm9kZU9wdGlvbnNbc291cmNlSWRdO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbm5lY3REcm9wVGFyZ2V0ICh0YXJnZXRJZCwgbm9kZSkge1xuICAgICAgICBjb25zdCBoYW5kbGVNb3ZlID0gKGUpID0+IHtcbiAgICAgICAgICAgIGxldCBjb29yZHM7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogR3JhYiB0aGUgY29vcmRpbmF0ZXMgZm9yIHRoZSBjdXJyZW50IG1vdXNlL3RvdWNoIHBvc2l0aW9uXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIGV2ZW50TmFtZXMubW91c2UubW92ZTpcbiAgICAgICAgICAgICAgICBjb29yZHMgPSB7IHg6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgZXZlbnROYW1lcy50b3VjaC5tb3ZlOlxuICAgICAgICAgICAgICAgIGNvb3JkcyA9IHsgeDogZS50b3VjaGVzWzBdLmNsaWVudFgsIHk6IGUudG91Y2hlc1swXS5jbGllbnRZIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVXNlIHRoZSBjb29yZGluYXRlcyB0byBncmFiIHRoZSBlbGVtZW50IHRoZSBkcmFnIGVuZGVkIG9uLlxuICAgICAgICAgICAgICogSWYgdGhlIGVsZW1lbnQgaXMgdGhlIHNhbWUgYXMgdGhlIHRhcmdldCBub2RlIChvciBhbnkgb2YgaXQncyBjaGlsZHJlbikgdGhlbiB3ZSBoYXZlIGhpdCBhIGRyb3AgdGFyZ2V0IGFuZCBjYW4gaGFuZGxlIHRoZSBtb3ZlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBsZXQgZHJvcHBlZE9uID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjb29yZHMueCwgY29vcmRzLnkpO1xuICAgICAgICAgICAgbGV0IGNoaWxkTWF0Y2ggPSBub2RlLmNvbnRhaW5zKGRyb3BwZWRPbik7XG5cbiAgICAgICAgICAgIGlmIChkcm9wcGVkT24gPT09IG5vZGUgfHwgY2hpbGRNYXRjaCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZU1vdmUoZSwgdGFyZ2V0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBdHRhY2hpbmcgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBib2R5IHNvIHRoYXQgdG91Y2htb3ZlIHdpbGwgd29yayB3aGlsZSBkcmFnZ2luZyBvdmVyIG11bHRpcGxlIHRhcmdldCBlbGVtZW50cy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksICdtb3ZlJywgaGFuZGxlTW92ZSk7XG5cblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSwgJ21vdmUnLCBoYW5kbGVNb3ZlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRTb3VyY2VDbGllbnRPZmZzZXQgKHNvdXJjZUlkKSB7XG4gICAgICAgIHJldHVybiBnZXROb2RlQ2xpZW50T2Zmc2V0KHRoaXMuc291cmNlTm9kZXNbc291cmNlSWRdKTtcbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlU3RhcnRDYXB0dXJlIChlKSB7XG4gICAgICAgIHRoaXMubW92ZVN0YXJ0U291cmNlSWRzID0gW107XG4gICAgfVxuXG4gICAgaGFuZGxlTW92ZVN0YXJ0IChzb3VyY2VJZCkge1xuICAgICAgICB0aGlzLm1vdmVTdGFydFNvdXJjZUlkcy51bnNoaWZ0KHNvdXJjZUlkKTtcbiAgICB9XG5cbiAgICBnZXRUb3BNb3ZlU3RhcnRIYW5kbGVyICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRlbGF5VG91Y2hTdGFydCAmJiAhdGhpcy5kZWxheU1vdXNlU3RhcnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydERlbGF5O1xuICAgIH1cblxuICAgIGhhbmRsZVRvcE1vdmVTdGFydCAoZSkge1xuICAgICAgICAvLyBEb24ndCBwcmVtYXR1cmVseSBwcmV2ZW50RGVmYXVsdCgpIGhlcmUgc2luY2UgaXQgbWlnaHQ6XG4gICAgICAgIC8vIDEuIE1lc3MgdXAgc2Nyb2xsaW5nXG4gICAgICAgIC8vIDIuIE1lc3MgdXAgbG9uZyB0YXAgKHdoaWNoIGJyaW5ncyB1cCBjb250ZXh0IG1lbnUpXG4gICAgICAgIC8vIDMuIElmIHRoZXJlJ3MgYW4gYW5jaG9yIGxpbmsgYXMgYSBjaGlsZCwgdGFwIHdvbid0IGJlIHRyaWdnZXJlZCBvbiBsaW5rXG5cbiAgICAgICAgY29uc3QgY2xpZW50T2Zmc2V0ID0gZ2V0RXZlbnRDbGllbnRPZmZzZXQoZSk7XG4gICAgICAgIGlmIChjbGllbnRPZmZzZXQpIHtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0ID0gY2xpZW50T2Zmc2V0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZVN0YXJ0RGVsYXkgKGUpIHtcbiAgICAgICAgY29uc3QgZGVsYXkgPSAoZS50eXBlID09PSBldmVudE5hbWVzLnRvdWNoLnN0YXJ0KVxuICAgICAgICAgICAgPyB0aGlzLmRlbGF5VG91Y2hTdGFydFxuICAgICAgICAgICAgOiB0aGlzLmRlbGF5TW91c2VTdGFydDtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmhhbmRsZVRvcE1vdmVTdGFydC5iaW5kKHRoaXMsIGUpLCBkZWxheSk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZUNhcHR1cmUgKGUpIHtcbiAgICAgICAgdGhpcy5kcmFnT3ZlclRhcmdldElkcyA9IFtdO1xuICAgIH1cblxuICAgIGhhbmRsZU1vdmUoIGUsIHRhcmdldElkICkge1xuICAgICAgICB0aGlzLmRyYWdPdmVyVGFyZ2V0SWRzLnVuc2hpZnQoIHRhcmdldElkICk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZSAoZSkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblxuICAgICAgICBjb25zdCB7IG1vdmVTdGFydFNvdXJjZUlkcywgZHJhZ092ZXJUYXJnZXRJZHMgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGNsaWVudE9mZnNldCA9IGdldEV2ZW50Q2xpZW50T2Zmc2V0KGUpO1xuXG4gICAgICAgIGlmICghY2xpZW50T2Zmc2V0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vIElmIHdlJ3JlIG5vdCBkcmFnZ2luZyBhbmQgd2UndmUgbW92ZWQgYSBsaXR0bGUsIHRoYXQgY291bnRzIGFzIGEgZHJhZyBzdGFydFxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy5tb25pdG9yLmlzRHJhZ2dpbmcoKSAmJlxuICAgICAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQuaGFzT3duUHJvcGVydHkoJ3gnKSAmJlxuICAgICAgICAgICAgbW92ZVN0YXJ0U291cmNlSWRzICYmXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQueCAhPT0gY2xpZW50T2Zmc2V0LnggfHxcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldC55ICE9PSBjbGllbnRPZmZzZXQueVxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVN0YXJ0U291cmNlSWRzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5iZWdpbkRyYWcobW92ZVN0YXJ0U291cmNlSWRzLCB7XG4gICAgICAgICAgICAgICAgY2xpZW50T2Zmc2V0OiB0aGlzLl9tb3VzZUNsaWVudE9mZnNldCxcbiAgICAgICAgICAgICAgICBnZXRTb3VyY2VDbGllbnRPZmZzZXQ6IHRoaXMuZ2V0U291cmNlQ2xpZW50T2Zmc2V0LFxuICAgICAgICAgICAgICAgIHB1Ymxpc2hTb3VyY2U6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5tb25pdG9yLmlzRHJhZ2dpbmcoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc291cmNlTm9kZSA9IHRoaXMuc291cmNlTm9kZXNbdGhpcy5tb25pdG9yLmdldFNvdXJjZUlkKCldO1xuICAgICAgICB0aGlzLmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKHNvdXJjZU5vZGUpO1xuICAgICAgICB0aGlzLmFjdGlvbnMucHVibGlzaERyYWdTb3VyY2UoKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdUYXJnZXRJZHMgPSBPYmplY3Qua2V5cyh0aGlzLnRhcmdldE5vZGVzKVxuICAgICAgICAgICAgLmZpbHRlcigodGFyZ2V0SWQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLnRhcmdldE5vZGVzW3RhcmdldElkXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xpZW50T2Zmc2V0LnggPj0gYm91bmRpbmdSZWN0LmxlZnQgJiZcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQueCA8PSBib3VuZGluZ1JlY3QucmlnaHQgJiZcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQueSA+PSBib3VuZGluZ1JlY3QudG9wICYmXG4gICAgICAgICAgICAgICAgY2xpZW50T2Zmc2V0LnkgPD0gYm91bmRpbmdSZWN0LmJvdHRvbTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAqL1xuXG4gICAgICAgIHRoaXMuYWN0aW9ucy5ob3ZlcihkcmFnT3ZlclRhcmdldElkcywge1xuICAgICAgICAgICAgY2xpZW50T2Zmc2V0OiBjbGllbnRPZmZzZXRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUgKGUpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLm1vbml0b3IuaXNEcmFnZ2luZygpIHx8IHRoaXMubW9uaXRvci5kaWREcm9wKCkpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVN0YXJ0U291cmNlSWRzID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldCA9IHt9O1xuXG4gICAgICAgIHRoaXMudW5pbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlcigpO1xuICAgICAgICB0aGlzLmFjdGlvbnMuZHJvcCgpO1xuICAgICAgICB0aGlzLmFjdGlvbnMuZW5kRHJhZygpO1xuICAgIH1cblxuICAgIGluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyIChub2RlKSB7XG4gICAgICAgIHRoaXMudW5pbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlcigpO1xuXG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGUgPSBub2RlO1xuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyID0gbmV3IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghbm9kZS5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN1cnJlY3RTb3VyY2VOb2RlKCk7XG4gICAgICAgICAgICAgICAgdGhpcy51bmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghbm9kZSB8fCAhbm9kZS5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyLm9ic2VydmUoXG4gICAgICAgICAgICBub2RlLnBhcmVudEVsZW1lbnQsXG4gICAgICAgICAgICB7IGNoaWxkTGlzdDogdHJ1ZSB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcmVzdXJyZWN0U291cmNlTm9kZSAoKSB7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZS5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtcmVhY3RpZCcpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGUpO1xuICAgIH1cblxuICAgIHVuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIgKCkge1xuICAgICAgICBpZiAodGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlcikge1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZSA9IG51bGw7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVUb3VjaEJhY2tlbmQgKG9wdGlvbnNPck1hbmFnZXIgPSB7fSkge1xuICAgIGNvbnN0IHRvdWNoQmFja2VuZEZhY3RvcnkgPSBmdW5jdGlvbiAobWFuYWdlcikge1xuICAgICAgICByZXR1cm4gbmV3IFRvdWNoQmFja2VuZChtYW5hZ2VyLCBvcHRpb25zT3JNYW5hZ2VyKTtcbiAgICB9O1xuXG4gICAgaWYgKG9wdGlvbnNPck1hbmFnZXIuZ2V0TW9uaXRvcikge1xuICAgICAgICByZXR1cm4gdG91Y2hCYWNrZW5kRmFjdG9yeShvcHRpb25zT3JNYW5hZ2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdG91Y2hCYWNrZW5kRmFjdG9yeTtcbiAgICB9XG59XG4iXX0=
