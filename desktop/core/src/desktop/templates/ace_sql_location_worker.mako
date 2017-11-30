## Licensed to Cloudera, Inc. under one
## or more contributor license agreements.  See the NOTICE file
## distributed with this work for additional information
## regarding copyright ownership.  Cloudera, Inc. licenses this file
## to you under the Apache License, Version 2.0 (the
## "License"); you may not use this file except in compliance
## with the License.  You may obtain a copy of the License at
##
##     http://www.apache.org/licenses/LICENSE-2.0
##
## Unless required by applicable law or agreed to in writing, software
## distributed under the License is distributed on an "AS IS" BASIS,
## WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
## See the License for the specific language governing permissions and
## limitations under the License.

<%!
  from desktop import conf
%>

% if conf.DEV.get():
importScripts('${ static('desktop/js/autocomplete/sqlParseSupport.js') }' + '?' + Math.random());
importScripts('${ static('desktop/js/autocomplete/sqlAutocompleteParser.js') }' + '?' + Math.random());
importScripts('${ static('desktop/js/sqlFunctions.js') }' + '?' + Math.random());
% else:
importScripts('${ static('desktop/js/autocomplete/sqlParseSupport.js') }');
importScripts('${ static('desktop/js/autocomplete/sqlAutocompleteParser.js') }');
importScripts('${ static('desktop/js/sqlFunctions.js') }');
% endif

(function () {

  this.throttle = -1;

  this.handleStatement = function (statement, locations, type, active) {
    // Statement locations come in the message to the worker and are generally more accurate
    locations.push(statement);
    try {
      var sqlParseResult = sqlAutocompleteParser.parseSql(statement.statement + ' ', '', type, false);
      if (sqlParseResult.locations) {
        sqlParseResult.locations.forEach(function (location) {
          location.active = active;
          // Skip statement locations from the sql parser
          if (location.type !== 'statement') {
            if (location.location.first_line === 1) {
              location.location.first_column += statement.location.first_column;
              location.location.last_column += statement.location.first_column;
            }
            location.location.first_line += statement.location.first_line - 1;
            location.location.last_line += statement.location.first_line - 1;
            locations.push(location);
          }
        })
      }
    } catch (error) {}
  };

  this.onmessage = function (msg) {
    if (msg.data.ping) {
      postMessage({ ping: true });
      return;
    }
    clearTimeout(this.throttle);
    this.throttle = setTimeout(function () {
      if (msg.data.statementDetails) {
        var locations = [];
        var activeStatementLocations = [];
        msg.data.statementDetails.precedingStatements.forEach(function (statement) {
          this.handleStatement(statement, locations, msg.data.type, false);
        });
        if (msg.data.statementDetails.activeStatement) {
          this.handleStatement(msg.data.statementDetails.activeStatement, activeStatementLocations, msg.data.type, true);
          locations = locations.concat(activeStatementLocations);
        }
        msg.data.statementDetails.followingStatements.forEach(function (statement) {
          this.handleStatement(statement, locations, msg.data.type, false);
        });

        postMessage({
          id: msg.data.id,
          editorChangeTime: msg.data.statementDetails.editorChangeTime,
          locations: locations,
          activeStatementLocations: activeStatementLocations,
          totalStatementCount: msg.data.statementDetails.totalStatementCount,
          activeStatementIndex: msg.data.statementDetails.activeStatementIndex
        });
      }
    }, 400);
  }
})();