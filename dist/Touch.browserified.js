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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW52YXJpYW50L2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL1RvdWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Y2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICdNaW5pZmllZCBleGNlcHRpb24gb2NjdXJyZWQ7IHVzZSB0aGUgbm9uLW1pbmlmaWVkIGRldiBlbnZpcm9ubWVudCAnICtcbiAgICAgICAgJ2ZvciB0aGUgZnVsbCBlcnJvciBtZXNzYWdlIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJ1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgICAgZXJyb3IubmFtZSA9ICdJbnZhcmlhbnQgVmlvbGF0aW9uJztcbiAgICB9XG5cbiAgICBlcnJvci5mcmFtZXNUb1BvcCA9IDE7IC8vIHdlIGRvbid0IGNhcmUgYWJvdXQgaW52YXJpYW50J3Mgb3duIGZyYW1lXG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaW52YXJpYW50O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE1LCBZYWhvbyBJbmMuXG4gKiBDb3B5cmlnaHRzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIHRoZSBhY2NvbXBhbnlpbmcgTElDRU5TRSBmaWxlIGZvciB0ZXJtcy5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2ludmFyaWFudCc7XG5cbmZ1bmN0aW9uIGdldEV2ZW50Q2xpZW50VG91Y2hPZmZzZXQgKGUpIHtcbiAgICBpZiAoZS50YXJnZXRUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gZ2V0RXZlbnRDbGllbnRPZmZzZXQoZS50YXJnZXRUb3VjaGVzWzBdKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdldEV2ZW50Q2xpZW50T2Zmc2V0IChlKSB7XG4gICAgaWYgKGUudGFyZ2V0VG91Y2hlcykge1xuICAgICAgICByZXR1cm4gZ2V0RXZlbnRDbGllbnRUb3VjaE9mZnNldChlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogZS5jbGllbnRYLFxuICAgICAgICAgICAgeTogZS5jbGllbnRZXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jb25zdCBFTEVNRU5UX05PREUgPSAxO1xuZnVuY3Rpb24gZ2V0Tm9kZUNsaWVudE9mZnNldCAobm9kZSkge1xuICAgIGNvbnN0IGVsID0gbm9kZS5ub2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFXG4gICAgICAgID8gbm9kZVxuICAgICAgICA6IG5vZGUucGFyZW50RWxlbWVudDtcblxuICAgIGlmICghZWwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgeyB0b3AsIGxlZnQgfSA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiB7IHg6IGxlZnQsIHk6IHRvcCB9O1xufVxuXG5jb25zdCBldmVudE5hbWVzID0ge1xuICAgIG1vdXNlOiB7XG4gICAgICAgIHN0YXJ0OiAnbW91c2Vkb3duJyxcbiAgICAgICAgbW92ZTogJ21vdXNlbW92ZScsXG4gICAgICAgIGVuZDogJ21vdXNldXAnXG4gICAgfSxcbiAgICB0b3VjaDoge1xuICAgICAgICBzdGFydDogJ3RvdWNoc3RhcnQnLFxuICAgICAgICBtb3ZlOiAndG91Y2htb3ZlJyxcbiAgICAgICAgZW5kOiAndG91Y2hlbmQnLFxuICAgICAgICBjYW5jZWw6ICd0b3VjaGNhbmNlbCdcbiAgICB9XG59O1xuXG5leHBvcnQgY2xhc3MgVG91Y2hCYWNrZW5kIHtcbiAgICBjb25zdHJ1Y3RvciAobWFuYWdlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIG9wdGlvbnMuZGVsYXlUb3VjaFN0YXJ0ID0gb3B0aW9ucy5kZWxheVRvdWNoU3RhcnQgfHwgb3B0aW9ucy5kZWxheTtcblxuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgZW5hYmxlVG91Y2hFdmVudHM6IHRydWUsXG4gICAgICAgICAgICBlbmFibGVNb3VzZUV2ZW50czogZmFsc2UsXG4gICAgICAgICAgICBkZWxheVRvdWNoU3RhcnQ6IDAsXG4gICAgICAgICAgICBkZWxheU1vdXNlU3RhcnQ6IDAsXG4gICAgICAgICAgICAuLi5vcHRpb25zXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5hY3Rpb25zID0gbWFuYWdlci5nZXRBY3Rpb25zKCk7XG4gICAgICAgIHRoaXMubW9uaXRvciA9IG1hbmFnZXIuZ2V0TW9uaXRvcigpO1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5ID0gbWFuYWdlci5nZXRSZWdpc3RyeSgpO1xuXG4gICAgICAgIHRoaXMuZGVsYXlUb3VjaFN0YXJ0ID0gb3B0aW9ucy5kZWxheVRvdWNoU3RhcnQ7XG4gICAgICAgIHRoaXMuZGVsYXlNb3VzZVN0YXJ0ID0gb3B0aW9ucy5kZWxheU1vdXNlU3RhcnQ7XG4gICAgICAgIHRoaXMuc291cmNlTm9kZXMgPSB7fTtcbiAgICAgICAgdGhpcy5zb3VyY2VOb2RlT3B0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLnNvdXJjZVByZXZpZXdOb2RlcyA9IHt9O1xuICAgICAgICB0aGlzLnNvdXJjZVByZXZpZXdOb2RlT3B0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLnRhcmdldE5vZGVPcHRpb25zID0ge307XG4gICAgICAgIHRoaXMubGlzdGVuZXJUeXBlcyA9IFtdO1xuICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldCA9IHt9O1xuICAgICAgICB0aGlzLl9zdXBwcmVzc0NvbnRleHRNZW51ID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlTW91c2VFdmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJUeXBlcy5wdXNoKCdtb3VzZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlVG91Y2hFdmVudHMpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJUeXBlcy5wdXNoKCd0b3VjaCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nZXRTb3VyY2VDbGllbnRPZmZzZXQgPSB0aGlzLmdldFNvdXJjZUNsaWVudE9mZnNldC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydCA9IHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0RGVsYXkgPSB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydERlbGF5LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0Q2FwdHVyZSA9IHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0Q2FwdHVyZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVDYXB0dXJlID0gdGhpcy5oYW5kbGVUb3BNb3ZlQ2FwdHVyZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmUgPSB0aGlzLmhhbmRsZVRvcE1vdmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlRW5kQ2FwdHVyZSA9IHRoaXMuaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlQ2FuY2VsQ2FwdHVyZSA9IHRoaXMuaGFuZGxlVG9wTW92ZUNhbmNlbENhcHR1cmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVTaG93Q29udGV4dE1lbnUgPSB0aGlzLmhhbmRsZVNob3dDb250ZXh0TWVudS5iaW5kKHRoaXMpO1xuICAgIH1cblxuICAgIHNldHVwICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhcmlhbnQoIXRoaXMuY29uc3RydWN0b3IuaXNTZXRVcCwgJ0Nhbm5vdCBoYXZlIHR3byBUb3VjaCBiYWNrZW5kcyBhdCB0aGUgc2FtZSB0aW1lLicpO1xuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLmlzU2V0VXAgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdzdGFydCcsICB0aGlzLmdldFRvcE1vdmVTdGFydEhhbmRsZXIoKSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdzdGFydCcsICB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydENhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAnbW92ZScsICAgdGhpcy5oYW5kbGVUb3BNb3ZlKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ21vdmUnLCAgIHRoaXMuaGFuZGxlVG9wTW92ZUNhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAnZW5kJywgICAgdGhpcy5oYW5kbGVUb3BNb3ZlRW5kQ2FwdHVyZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdjYW5jZWwnLCB0aGlzLmhhbmRsZVRvcE1vdmVDYW5jZWxDYXB0dXJlLCB0cnVlKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCB0aGlzLmhhbmRsZVNob3dDb250ZXh0TWVudSk7XG4gICAgfVxuXG4gICAgdGVhcmRvd24gKCkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uc3RydWN0b3IuaXNTZXRVcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldCA9IHt9O1xuXG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdzdGFydCcsICB0aGlzLmdldFRvcE1vdmVTdGFydEhhbmRsZXIoKSk7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdzdGFydCcsICB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydENhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnbW92ZScsICAgdGhpcy5oYW5kbGVUb3BNb3ZlQ2FwdHVyZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdtb3ZlJywgICB0aGlzLmhhbmRsZVRvcE1vdmUpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnZW5kJywgICAgdGhpcy5oYW5kbGVUb3BNb3ZlRW5kQ2FwdHVyZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdjYW5jZWwnLCB0aGlzLmhhbmRsZVRvcE1vdmVDYW5jZWxDYXB0dXJlLCB0cnVlKTtcblxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCB0aGlzLmhhbmRsZVNob3dDb250ZXh0TWVudSk7XG5cbiAgICAgICAgdGhpcy51bmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKCk7XG4gICAgfVxuXG4gICAgYWRkRXZlbnRMaXN0ZW5lciAoc3ViamVjdCwgZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lclR5cGVzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyVHlwZSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gZXZlbnROYW1lc1tsaXN0ZW5lclR5cGVdW2V2ZW50XTtcbiAgICAgICAgICAgIGlmIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBzdWJqZWN0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlRXZlbnRMaXN0ZW5lciAoc3ViamVjdCwgZXZlbnQsIGhhbmRsZXIsIGNhcHR1cmUpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lclR5cGVzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyVHlwZSkge1xuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gZXZlbnROYW1lc1tsaXN0ZW5lclR5cGVdW2V2ZW50XTtcbiAgICAgICAgICAgIGlmIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICBzdWJqZWN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyLCBjYXB0dXJlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29ubmVjdERyYWdTb3VyY2UgKHNvdXJjZUlkLCBub2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc291cmNlTm9kZXNbc291cmNlSWRdID0gbm9kZTtcblxuICAgICAgICBjb25zdCBoYW5kbGVNb3ZlU3RhcnQgPSB0aGlzLmhhbmRsZU1vdmVTdGFydC5iaW5kKHRoaXMsIHNvdXJjZUlkKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKG5vZGUsICdzdGFydCcsIGhhbmRsZU1vdmVTdGFydCk7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlQ2xpY2tEcmFnU291cmNlID0gdGhpcy5oYW5kbGVDbGlja0RyYWdTb3VyY2UuYmluZCh0aGlzLCBzb3VyY2VJZCk7XG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGlja0RyYWdTb3VyY2UsIHRydWUpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zb3VyY2VOb2Rlc1tzb3VyY2VJZF07XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIobm9kZSwgJ3N0YXJ0JywgaGFuZGxlTW92ZVN0YXJ0KTtcbiAgICAgICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGlja0RyYWdTb3VyY2UsIHRydWUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbm5lY3REcmFnUHJldmlldyAoc291cmNlSWQsIG5vZGUsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5zb3VyY2VQcmV2aWV3Tm9kZU9wdGlvbnNbc291cmNlSWRdID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5zb3VyY2VQcmV2aWV3Tm9kZXNbc291cmNlSWRdID0gbm9kZTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc291cmNlUHJldmlld05vZGVzW3NvdXJjZUlkXTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNvdXJjZVByZXZpZXdOb2RlT3B0aW9uc1tzb3VyY2VJZF07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgY29ubmVjdERyb3BUYXJnZXQgKHRhcmdldElkLCBub2RlKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZU1vdmUgPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29vcmRzID0gZ2V0RXZlbnRDbGllbnRPZmZzZXQoZSk7XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogVXNlIHRoZSBjb29yZGluYXRlcyB0byBncmFiIHRoZSBlbGVtZW50IHRoZSBkcmFnIGVuZGVkIG9uLlxuICAgICAgICAgICAgICogSWYgdGhlIGVsZW1lbnQgaXMgdGhlIHNhbWUgYXMgdGhlIHRhcmdldCBub2RlIChvciBhbnkgb2YgaXQncyBjaGlsZHJlbikgdGhlbiB3ZSBoYXZlIGhpdCBhIGRyb3AgdGFyZ2V0IGFuZCBjYW4gaGFuZGxlIHRoZSBtb3ZlLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBjb25zdCBkcm9wcGVkT24gPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGNvb3Jkcy54LCBjb29yZHMueSk7XG4gICAgICAgICAgICBjb25zdCBjaGlsZE1hdGNoID0gbm9kZS5jb250YWlucyhkcm9wcGVkT24pO1xuXG4gICAgICAgICAgICBpZiAoZHJvcHBlZE9uID09PSBub2RlIHx8IGNoaWxkTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVNb3ZlKGUsIHRhcmdldElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQXR0YWNoaW5nIHRoZSBldmVudCBsaXN0ZW5lciB0byB0aGUgYm9keSBzbyB0aGF0IHRvdWNobW92ZSB3aWxsIHdvcmsgd2hpbGUgZHJhZ2dpbmcgb3ZlciBtdWx0aXBsZSB0YXJnZXQgZWxlbWVudHMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLCAnbW92ZScsIGhhbmRsZU1vdmUpO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpLCAnbW92ZScsIGhhbmRsZU1vdmUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGhhbmRsZVNob3dDb250ZXh0TWVudSAoZSkge1xuICAgICAgICBpZiAodGhpcy5fc3VwcHJlc3NDb250ZXh0TWVudSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYW5jZWxEcmFnKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVDbGlja0RyYWdTb3VyY2UgKHNvdXJjZUlkLCBlKSB7XG4gICAgICAgIGlmICh0aGlzLl9sYXN0RHJvcEV2ZW50VGltZVN0YW1wICYmIHRoaXMuX2xhc3REcm9wRXZlbnRUaW1lU3RhbXAgPT09IGUudGltZVN0YW1wKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U291cmNlQ2xpZW50T2Zmc2V0IChzb3VyY2VJZCkge1xuICAgICAgICByZXR1cm4gZ2V0Tm9kZUNsaWVudE9mZnNldCh0aGlzLnNvdXJjZU5vZGVzW3NvdXJjZUlkXSk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZVN0YXJ0Q2FwdHVyZSAoZSkge1xuICAgICAgICB0aGlzLm1vdmVTdGFydFNvdXJjZUlkcyA9IFtdO1xuICAgIH1cblxuICAgIGhhbmRsZU1vdmVTdGFydCAoc291cmNlSWQpIHtcbiAgICAgICAgdGhpcy5tb3ZlU3RhcnRTb3VyY2VJZHMudW5zaGlmdChzb3VyY2VJZCk7XG4gICAgfVxuXG4gICAgZ2V0VG9wTW92ZVN0YXJ0SGFuZGxlciAoKSB7XG4gICAgICAgIGlmICghdGhpcy5kZWxheVRvdWNoU3RhcnQgJiYgIXRoaXMuZGVsYXlNb3VzZVN0YXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnREZWxheTtcbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlU3RhcnQgKGUpIHtcbiAgICAgICAgLy8gQWxsb3cgb3RoZXIgc3lzdGVtcyB0byBwcmV2ZW50IGRyYWdnaW5nXG4gICAgICAgIGlmIChlLmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERvbid0IHByZW1hdHVyZWx5IHByZXZlbnREZWZhdWx0KCkgaGVyZSBzaW5jZSBpdCBtaWdodDpcbiAgICAgICAgLy8gMS4gTWVzcyB1cCBzY3JvbGxpbmdcbiAgICAgICAgLy8gMi4gTWVzcyB1cCBsb25nIHRhcCAod2hpY2ggYnJpbmdzIHVwIGNvbnRleHQgbWVudSlcbiAgICAgICAgLy8gMy4gSWYgdGhlcmUncyBhbiBhbmNob3IgbGluayBhcyBhIGNoaWxkLCB0YXAgd29uJ3QgYmUgdHJpZ2dlcmVkIG9uIGxpbmtcblxuICAgICAgICBjb25zdCBjbGllbnRPZmZzZXQgPSBnZXRFdmVudENsaWVudE9mZnNldChlKTtcbiAgICAgICAgaWYgKGNsaWVudE9mZnNldCkge1xuICAgICAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQgPSBjbGllbnRPZmZzZXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlU3RhcnREZWxheSAoZSkge1xuICAgICAgICBjb25zdCBkZWxheSA9IChlLnR5cGUgPT09IGV2ZW50TmFtZXMudG91Y2guc3RhcnQpXG4gICAgICAgICAgICA/IHRoaXMuZGVsYXlUb3VjaFN0YXJ0XG4gICAgICAgICAgICA6IHRoaXMuZGVsYXlNb3VzZVN0YXJ0O1xuXG4gICAgICAgIGlmIChkZWxheSkge1xuICAgICAgICAgICAgdGhpcy5fc3VwcHJlc3NDb250ZXh0TWVudSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0LmJpbmQodGhpcywgZSksIGRlbGF5KTtcbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlQ2FwdHVyZSAoZSkge1xuICAgICAgICB0aGlzLmRyYWdPdmVyVGFyZ2V0SWRzID0gW107XG4gICAgfVxuXG4gICAgaGFuZGxlTW92ZSggZSwgdGFyZ2V0SWQgKSB7XG4gICAgICAgIHRoaXMuZHJhZ092ZXJUYXJnZXRJZHMudW5zaGlmdCggdGFyZ2V0SWQgKTtcbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlIChlKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuXG4gICAgICAgIGNvbnN0IHsgbW92ZVN0YXJ0U291cmNlSWRzLCBkcmFnT3ZlclRhcmdldElkcyB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgY2xpZW50T2Zmc2V0ID0gZ2V0RXZlbnRDbGllbnRPZmZzZXQoZSk7XG5cbiAgICAgICAgaWYgKCFjbGllbnRPZmZzZXQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsbG93IGRyYWcgdG8gYmUgcHJlLWVtcHRlZFxuICAgICAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkICYmICF0aGlzLm1vbml0b3IuaXNEcmFnZ2luZygpKSB7XG4gICAgICAgICAgICB0aGlzLmNhbmNlbERyYWcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlJ3JlIG5vdCBkcmFnZ2luZyBhbmQgd2UndmUgbW92ZWQgYSBsaXR0bGUsIHRoYXQgY291bnRzIGFzIGEgZHJhZyBzdGFydFxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAhdGhpcy5tb25pdG9yLmlzRHJhZ2dpbmcoKSAmJlxuICAgICAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQuaGFzT3duUHJvcGVydHkoJ3gnKSAmJlxuICAgICAgICAgICAgbW92ZVN0YXJ0U291cmNlSWRzICYmXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQueCAhPT0gY2xpZW50T2Zmc2V0LnggfHxcbiAgICAgICAgICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldC55ICE9PSBjbGllbnRPZmZzZXQueVxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVN0YXJ0U291cmNlSWRzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuYWN0aW9ucy5iZWdpbkRyYWcobW92ZVN0YXJ0U291cmNlSWRzLCB7XG4gICAgICAgICAgICAgICAgY2xpZW50T2Zmc2V0OiB0aGlzLl9tb3VzZUNsaWVudE9mZnNldCxcbiAgICAgICAgICAgICAgICBnZXRTb3VyY2VDbGllbnRPZmZzZXQ6IHRoaXMuZ2V0U291cmNlQ2xpZW50T2Zmc2V0LFxuICAgICAgICAgICAgICAgIHB1Ymxpc2hTb3VyY2U6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5tb25pdG9yLmlzRHJhZ2dpbmcoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc291cmNlTm9kZSA9IHRoaXMuc291cmNlTm9kZXNbdGhpcy5tb25pdG9yLmdldFNvdXJjZUlkKCldO1xuICAgICAgICB0aGlzLmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKHNvdXJjZU5vZGUpO1xuICAgICAgICB0aGlzLmFjdGlvbnMucHVibGlzaERyYWdTb3VyY2UoKTtcblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgY29uc3QgbWF0Y2hpbmdUYXJnZXRJZHMgPSBPYmplY3Qua2V5cyh0aGlzLnRhcmdldE5vZGVzKVxuICAgICAgICAgICAgLmZpbHRlcigodGFyZ2V0SWQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLnRhcmdldE5vZGVzW3RhcmdldElkXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xpZW50T2Zmc2V0LnggPj0gYm91bmRpbmdSZWN0LmxlZnQgJiZcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQueCA8PSBib3VuZGluZ1JlY3QucmlnaHQgJiZcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQueSA+PSBib3VuZGluZ1JlY3QudG9wICYmXG4gICAgICAgICAgICAgICAgY2xpZW50T2Zmc2V0LnkgPD0gYm91bmRpbmdSZWN0LmJvdHRvbTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAqL1xuXG4gICAgICAgIHRoaXMuYWN0aW9ucy5ob3ZlcihkcmFnT3ZlclRhcmdldElkcywge1xuICAgICAgICAgICAgY2xpZW50T2Zmc2V0OiBjbGllbnRPZmZzZXRcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUgKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZW5kRHJhZyhldmVudCk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZUNhbmNlbENhcHR1cmUgKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuY2FuY2VsRHJhZyhldmVudCk7XG4gICAgfVxuXG4gICAgY2FuY2VsRHJhZyAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbmREcmFnKGV2ZW50LCB7IGNhbmNlbGxlZDogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBlbmREcmFnIChldmVudCwgeyBjYW5jZWxsZWQgfSA9IHt9KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuXG4gICAgICAgIHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0ID0ge307XG4gICAgICAgIHRoaXMuX3N1cHByZXNzQ29udGV4dE1lbnUgPSBmYWxzZTtcblxuICAgICAgICBpZiAoIXRoaXMubW9uaXRvci5pc0RyYWdnaW5nKCkgfHwgdGhpcy5tb25pdG9yLmRpZERyb3AoKSkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlU3RhcnRTb3VyY2VJZHMgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51bmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKCk7XG5cbiAgICAgICAgaWYgKCFjYW5jZWxsZWQpIHtcbiAgICAgICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3REcm9wRXZlbnRUaW1lU3RhbXAgPSBldmVudC50aW1lU3RhbXA7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLmRyb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYWN0aW9ucy5lbmREcmFnKCk7XG4gICAgfVxuXG4gICAgaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIgKG5vZGUpIHtcbiAgICAgICAgdGhpcy51bmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKCk7XG5cbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZSA9IG5vZGU7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIgPSBuZXcgd2luZG93Lk11dGF0aW9uT2JzZXJ2ZXIoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFub2RlLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc3VycmVjdFNvdXJjZU5vZGUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFub2RlIHx8ICFub2RlLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIub2JzZXJ2ZShcbiAgICAgICAgICAgIG5vZGUucGFyZW50RWxlbWVudCxcbiAgICAgICAgICAgIHsgY2hpbGRMaXN0OiB0cnVlIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZXN1cnJlY3RTb3VyY2VOb2RlICgpIHtcbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlLnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1yZWFjdGlkJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kcmFnZ2VkU291cmNlTm9kZSk7XG4gICAgfVxuXG4gICAgdW5pbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdnZWRTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlID0gbnVsbDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNyZWF0ZVRvdWNoQmFja2VuZCAob3B0aW9uc09yTWFuYWdlciA9IHt9KSB7XG4gICAgY29uc3QgdG91Y2hCYWNrZW5kRmFjdG9yeSA9IGZ1bmN0aW9uIChtYW5hZ2VyKSB7XG4gICAgICAgIHJldHVybiBuZXcgVG91Y2hCYWNrZW5kKG1hbmFnZXIsIG9wdGlvbnNPck1hbmFnZXIpO1xuICAgIH07XG5cbiAgICBpZiAob3B0aW9uc09yTWFuYWdlci5nZXRNb25pdG9yKSB7XG4gICAgICAgIHJldHVybiB0b3VjaEJhY2tlbmRGYWN0b3J5KG9wdGlvbnNPck1hbmFnZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0b3VjaEJhY2tlbmRGYWN0b3J5O1xuICAgIH1cbn1cbiJdfQ==
