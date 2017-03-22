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
        value: function handleMoveStart(sourceId, event) {
            // Prevent text selection when draging an element.
            if (event instanceof MouseEvent) {
                event.preventDefault();
                event.defaultPreventedToAvoidTextSelection = true;
            }

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
            if (e.defaultPrevented && !e.defaultPreventedToAvoidTextSelection) {
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
            if (e.defaultPrevented && !e.defaultPreventedToAvoidTextSelection && !this.monitor.isDragging()) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvaW52YXJpYW50L2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwic3JjL1RvdWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q3ZDLHFCQUFLLGdDQUFMLENBQXNDLFVBQXRDO0FBQ0g7O0FBRUQsaUJBQUssZ0NBQUwsR0FBd0MsSUFBeEM7QUFDQSxpQkFBSyxpQkFBTCxHQUF5QixJQUF6QjtBQUNIOzs7Ozs7QUFHVSxTQUFTLGtCQUFULEdBQW9EO0FBQUEsUUFBdkIsZ0JBQXVCLHlEQUFKLEVBQUk7O0FBQy9ELFFBQU0sc0JBQXNCLFNBQXRCLG1CQUFzQixDQUFVLE9BQVYsRUFBbUI7QUFDM0MsZUFBTyxJQUFJLFlBQUosQ0FBaUIsT0FBakIsRUFBMEIsZ0JBQTFCLENBQVA7QUFDSCxLQUZEOztBQUlBLFFBQUksaUJBQWlCLFVBQXJCLEVBQWlDO0FBQzdCLGVBQU8sb0JBQW9CLGdCQUFwQixDQUFQO0FBQ0gsS0FGRCxNQUVPO0FBQ0gsZUFBTyxtQkFBUDtBQUNIO0FBQ0oiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy0yMDE1LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVzZSBpbnZhcmlhbnQoKSB0byBhc3NlcnQgc3RhdGUgd2hpY2ggeW91ciBwcm9ncmFtIGFzc3VtZXMgdG8gYmUgdHJ1ZS5cbiAqXG4gKiBQcm92aWRlIHNwcmludGYtc3R5bGUgZm9ybWF0IChvbmx5ICVzIGlzIHN1cHBvcnRlZCkgYW5kIGFyZ3VtZW50c1xuICogdG8gcHJvdmlkZSBpbmZvcm1hdGlvbiBhYm91dCB3aGF0IGJyb2tlIGFuZCB3aGF0IHlvdSB3ZXJlXG4gKiBleHBlY3RpbmcuXG4gKlxuICogVGhlIGludmFyaWFudCBtZXNzYWdlIHdpbGwgYmUgc3RyaXBwZWQgaW4gcHJvZHVjdGlvbiwgYnV0IHRoZSBpbnZhcmlhbnRcbiAqIHdpbGwgcmVtYWluIHRvIGVuc3VyZSBsb2dpYyBkb2VzIG5vdCBkaWZmZXIgaW4gcHJvZHVjdGlvbi5cbiAqL1xuXG52YXIgaW52YXJpYW50ID0gZnVuY3Rpb24oY29uZGl0aW9uLCBmb3JtYXQsIGEsIGIsIGMsIGQsIGUsIGYpIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24oKSB7IHJldHVybiBhcmdzW2FyZ0luZGV4KytdOyB9KVxuICAgICAgKTtcbiAgICAgIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gICAgfVxuXG4gICAgZXJyb3IuZnJhbWVzVG9Qb3AgPSAxOyAvLyB3ZSBkb24ndCBjYXJlIGFib3V0IGludmFyaWFudCdzIG93biBmcmFtZVxuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBpcyBub3QgZGVmaW5lZCcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNSwgWWFob28gSW5jLlxuICogQ29weXJpZ2h0cyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSB0aGUgYWNjb21wYW55aW5nIExJQ0VOU0UgZmlsZSBmb3IgdGVybXMuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IGludmFyaWFudCBmcm9tICdpbnZhcmlhbnQnO1xuXG5mdW5jdGlvbiBnZXRFdmVudENsaWVudFRvdWNoT2Zmc2V0IChlKSB7XG4gICAgaWYgKGUudGFyZ2V0VG91Y2hlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGdldEV2ZW50Q2xpZW50T2Zmc2V0KGUudGFyZ2V0VG91Y2hlc1swXSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBnZXRFdmVudENsaWVudE9mZnNldCAoZSkge1xuICAgIGlmIChlLnRhcmdldFRvdWNoZXMpIHtcbiAgICAgICAgcmV0dXJuIGdldEV2ZW50Q2xpZW50VG91Y2hPZmZzZXQoZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IGUuY2xpZW50WCxcbiAgICAgICAgICAgIHk6IGUuY2xpZW50WVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuY29uc3QgRUxFTUVOVF9OT0RFID0gMTtcbmZ1bmN0aW9uIGdldE5vZGVDbGllbnRPZmZzZXQgKG5vZGUpIHtcbiAgICBjb25zdCBlbCA9IG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERVxuICAgICAgICA/IG5vZGVcbiAgICAgICAgOiBub2RlLnBhcmVudEVsZW1lbnQ7XG5cbiAgICBpZiAoIWVsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4geyB4OiBsZWZ0LCB5OiB0b3AgfTtcbn1cblxuY29uc3QgZXZlbnROYW1lcyA9IHtcbiAgICBtb3VzZToge1xuICAgICAgICBzdGFydDogJ21vdXNlZG93bicsXG4gICAgICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxuICAgICAgICBlbmQ6ICdtb3VzZXVwJ1xuICAgIH0sXG4gICAgdG91Y2g6IHtcbiAgICAgICAgc3RhcnQ6ICd0b3VjaHN0YXJ0JyxcbiAgICAgICAgbW92ZTogJ3RvdWNobW92ZScsXG4gICAgICAgIGVuZDogJ3RvdWNoZW5kJyxcbiAgICAgICAgY2FuY2VsOiAndG91Y2hjYW5jZWwnXG4gICAgfVxufTtcblxuZXhwb3J0IGNsYXNzIFRvdWNoQmFja2VuZCB7XG4gICAgY29uc3RydWN0b3IgKG1hbmFnZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBvcHRpb25zLmRlbGF5VG91Y2hTdGFydCA9IG9wdGlvbnMuZGVsYXlUb3VjaFN0YXJ0IHx8IG9wdGlvbnMuZGVsYXk7XG5cbiAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGVuYWJsZVRvdWNoRXZlbnRzOiB0cnVlLFxuICAgICAgICAgICAgZW5hYmxlTW91c2VFdmVudHM6IGZhbHNlLFxuICAgICAgICAgICAgZGVsYXlUb3VjaFN0YXJ0OiAwLFxuICAgICAgICAgICAgZGVsYXlNb3VzZVN0YXJ0OiAwLFxuICAgICAgICAgICAgbWluTW92ZVRvdWNoU3RhcnQ6IDAsXG4gICAgICAgICAgICBtaW5Nb3ZlTW91c2VTdGFydDogMCxcbiAgICAgICAgICAgIC4uLm9wdGlvbnNcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmFjdGlvbnMgPSBtYW5hZ2VyLmdldEFjdGlvbnMoKTtcbiAgICAgICAgdGhpcy5tb25pdG9yID0gbWFuYWdlci5nZXRNb25pdG9yKCk7XG4gICAgICAgIHRoaXMucmVnaXN0cnkgPSBtYW5hZ2VyLmdldFJlZ2lzdHJ5KCk7XG5cbiAgICAgICAgdGhpcy5taW5Nb3ZlVG91Y2hTdGFydCA9IG9wdGlvbnMubWluTW92ZVRvdWNoU3RhcnQ7XG4gICAgICAgIHRoaXMubWluTW92ZU1vdXNlU3RhcnQgPSBvcHRpb25zLm1pbk1vdmVNb3VzZVN0YXJ0O1xuICAgICAgICB0aGlzLmRlbGF5VG91Y2hTdGFydCA9IG9wdGlvbnMuZGVsYXlUb3VjaFN0YXJ0O1xuICAgICAgICB0aGlzLmRlbGF5TW91c2VTdGFydCA9IG9wdGlvbnMuZGVsYXlNb3VzZVN0YXJ0O1xuICAgICAgICB0aGlzLnNvdXJjZU5vZGVzID0ge307XG4gICAgICAgIHRoaXMuc291cmNlTm9kZU9wdGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy5zb3VyY2VQcmV2aWV3Tm9kZXMgPSB7fTtcbiAgICAgICAgdGhpcy5zb3VyY2VQcmV2aWV3Tm9kZU9wdGlvbnMgPSB7fTtcbiAgICAgICAgdGhpcy50YXJnZXROb2RlT3B0aW9ucyA9IHt9O1xuICAgICAgICB0aGlzLmxpc3RlbmVyVHlwZXMgPSBbXTtcbiAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQgPSB7fTtcbiAgICAgICAgdGhpcy5fc3VwcHJlc3NDb250ZXh0TWVudSA9IGZhbHNlO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmVuYWJsZU1vdXNlRXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyVHlwZXMucHVzaCgnbW91c2UnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmVuYWJsZVRvdWNoRXZlbnRzKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVyVHlwZXMucHVzaCgndG91Y2gnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2V0U291cmNlQ2xpZW50T2Zmc2V0ID0gdGhpcy5nZXRTb3VyY2VDbGllbnRPZmZzZXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnQgPSB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydERlbGF5ID0gdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnREZWxheS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydENhcHR1cmUgPSB0aGlzLmhhbmRsZVRvcE1vdmVTdGFydENhcHR1cmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlQ2FwdHVyZSA9IHRoaXMuaGFuZGxlVG9wTW92ZUNhcHR1cmUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYW5kbGVUb3BNb3ZlID0gdGhpcy5oYW5kbGVUb3BNb3ZlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUgPSB0aGlzLmhhbmRsZVRvcE1vdmVFbmRDYXB0dXJlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlVG9wTW92ZUNhbmNlbENhcHR1cmUgPSB0aGlzLmhhbmRsZVRvcE1vdmVDYW5jZWxDYXB0dXJlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2hvd0NvbnRleHRNZW51ID0gdGhpcy5oYW5kbGVTaG93Q29udGV4dE1lbnUuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICBzZXR1cCAoKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaW52YXJpYW50KCF0aGlzLmNvbnN0cnVjdG9yLmlzU2V0VXAsICdDYW5ub3QgaGF2ZSB0d28gVG91Y2ggYmFja2VuZHMgYXQgdGhlIHNhbWUgdGltZS4nKTtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5pc1NldFVwID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAnc3RhcnQnLCAgdGhpcy5nZXRUb3BNb3ZlU3RhcnRIYW5kbGVyKCkpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAnc3RhcnQnLCAgdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnRDYXB0dXJlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ21vdmUnLCAgIHRoaXMuaGFuZGxlVG9wTW92ZSk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdtb3ZlJywgICB0aGlzLmhhbmRsZVRvcE1vdmVDYXB0dXJlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHdpbmRvdywgJ2VuZCcsICAgIHRoaXMuaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIod2luZG93LCAnY2FuY2VsJywgdGhpcy5oYW5kbGVUb3BNb3ZlQ2FuY2VsQ2FwdHVyZSwgdHJ1ZSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgdGhpcy5oYW5kbGVTaG93Q29udGV4dE1lbnUpO1xuICAgIH1cblxuICAgIHRlYXJkb3duICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLmlzU2V0VXAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQgPSB7fTtcblxuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnc3RhcnQnLCAgdGhpcy5nZXRUb3BNb3ZlU3RhcnRIYW5kbGVyKCkpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnc3RhcnQnLCAgdGhpcy5oYW5kbGVUb3BNb3ZlU3RhcnRDYXB0dXJlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ21vdmUnLCAgIHRoaXMuaGFuZGxlVG9wTW92ZUNhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnbW92ZScsICAgdGhpcy5oYW5kbGVUb3BNb3ZlKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ2VuZCcsICAgIHRoaXMuaGFuZGxlVG9wTW92ZUVuZENhcHR1cmUsIHRydWUpO1xuICAgICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIod2luZG93LCAnY2FuY2VsJywgdGhpcy5oYW5kbGVUb3BNb3ZlQ2FuY2VsQ2FwdHVyZSwgdHJ1ZSk7XG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgdGhpcy5oYW5kbGVTaG93Q29udGV4dE1lbnUpO1xuXG4gICAgICAgIHRoaXMudW5pbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlcigpO1xuICAgIH1cblxuICAgIGFkZEV2ZW50TGlzdGVuZXIgKHN1YmplY3QsIGV2ZW50LCBoYW5kbGVyLCBjYXB0dXJlKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lclR5cGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGV2ZW50TmFtZXNbbGlzdGVuZXJUeXBlXVtldmVudF07XG4gICAgICAgICAgICBpZiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgc3ViamVjdC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIgKHN1YmplY3QsIGV2ZW50LCBoYW5kbGVyLCBjYXB0dXJlKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJUeXBlcy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lclR5cGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGV2ZW50TmFtZXNbbGlzdGVuZXJUeXBlXVtldmVudF07XG4gICAgICAgICAgICBpZiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgICAgc3ViamVjdC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlciwgY2FwdHVyZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbm5lY3REcmFnU291cmNlIChzb3VyY2VJZCwgbm9kZSwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLnNvdXJjZU5vZGVzW3NvdXJjZUlkXSA9IG5vZGU7XG5cbiAgICAgICAgY29uc3QgaGFuZGxlTW92ZVN0YXJ0ID0gdGhpcy5oYW5kbGVNb3ZlU3RhcnQuYmluZCh0aGlzLCBzb3VyY2VJZCk7XG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihub2RlLCAnc3RhcnQnLCBoYW5kbGVNb3ZlU3RhcnQpO1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZUNsaWNrRHJhZ1NvdXJjZSA9IHRoaXMuaGFuZGxlQ2xpY2tEcmFnU291cmNlLmJpbmQodGhpcywgc291cmNlSWQpO1xuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlQ2xpY2tEcmFnU291cmNlLCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc291cmNlTm9kZXNbc291cmNlSWRdO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKG5vZGUsICdzdGFydCcsIGhhbmRsZU1vdmVTdGFydCk7XG4gICAgICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlQ2xpY2tEcmFnU291cmNlLCB0cnVlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25uZWN0RHJhZ1ByZXZpZXcgKHNvdXJjZUlkLCBub2RlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuc291cmNlUHJldmlld05vZGVPcHRpb25zW3NvdXJjZUlkXSA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuc291cmNlUHJldmlld05vZGVzW3NvdXJjZUlkXSA9IG5vZGU7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnNvdXJjZVByZXZpZXdOb2Rlc1tzb3VyY2VJZF07XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5zb3VyY2VQcmV2aWV3Tm9kZU9wdGlvbnNbc291cmNlSWRdO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbm5lY3REcm9wVGFyZ2V0ICh0YXJnZXRJZCwgbm9kZSkge1xuICAgICAgICBjb25zdCBoYW5kbGVNb3ZlID0gKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkcyA9IGdldEV2ZW50Q2xpZW50T2Zmc2V0KGUpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFVzZSB0aGUgY29vcmRpbmF0ZXMgdG8gZ3JhYiB0aGUgZWxlbWVudCB0aGUgZHJhZyBlbmRlZCBvbi5cbiAgICAgICAgICAgICAqIElmIHRoZSBlbGVtZW50IGlzIHRoZSBzYW1lIGFzIHRoZSB0YXJnZXQgbm9kZSAob3IgYW55IG9mIGl0J3MgY2hpbGRyZW4pIHRoZW4gd2UgaGF2ZSBoaXQgYSBkcm9wIHRhcmdldCBhbmQgY2FuIGhhbmRsZSB0aGUgbW92ZS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3QgZHJvcHBlZE9uID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChjb29yZHMueCwgY29vcmRzLnkpO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRNYXRjaCA9IG5vZGUuY29udGFpbnMoZHJvcHBlZE9uKTtcblxuICAgICAgICAgICAgaWYgKGRyb3BwZWRPbiA9PT0gbm9kZSB8fCBjaGlsZE1hdGNoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlTW92ZShlLCB0YXJnZXRJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEF0dGFjaGluZyB0aGUgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGJvZHkgc28gdGhhdCB0b3VjaG1vdmUgd2lsbCB3b3JrIHdoaWxlIGRyYWdnaW5nIG92ZXIgbXVsdGlwbGUgdGFyZ2V0IGVsZW1lbnRzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSwgJ21vdmUnLCBoYW5kbGVNb3ZlKTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSwgJ21vdmUnLCBoYW5kbGVNb3ZlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBoYW5kbGVTaG93Q29udGV4dE1lbnUgKGUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N1cHByZXNzQ29udGV4dE1lbnUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRHJhZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2tEcmFnU291cmNlIChzb3VyY2VJZCwgZSkge1xuICAgICAgICBpZiAodGhpcy5fbGFzdERyb3BFdmVudFRpbWVTdGFtcCAmJiB0aGlzLl9sYXN0RHJvcEV2ZW50VGltZVN0YW1wID09PSBlLnRpbWVTdGFtcCkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFNvdXJjZUNsaWVudE9mZnNldCAoc291cmNlSWQpIHtcbiAgICAgICAgcmV0dXJuIGdldE5vZGVDbGllbnRPZmZzZXQodGhpcy5zb3VyY2VOb2Rlc1tzb3VyY2VJZF0pO1xuICAgIH1cblxuICAgIGhhbmRsZVRvcE1vdmVTdGFydENhcHR1cmUgKGUpIHtcbiAgICAgICAgdGhpcy5tb3ZlU3RhcnRTb3VyY2VJZHMgPSBbXTtcbiAgICB9XG5cbiAgICBoYW5kbGVNb3ZlU3RhcnQgKHNvdXJjZUlkLCBldmVudCkge1xuICAgICAgICAvLyBQcmV2ZW50IHRleHQgc2VsZWN0aW9uIHdoZW4gZHJhZ2luZyBhbiBlbGVtZW50LlxuICAgICAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuZGVmYXVsdFByZXZlbnRlZFRvQXZvaWRUZXh0U2VsZWN0aW9uID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubW92ZVN0YXJ0U291cmNlSWRzLnVuc2hpZnQoc291cmNlSWQpO1xuICAgIH1cblxuICAgIGdldFRvcE1vdmVTdGFydEhhbmRsZXIgKCkge1xuICAgICAgICBpZiAoIXRoaXMuZGVsYXlUb3VjaFN0YXJ0ICYmICF0aGlzLmRlbGF5TW91c2VTdGFydCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlVG9wTW92ZVN0YXJ0RGVsYXk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZVN0YXJ0IChlKSB7XG4gICAgICAgIC8vIEFsbG93IG90aGVyIHN5c3RlbXMgdG8gcHJldmVudCBkcmFnZ2luZ1xuICAgICAgICBpZiAoZS5kZWZhdWx0UHJldmVudGVkICYmICFlLmRlZmF1bHRQcmV2ZW50ZWRUb0F2b2lkVGV4dFNlbGVjdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRG9uJ3QgcHJlbWF0dXJlbHkgcHJldmVudERlZmF1bHQoKSBoZXJlIHNpbmNlIGl0IG1pZ2h0OlxuICAgICAgICAvLyAxLiBNZXNzIHVwIHNjcm9sbGluZ1xuICAgICAgICAvLyAyLiBNZXNzIHVwIGxvbmcgdGFwICh3aGljaCBicmluZ3MgdXAgY29udGV4dCBtZW51KVxuICAgICAgICAvLyAzLiBJZiB0aGVyZSdzIGFuIGFuY2hvciBsaW5rIGFzIGEgY2hpbGQsIHRhcCB3b24ndCBiZSB0cmlnZ2VyZWQgb24gbGlua1xuXG4gICAgICAgIGNvbnN0IGNsaWVudE9mZnNldCA9IGdldEV2ZW50Q2xpZW50T2Zmc2V0KGUpO1xuICAgICAgICBpZiAoY2xpZW50T2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldCA9IGNsaWVudE9mZnNldDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhbmRsZVRvcE1vdmVTdGFydERlbGF5IChlKSB7XG4gICAgICAgIGNvbnN0IGRlbGF5ID0gKGUudHlwZSA9PT0gZXZlbnROYW1lcy50b3VjaC5zdGFydClcbiAgICAgICAgICAgID8gdGhpcy5kZWxheVRvdWNoU3RhcnRcbiAgICAgICAgICAgIDogdGhpcy5kZWxheU1vdXNlU3RhcnQ7XG5cbiAgICAgICAgaWYgKGRlbGF5KSB7XG4gICAgICAgICAgICB0aGlzLl9zdXBwcmVzc0NvbnRleHRNZW51ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLmhhbmRsZVRvcE1vdmVTdGFydC5iaW5kKHRoaXMsIGUpLCBkZWxheSk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZUNhcHR1cmUgKGUpIHtcbiAgICAgICAgdGhpcy5kcmFnT3ZlclRhcmdldElkcyA9IFtdO1xuICAgIH1cblxuICAgIGhhbmRsZU1vdmUoIGUsIHRhcmdldElkICkge1xuICAgICAgICB0aGlzLmRyYWdPdmVyVGFyZ2V0SWRzLnVuc2hpZnQoIHRhcmdldElkICk7XG4gICAgfVxuXG4gICAgaGFuZGxlVG9wTW92ZSAoZSkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0KTtcblxuICAgICAgICBjb25zdCB7IG1vdmVTdGFydFNvdXJjZUlkcywgZHJhZ092ZXJUYXJnZXRJZHMgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGNsaWVudE9mZnNldCA9IGdldEV2ZW50Q2xpZW50T2Zmc2V0KGUpO1xuXG4gICAgICAgIGlmICghY2xpZW50T2Zmc2V0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbGxvdyBkcmFnIHRvIGJlIHByZS1lbXB0ZWRcbiAgICAgICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCAmJiAhZS5kZWZhdWx0UHJldmVudGVkVG9Bdm9pZFRleHRTZWxlY3Rpb24gJiYgIXRoaXMubW9uaXRvci5pc0RyYWdnaW5nKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsRHJhZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHJhZ1N0YXJ0TWluT2Zmc2V0Q2hhbmdlID0gKGUudHlwZSA9PT0gZXZlbnROYW1lcy50b3VjaC5tb3ZlKVxuICAgICAgICAgICAgPyB0aGlzLm1pbk1vdmVUb3VjaFN0YXJ0XG4gICAgICAgICAgICA6IHRoaXMubWluTW92ZU1vdXNlU3RhcnQ7XG5cbiAgICAgICAgLy8gSWYgd2UncmUgbm90IGRyYWdnaW5nIGFuZCB3ZSd2ZSBtb3ZlZCBhIGxpdHRsZSwgdGhhdCBjb3VudHMgYXMgYSBkcmFnIHN0YXJ0XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF0aGlzLm1vbml0b3IuaXNEcmFnZ2luZygpICYmXG4gICAgICAgICAgICB0aGlzLl9tb3VzZUNsaWVudE9mZnNldC5oYXNPd25Qcm9wZXJ0eSgneCcpICYmXG4gICAgICAgICAgICBtb3ZlU3RhcnRTb3VyY2VJZHMgJiZcbiAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICBNYXRoLmFicyh0aGlzLl9tb3VzZUNsaWVudE9mZnNldC54IC0gY2xpZW50T2Zmc2V0LngpID49IGRyYWdTdGFydE1pbk9mZnNldENoYW5nZSB8fFxuICAgICAgICAgICAgICAgIE1hdGguYWJzKHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0LnkgLSBjbGllbnRPZmZzZXQueSkgPj0gZHJhZ1N0YXJ0TWluT2Zmc2V0Q2hhbmdlXG4gICAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlU3RhcnRTb3VyY2VJZHMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5hY3Rpb25zLmJlZ2luRHJhZyhtb3ZlU3RhcnRTb3VyY2VJZHMsIHtcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQ6IHRoaXMuX21vdXNlQ2xpZW50T2Zmc2V0LFxuICAgICAgICAgICAgICAgIGdldFNvdXJjZUNsaWVudE9mZnNldDogdGhpcy5nZXRTb3VyY2VDbGllbnRPZmZzZXQsXG4gICAgICAgICAgICAgICAgcHVibGlzaFNvdXJjZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLm1vbml0b3IuaXNEcmFnZ2luZygpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzb3VyY2VOb2RlID0gdGhpcy5zb3VyY2VOb2Rlc1t0aGlzLm1vbml0b3IuZ2V0U291cmNlSWQoKV07XG4gICAgICAgIHRoaXMuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoc291cmNlTm9kZSk7XG4gICAgICAgIHRoaXMuYWN0aW9ucy5wdWJsaXNoRHJhZ1NvdXJjZSgpO1xuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAvKlxuICAgICAgICBjb25zdCBtYXRjaGluZ1RhcmdldElkcyA9IE9iamVjdC5rZXlzKHRoaXMudGFyZ2V0Tm9kZXMpXG4gICAgICAgICAgICAuZmlsdGVyKCh0YXJnZXRJZCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMudGFyZ2V0Tm9kZXNbdGFyZ2V0SWRdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjbGllbnRPZmZzZXQueCA+PSBib3VuZGluZ1JlY3QubGVmdCAmJlxuICAgICAgICAgICAgICAgIGNsaWVudE9mZnNldC54IDw9IGJvdW5kaW5nUmVjdC5yaWdodCAmJlxuICAgICAgICAgICAgICAgIGNsaWVudE9mZnNldC55ID49IGJvdW5kaW5nUmVjdC50b3AgJiZcbiAgICAgICAgICAgICAgICBjbGllbnRPZmZzZXQueSA8PSBib3VuZGluZ1JlY3QuYm90dG9tO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICovXG5cbiAgICAgICAgdGhpcy5hY3Rpb25zLmhvdmVyKGRyYWdPdmVyVGFyZ2V0SWRzLCB7XG4gICAgICAgICAgICBjbGllbnRPZmZzZXQ6IGNsaWVudE9mZnNldFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlRW5kQ2FwdHVyZSAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbmREcmFnKGV2ZW50KTtcbiAgICB9XG5cbiAgICBoYW5kbGVUb3BNb3ZlQ2FuY2VsQ2FwdHVyZSAoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxEcmFnKGV2ZW50KTtcbiAgICB9XG5cbiAgICBjYW5jZWxEcmFnIChldmVudCkge1xuICAgICAgICB0aGlzLmVuZERyYWcoZXZlbnQsIHsgY2FuY2VsbGVkOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIGVuZERyYWcgKGV2ZW50LCB7IGNhbmNlbGxlZCB9ID0ge30pIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG5cbiAgICAgICAgdGhpcy5fbW91c2VDbGllbnRPZmZzZXQgPSB7fTtcbiAgICAgICAgdGhpcy5fc3VwcHJlc3NDb250ZXh0TWVudSA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghdGhpcy5tb25pdG9yLmlzRHJhZ2dpbmcoKSB8fCB0aGlzLm1vbml0b3IuZGlkRHJvcCgpKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmVTdGFydFNvdXJjZUlkcyA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoKTtcblxuICAgICAgICBpZiAoIWNhbmNlbGxlZCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdERyb3BFdmVudFRpbWVTdGFtcCA9IGV2ZW50LnRpbWVTdGFtcDtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmFjdGlvbnMuZHJvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY3Rpb25zLmVuZERyYWcoKTtcbiAgICB9XG5cbiAgICBpbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciAobm9kZSkge1xuICAgICAgICB0aGlzLnVuaW5zdGFsbFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIoKTtcblxuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciA9IG5ldyB3aW5kb3cuTXV0YXRpb25PYnNlcnZlcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIW5vZGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVzdXJyZWN0U291cmNlTm9kZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMudW5pbnN0YWxsU291cmNlTm9kZVJlbW92YWxPYnNlcnZlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIW5vZGUgfHwgIW5vZGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlci5vYnNlcnZlKFxuICAgICAgICAgICAgbm9kZS5wYXJlbnRFbGVtZW50LFxuICAgICAgICAgICAgeyBjaGlsZExpc3Q6IHRydWUgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlc3VycmVjdFNvdXJjZU5vZGUgKCkge1xuICAgICAgICB0aGlzLmRyYWdnZWRTb3VyY2VOb2RlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGUucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXJlYWN0aWQnKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRyYWdnZWRTb3VyY2VOb2RlKTtcbiAgICB9XG5cbiAgICB1bmluc3RhbGxTb3VyY2VOb2RlUmVtb3ZhbE9ic2VydmVyICgpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGVSZW1vdmFsT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2VkU291cmNlTm9kZVJlbW92YWxPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIHRoaXMuZHJhZ2dlZFNvdXJjZU5vZGUgPSBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlVG91Y2hCYWNrZW5kIChvcHRpb25zT3JNYW5hZ2VyID0ge30pIHtcbiAgICBjb25zdCB0b3VjaEJhY2tlbmRGYWN0b3J5ID0gZnVuY3Rpb24gKG1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUb3VjaEJhY2tlbmQobWFuYWdlciwgb3B0aW9uc09yTWFuYWdlcik7XG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zT3JNYW5hZ2VyLmdldE1vbml0b3IpIHtcbiAgICAgICAgcmV0dXJuIHRvdWNoQmFja2VuZEZhY3Rvcnkob3B0aW9uc09yTWFuYWdlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRvdWNoQmFja2VuZEZhY3Rvcnk7XG4gICAgfVxufVxuIl19
