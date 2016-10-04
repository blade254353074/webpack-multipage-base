//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
//
//     Some code (c) 2005, 2013 jQuery Foundation, Inc. and other contributors

;(function ($) {
  var slice = Array.prototype.slice

  function Deferred (func) {
    let state = 'pending'
    let deferred = {}
    const tuples = [
      // action, add listener, listener list, final state
      [ 'resolve', 'done', $.Callbacks({once: 1, memory: 1}), 'resolved' ],
      [ 'reject', 'fail', $.Callbacks({once: 1, memory: 1}), 'rejected' ],
      [ 'notify', 'progress', $.Callbacks({memory: 1}) ]
    ]
    const promise = {
      state: function () {
        return state
      },
      always: function () {
        deferred.done(arguments).fail(arguments)
        return this
      },
      then: function (/* fnDone [, fnFailed [, fnProgress]] */) {
        var fns = arguments
        return Deferred(function (defer) {
          $.each(tuples, function (i, tuple) {
            var fn = $.isFunction(fns[i]) && fns[i]
            deferred[tuple[1]](function () {
              var returned = fn && fn.apply(this, arguments)
              if (returned && $.isFunction(returned.promise)) {
                returned.promise()
                  .done(defer.resolve)
                  .fail(defer.reject)
                  .progress(defer.notify)
              } else {
                const context = this === promise ? defer.promise() : this
                const values = fn ? [returned] : arguments
                defer[tuple[0] + 'With'](context, values)
              }
            })
          })
          fns = null
        }).promise()
      },
      promise: function (obj) {
        return obj != null ? $.extend(obj, promise) : promise
      }
    }

    $.each(tuples, function (i, tuple) {
      let list = tuple[2]
      let stateString = tuple[3]

      promise[tuple[1]] = list.add

      if (stateString) {
        list.add(function () {
          state = stateString
        }, tuples[i ^ 1][2].disable, tuples[2][2].lock)
      }

      deferred[tuple[0]] = function () {
        deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments)
        return this
      }
      deferred[tuple[0] + 'With'] = list.fireWith
    })

    promise.promise(deferred)
    if (func) func.call(deferred, deferred)
    return deferred
  }

  $.when = function (sub) {
    let resolveValues = slice.call(arguments)
    let len = resolveValues.length
    let i = 0
    let remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0
    let deferred = remain === 1 ? sub : Deferred()
    let progressValues, progressContexts, resolveContexts
    let updateFn = function (i, ctx, val) {
      return function (value) {
        ctx[i] = this
        val[i] = arguments.length > 1 ? slice.call(arguments) : value
        if (val === progressValues) {
          deferred.notifyWith(ctx, val)
        } else if (!(--remain)) {
          deferred.resolveWith(ctx, val)
        }
      }
    }

    if (len > 1) {
      progressValues = new Array(len)
      progressContexts = new Array(len)
      resolveContexts = new Array(len)
      for (; i < len; ++i) {
        if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
          resolveValues[i].promise()
            .done(updateFn(i, resolveContexts, resolveValues))
            .fail(deferred.reject)
            .progress(updateFn(i, progressContexts, progressValues))
        } else {
          --remain
        }
      }
    }
    if (!remain) deferred.resolveWith(resolveContexts, resolveValues)
    return deferred.promise()
  }

  $.Deferred = Deferred
})(Zepto)
