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

import './ext/jquery/hue.jquery.lib'
import './ext/bootstrap.2.3.2.min'
import _ from 'lodash'
import filesize from 'filesize'
import qq from './ext/fileuploader.custom'
import page from 'page'
import localforage from 'localforage'

import ko from 'knockout'
import komapping from 'knockout.mapping'
import 'ext/ko.editable.custom'
import 'ext/ko.selectize.custom'
import 'knockout-switch-case'
import 'knockout-sortable'
import 'knockout.validation'

import apiHelper from 'api/apiHelper';
import CancellablePromise from 'api/cancellablePromise'
import contextCatalog from 'catalog/contextCatalog'
import dataCatalog from 'catalog/dataCatalog'
import hueAnalytics from 'utils/hueAnalytics'
import hueDebug from 'utils/hueDebug'
import hueDrop from 'utils/hueDrop'
import huePubSub from 'utils/huePubSub'
import hueUtils from 'utils/hueUtils'

// TODO: Migrate away
window._ = _;
window.apiHelper = apiHelper;
window.CancellablePromise = CancellablePromise;
window.contextCatalog = contextCatalog;
window.dataCatalog = dataCatalog;
window.filesize = filesize;
window.hueUtils = hueUtils;
window.hueAnalytics = hueAnalytics;
window.hueDebug = hueDebug;
window.huePubSub = huePubSub;
window.hueDrop = hueDrop;
window.ko = ko;
window.ko.mapping = komapping;
window.localforage = localforage;
window.page = page;
window.qq = qq;