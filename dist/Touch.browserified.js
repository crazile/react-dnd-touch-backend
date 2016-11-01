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
            this.addEventListener(window, 'cancel', this.handleTopMoveEndCapture, true);
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
            this.removeEventListener(window, 'cancel', this.handleTopMoveEndCapture, true);

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

            var handleMoveStart = this.handleMoveStart.bind(this, sourceId);
            this.sourceNodes[sourceId] = node;

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
                /**
                 * Grab the coordinates for the current mouse/touch position
                 */
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
                this._mouseClientOffset = {};
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

            this._mouseClientOffset = {};

            if (!this.monitor.isDragging() || this.monitor.didDrop()) {
                this.moveStartSourceIds = null;
                return;
            }

            e.preventDefault();

            this._lastDropEventTimeStamp = e.timeStamp;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW52YXJpYW50L2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL1RvdWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QVUsT0FBVixFQUFtQjtBQUMzQyxlQUFPLElBQUksWUFBSixDQUFpQixPQUFqQixFQUEwQixnQkFBMUIsQ0FBUDtBQUNILEtBRkQ7O0FBSUEsUUFBSSxpQkFBaUIsVUFBckIsRUFBaUM7QUFDN0IsZUFBTyxvQkFBb0IsZ0JBQXBCLENBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxlQUFPLG1CQUFQO0FBQ0g7QUFDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE1LCBZYWhvbyBJbmMuXG4gKiBDb3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5cbmZ1bmN0aW9uIGdldEV2ZW50Q2xpZW50VG91Y2hPZmZzZXQgKGUpIHtcbiAgICBpZiAoZS50YXJnZXRUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gZ2V0RXZlbnRDbGllbnRPZmZzZXQoZS50YXJnZXRUb3VjaGVzWzBdKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldEV2ZW50Q2xpZW50T2Zmc2V0IChlKSB7XG4gICAgaWYgKGUudGFyZ2V0VG91Y2hlcykge1xuICAgICAgICByZXR1cm4gZ2V0RXZlbnRDbGllbnRUb3VjaE9mZnNldChlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogZS5jbGllbnRYLFxuICAgICAgICAgICAgeTogZS5jbGllbnRZXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jb25zdCBFTEVNRU5UX05PREUgPSAxO1xuZnVuY3Rpb24gZ2V0Tm9kZUNsaWVudE9mZnNldCAobm9kZSkge1xuICAgIGNvbnN0IGVsID0gbm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFXG4gICAgICAgID8gbm9kZVxuICAgICAgICA6IG5vZGUucGFyZW50RWxlbWVudDtcblxuICAgIGlmICghZWwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiB7IHg6IGxlZnQsIHk6IHRvcCB9O1xufVxuXG5jb25zdCBldmVudE5hbWVzID0ge1xuICAgIG1vdXNlOiB7XG4gICAgICAgIHN0YXJ0OiAnbW91c2Vkb3duJyxcbiAgICAgICAgbW92ZTogJ21vdXNlbW92ZScsXG4gICAgICAgIGVuZDogJ21vdXNldXAnXG4gICAgfSxcbiAgICB0b3VjaDoge1xuICAgICAgICBzdGFydDogJ3RvdWNoc3RhcnQnLFxuICAgICAgICBtb3ZlOiAndG91Y2htb3ZlJyxcbiAgICAgICAgZW5kOiAndG91Y2hlbmQnLFxuICAgICAgICBjYW5jZWw6ICd0b3VjaGNhbmNlbCdcbiAgICB9XG59O1xuXG5leHBvcnQgY2xhc3MgVG91Y2hCYWNrZW5kIHtcbiAgICBjb25zdHJ1Y3RvciAobWFuYWdlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIG9wdGlvbnMuZGVsYXlUb3VjaFN0YXJ0ID0gb3B0aW9ucy5kZWxheVRvdWNoU3RhcnQgfHwgb3B0aW9ucy5kZWxheTtcblxuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgZW5hYmxlVG91Y2hFdmVudHM6IHRydWUsXG4gICAgICAgICAgICBlbmFibGVNb3VzZUV2ZW50czogZmFsc2UsXG4gICAgICAgICAgICBkZWxheVRvdWNoU3RhcnQ6IDAsXG4gICAgICAgICAgICBkZWxheU1vdXNlU3RhcnQ6IDAsXG4gICAgICAgICAgICAuLi5vcHRpb25zXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5hY3Rpb25zID0gbWFuYWdlci5nZXRBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMubW9uaXRvciA9IG1hbmFnZXIuZ2V0TW9uaXRvcigpO1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5ID0gbWFuYWdlci5nZXRSZWdpc3RyeSgpO1xuXG4gICAgICAgIHRoaXMuZGVsYXlUb3VjaFN0YXJ0ID0gb3B0aW9ucy5kZWxheVRvdWNoU3RhcnQ7XG4gICAgICAgIHRoaXMuZGVsYXlNb3VzZVN0YXJ0ID0gb3B0aW9ucy5kZWxheU1vdXNlU3RhcnQ7XG4gICAgICAgIHRoaXMuc291cmNlTm9kZXMgPSB7fTtcbiAgICAgICAgdGhpcy5zb3VyY2VOb2RlT3B0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLnNvdXJjZVByZXZpZXdOb2RlcyA9IHt9O1xuICAgICAgICB0aGlzLnNvdXJjZVByZXZpZXdOb2RlT3B0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLnRhcmdldE5vZGVPcHRpb25zID0ge307XG4gICAgICAgIHRoaXMubGlzdGVuZXJUeXBlcyA9IFtdO1xuICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldCA9IHt9O1xuXG4gICAgICAgIGlmIChvcHRpb25zLmVuYWJsZU1vdXNlRXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyVHlwZXMucHVzaCgnbW91c2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmVuYWJsZVRvdWNoRXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyVHlwZXMucHVzaCgndG91Y2gnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2V0U291cmNlQ2xpZW50T2Zmc2V0ID0gdGhpcy5nZXRTb3VyY2VDbGllbnRPZmZzZXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnQgPSB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydERlbGF5ID0gdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnREZWxheS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydENhcHR1cmUgPSB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydENhcHR1cmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlQ2FwdHVyZSA9IHRoaXMuaGFuZGxlVG9wTW92ZUNhcHR1cmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlID0gdGhpcy5oYW5kbGVUb3BNb3ZlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUgPSB0aGlzLmhhbmRsZVRvcE1vdmVFbmRDYXB0dXJlLmJpbmQodGhpcyk7XG4gICAgfVxuXG4gICAgc2V0dXAgKCkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGludmFyaWFudCghdGhpcy5jb25zdHJ1Y3Rvci5pc1NldFVwLCAnQ2Fubm90IGhhdmUgdHdvIFRvdWNoIGJhY2tlbmRzIGF0IHRoZSBzYW1lIHRpbWUuJyk7XG4gICAgICAgIHRoaXMuY29uc3RydWN0b3IuaXNTZXRVcCA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ3N0YXJ0JywgIHRoaXMuZ2V0VG9wTW92ZVN0YXJ0SGFuZGxlcigpKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ3N0YXJ0JywgIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0Q2FwdHVyZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdtb3ZlJywgICB0aGlzLmhhbmRsZVRvcE1vdmUpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAnbW92ZScsICAgdGhpcy5oYW5kbGVUb3BNb3ZlQ2FwdHVyZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdlbmQnLCAgICB0aGlzLmhhbmRsZVRvcE1vdmVFbmRDYXB0dXJlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ2NhbmNlbCcsIHRoaXMuaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUsIHRydWUpO1xuICAgIH1cblxuICAgIHRlYXJkb3duICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLmlzU2V0VXAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQgPSB7fTtcblxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnc3RhcnQnLCAgdGhpcy5nZXRUb3BNb3ZlU3RhcnRIYW5kbGVyKCkpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnc3RhcnQnLCAgdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnRDYXB0dXJlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ21vdmUnLCAgIHRoaXMuaGFuZGxlVG9wTW92ZUNhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnbW92ZScsICAgdGhpcy5oYW5kbGVUb3BNb3ZlKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ2VuZCcsICAgIHRoaXMuaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnY2FuY2VsJywgdGhpcy5oYW5kbGVUb3BNb3ZlRW5kQ2FwdHVyZSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy51bmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKCk7XG4gICAgfVxuXG4gICAgYWRkRXZlbnRMaXN0ZW5lciAoc3ViamVjdCwgZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lclR5cGVzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyVHlwZSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gZXZlbnROYW1lc1tsaXN0ZW5lclR5cGVdW2V2ZW50XTtcbiAgICAgICAgICAgIGlmIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBzdWJqZWN0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lciAoc3ViamVjdCwgZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lclR5cGVzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyVHlwZSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gZXZlbnROYW1lc1tsaXN0ZW5lclR5cGVdW2V2ZW50XTtcbiAgICAgICAgICAgIGlmIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBzdWJqZWN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29ubmVjdERyYWdTb3VyY2UgKHNvdXJjZUlkLCBub2RlLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZU1vdmVTdGFydCA9IHRoaXMuaGFuZGxlTW92ZVN0YXJ0LmJpbmQodGhpcywgc291cmNlSWQpO1xuICAgICAgICB0aGlzLnNvdXJjZU5vZGVzW3NvdXJjZUlkXSA9IG5vZGU7XG5cbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG5vZGUsICdzdGFydCcsIGhhbmRsZU1vdmVTdGFydCk7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlQ2xpY2tEcmFnU291cmNlID0gdGhpcy5oYW5kbGVDbGlja0RyYWdTb3VyY2UuYmluZCh0aGlzLCBzb3VyY2VJZCk7XG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGlja0RyYWdTb3VyY2UsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zb3VyY2VOb2Rlc1tzb3VyY2VJZF07XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIobm9kZSwgJ3N0YXJ0JywgaGFuZGxlTW92ZVN0YXJ0KTtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGlja0RyYWdTb3VyY2UsIHRydWUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbm5lY3REcmFnUHJldmlldyAoc291cmNlSWQsIG5vZGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zb3VyY2VQcmV2aWV3Tm9kZU9wdGlvbnNbc291cmNlSWRdID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5zb3VyY2VQcmV2aWV3Tm9kZXNbc291cmNlSWRdID0gbm9kZTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc291cmNlUHJldmlld05vZGVzW3NvdXJjZUlkXTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNvdXJjZVByZXZpZXdOb2RlT3B0aW9uc1tzb3VyY2VJZF07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29ubmVjdERyb3BUYXJnZXQgKHRhcmdldElkLCBub2RlKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZU1vdmUgPSAoZSkgPT4ge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBHcmFiIHRoZSBjb29yZGluYXRlcyBmb3IgdGhlIGN1cnJlbnQgbW91c2UvdG91Y2ggcG9zaXRpb25cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgY29vcmRzID0gZ2V0RXZlbnRDbGllbnRPZmZzZXQoZSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVXNlIHRoZSBjb29yZGluYXRlcyB0byBncmFiIHRoZSBlbGVtZW50IHRoZSBkcmFnIGVuZGVkIG9uLlxuICAgICAgICAgICAgICogSWYgdGhlIGVsZW1lbnQgaXMgdGhlIHNhbWUgYXMgdGhlIHRhcmdldCBub2RlIChvciBhbnkgb2YgaXQncyBjaGlsZHJlbikgdGhlbiB3ZSBoYXZlIGhpdCBhIGRyb3AgdGFyZ2V0IGFuZCBjYW4gaGFuZGxlIHRoZSBtb3ZlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBkcm9wcGVkT24gPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNvb3Jkcy54LCBjb29yZHMueSk7XG4gICAgICAgICAgICBjb25zdCBjaGlsZE1hdGNoID0gbm9kZS5jb250YWlucyhkcm9wcGVkT24pO1xuXG4gICAgICAgICAgICBpZiAoZHJvcHBlZE9uID09PSBub2RlIHx8IGNoaWxkTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVNb3ZlKGUsIHRhcmdldElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQXR0YWNoaW5nIHRoZSBldmVudCBsaXN0ZW5lciB0byB0aGUgYm9keSBzbyB0aGF0IHRvdWNobW92ZSB3aWxsIHdvcmsgd2hpbGUgZHJhZ2dpbmcgb3ZlciBtdWx0aXBsZSB0YXJnZXQgZWxlbWVudHMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLCAnbW92ZScsIGhhbmRsZU1vdmUpO1xuXG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5JyksICdtb3ZlJywgaGFuZGxlTW92ZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2tEcmFnU291cmNlIChzb3VyY2VJZCwgZSkge1xuICAgICAgICBpZiAodGhpcy5fbGFzdERyb3BFdmVudFRpbWVTdGFtcCAmJiB0aGlzLl9sYXN0RHJvcEV2ZW50VGltZVN0YW1wID09PSBlLnRpbWVTdGFtcCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNvdXJjZUNsaWVudE9mZnNldCAoc291cmNlSWQpIHtcbiAgICAgICAgcmV0dXJuIGdldE5vZGVDbGllbnRPZmZzZXQodGhpcy5zb3VyY2VOb2Rlc1tzb3VyY2VJZF0pO1xuICAgIH1cblxuICAgIGhhbmRsZVRvcE1vdmVTdGFydENhcHR1cmUgKGUpIHtcbiAgICAgICAgdGhpcy5tb3ZlU3RhcnRTb3VyY2VJZHMgPSBbXTtcbiAgICB9XG5cbiAgICBoYW5kbGVNb3ZlU3RhcnQgKHNvdXJjZUlkKSB7XG4gICAgICAgIHRoaXMubW92ZVN0YXJ0U291cmNlSWRzLnVuc2hpZnQoc291cmNlSWQpO1xuICAgIH1cblxuICAgIGdldFRvcE1vdmVTdGFydEhhbmRsZXIgKCkge1xuICAgICAgICBpZiAoIXRoaXMuZGVsYXlUb3VjaFN0YXJ0ICYmICF0aGlzLmRlbGF5TW91c2VTdGFydCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0RGVsYXk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZVN0YXJ0IChlKSB7XG4gICAgICAgIC8vIEFsbG93IG90aGVyIHN5c3RlbXMgdG8gcHJldmVudCBkcmFnZ2luZ1xuICAgICAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEb24ndCBwcmVtYXR1cmVseSBwcmV2ZW50RGVmYXVsdCgpIGhlcmUgc2luY2UgaXQgbWlnaHQ6XG4gICAgICAgIC8vIDEuIE1lc3MgdXAgc2Nyb2xsaW5nXG4gICAgICAgIC8vIDIuIE1lc3MgdXAgbG9uZyB0YXAgKHdoaWNoIGJyaW5ncyB1cCBjb250ZXh0IG1lbnUpXG4gICAgICAgIC8vIDMuIElmIHRoZXJlJ3MgYW4gYW5jaG9yIGxpbmsgYXMgYSBjaGlsZCwgdGFwIHdvbid0IGJlIHRyaWdnZXJlZCBvbiBsaW5rXG5cbiAgICAgICAgY29uc3QgY2xpZW50T2Zmc2V0ID0gZ2V0RXZlbnRDbGllbnRPZmZzZXQoZSk7XG4gICAgICAgIGlmIChjbGllbnRPZmZzZXQpIHtcbiAgICAgICAgICAgIHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0ID0gY2xpZW50T2Zmc2V0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZVN0YXJ0RGVsYXkgKGUpIHtcbiAgICAgICAgY29uc3QgZGVsYXkgPSAoZS50eXBlID09PSBldmVudE5hbWVzLnRvdWNoLnN0YXJ0KVxuICAgICAgICAgICAgPyB0aGlzLmRlbGF5VG91Y2hTdGFydFxuICAgICAgICAgICAgOiB0aGlzLmRlbGF5TW91c2VTdGFydDtcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmhhbmRsZVRvcE1vdmVTdGFydC5iaW5kKHRoaXMsIGUpLCBkZWxheSk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZUNhcHR1cmUgKGUpIHtcbiAgICAgICAgdGhpcy5kcmFnT3ZlclRhcmdldElkcyA9IFtdO1xuICAgIH1cblxuICAgIGhhbmRsZU1vdmUoIGUsIHRhcmdldElkICkge1xuICAgICAgICB0aGlzLmRyYWdPdmVyVGFyZ2V0SWRzLnVuc2hpZnQoIHRhcmdldElkICk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZSAoZSkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblxuICAgICAgICBjb25zdCB7IG1vdmVTdGFydFNvdXJjZUlkcywgZHJhZ092ZXJUYXJnZXRJZHMgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGNsaWVudE9mZnNldCA9IGdldEV2ZW50Q2xpZW50T2Zmc2V0KGUpO1xuXG4gICAgICAgIGlmICghY2xpZW50T2Zmc2V0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbGxvdyBkcmFnIHRvIGJlIHByZS1lbXB0ZWRcbiAgICAgICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCAmJiAhdGhpcy5tb25pdG9yLmlzRHJhZ2dpbmcoKSkge1xuICAgICAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlJ3JlIG5vdCBkcmFnZ2luZyBhbmQgd2UndmUgbW92ZWQgYSBsaXR0bGUsIHRoYXQgY291bnRzIGFzIGEgZHJhZyBzdGFydFxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy5tb25pdG9yLmlzRHJhZ2dpbmcoKSAmJlxuICAgICAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQuaGFzT3duUHJvcGVydHkoJ3gnKSAmJlxuICAgICAgICAgICAgbW92ZVN0YXJ0U291cmNlSWRzICYmXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQueCAhPT0gY2xpZW50T2Zmc2V0LnggfHxcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldC55ICE9PSBjbGllbnRPZmZzZXQueVxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVN0YXJ0U291cmNlSWRzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5iZWdpbkRyYWcobW92ZVN0YXJ0U291cmNlSWRzLCB7XG4gICAgICAgICAgICAgICAgY2xpZW50T2Zmc2V0OiB0aGlzLl9tb3VzZUNsaWVudE9mZnNldCxcbiAgICAgICAgICAgICAgICBnZXRTb3VyY2VDbGllbnRPZmZzZXQ6IHRoaXMuZ2V0U291cmNlQ2xpZW50T2Zmc2V0LFxuICAgICAgICAgICAgICAgIHB1Ymxpc2hTb3VyY2U6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5tb25pdG9yLmlzRHJhZ2dpbmcoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc291cmNlTm9kZSA9IHRoaXMuc291cmNlTm9kZXNbdGhpcy5tb25pdG9yLmdldFNvdXJjZUlkKCldO1xuICAgICAgICB0aGlzLmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKHNvdXJjZU5vZGUpO1xuICAgICAgICB0aGlzLmFjdGlvbnMucHVibGlzaERyYWdTb3VyY2UoKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdUYXJnZXRJZHMgPSBPYmplY3Qua2V5cyh0aGlzLnRhcmdldE5vZGVzKVxuICAgICAgICAgICAgLmZpbHRlcigodGFyZ2V0SWQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLnRhcmdldE5vZGVzW3RhcmdldElkXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xpZW50T2Zmc2V0LnggPj0gYm91bmRpbmdSZWN0LmxlZnQgJiZcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQueCA8PSBib3VuZGluZ1JlY3QucmlnaHQgJiZcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQueSA+PSBib3VuZGluZ1JlY3QudG9wICYmXG4gICAgICAgICAgICAgICAgY2xpZW50T2Zmc2V0LnkgPD0gYm91bmRpbmdSZWN0LmJvdHRvbTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAqL1xuXG4gICAgICAgIHRoaXMuYWN0aW9ucy5ob3ZlcihkcmFnT3ZlclRhcmdldElkcywge1xuICAgICAgICAgICAgY2xpZW50T2Zmc2V0OiBjbGllbnRPZmZzZXRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUgKGUpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cbiAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQgPSB7fTtcblxuICAgICAgICBpZiAoIXRoaXMubW9uaXRvci5pc0RyYWdnaW5nKCkgfHwgdGhpcy5tb25pdG9yLmRpZERyb3AoKSkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlU3RhcnRTb3VyY2VJZHMgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHRoaXMuX2xhc3REcm9wRXZlbnRUaW1lU3RhbXAgPSBlLnRpbWVTdGFtcDtcblxuICAgICAgICB0aGlzLnVuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoKTtcbiAgICAgICAgdGhpcy5hY3Rpb25zLmRyb3AoKTtcbiAgICAgICAgdGhpcy5hY3Rpb25zLmVuZERyYWcoKTtcbiAgICB9XG5cbiAgICBpbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciAobm9kZSkge1xuICAgICAgICB0aGlzLnVuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoKTtcblxuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciA9IG5ldyB3aW5kb3cuTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIW5vZGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdXJyZWN0U291cmNlTm9kZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudW5pbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIW5vZGUgfHwgIW5vZGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlci5vYnNlcnZlKFxuICAgICAgICAgICAgbm9kZS5wYXJlbnRFbGVtZW50LFxuICAgICAgICAgICAgeyBjaGlsZExpc3Q6IHRydWUgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlc3VycmVjdFNvdXJjZU5vZGUgKCkge1xuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGUucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXJlYWN0aWQnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRyYWdnZWRTb3VyY2VOb2RlKTtcbiAgICB9XG5cbiAgICB1bmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGUgPSBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVG91Y2hCYWNrZW5kIChvcHRpb25zT3JNYW5hZ2VyID0ge30pIHtcbiAgICBjb25zdCB0b3VjaEJhY2tlbmRGYWN0b3J5ID0gZnVuY3Rpb24gKG1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUb3VjaEJhY2tlbmQobWFuYWdlciwgb3B0aW9uc09yTWFuYWdlcik7XG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zT3JNYW5hZ2VyLmdldE1vbml0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRvdWNoQmFja2VuZEZhY3Rvcnkob3B0aW9uc09yTWFuYWdlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRvdWNoQmFja2VuZEZhY3Rvcnk7XG4gICAgfVxufVxuIl19
