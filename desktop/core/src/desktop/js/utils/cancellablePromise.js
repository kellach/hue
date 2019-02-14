// Licensed to Cloudera, Inc. under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  Cloudera, Inc. licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import apiHelper from './apiHelper'

class CancellablePromise {

  constructor (deferred, request, otherCancellables) {
    var self = this;
    self.cancelCallbacks = [];
    self.deferred = deferred;
    self.request = request;
    self.otherCancellables = otherCancellables;
    self.cancelled = false;
    self.cancelPrevented = false;
  }

  /**
   * A promise might be shared across multiple components in the UI, in some cases cancel is not an option and calling
   * this will prevent that to happen.
   *
   * One example is autocompletion of databases while the assist is loading the database tree, closing the autocomplete
   * results would make the assist loading fail if cancel hasn't been prevented.
   *
   * @returns {CancellablePromise}
   */
  preventCancel() {
    var self = this;
    self.cancelPrevented = true;
    return self;
  };

  cancel() {
    var self = this;
    if (self.cancelPrevented || self.cancelled || self.state() !== 'pending') {
      return;
    }
    self.cancelled = true;
    if (self.request) {
      apiHelper.cancelActiveRequest(self.request);
    }

    if (self.state && self.state() === 'pending' && self.deferred.reject) {
      self.deferred.reject();
    }

    if (self.otherCancellables) {
      self.otherCancellables.forEach(function (cancellable) { if (cancellable.cancel) { cancellable.cancel() } });
    }

    while (self.cancelCallbacks.length) {
      self.cancelCallbacks.pop()();
    }
    return self;
  };

  onCancel(callback) {
    var self = this;
    if (self.cancelled) {
      callback();
    } else {
      self.cancelCallbacks.push(callback);
    }
    return self;
  };

  then() {
    var self = this;
    self.deferred.then.apply(self.deferred, arguments);
    return self;
  };

  done(callback) {
    var self = this;
    self.deferred.done.apply(self.deferred, arguments);
    return self;
  };

  fail(callback) {
    var self = this;
    self.deferred.fail.apply(self.deferred, arguments);
    return self;
  };

  always(callback) {
    var self = this;
    self.deferred.always.apply(self.deferred, arguments);
    return self;
  };

  pipe(callback) {
    var self = this;
    self.deferred.pipe.apply(self.deferred, arguments);
    return self;
  };

  progress(callback) {
    var self = this;
    self.deferred.progress.apply(self.deferred, arguments);
    return self;
  };

  state() {
    var self = this;
    return self.deferred.state && self.deferred.state();
  };
}

export default CancellablePromise;

