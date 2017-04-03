﻿;
if (!window.JSON) {
    window.JSON = {
        // implement JSON.stringify
        stringify: function (obj) {
            var t = typeof (obj);
            if (t != "object" || obj === null) {
                // simple data type
                if (t == "string") obj = '"' + obj + '"';
                return String(obj);
            }
            else {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);
                for (n in obj) {
                    v = obj[n]; t = typeof (v);
                    if (t == "string") v = '"' + v + '"';
                    else if (t == "object" && v !== null) v = JSON.stringify(v);
                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
        },


        //implement JSON.parse de-serialization
        parse: function (str) {
            if (str === "") str = '""';
            eval("var p=" + str + ";");
            return p;
        }
    }
}

﻿
//checking jQuery and jQuery UI existence
(function () {
    var minVersionJQ = 10700; //1.7
    var minVersionUI = 10900; //1.9.0

    var result;

    //Checking for jQuery Core

    var result = (typeof(jQuery) !== "undefined");
    if (result) {
        var verArr = jQuery.fn.jquery.split('.');
        var verInt = (10000 * parseInt(verArr[0])) + (100 * parseInt(verArr[1])) + parseInt(verArr[2] || 0);

        result = verInt >= minVersionJQ;
    }

    if (!result) {
        alert('jQuery is not loaded or has wrong version.');
        return false;
    }

    //jQuery UI
    result = (jQuery.ui && jQuery.ui.version) ? true : false;
    if (result) {
        var verArr = jQuery.ui.version.split('.');
        var verInt = (10000 * parseInt(verArr[0])) + (100 * parseInt(verArr[1])) + parseInt(verArr[2] || 0);

        result = verInt >= minVersionUI;
    }

    if (!result) {
        alert('jQuery.UI is not loaded or has wrong version.');
        return false;
    }

    return true;
})();


(function ($, window) {

    //Ensure that global variables exist
    var EQ = window.EQ = window.EQ || {};

    var defaultTexts = {
        Locale: "en",
        AltMenuAttribute: "Attribute",
        AltMenuConstantExpression: "Constant expression",
        ButtonApply: "Apply",
        ButtonCancel: "Cancel",
        ButtonOK: "OK",
        ButtonClear: "Clear",
        ButtonEnable: "Toggle enable",
        ButtonParameterization: "Toggle parameterization",
        ButtonDelete: "Delete",
        ButtonAddCondition: "Add condition",
        ButtonAddPredicate: "Add group of conditions",
        ButtonSelectAll: "Select all",
        ButtonDeselectAll: "Clear selection",
        ButtonAddColumns: "Add column(s)",
        ButtonAddConditions: "Add condition(s)",

        CmdAddConditionAfter: "Add a new condition after the current row",
        CmdAddConditionInto: "Add a new condition",
        CmdAddPredicateAfter: "Open a bracket after the current row",
        CmdAddPredicateInto: "Open a bracket",
        CmdClickToAddCondition: "[Add new condition]",
        CmdDeleteRow: "Delete this row",
        ErrIncorrectPredicateTitleFormat: "Incorrect predicate title format",
        ErrNotNumber: " is not a number",
        ErrIncorrectInteger: "Incorrect integer value",
        ErrIncorrectNumberList: "Incorrect list format",
        False: "False",
        LinkTypeAll: "all",
        LinkTypeAny: "any",
        LinkTypeNone: "none",
        LinkTypeNotAll: "not all",
        ConjAll: "and",
        ConjAny: "or",
        ConjNotAll: "and",
        ConjNone: "or",
        MsgApplySelection: "[Apply selection]",
        MsgAs: "as",
        MsgEmptyList: "(empty list)",
        MsgEmptyListValue: "[select value]",
        MsgEmptyScalarValue: "[enter value]",
        MsgSubQueryValue: "[edit sub-query]",
        MsgEmptyAttrValue: "[select attribute]",
        MsgEmptyCustomSql: "[enter SQL expression]",
        MsgOf: "of",
        PredicateTitle: "{lt} of the following apply",
        RootPredicateTitle: "Select records where {lt} of the following apply",
        StrAddConditions: "Add conditions",
        SubQueryDialogTitle: "Edit sub-query",
        SubQueryColumnTitle: "Column:",
        SubQueryEmptyColumn: "[select column]",
        SubQueryQueryPanelCaption: "Conditions",
        True: "True",

        ButtonSorting: "Sorting",
        ButtonToAggr: "Change to aggregate column",
        ButtonToSimple: "Change to simple column",
        CmdAscending: "Ascending",
        CmdClickToAddColumn: "[Add new column]",
        CmdDeleteColumn: "Delete column",
        CmdDeleteSorting: "Delete sorting",
        CmdDescending: "Descending",
        CmdGroupSort: "Sorting",
        CmdNotSorted: "Not sorted",
        ColTypeAggrFunc: "Aggregate function",
        ColTypeCompound: "Calculated",
        ColTypeGroup: "Column type",
        ColTypeSimple: "Simple column",
        HeaderExpression: "Expression",
        HeaderSorting: "Sorting",
        HeaderTitle: "Title",
        SortHeaderColumn: "Column",
        SortHeaderSorting: "Sorting",
        StrAddColumns: "Add columns",
        CustomExpression: "Custom Expression",
        
        CmdMoveToStart: "Move to start",
        CmdMoveRight: "Move right",
        CmdMoveLeft: "Move left",
        CmdMoveToEnd: "Move to the end",
        ButtonMenu: "Show menu",
        CmdToSimple: "Not aggregated",

        CmdMoveToFirst: "Move to the first",
        CmdMoveToPrev: "Move to the previous",
        CmdMoveToNext: "Move to the next",
        CmdMoveToLast: "Move to the last",

        //FilterBar
        StrNoFilterDefined: "No filter defined",
        StrNoFilterClickToAdd: "No filter defined. Click to add a new condition",

        //DateTime macroses
        Today: "Today",
        Yesterday: "Yesterday",
        Tomorrow: "Tomorrow",
        FirstDayOfMonth: "First day of the month",
        LastDayOfMonth: "Last day of the month",
        FirstDayOfWeek: "First day of the week",
        FirstDayOfYear: "First day of the year",
        FirstDayOfNextWeek: "First day of the next week",
        FirstDayOfNextMonth: "First day of the next month",
        FirstDayOfNextYear: "First day of the next week",
        Now: "Now",
        HourStart: "This hour start",
        Midnight: "Midnight",
        Noon: "Noon"
    };

    /// <namespace name="EQ.core" version="1.0.0">
    /// <summary>
    /// Contains different classes and functions for managing core EasyQuery objects: data model, query, entities, attributes, operators, etc.
    /// </summary>
    /// </namespace>

    EQ.core = {

        /// <var name="texts" type="Object" default="{Entities: {}, Attributes: {}, Operators: {}}">
        /// <summary>
        /// Contains the text strings that are used in the UI divided by 3 lists. By default the internal (English) list of strings is used.
        /// </summary>
        /// <notes>These lists are usually used to localize the UI.</notes>
        /// </var>
        texts: {
            Entities: {},
            Attributes: {},
            Operators: {}
        },

        /// <var name="constLists" type="Object">
        /// <summary>
        /// Contains the constants used to work with date/time and boolean values.
        /// </summary>
        /// </var>
        constLists: {
            SpecDateValues: [
                    { id: '${Today}', key: 'Today', isDefault: true },
                    { id: '${Yesterday}', key: 'Yesterday' },
                    { id: '${Tomorrow}', key: 'Tomorrow' },
                    { id: '${FirstDayOfMonth}', key: 'FirstDayOfMonth' },
                    { id: '${FirstDayOfYear}', key: 'FirstDayOfYear' }
            ],

            SpecTimeValues: [
                    { id: '${Now}', key: 'Now', isDefault: true },
                    { id: '${HourStart}', key: 'HourStart' },
                    { id: '${Midnight}', key: 'Midnight' },
                    { id: '${Noon}', key: 'Noon' }
            ],

            BooleanValues: [
                    { id: '${false}', key: 'False' },
                    { id: '${true}', key: 'True', isDefault: true }
            ]
        },

        predicateLinkTypeList: [
                { id: 'All', key: 'LinkTypeAll' },
                { id: 'Any', key: 'LinkTypeAny' },
                { id: 'None', key: 'LinkTypeNone' },
                { id: 'NotAll', key: 'LinkTypeNotAll' }
        ],

        _numericTypes: ["Byte", "Word", "Int", "Int32", "Int64", "Float", "Currency"],

        _intTypes: ["Byte", "Word", "Int", "Int32", "Int64"],

        /*
        AggrFunctions: [
        { id: 'SUM' },
        { id: 'COUNT' },
        { id: 'COUNT DISTINCT' },
        { id: 'AVG' },
        { id: 'MIN' },
        { id: 'MAX' }
        ],
        */

        /// <function version="1.0.0">
        /// <summary>Returns localized text by the key defined in parameters</summary>
        /// <returns type="String">  
        /// Text of the resource defined by key
        /// </returns>
        /// <param name="key" type="String">
        /// The key of the resource string.
        /// </param>
        /// <example>
        /// Here we get the text of the resource string assigned to CmdClickToAddCondition key
        /// <code>
        /// var text = EQ.core.getText("CmdClickToAddCondition")
        /// </code>
        /// </example>
        /// </function>
        getText: function () {
            var textsObj = EQ.core.texts;
            var resText = "";
            if (arguments) {
                var bStop = false;
                var argLength = arguments.length;
                var i;
                for (i = 0; i < argLength; i++) {
                    resText = textsObj[arguments[i]];
                    if (!resText) {
                        bStop = true;
                        break;
                    }
                    else {
                        textsObj = resText;
                    }
                }

                if (bStop) {
                    textsObj = defaultTexts;
                    for (i = 0; i < argLength; i++) {
                        resText = textsObj[arguments[i]];
                        if (!resText) {
                            break;
                        }
                        else {
                            textsObj = resText;
                        }
                    }
                }
            }

            return resText;
        },

        getShiftToFitWindow: function (absLeft, width) {
            var winWidth = $(window).width();
            var absRight = absLeft + width;
            //console.log("left: " + absLeft + "; right: " + absRight + "; winWidth: " + winWidth);

            var shift = 0;
            if (absRight > winWidth) {
                shift = winWidth - absRight - 10;
                if (absLeft + shift < 0) {
                    shift = 10 - absLeft;
                }
            }

            return shift;
        },

        isObject: function(val) {
            if (val === null) { return false;}
            return ( (typeof val === 'function') || (typeof val === 'object') );
        },


        isNumericType: function (typeName) {
            var idx = $.inArray(typeName, this._numericTypes);

            return (idx >= 0);
        },

        isIntType: function (typeName) {
            var idx = $.inArray(typeName, this._intTypes);

            return (idx >= 0);
        },

        isNumeric: function (val) {
            return $.isNumeric(val);
        },

        areCompatibleDataTypes: function (type1, type2) {
            return !type1 || !type2 ||  (type1 == type2) || (type1 == "Date" && type2 == "DateTime") || (type1 == "DateTime" && type2 == "Date");
        },

        combinePath: function(path1, path2) {
            var result = path1;
            if (result != null && result.length > 0) {
                
                if (result.charAt(result.length-1) != '/')
                    result += "/";
                result += path2;
            }
            else 
                result = path2;

            return result;
        },

        moveArrayItem: function(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length;
                while ((k--) + 1) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        },


        //Deprecated. Left for backward compatibility
        queryChanged: function (callback, remove) {
            EQ.client.queryChanged(callback, remove);
        },

        getEmptyQueryObject: function () {
            var queryObj = {
                root: {
                    linkType: "All",
                    enabled: true,
                    conditions: []
                },
                columns: [],
                justsorted: []
            };

            return queryObj;
        },

        parseOperatorFormat: function (operator) {
            var format = EQ.core.getText('Operators', operator.id, 'displayFormat');
            if (!format)
                format = operator.displayFormat;

            var result = [];

            var parser = new EQ.core.FormatParser(format);
            //parser.start(format);

            while (parser.next()) {
                if (parser.token === 'operator') {
                    result.push({ type: 'operator', text: parser.tokenText });
                }
                else if (parser.token === 'expression') {
                    result.push({ type: 'expression', index: parser.exprNum - 1 });
                }
                else if (parser.token === 'text') {
                    result.push({ type: 'text', text: parser.tokenText });
                }
            }

            return result;
        },

        isPropSet: function (obj, propName) {
            return obj[propName] || obj[propName.toLowerCase()] || obj[propName.toUpperCase()];
        }

    }


    //-----------------  Format Parser---------------------

    EQ.core.FormatParser = function(s) {
        this.start(s);
    };


    EQ.core.FormatParser.prototype = {
        start: function (s) {
            this.formatStr = s;
            this.pos = 0;
            this.exprNum = 0;
            this.tokenText = '';
        },

        skipSpaces: function () {
            while (this.pos < this.formatStr.length && this.formatStr.charAt(this.pos) === ' ') this.pos++;
        },

        next: function () {
            this.skipSpaces();
            if (this.pos >= this.formatStr.length) return false;

            var npos = 0;
            if (this.formatStr.charAt(this.pos) === '{') {
                npos = this.formatStr.indexOf('}', this.pos);
                if (npos < 0) return false;
                this.tokenText = this.formatStr.substring(this.pos, npos+1);
                if (this.tokenText.indexOf('{expr') === 0) {
                    this.token = 'expression';
                    this.exprNum = parseInt(this.tokenText.substring(5, this.tokenText.length));
                }
                this.pos = npos + 1;
            }
            else if (this.formatStr.charAt(this.pos) === '[' && this.pos < this.formatStr.length-1 && this.formatStr.charAt(this.pos+1) === '[') {
                this.pos += 2;
                npos = this.formatStr.indexOf(']]', this.pos);
                this.token = 'operator';
                this.tokenText = this.formatStr.substring(this.pos, npos);
                this.pos = npos + 2;
            }
            else {
                this.token = 'text';
                var npos1 = this.formatStr.indexOf('{', this.pos);
                if (npos1 < 0) npos1 = this.formatStr.length;
                var npos2 = this.formatStr.indexOf('[[', this.pos);
                if (npos2 < 0) npos2 = this.formatStr.length;
                npos = Math.min(npos1, npos2);
                this.tokenText = $.trim(this.formatStr.substring(this.pos, npos));
                this.pos = npos;
            }
            return true;
        }    
    };

    //-----------------  DataModel ---------------------

    /// <class name="DataModel">
    /// <summary>
    /// Represents a data model.
    /// </summary>
    /// </class>
    EQ.core.DataModel = function (data) {
        if (data) {
            this.setObject(data);
        }
        else {
            this.setObject({
                aggrFunctions: [],
                operators: [],
                rootEntity: {}
            });
        }
    };

    EQ.core.DataModel.prototype = {

        nullAttribute: {
            id: "",
            caption: "{Unrecognized attribute}",
            dataType: "String",
            description: "",
            size: 0,
            operators: [],
            uic: false,
            uir: false,
            uis: false
        },

        nullOperator: {
            id: "",
            caption: "{Unrecognized operator}",
            displayFormat: "{expr1} [[{unrecognized operator}]] {expr2}",
            exprType: "Unknown",
            paramCount: 2,
            valueKind: "Scalar"
        },

        dateMacroList: ["${Today}", "${Yesterday}", "${Tomorrow}", "${FirstDayOfMonth}", "${LastDayOfMonth}", "${FirstDayOfWeek}", "${FirstDayOfYear}", "${FirstDayOfNextWeek}", "${FirstDayOfNextMonth}", "${FirstDayOfNextYear}"],
        timeMacroList: ["${Now}", "${HourStart}", "${Midnight}", "${Noon}"],


        /// <method name="getObject" version="1.0.0">
        /// <summary>
        /// Gets internal model object.
        /// </summary>
        /// </method>
        getObject: function () {
            return this.model;
        },

        /// <method name="setObject" version="1.0.0">
        /// <summary>
        /// Sets internal model object. Accepts model representation in JSON format as well.
        /// </summary>
        /// <param name="data" type="Object | String">
        /// Internal model representation as pure JavaScript object or as JSON string
        /// </param>
        /// </method>
        setObject: function (data) {
            if (data) {
                if (typeof data === 'string') {
                    this.model = JSON.parse(data);
                }
                else {
                    this.model = data;
                }

                //fixing useIn.. properties
                this.runThroughEntities(
                    function (attr) {
                        if (attr.UIC != undefined && attr.uic == undefined)
                            attr.uic = attr.UIC;
                        if (attr.UIR != undefined && attr.uir == undefined)
                            attr.uir = attr.UIR;
                        if (attr.UIS != undefined && attr.uis == undefined)
                            attr.uis = attr.UIS;
                    },
                    function (ent) {
                        if (ent.UIC != undefined && ent.uic == undefined)
                            ent.uic = ent.UIC;
                        if (ent.UIR != undefined && ent.uir == undefined)
                            ent.uir = ent.UIR;
                        if (ent.UIS != undefined && ent.uis == undefined)
                            ent.uis = ent.UIS;
                    }
                );
            }
        },

        /// <method name="isEmpty" version="1.0.0">
        /// <summary>
        /// Returns true if current model is empty (does not contain any entity)
        /// </summary>
        /// </method>
        isEmpty: function () {
            return this.model == null;
        },

        getId: function () {
            return this.model.id;
        },

        getName: function () {
            return this.model.name;
        },

        /// <method name="isEmpty" version="1.0.0">
        /// <summary>
        /// Returns root entity object
        /// </summary>
        /// </method>
        getRootEntity: function () {
            return this.model ? this.model.rootEntity : {};
        },

        /// <method name="getAttributById" version="1.0.0">
        /// <summary>
        /// Gets entity attribute by its ID.
        /// This function runs through all attributes inside specified model (it's root entity and all its sub-entities).
        /// Returns null if attribute is not found.
        /// </summary>
        /// <returns type="Object">
        /// An attribute.
        /// </returns>
        /// <param name="attrId" type="String">
        /// Attribute ID
        /// </param>
        /// </method>
        getAttributeById: function (attrId) {
            var attr = this.getEntityAttrById(this.getRootEntity(), attrId);
            if (!attr) {
                attr = this.nullAttribute;
            }
            return attr;
        },

        checkAttrProperty: function (attrId, propName) {
            var attribute = (typeof attrId === "object") ? attrId : this.getAttributeById(attrId);
            if (attribute) {
                if (attribute[propName]) {
                    return true;
                }
                else if (attribute.lookupAttr) {
                    attrId = attribute.lookupAttr;
                    attribute = this.getAttributeById(attrId);
                    return attribute && attribute[propName];
                }
            }
            else
                return false;

        },

        /// <method name="getEntityAttrById" version="1.0.0">
        /// <summary>
        /// Gets entity attribute by its ID.
        /// This function runs through all attributes inside specified entity and all its sub-entities.
        /// Returns null if attribute is not found.
        /// </summary>
        /// <returns type="Object">
        /// An attribute.
        /// </returns>
        /// <param name="entity" type="Object">
        /// Entity object to search in
        /// </param>
        /// <param name="attrId" type="String">
        /// Attribute ID
        /// </param>
        /// </method>
        getEntityAttrById: function (entity, attrId) {
            var idx;
            if (entity.attributes) {
                var attrCount = entity.attributes.length;
                for (idx = 0; idx < attrCount; idx++) {
                    if (entity.attributes[idx].id == attrId) {
                        return entity.attributes[idx];
                    }
                }
            }

            if (entity.subEntities) {
                var subEntityCount = entity.subEntities.length;
                for (idx = 0; idx < subEntityCount; idx++) {
                    res = this.getEntityAttrById(entity.subEntities[idx], attrId);
                    if (res) return res;
                }
            }


            return null;
        },

        getFullEntityPathByAttr: function (attrId, sep) {
            sep = sep || " ";
            return this.getEntityPathByAttr(this.getRootEntity(), attrId, sep, true);
        },

        getEntityPathByAttr: function (entity, attrId, sep, root) {
            if (!entity) return "";
            sep = sep || " ";

            var entityCaption = "";
            if (entity.caption && !root) {
                var entityText = EQ.core.getText('Entities', entity.caption);
                entityCaption = entityText ? entityText : entity.caption;
            }

            var idx;
            if (entity.attributes) {
                var attrCount = entity.attributes.length;
                for (idx = 0; idx < attrCount; idx++) {
                    if (entity.attributes[idx].id == attrId) {
                        return entityCaption;
                    }
                }
            }

            if (entity.subEntities) {
                var subEntityCount = entity.subEntities.length;
                for (idx = 0; idx < subEntityCount; idx++) {
                    var ent = entity.subEntities[idx];
                    var res = this.getEntityPathByAttr(ent, attrId, sep, false);
                    if (res !== "") {
                        if (entityCaption !== "")
                            res = entityCaption + sep + res;
                        return res;
                    }
                }
            }

            return "";
        },

        getAttributeText: function (attr, format) {

            var attrText = EQ.core.getText('Attributes', attr.id);
            if (!attrText)
                attrText = attr.caption;

            if (!format) return attrText;

            var result = format.replace(new RegExp("{attr}", 'g'), attrText);
            var entityPath = this.getFullEntityPathByAttr(attr.id, ' ');
            result = result.replace(new RegExp("{entity}", 'g'), entityPath);

            return result;

        },


        _listByEntityWithFilter: function (entity, filterCallback) {
            var result = [];

            var caption;

            var ent = null;
            if (entity.subEntities) {
                var subEntityCount = entity.subEntities.length;
                for (var entIdx = 0; entIdx < subEntityCount; entIdx++) {
                    ent = entity.subEntities[entIdx];

                    if (!filterCallback || filterCallback(ent)) {

                        caption = EQ.core.getText('Entities', ent.name);
                        if (!caption)
                            caption = ent.caption;
                        var newEnt = { id: ent.name, text: caption, items: [], isEntity: true };
                        newEnt.items = this._listByEntityWithFilter(ent, filterCallback);
                        if (newEnt.items.length > 0)
                            result.push(newEnt);
                    }
                }
            }


            var attr = null;
            if (entity.attributes) {
                var attrCount = entity.attributes.length;
                for (var attrIdx = 0; attrIdx < attrCount; attrIdx++) {
                    attr = entity.attributes[attrIdx];
                    if (!filterCallback || filterCallback(attr)) {
                        caption = EQ.core.getText('Attributes', attr.id);
                        if (!caption)
                            caption = attr.caption;
                        result.push({ id: attr.id, text: caption, dataType: attr.dataType });
                    }
                }
            }


            return result;
        },

        _listByEntity: function (entity, opts) {
            var opts = opts || {};
            var resultEnt = [];
            var resultAttr = [];

            var caption;

            var ent = null;
            if (entity.subEntities) {
                var subEntityCount = entity.subEntities.length;
                for (var entIdx = 0; entIdx < subEntityCount; entIdx++) {
                    ent = entity.subEntities[entIdx];

                    if (opts.addUIC !== false && ent.uic !== false ||
                        opts.addUIR !== false && ent.uir !== false ||
                        opts.addUIS !== false && ent.uis !== false) {

                        caption = EQ.core.getText('Entities', ent.name);
                        if (!caption)
                            caption = ent.caption;
                        var newEnt = { id: ent.name, text: caption, items: [], isEntity: true, description: ent.description };
                        var newOpts = $.extend({}, opts);
                        newOpts.includeRootData = false;
                        newEnt.items = this._listByEntity(ent, newOpts);
                        resultEnt.push(newEnt);
                    }
                }
            }


            var attr = null;
            if (entity.attributes) {
                var attrCount = entity.attributes.length;
                for (var attrIdx = 0; attrIdx < attrCount; attrIdx++) {
                    attr = entity.attributes[attrIdx];
                    if (opts.addUIC !== false && attr.uic !== false ||
                        opts.addUIR !== false && attr.uir !== false ||
                        opts.addUIS !== false && attr.uis !== false) {

                        caption = EQ.core.getText('Attributes', attr.id);
                        if (!caption)
                            caption = attr.caption;
                        resultAttr.push({ id: attr.id, text: caption, dataType: attr.dataType, lookupAttr: attr.lookupAttr, description: attr.description });
                    }
                }
            }

            function sortCheck(a, b) {
                if (a.text.toLowerCase() == b.text.toLowerCase()) { return 0; }
                if (a.text.toLowerCase() > b.text.toLowerCase()) {
                    return 1;
                }
                return -1;
            }

            if (opts.sortEntities) {
                resultEnt.sort(sortCheck);
                resultAttr.sort(sortCheck);
            }

            var result;
            if (!opts.attrPlacement || opts.attrPlacement == 0) {
                result = resultEnt.concat(resultAttr);
            }
            else {
                result = resultAttr.concat(resultEnt);
            }

            if (opts.attrPlacement == 2) {
                result.sort(sortCheck);
            }

            if (opts.includeRootData) {
                caption = EQ.core.getText('Entities', entity.name);
                if (!caption)
                    caption = entity.caption;

                return { id: entity.name, text: caption, items: result };
            }
            else {
                return result;
            }
        },

        getEntitiesTree: function (opts) {
            return this._listByEntity(this.getRootEntity(), opts);
        },

        getEntitiesTreeWithFilter: function (filterCallback) {
            return this._listByEntityWithFilter(this.getRootEntity(), filterCallback);
        },

        _findItemById: function (array, id) {
            var arrLength = array.length;
            for (var idx = 0; idx < arrLength; idx++) {
                if (array[idx].id === id)
                    return array[idx];
            }

            return null;
        },

        getFirstUICAttr: function () {
            return this.getFirstUICAttrInEntity(this.getRootEntity());
        },

        /// <method name="getFirstUICAttrInEntity" version="1.0.0">
        /// <summary>
        /// Gets first "UIC" attribute in specified entity
        /// (UIC stands for "use in conditions" - so such attribute can be used in conditions) 
        /// Returns null if attribute is not found.
        /// </summary>
        /// <returns type="Object">
        /// An attribute.
        /// </returns>
        /// <param name="entity" type="Object">
        /// Entity object to search our attribute in.
        /// </param>
        /// </method>
        getFirstUICAttrInEntity: function (entity) {
            if (entity.uic !== false) {
                var idx = 0;
                if (entity.attributes) {
                    var attrCount = entity.attributes.length;
                    for (idx = 0; idx < attrCount; idx++) {
                        if (entity.attributes[idx].uic) {
                            return entity.attributes[idx];
                        }
                    }
                }

                if (entity.subEntities) {
                    var subEntityCount = entity.subEntities.length;
                    for (idx = 0; idx < subEntityCount; idx++) {
                        var result = this.getFirstUICAttrInEntity(entity.subEntities[idx]);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
            return null;
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Scans model's entity tree and calls the callback functions for each attribute and entity.
        /// </summary>
        /// <param name="processAttribute" type="Function">
        /// The callback function which is called for each attribute in model's entity tree.
        /// The processed attribute is passed in the first function parameter.
        /// </param>
        /// <param name="processEntity" type="Function">
        /// The callback function which is called for each entity in tree.
        /// The processed entity is passed in the first function parameter.
        /// </param>
        /// </method>
        runThroughEntities: function (processAttribute, processEntity) {
            var opts = { stop: false };
            var internalProcessEntity = function (entity) {
                if (processEntity)
                    processEntity(entity, opts);
                var idx = 0;
                if (entity.attributes) {
                    var attrCount = entity.attributes.length;
                    for (idx = 0; (idx < attrCount) && !opts.stop; idx++) {
                        var attr = entity.attributes[idx];
                        if (processAttribute) {
                            processAttribute(attr, opts);
                        }
                        if (opts.stop) return;
                    }
                }

                if (entity.subEntities) {
                    var subEntityCount = entity.subEntities.length;
                    for (idx = 0; (idx < subEntityCount) && !opts.stop; idx++) {
                        internalProcessEntity(entity.subEntities[idx]);
                    }
                }
            };

            internalProcessEntity(this.getRootEntity());
        },


        getFirstAttributeByFilter: function (filterCallback) {
            var res = null;
            this.runThroughEntities(function (attr, opts) {
                if (filterCallback(attr)) {
                    opts.stop = true;
                    res = attr;
                }
            });
            return res;
        },

        /// <method name="findOperatorById" version="1.0.0">
        /// <summary>
        /// Finds operator in model by its ID.
        /// This function runs through all operators inside specified model and returns the one with specified ID.
        /// Returns null if operator is not found.
        /// </summary>
        /// <returns type="Object">
        /// An operator.
        /// </returns>
        /// <param name="operatorId" type="String">
        /// Operator ID
        /// </param>
        /// </method>
        findOperatorById: function (operatorId) {
            if (this.model.operators) {
                var opCount = this.model.operators.length;
                for (var idx = 0; idx < opCount; idx++) {
                    if (this.model.operators[idx].id == operatorId) {
                        return this.model.operators[idx];
                    }
                }
            }
            return null;
        },

        /// <method name="getOperatorById" version="1.0.0">
        /// <summary>
        /// Finds operator in model by its ID.
        /// This function runs through all operators inside specified model and returns the one with specified ID.
        /// Returns special NullOperator object if operator is not found.
        /// </summary>
        /// <returns type="Object">
        /// An operator.
        /// </returns>
        /// <param name="operatorId" type="String">
        /// Operator ID
        /// </param>
        /// </method>
        getOperatorById: function (operatorId) {
            var op = this.findOperatorById(operatorId);
            if (!op) op = this.nullOperator;
            return op;
        },

        getDefaultOperatorIdForAttr: function (attr) {
            if (attr.defaultOperator) {
                return attr.defaultOperator;
            }
            else if (attr.operators.length > 0) {
                return attr.operators[0];
            }
            else {
                return this.nullOperator.id;
            }

        },

        getDefaultOperatorForAttr: function (attr) {
            var operatorId = this.getDefaultOperatorIdForAttr(attr);
            return this.getOperatorById(operatorId);
        },

        /*
                getDefaultOperand: function (attr, operator) {
                    var result = { "dataType": operator.exprType, "kind": operator.valueKind };
                    if (!result.dataType || result.dataType === "Unknown")
                        result.dataType = attr.dataType;
        
                    return result;
                },
        */

        getOperand: function (attr, operator, index) {

            var defOperand;

			if (operator && operator.defaultOperand) {
			    defOperand = operator.defaultOperand;
			    if (!defOperand.defValue) {
			        defOperand.defValue = "";
			    }
			    if (!defOperand.defText) {
			        defOperand.defText = "";
			    }
            }
			else {
				defOperand = {
					kind: "Scalar",
					dataType: "Unknown",
					defValue: "",
                    defText: "",
					editor: null
				};
			}
						
			var result = $.extend({}, defOperand);			
			

            if ((!result.dataType || result.dataType === "Unknown") && attr) {
                result.dataType = attr.dataType;
            }

            if (operator && (index !== undefined)) {
                if (operator.operands && operator.operands[index - 1]) {
                    $.extend(result, operator.operands[index - 1]);
                }
            };


            if (!result.editor) {
                if (defOperand.editor) {
                    result.editor = $.extend({}, defOperand.editor);
                }
                else if (defOperand.kind === "Query") {
                    result.editor = {
                        type: 'SUBQUERY'
                    };
                }
                else if (attr && attr.defaultEditor) {
                    result.editor = $.extend({}, attr.defaultEditor);
                }
                else if (result.dataType && (result.dataType == "Date" || result.dataType == "DateTime" || result.dataType == "Time")) {
                    result.editor = {
                        type: "DATETIME"
                    }
                }
                else {
                    result.editor = {
                        type: "EDIT"
                    }
                }

            }

            return result;
        },

        getAggrFunctions: function () {
            return this.model ? this.model.aggrFunctions : [];
        },

        getAggrFunctionCaption: function (funcId) {
            var funcCaption = EQ.core.getText('Aggr' + funcId.replace(' ', '') + '_Caption');
            if (funcCaption) return funcCaption;

            var func = this._findItemById(this.model.aggrFunctions, funcId);
            if (!func || !func.caption) return funcId;

            return func.caption;
        },

        getAggrFunctionFormat: function (funcId) {
            var funcFormat = EQ.core.getText('Aggr' + funcId.replace(' ', '') + '_Format');
            if (funcFormat) return funcFormat;

            var func = this._findItemById(this.model.aggrFunctions, funcId);
            if (!func || !func.displayFormat) return '';

            return func.displayFormat;
        },

        getMacroDateValue: function (macro) {
            var d = new Date();

            if ($.inArray(macro, this.dateMacroList) >= 0) {
                switch (macro) {
                    case "${Today}":
                        break;
                    case "${Yesterday}":
                        d.setDate(d.getDate() - 1);
                        break;
                    case "${Tomorrow}":
                        d.setDate(d.getDate() + 1);
                        break;
                    case "${FirstDayOfMonth}":
                        d.setDate(1);
                        break;
                    case "${LastDayOfMonth}":
                        d.setMonth(d.getMonth() + 1, 0);
                        break;
                    case "${FirstDayOfWeek}":
                        var day = d.getDay();
                        day = (day == 0) ? 6 : day - 1; //We start week from Monday, but js - from Sunday
                        d.setDate(d.getDate() - day);
                        break;
                    case "${FirstDayOfYear}":
                        d.setMonth(0, 1);
                        break;
                    case "${FirstDayOfNextWeek}":
                        var day = d.getDay();
                        day = (day == 0) ? 1 : 8 - day; //We start week from Monday, but js - from Sunday
                        d.setDate(d.getDate() + day);
                        break;
                    case "${FirstDayOfNextMonth}":
                        d.setMonth(d.getMonth() + 1, 1);
                        break;
                    case "${FirstDayOfNextYear}":
                        d.setFullYear(d.getFullYear() + 1, 0, 1);
                        break;
                };

                return d;
            }

            return null;
        },

        getDateOrMacroDateValue: function (date) {
            var d = this.getMacroDateValue(date);
            return d ? d : date;
        },

        getMacroTimeValue: function (macro) {
            var d = new Date();

            if ($.inArray(macro, this.timeMacroList) >= 0) {
                switch (macro) {
                    case "${Now}":
                        break;
                    case "${HourStart}":
                        d.setMinutes(0, 0, 0);
                        break;
                    case "${Midnight}":
                        d.setHours(0, 0, 0, 0);
                        break;
                    case "${Noon}":
                        d.setHours(12, 0, 0, 0);
                        break;
                };

                return d;
            }

            return null;
        },

        getTimeOrMacroTimeValue: function (time) {
            var t = this.getMacroTimeValue(time);
            return t ? t : time;
        }
    }



    //-----------------  Query ---------------------


    /// <class name="Query">
    /// <summary>
    /// Represents internal query structure.
    /// </summary>
    /// </class>
    EQ.core.Query = function (model, data, options) {
        if (model) {
            this.model = model;
        }
        else {
            this.model = new EQ.core.DataModel();
        }

        data = data || EQ.core.getEmptyQueryObject();

        this._listCache = {};
        this._updating = 0;


        options = options || {};
        this.attrClassName = options.attrClassName || "ENTATTR";
        this.clientListRequestHandler = options.clientListRequestHandler;
        this.serverListRequestHandler = options.serverListRequestHandler;

        this._queryChangedCallbacks = $.Callbacks("unique");

        this._queryProcessCallbacks = $.Callbacks("unique");

        this.setObject(data);
    };

    EQ.core.Query.prototype = {
        /// <method name="getObject" version="1.0.0">
        /// <summary>
        /// Gets internal query object.
        /// </summary>
        /// </method>
        getObject: function () {
            return this.query;
        },

        /// <method name="setObject" version="1.0.0">
        /// <summary>
        /// Sets internal query object. Accepts query representation in JSON format as well.
        /// </summary>
        /// <param name="data" type="Object | String">
        /// Internal query representation as pure JavaScript object or as JSON string
        /// </param>
        /// </method>
        setObject: function (data, silent) {
            if (data) {
                if (typeof data === 'string') {
                    this.query = JSON.parse(data);
                }
                else {
                    this.query = data;
                }
                if (!silent) {
                    this.fireChangedEvent({
                        "changeType": "query.all"
                    }, true);
                }
            }
        },


        /// <method name="getModel" version="1.0.0">
        /// <summary>
        /// Gets DataModel object associated with this query.
        /// </summary>
        /// </method>
        getModel: function () {
            return this.model;
        },

        /// <method name="setModel" version="1.0.0">
        /// <summary>
        /// Sets DataModel object associated with this query.
        /// </summary>
        /// <param name="model" type="Object">
        /// A DataModel object
        /// </param>
        /// </method>
        setModel: function (model) {
            this.model = model;
            this.clear();
        },

        loadModelObject: function(modelObject) {
            this.model.setObject(modelObject);
        },

        /// <method name="toJSON" version="1.0.0">
        /// <summary>
        /// Returns JSON representation of this query.
        /// </summary>
        /// </method>
        toJSON: function () {
            var model = this.getModel();
            this.query.modelId = model ? model.getId() : null;
            this.query.modelName = model ? model.getName() : null;
            return JSON.stringify(this.query);
        }, 

        /// <method name="isEmptyConditions" version="1.0.0">
        /// <summary>
        /// Returns true if query does not contain any condition.
        /// </summary>
        /// </method>
        isEmptyConditions: function() {
            return !this.query.root || !this.query.root.conditions || this.query.root.conditions.length === 0;
        },

        isEmptyColumns: function () {
            return !this.query.root || !this.query.root.columns || this.query.root.columns.length === 0;
        },

        beginUpdate: function() {
            this._updating++;
        },

        endUpdate: function(raiseChangeEvent) {
            this._updating--;
            if (this._updating == 0 && raiseChangeEvent) {
                this.fireChangedEvent({
                    "changeType": "query.all"
                }, true);
            }
        },

        isUpdating: function() {
            return this._updating > 0;
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Clears query (all conditions and columns).
        /// </summary>
        /// </method>
        clear: function (silent) {
            this.beginUpdate();
            try {
                this.clearColumns();
                this.clearConditions();
            }
            finally {
                this.endUpdate();
                if (!silent) {
                    this.fireChangedEvent({
                        "changeType": "query.clear"
                    }, true);
                }
            }
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Clears all columns in query.
        /// </summary>
        /// </method>
        clearColumns: function() {
            this.query.columns = [];
            this.query.justsorted = [];

            this.fireChangedEvent({
                "changeType": "query.columns.clear"
            }, true);
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Clears all conditions in query.
        /// </summary>
        /// </method>
        clearConditions: function() {
            this.query.root = {
                linkType: "All",
                enabled: true,
                conditions: []
            };

            this.fireChangedEvent({
                "changeType": "query.conditions.clear"
            }, true);
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Gets query ID.
        /// </summary>
        /// </method>
        getId: function () {
            return this.query ? this.query.id : "";
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Sets query ID.
        /// </summary>
        /// <param name="id" type="String">
        /// New Query ID
        /// </param>
        /// </method>
        setId: function (id) {
            if (this.query)
                this.query.id = id;
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Gets query name.
        /// </summary>
        /// </method>
        getName: function(){
            return this.query ? this.query.name : "";
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Sets query name.
        /// </summary>
        /// <param name="name" type="String">
        /// Query name
        /// </param>
        /// </method>
        setName: function(name){
            if (this.query)
				this.query.name = name;
        },


        /// <method version="1.0.0">
        /// <summary>
        /// Get array of columns.
        /// </summary>
        /// </method>
        getColumns: function() {
            return this.query ? this.query.columns : [];
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Adds new column with specified index.
        /// </summary>
        /// <param name="column" type="Object">
        /// The plain JavaScript object that defines a new column.
		/// <example>
		/// <code>
        /// {
		///   "caption" : "Company name",
		///   "sorting" : "None",
		///   "sortIndex" : -1,
		///   "expr" : {
		///       "typeName" : "ENTATTR",
		///       "id" : "Customers.Company"
		///   }
		/// }
		/// </code>
		/// </example>
        /// </param>
        /// <param name="index" type="Number">
        /// The index of new column
        /// </param>
        /// </method>
        addColumn: function (column, index, source) {
            if (!this.query) return;
            var columns = this.query.columns;

            if (typeof index == "number")
                columns.splice.apply(columns, [index, 0].concat(column));
            else
                columns.push.apply(columns, [].concat(column));

            this.fireChangedEvent({
                "source": source,
                "changeType": "column.add",
                "column": column
            }, true);
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Moves the column with specified index to another position.
        /// </summary>
        /// <param name="index1" type="Number">
        /// The index of the column that should be moved.
        /// </param>
        /// <param name="index2" type="Number">
        /// The index of the position the column should be moved to
        /// </param>
        /// </method>
        moveColumn: function (index1, index2, source) {
            var columns = this.getColumns();
            var column = columns[index1];
            EQ.core.moveArrayItem(columns, index1, index2);
            this.fireChangedEvent({
                "source": source,
                "changeType": "column.move",
                "column": column
            }, true);
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Removes the column.
        /// </summary>
        /// <param name="column" type="Object">
        /// The column to be removed.
        /// </param>
        /// </method>
        removeColumn: function (column, source) {
            var columns = this.getColumns();

            var index = $.inArray(column, columns);
            if (index >= 0) {
                columns.splice(index, 1);

                this.fireChangedEvent({
                    "source": source,
                    "changeType": "column.remove",
                    "column": column
                }, true);
            }
        },

        /// <method version="1.0.0">
        /// <summary>
        /// Removes several columns passed as array.
        /// </summary>
        /// <param name="columnsToRemove" type="Array">
        /// The list of columns to be removed.
        /// </param>
        /// </method>
        removeColumns: function (columnsToRemove, source) {
            var allColumns = this.getColumns();

            var ctrLen = columnsToRemove.length;
            for (var i = 0; i < ctrLen; i++) {
                var index = $.inArray(columnsToRemove[i], allColumns);
                if (index >= 0) {
                    allColumns.splice(index, 1);
                }
            }

            this.fireChangedEvent({
                "source": source,
                "changeType": "column.remove",
                "column": columnsToRemove
            }, true);
        },

        getRootPredicate: function () {
            return this.query.root;
        },

        addSimpleCondition: function(params) {
            var predicate = params.predicate || this.getRootPredicate();

            var model = this.getModel();

            if (!model) return null;
            var attrId = params.attr;
            var attr = model.getAttributeById(attrId);
            if (!attr) return null;
            var operatorId = params.operator;
            var op;
            if (!operatorId) {
                op = model.getDefaultOperatorForAttr(attr);
            }
            else {
                op = model.getOperatorById(operatorId);
            }
            if (!op) return null;

            var cond = this._createSimpleConditionObject(attr, op, params.value)
            predicate.conditions.push(cond);
            this.fireChangedEvent({
                "changeType": "condition.add",
                "condition": cond
            }, true);
            return cond;
        },

        addPredicate: function (params) {
            var parent = params.predicate || this.getRootPredicate();

            var model = this.getModel();


            var attr = model.getFirstUICAttr();
            var op = model.getDefaultOperatorForAttr(attr);
            var cond = this._createSimpleConditionObject(attr, op, "")


            var lType = parent.linkType === 'All' ? 'Any' : 'All';
            var predicate = {
                typeName: "PDCT",
                linkType: lType,
                conditions: []
            };

            predicate.conditions.push(cond);

            return predicate;        
        },

        _createValueExpr: function(attr, operator, index, value){
            var model = this.getModel();
            var opnd = model.getOperand(attr, operator);
            var result = {
                "typeName": "CONST",
                "dataType": opnd.dataType,
                "kind": opnd.kind,
                "value": value,
                "text": value
            };
            return result;
        },

        _createSimpleConditionObject: function (attr, operator, value) {
            var self = this;
            if (!attr) { return null; }
            if (!attr.uic) { return null; }

            var cond = {
                typeName: 'SMPL',
                enabled: true,
                "operatorID": operator.id,
                expressions: [
                    {
                        'typeName': self.attrClassName, //'ENTATTR',
                        'id': attr.id
                    }
                ]
            };

            if (value !== null && typeof value !== "undefined") {
                if ($.isArray(value)) {
                    var valLength = value.length;
                    for (var i = 0; i < valLength; i++) {
                        cond.expressions.push(this._createValueExpr(attr, operator, i+1, value));
                    }
                }
                else {
                    cond.expressions.push(this._createValueExpr(attr, operator, 1, value));
                }

            }
            return cond;
        },

        _getListFromCache: function(params){
            var key = params.listName == "SQL" ? "SQL_" + params.editorId : params.listName;
            return this._listCache[key];
        },
	
        _addListToCache: function(params, list) {
            var key = params.listName == "SQL" ? "SQL_" + params.editorId : params.listName;
            this._listCache[key] = list;
        },

        resetListCache: function() {
            this._listCache = {};
        },

        getListRequestHandler: function () {
            var self = this;
            var handler = function (params, onResult) {

                if (params == null || !params.listName) return;

                var dynamicParam = params.listName.match(/{{(.+?)}}/);
                if (dynamicParam) {
                    var paramValue = self.getOneValueForAttr(dynamicParam[1]);
                    if (!paramValue)
                        paramValue = "";
                    params.listName = params.listName.replace(/{{.+?}}/, paramValue);
                }

                var list = self._getListFromCache(params);
                if (list && list.length > 0) {
                    onResult(list);
                    return;
                }


                var processed = false;
                if (self.clientListRequestHandler) {
                    processed = self.clientListRequestHandler(params, onResult);
                }

                if (!processed && self.serverListRequestHandler) {
                    processed = self.serverListRequestHandler(params, function (data) {
                        if (data) {
                            self._addListToCache(params, data);
                        }
                        onResult(data);
                    });
                }
            }
            return handler;
        },

	
        /// <method name="addChangedCallback" version="1.0.0">
        /// <summary>
        /// Adds a handler for "query changed" event.
        /// </summary>
        /// <param name="callback" type="Function">
        /// The function that will be called when query is changed.
        /// This function can take one parameter - the object which contains information what change exactly occurred.
        /// <prop name="changeType" type="String">
        /// Contains the reason of change. The value consists of two parts separated by dot.
        /// First part can be "condition" or "column" and tells where exactly the modification occurred.
        /// Second part tells more about the type of that modification: "add", "delete", "move", etc.
        /// For example: "condition.add" means that a new condition was added into the query
        /// </prop>
        /// <prop name="condition" type="Object">
        /// Represents condition which was added or modified
        /// Can be undefined (if the query change was made in columns)
        /// </prop>
        /// <prop name="column" type="Object">
        /// Represents condition which was added or modified
        /// Can be undefined (if the query change was made in conditions)
        /// </prop>
        /// </param>
        /// </method>
        addChangedCallback: function (callback) {
            if (!callback) return;
            this._queryChangedCallbacks.add(callback);
        },

        /// <method name="removeChangedCallback" version="1.0.0">
        /// <summary>
        /// Removes a handler for "query changed" event.
        /// </summary>
        /// <param name="callback" type="Function">
        /// A callback function that should be removed from the list of handlers.
        /// </param>
        /// </method>
        removeChangedCallback: function (callback) {
            if (!callback) return;
            this._queryChangedCallbacks.remove(callback);
        },

        fireChangedEvent: function (params, immediately) {
            if (!this.isUpdating()) {
                params = params || {};
                params.query = this;

                var self = this;
                if (immediately)
                    this._queryChangedCallbacks.fire(params);
                else
                    setTimeout(function () {
                            self._queryChangedCallbacks.fire(params);
                    }, 50);
            }
        },


        addProcessCallback: function (callback) {
            if (!callback) return;
            this._queryProcessCallbacks.add(callback);
        },

        removeProcessCallback: function (callback) {
            if (!callback) return;
            this._queryProcessCallbacks.remove(callback);
        },

        fireProcessEvent: function(params) {
            this._queryProcessCallbacks.fire(params);

        },

        runThroughConditions: function(processCondition) {
            var processPredicate = function (predicate) {
                var i;
                for (i = 0; i < predicate.conditions.length; i++) {
                    var cond = predicate.conditions[i];
                    if (cond.conditions) {
                        processPredicate(cond);
                    }
                    else {
                        if (processCondition)
                            processCondition(cond);
                    }
                }
            };

            processPredicate(this.getRootPredicate());
        },

        getOneValueForAttr: function (attrId) {
            var res = null;
            this.runThroughConditions(function (cond) {
                var expr = cond.expressions[0];
                if (expr.id == attrId && cond.expressions[1] &&
                        (cond.operatorID == "Equal" ||
                         cond.operatorID == "InList" ||
                         cond.operatorID == "StartsWith")) {
                    res = cond.expressions[1].value;
                }
            });

            return res;
        },

        getConditionsText: function () {
            var self = this;
            var model = self.getModel();

            if (!model) return '';
/*
            var processMacroses = function (text) {
                var res = text;
                var cnt = model.dateMacroList.length;
                for (var i = 0; i < cnt; i++) {
                    var macro = model.dateMacroList[i];
                    var resText = EQ.core.getText(macro);
                    resText = resText ? resText : macro.substring(2, macro.length - 1);

                    res.replace(new RegExp(macro, 'g'), resText);
                    return res;
                }
            };
*/
            var getPredicateText = function (predicate) {
                var result = "",
                    conjKey = "Conj" + predicate.linkType,
                    conjText = EQ.core.getText(conjKey),
                    condText,
                    i;

                for (i = 0; i < predicate.conditions.length; i++) {
                    condText = "";
                    var cond = predicate.conditions[i];
                    if (cond.enabled || typeof(cond.enabled) === "undefined" ) {
                        if (cond.conditions) {
                            condText = getPredicateText(cond);
                            if (condText) {
                                condText = "(" + condText + ")";
                            }
                        }
                        else {
                            var opId = cond.operatorID;
                            var operator = model.getOperatorById(opId);
                            var parts = EQ.core.parseOperatorFormat(operator);
                            var plen = parts.length;

                            for (var pi = 0; pi < plen; pi++) {
                                var part = parts[pi];
                                var txt = part.text;
                                if (part.type == "expression") {
                                    var expr = cond.expressions[part.index];
                                    if (expr.kind == "Attribute" || expr.typeName == "ENTATTR") {
                                        var attr = model.getAttributeById(expr.id);
                                        txt = model.getAttributeText(attr, "{entity} {attr}");
                                    }
                                    else {
                                        txt = expr.text;  //processMacroses(expr.text);
                                    }
                                }
                                if (pi > 0) condText += " ";
                                condText += txt;
                            }
                        }
                    }

                    if (condText) {
                        if (i > 0 && result)
                            result += " " + conjText + " ";
                        result += condText;
                    }
                }

                if (predicate.linkType == "None" || predicate.linkType == "NotAll")
                    result = "not ( " + result + " )";
                    
                return result;
            };
            return getPredicateText(self.getRootPredicate());
        }
    }


})(jQuery, window);
﻿//----------------------------------
//  PopupMenu widget
//----------------------------------
;(function ($, undefined) {


    function getScrollPos() {
        return {
            top: $(window).scrollTop(), // window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
            left: $(window).scrollLeft() //window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
        };
    }

    function getElementAbsolutePos(element, parent) {
        var res = { x: 0, y: 0 }
        if (element !== null) {
            var position = $(element).offset();
            parent = parent || document.documentElement || document.body;
            var parPosition = $(parent).offset();

            res = { x: position.left - parPosition.left, y: position.top - parPosition.top };
        }
        return res;

/*
        if (element !== null) {
            var box = element.getBoundingClientRect();

            parent = parent || document.documentElement || document.body;

            var parentBox = parent.getBoundingClientRect();

            //var scrollPos = getScrollPos();

            //var scrollTop = scrollPos.top; //window.pageYOffset || docElem.scrollTop || body.scrollTop;
            //var scrollLeft = scrollPos.left; //window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            var clientTop = parentBox.top || parent.clientTop || 0;
            var clientLeft = parentBox.left || parent.clientLeft || 0;


            res.x = Math.round(box.left - clientLeft);
            res.y = Math.round(box.top - clientTop);

        }
        return res;
*/
    }

    function getWinSize() {
        var wnd = $(window);
        return { 
            width: wnd.innerWidth(), 
            height: wnd.innerHeight()
        };
    }



    var mouseTimer = null;

    MenuLevel.prototype = {
        _turnCheckboxes: function (items) {
            var itemsLength = items.length;
            var item;

            //turn checkboxes on for selected items
            for (var i = 0; i < itemsLength; i++) {
                item = items[i];
                if (item.itemCheckbox)
                    item.itemCheckbox.checked = this._isItemSelected(item);
                if (item.items) {
                    this._turnCheckboxes(item.items);
                }
            }
        },

        _isItemSelected: function (item) {
            if (item.items) {
                for (var i = 0; i < item.items.length; i++) {
                    if (this._isItemSelected(item.items[i])) {
                        return true;
                    }
                }
                return false;
            }
            else {
                return item.selected;
            }
        },

        _setItemSelected: function (item, value) {
            if (item.items) {
                for (var i = 0; i < item.items.length; i++) {
                    this._setItemSelected(item.items[i], value);
                }
            }
            else {
                item.selected = value;
            }
        },

        showAt: function (x, y, adjustTopPos, hidden) {
            if (!this.items) {
                return;
            }

            var self = this;

            this.initLevelDiv();

            //crocodile
            this._turnCheckboxes(this.items);

            this._renderItems();

            var levelStyle = this.levelDiv.style;
            if (hidden) {
                $(this.levelDiv).css("visibility", "hidden");
            }
            levelStyle.display = 'block';
        
            levelStyle.left = x + 'px';
            levelStyle.top = y + 'px';


            this.scrollDiv.style.width = "auto";
            this.scrollDiv.style.height = "auto";

            //adjusting level top position
            if (adjustTopPos) {
                y = this.adjustTopPos(y);
                levelStyle.top = y + 'px';
            }

            //setting minimal level width if it is defined
            var minItemWidth = this.parentMenu.minItemWidth;
            if (minItemWidth > 0 && this.scrollDiv.offsetWidth < minItemWidth) {
                for (var i = 0; i < itemsLength; i++) {
                    this.items[i].itemDiv.style.width = minItemWidth + "px";
                }
            }

            var maxItemWidth = this.parentMenu.maxItemWidth;

            //window.alert("max width:" + maxItemWidth + "; div width:" + this.scrollDiv.offsetWidth);
            if (maxItemWidth > 0 && this.scrollDiv.offsetWidth > maxItemWidth) {
                for (var i = 0; i < itemsLength; i++) {
                    this.items[i].itemDiv.style.width = maxItemWidth + "px";
                    this.items[i].itemDiv.style.overflowX = "hidden";
                }
            }

            var winSize = getWinSize();

            //adjustinng maximum height of the menu level if it does not fit to browser window
            var maxHeight = winSize.height - (y - getScrollPos().top) - 15;  //document.documentElement.scrollTop

            if (this.parentMenu.maxHeight > 0 && maxHeight > this.parentMenu.maxHeight) {
                maxHeight = this.parentMenu.maxHeight;
            }

            if (this.applyItem != null && this.applyItem.itemDiv != null) {
                maxHeight -= this.applyItem.itemDiv.offsetHeight + 5;
            }

            if (this.searchDiv != null) {
                maxHeight -= this.searchDiv.offsetHeight;
            }

            if (this.levelDiv.offsetHeight > maxHeight) {
                var newHeight = maxHeight;
                if (newHeight < 50) { newHeight = 50; }
                this.scrollDiv.style.height = newHeight + "px";
            }
            else {
                this.scrollDiv.style.height = "auto";
            }
            
            this.activeItem = null;
        },

        focus: function () {
            var self = this;
            window.setTimeout(function () {
                $(self.scrollDiv).focus();
                if (self.searchBox != null) {
                    if (self.parentMenu.options.searchBoxAutoFocus) {
                        self.searchBox.focus();
                    }
                    self.searchBox.value = "";
                }
            }, 100);
        },

        hide: function () {
            if (this.activeItem !== null) {
                if (this.activeItem.subLevel) {
                    this.activeItem.subLevel.hide();
                }
            }

            if (this.levelDiv) {
                var levelStyle = this.levelDiv.style;
                levelStyle.display = 'none';

                if (this.initialized) {
                    this.parentElement.removeChild(this.levelDiv);
                    this.initialized = false;
                }
            }
        },

        adjustTopPos: function (top) {
            var winSize = getWinSize();
            var res = top;
            var levelBottom = top - getScrollPos().top + this.levelDiv.offsetHeight;  //document.documentElement.scrollTop
            if (levelBottom > winSize.height - 5) {
                res -= levelBottom - winSize.height + 5;
                if (res < getScrollPos().top) {   //document.documentElement.scrollTop
                    res = getScrollPos().top + 10; //document.documentElement.scrollTop
                }
            }
            return res;
        },

        initLevelDiv: function () {
            if (!this.initialized) {
                this.parentElement.appendChild(this.levelDiv);
                $(this.levelDiv).addClass("eqjs-menu-levelDiv");
                this.initialized = true;
            }
        },

        activateItem: function (menuItem) {
            if (this.activeItem != null) {
                this.deactivateItem(this.activeItem);
            }
            this.activeItem = menuItem;

            var rowElement = menuItem.itemDiv;
            $(rowElement).addClass("active");

            if (this.parentMenu.options.useDefaultStyles) {
                var itemBgColor = this.parentMenu.style.colors.bgON;
                var itemFgColor = this.parentMenu.style.colors.fgON;
                var itemOverBgColor = this.parentMenu.style.colors.bgOVER;
                var itemOverFgColor = this.parentMenu.style.colors.fgOVER || "";

                var itemClass = this.parentMenu.style.itemClass || "";
                var itemClassOver = this.parentMenu.style.itemClassOver || "";


                if (itemClassOver != "") {
                    rowElement.style.backgroundColor = "";
                    rowElement.style.color = "";
                    //rowElement.className = itemClassOver;
                }
                else {
                    //rowElement.className = "";
                    rowElement.style.backgroundColor = itemOverBgColor;
                    rowElement.style.color = itemOverFgColor;
                }
            }

            if (menuItem.items) {
                this.showSubLevel(menuItem);
            }

        },

        deactivateItem: function (menuItem) {
            var rowElement = menuItem.itemDiv;

            $(rowElement).removeClass("active");

            if (this.parentMenu.options.useDefaultStyles) {
                var itemBgColor = this.parentMenu.style.colors.bgON;
                var itemFgColor = this.parentMenu.style.colors.fgON;

                var itemClass = this.parentMenu.style.itemClass || "";
                if (itemClass != "") {
                    rowElement.style.backgroundColor = "";
                    rowElement.style.color = "";
                }
                else {
                    rowElement.style.backgroundColor = itemBgColor;
                    rowElement.style.color = itemFgColor;
                }
            }

            if (menuItem.subLevel) {
                menuItem.subLevel.hide();
            }
            this.activeItem = null;


        },


        _submitItems: function (items, selectedItems) {
            var itemsLength = items.length;
            for (var j = 0; j < itemsLength; j++) {
                if (items[j].items) {
                    this._submitItems(items[j].items, selectedItems);
                }
                else {
                    if (items[j].selected) {
                        selectedItems.push(items[j]);
                    }
                }
            }
        },

        submit: function (menuItem) {
            if (menuItem != null) {

                if (menuItem.items) { 

                }
                else {
                    this.parentMenu.hideMenu();
                    var selectedItems = [];
                    if (menuItem == this.applyItem) {
                        this._submitItems(this.items, selectedItems);
                    }

                    //-------- Not necessary. Remove after testing --------
                    //if (selectedItems.length == 0)
                    //    selectedItems = null;

                    this.parentMenu.submitMenu(menuItem, selectedItems);
                }
            }

        },

        showSubLevel: function (menuItem) {
            if (!menuItem.subLevel) {
                var levelId = '';
                if (this.menuId) {
                    levelId = this.menuId + "-" + menuItem.id;
                }
//                var rootId = this.menuId || $(this.parentMenu._rootLevel.levelDiv).attr('id');
                menuItem.subLevel = new MenuLevel({ menu: this.parentMenu, parent: this, container: this.parentElement, items: menuItem.items, levelIndex: this.levelIndex + 1, domWriteItemsId: this.domWriteItemsId, menuId: levelId });
//                if (rootId) {
//                    $(menuItem.subLevel.levelDiv).attr('id', rootId + '-' + menuItem.id + '-sub');
//                }
            }

            var pos = getElementAbsolutePos(menuItem.itemDiv, this.parentElement);
            var scroll = getScrollPos();
            var winSize = getWinSize();

            //show menu to the side that have more space available
            var leftSpace = pos.x - scroll.left; //window.pageXOffset;
            var rightSpace = winSize.width - leftSpace - menuItem.itemDiv.offsetWidth;
            var leftposx = pos.x;

            //pos.x += menuItem.itemDiv.offsetWidth - 2;
            
            pos.x += menuItem.itemDiv.offsetParent.offsetWidth;
            pos.y += 1;
            menuItem.subLevel.showAt(pos.x, pos.y, true, true);

            menuItem.subLevel.levelDiv.style.width = '';
            menuItem.subLevel.levelDiv.style.right = '';
            if ((rightSpace >= menuItem.subLevel.levelDiv.offsetWidth) || (rightSpace >= leftSpace)) {  //show level to the right
                if (rightSpace < menuItem.subLevel.levelDiv.offsetWidth) {
                    menuItem.subLevel.levelDiv.style.right = -scroll.left + 'px'; 
                }
            }
            else { //show level to the left
                if (leftSpace < menuItem.subLevel.levelDiv.offsetWidth) {
                    menuItem.subLevel.levelDiv.style.left = scroll.left + 4 + 'px';
                }
                else {
                    menuItem.subLevel.levelDiv.style.left = '';
                }
                menuItem.subLevel.levelDiv.style.right = $(window).width() - pos.x + menuItem.itemDiv.offsetWidth - 6 + 'px';
            }

            $(menuItem.subLevel.levelDiv).css("visibility", "visible");
            menuItem.subLevel.focus();
        },

        refreshItems: function() {
            var itemsLength = this.items.length;
            for (var i = 0; i < itemsLength; i++) {
                var item = this.items[i];
                if (item.itemDiv) {
                    if (item.hidden) {
                        item.itemDiv.style.display = "none";
                    }
                    else {
                        item.itemDiv.style.display = "block";
                    }
                }

                if (item.subLevel) {
                    item.subLevel.refreshItems();
                }
            }
        },

        refreshCheckboxes: function () {
            var itemsLength = this.items.length;
            for (var i = 0; i < itemsLength; i++) {
                var item = this.items[i];
                if (item.itemCheckbox) {
                    item.itemCheckbox.checked = this._isItemSelected(item);
                }

                if (item.subLevel) {
                    item.subLevel.refreshCheckboxes();
                }
            }
        },

        renderContent: function () {
            if (!this.items) {
                return;
            }

            var self = this;
            //define internal variables used in this function
            var itemBgColor = this.parentMenu.style.colors.bgON || "white";
            var itemFgColor = this.parentMenu.style.colors.fgON || "black";
            var itemOverBgColor = this.parentMenu.style.colors.bgOVER || "LightSteelBlue";
            var itemFontFamily = this.parentMenu.style.itemStyle.fontFamily || "";
            var itemFontSize = this.parentMenu.style.itemStyle.fontSize || "14px";

            var multiselect = this.parentMenu.options.multiselect;


            //add base DIV element which is also used to show the shadow
            var baseDiv = document.createElement("div");

            if (this.parentMenu.options.useDefaultStyles) {
                baseDiv.style.backgroundColor = itemBgColor;
                baseDiv.style.border = "1px solid";
                baseDiv.style.borderColor = this.parentMenu.style.colors.border;
                baseDiv.style.margin = "-2px 2px 2px -2px";
                baseDiv.style.width = "auto";
                baseDiv.style.height = "auto";
            }
            baseDiv.style.zIndex = this.parentMenu.zIndex;
            baseDiv.style.position = "absolute";
            baseDiv.style.display = "none";

            baseDiv.menuLevel = this;

            var _parentMenu = this.parentMenu;
            var _applyItem = this.applyItem;


            //if multiselect option is on - then we should add special "apply" item
            if (multiselect && this.levelIndex === 0) {
                var applyDiv = document.createElement("div");
                this.applyBtn = document.createElement('button');
                $(applyDiv).addClass("eqjs-menu-applyDiv");

                applyDiv.menuItem = _applyItem;

                if (this.parentMenu.options.useDefaultStyles) {
                    applyDiv.style.borderBottom = "1px solid";
                    applyDiv.style.padding = "5px";
                    applyDiv.style.marginBottom = "5px";

                    this.applyBtn.style.padding = "0 5px";
                    this.applyBtn.style.cursor = "pointer";
                }

                var applyTextNode = document.createTextNode(this.parentMenu.options.buttons.submit);

                this.applyBtn.appendChild(applyTextNode);

                applyDiv.appendChild(this.applyBtn);


                //cancel btn

                var cancelBtn = document.createElement('button');

                $(cancelBtn).addClass('eqjs-menu-cancel')

                if (this.parentMenu.options.useDefaultStyles) {
                    cancelBtn.style.padding = "0 5px";
                    cancelBtn.style.cursor = "pointer";
                    cancelBtn.style.marginLeft = "15px";
                }

                var cancelText = document.createTextNode(this.parentMenu.options.buttons.cancel);

                cancelBtn.appendChild(cancelText);

                applyDiv.appendChild(cancelBtn);

                baseDiv.appendChild(applyDiv);

                _applyItem.itemDiv = applyDiv;

                $(this.applyBtn).click(function () {
                    self.submit(self.applyItem);
                });

                $(cancelBtn).click(function () {
                    self.parentMenu.hideMenu();
                });
            }

            //if too many items - then we add a special "search" item
            if (self.items.length >= _parentMenu.options.showSearchBoxAfter) {
                var searchDiv = document.createElement("div");
                $(searchDiv).addClass("eqjs-menu-searchDiv");
                if (this.parentMenu.options.useDefaultStyles) {
                    searchDiv.style.borderBottom = "1px solid #666";
                    searchDiv.style.backgroundColor = itemBgColor;
                    searchDiv.style.borderColor = this.parentMenu.style.colors.border;
                    if (itemFontFamily != "") { searchDiv.style.fontFamily = itemFontFamily; }
                    searchDiv.style.fontSize = itemFontSize;
                    searchDiv.style.color = itemFgColor;
                    searchDiv.style.cursor = "pointer";
                    searchDiv.style.textAlign = "left";
                    searchDiv.style.padding = "5px";
                }

                var searchEditBox = document.createElement("input");
                searchEditBox.name = "searchBox";
                searchEditBox.id = "searchBox";

                self.searchBox = searchEditBox;
                self.searchDiv = searchDiv;

                searchEditBox.type = "text";
                searchEditBox.size = "16";
                if (this.parentMenu.options.useDefaultStyles) {
                    searchEditBox.style.fontFamily = "monospace";
                    searchEditBox.style.fontSize = "8pt";
                    searchEditBox.style.width = "100%";
                }
                searchDiv.appendChild(searchEditBox);
                baseDiv.appendChild(searchDiv);

                $(searchEditBox).on("input", function () {
                    self._renderItems($(this).val());
                });

            }

            var scrollDiv = document.createElement("div");
            $(scrollDiv).prop("tabindex", 1);
            $(scrollDiv).addClass("eqjs-menu-scrollDiv");
            scrollDiv.style.overflowX = "hidden";
            scrollDiv.style.overflowY = "auto";
            scrollDiv.style.position = "relative";
            baseDiv.appendChild(scrollDiv);
            this.levelDiv = baseDiv;
            this.scrollDiv = scrollDiv;

            if (this.menuId) {
                $(this.levelDiv).attr('id', this.menuId);
            }

            this._renderItems();

            $(scrollDiv).on("keydown", function (event) {
                switch(event.which) {
                    case 13: // enter
                        if (self.parentMenu.options.multiselect) {
                            self.parentMenu._rootLevel.applyBtn.click();
                        }
                        else {
                            if (self.activeItem) {
                                $(self.activeItem.itemDiv).click();
                            }
                        }
                        break;

                    case 32: // space
                        if (self.activeItem) {
                            $(self.activeItem.itemDiv).trigger("click", [true]);
                        }
                        break;

                    case 37: // left
                        if (self.parentLevel) {
                            self.deactivateItem(self.activeItem);
                            self.parentLevel._focusScrollDiv();
                        }
                        break;

                    case 38: // up
                        if (self.activeItem) {
                            var idx = $.inArray(self.activeItem, self.items);
                            if (idx > 0) {
                                self.activateItem(self.items[idx - 1]);
                            }
                        }
                        else {
                            self.activateItem(self.items[self.items.length - 1]);
                        }
                        break;

                    case 39: // right
                        if (self.activeItem && self.activeItem.subLevel) {
                            self.activeItem.subLevel._focusScrollDiv();
                            self.activeItem.subLevel.activateItem(self.activeItem.subLevel.items[0]);
                        }
                        break;

                    case 40: // down
                        if (self.activeItem) {
                            var idx = $.inArray(self.activeItem, self.items);
                            if (idx < self.items.length - 1) {
                                self.activateItem(self.items[idx + 1]);
                            }
                        }
                        else {
                            self.activateItem(self.items[0]);
                        }
                        break;

                    default: return; // exit this handler for other keys
                }
                event.preventDefault(); // prevent the default action (scroll / move caret)            
            })

        },

        _allSubitemsAreFiltered: function(items, filterCallback) {
            var len = items.length;
            for (var i = 0; i < len; i++) {
                if (filterCallback(items[i])) 
                    return false;
            }

            return true;
        },

        _renderItems: function(filter) {
            var self = this;

            var scrollDiv = this.scrollDiv;

            var multiselect = this.parentMenu.options.multiselect;
            var activateOnMouseOver = this.parentMenu.options.activateOnMouseOver;

            var itemFgColor = this.parentMenu.style.colors.fgON || "black";
            var itemOverBgColor = this.parentMenu.style.colors.bgOVER || "LightSteelBlue";

            var itemFontSize = this.parentMenu.style.itemStyle.fontSize || "14px";

            var itemFilterCallback = this.parentMenu._itemFilterCallback;

            //var itemClass = this.parentMenu.style.itemClass || "";
            //var itemClassOver = this.parentMenu.style.itemClassOver || "";

            $(scrollDiv).empty();

            var regex = filter ? new RegExp(filter, "i") : null;

            var i;
            var itemsLength = this.items.length;
            for (i = 0; i < itemsLength; i++) {
                var item = this.items[i];
                if (!item || !item.text) continue;
                if (itemFilterCallback) {
                    if (!itemFilterCallback(item)) continue;
                    if (item.items && self._allSubitemsAreFiltered(item.items, itemFilterCallback)) continue;
                }
                var idx = regex ? item.text.search(regex) : 0;
                if (idx < 0) continue;
                //if (item.hidden) continue;

                item.data = function (propName) {
                    return this[propName];
                };

                if (typeof (item.selected) == "undefined") {
                    item.selected = false;
                }
                if (item.selected && this.selectedItem == null) {
                    this.selectedItem = item;
                }
                var itemDiv = document.createElement("div");
                $(itemDiv).addClass("eqjs-menu-itemDiv");

                if (this.domWriteItemsId && this.menuId) {
                    $(itemDiv).attr('id', 'item-' + this.menuId + '-' + item.id);
                }

//                $(itemDiv).on("focus", function (event) {
//                    $(this).mouseenter();
//                });


                scrollDiv.appendChild(itemDiv);

                itemDiv.menuItem = item;
                item.itemDiv = itemDiv;
                if (this.parentMenu.options.useDefaultStyles) {
                    itemDiv.style.fontSize = itemFontSize;
                    itemDiv.style.color = itemFgColor;
                    itemDiv.style.paddingLeft = "15px";
                    itemDiv.style.paddingRight = "6px";
                    itemDiv.style.cursor = "pointer";
                }


                if (item.text == '---') {
                    itemDiv.appendChild(document.createElement('hr'));
                }
                else {
                    if (multiselect) { // && !item.items) {
                        var cb = document.createElement("input");
                        cb.type = "checkbox";
                        cb.id = "cb" + item.id;
                        cb.checked = this._isItemSelected(item);
                        cb.defaultChecked = this._isItemSelected(item);
                        itemDiv.appendChild(cb);
                        item.itemCheckbox = cb;
                        if (this.parentMenu.options.useDefaultStyles) {
                            cb.style.margin = "4px 10px 0 0";
                            cb.style.verticalAlign = "top";
                        }
                    }
                    else {
                        if (item.selected) {
                            //var markText = document.createTextNode("\u25CF ");
                            //itemDiv.appendChild(markText);
                        }

                    }

                    var itemText = document.createTextNode(item.text);
                    itemDiv.appendChild(itemText);
                    var itemDivJq = $(itemDiv);

                    if (item.items && item.items.length > 0) {
                        itemDivJq.addClass("eqjs-menu-itemDiv-hasChildren");

/*
                        var itemSpan = document.createElement("span");
                        $(itemSpan).addClass("eqjs-menu-itemDiv-text");
                        itemDiv.appendChild(itemSpan);

                        var itemText = document.createTextNode(item.text);
                        itemSpan.appendChild(itemText);
*/
                        var arrowSpan = document.createElement("span");
                        $(arrowSpan).addClass("eqjs-menu-itemDiv-arrow");
                        itemDiv.appendChild(arrowSpan);

                        var arrowText = document.createTextNode(">");
                        arrowSpan.appendChild(arrowText);

/*
                        if (this.parentMenu.options.useDefaultStyles) {
                            itemDiv.style.textAlign = "right";
                            itemSpan.style["float"] = "left";
                        }
*/
                    }




                    var itemClickHandler = function (event, isSpacePressed) {
                        var menuItem = this.menuItem;
                        //eventObj.preventDefault();

                        if (multiselect) {
                            if (!menuItem.items || event.target == menuItem.itemCheckbox || isSpacePressed) {
                                var itemSelected = self._isItemSelected(menuItem);
                                self._setItemSelected(menuItem, !itemSelected);
                                menuItem.itemCheckbox.checked = !itemSelected;
                                self.parentMenu.refreshCheckboxes();
                            }
                            else {
                                self.activateItem(menuItem);
                            }
                        }
                        else {
                            self.activateItem(menuItem);
                            self.submit(menuItem);
                        }
                        //return false;
                    };

                    itemDivJq.off("click", itemClickHandler);
                    itemDivJq.on("click", itemClickHandler);


                    $(itemDiv).mouseenter(function () {
                        var menuItem = this.menuItem;
                        self.parentMenu.isCursorInside = true;
                        if (activateOnMouseOver) {
                            self.activateItem(menuItem);
                        }
                    });

                    $(itemDiv).mouseleave(function () {
                        var menuItem = this.menuItem;
                        self.parentMenu.isCursorInside = false;
                        setTimeout(function () {
                            if (!self.parentMenu.isCursorInside) {
                                if (menuItem == self.activeItem && activateOnMouseOver && !menuItem.subLevel) {
                                    self.deactivateItem(menuItem);
                                }
                            }
                        }, 200);
                    });
                }

            }

        },

        remove: function () {
            //remove old level elements
            var itemsLength = this.items.length;
            for (var i = 0; i < itemsLength; i++) {
                var item = this.items[i];
                if (item.subLevel) {
                    item.subLevel.remove();
                }
            }

            if (this.levelDiv) {
                this.levelDiv.innerHtml = "";
                var parentNode = this.levelDiv.parentNode;
                if (parentNode != null) {
                    parentNode.removeChild(this.levelDiv);
                }
            }
            this.levelDiv = null;
        },

        update: function (newItems) {
            this.remove();

            //create new level
            this.items = newItems;
            this.activeItem = null;
            this.selectedItem = null;
            this.applyItem.itemDiv = null;
            this.initialized = false;
            this.updated++;

            this.renderContent();
        },

        findItem: function (searchedText) {
            var txt = searchedText.toLowerCase();
            var itemsLength = this.items.length;
            for (var i = 0; i < itemsLength; i++) {
                var item = this.items[i];
                if (item.text.toLowerCase().indexOf(txt) == 0) {
                    return item;
                }
            }
            return null;
        }


    };

    function MenuLevel(options) {
        //menu, items, levelIndex
        this.parentMenu = options.menu || null;
        this.parentLevel = options.parent || null;
        this.parentElement = options.container || document.body; //documentElement;
        this.levelIndex = options.levelIndex || 0;
        this.levelDiv = null;
        this.domWriteItemsId = options.domWriteItemsId || false;
        this.menuId = options.menuId || '';

        //we need to define special "apply" item for this level
        this.applyItem = new Object();
        this.applyItem.itemDiv = null;

        this.items = options.items || [];
        this.activeItem = null;
        this.selectedItem = null;
        this.initialized = false;

        this.updated = 0;

        this.renderContent();
    }

    var lastMenuID = 1;

    $.widget("eqjs.PopupMenu", {
        _mouseIsOverBlock: false,
        _mouseIsOverLink: false,
        _toId: null,
        _itemSelectedCallback: null,
        _menuClosedCallback: null,
        _itemFilterCallback: null,
        _rootLevel: null,

        options: {
            items: [],
            buttons: {
                submit: EQ.core.getText('ButtonApply'),
                cancel: EQ.core.getText('ButtonCancel')
            },
            itemFilterCallback : null,
            useDefaultStyles: false,
            multiselect: false,
            adjustHeight: true,
            showSearchBoxAfter: 30,
            activateOnMouseOver: true,
            container: document.body, //documentElement
            zIndex: 100000,
            domWriteItemsId: false
        },

        _create: function () {
            this.menuId = lastMenuID++;

            this._updateProps();

            //this._clearItemsMenuProps(this.options.items);
            this._rootLevel = new MenuLevel({ menu: this, items: this.options.items, levelIndex: 0, container: this.options.container, domWriteItemsId: this.options.domWriteItemsId, menuId: this.options.id });
            $(this._rootLevel.levelDiv).addClass("eqjs-menu-rootLevel");
            $(this._rootLevel.levelDiv).css('z-index', this.options.zIndex);
//            if (this.options.id) {
//                $(this._rootLevel.levelDiv).attr('id', this.options.id);
//            }

            var self = this;

            this._menuKeyUpHandler = function (eventObj) {
                if (eventObj.which == 27) {
                    self.hideMenu();
                    eventObj.stopImmediatePropagation();
                }
            };

            this._globalMouseDownHandler = function () {
                if (!self.active) return true;
                var e = window.event || arguments[0];
                var o = e.srcElement || e.target;
                var isOutside = true;

                while (o) {
                    if (o.tagName && o.tagName.toLowerCase() == 'div') {
                        if (o.menuLevel) {
                            if (o.menuLevel.parentMenu == self) {
                                isOutside = false;
                                break;
                            }
                        }
                    }
                    o = o.parentNode || o.parentElement;
                }
                if (isOutside) {
                    self.hideMenu();
                }
                return true;
            };


            this._render();
        },


        _clearItemMenuProps: function (item) {
            //don't clear properties they belong this menu
            if (item.subLevel && item.subLevel.parentMenu == this) return;

            if (item.subLevel) {
                item.subLevel.remove();
                item.subLevel = null;
            }

            if (item.itemDiv) {
                item.itemDiv = null;
            }

            if (item.items) {
                this._clearItemsMenuProps(item.items);
            } 
        },

        _clearItemsMenuProps: function (items) {
            if (!items) return;

            for (var i = 0; i < items.length; i++) {
                this._clearItemMenuProps(items[i]);
            }
        },

        _render: function () {
            var self = this;

        },

        _updateProps: function () {
            this.style = {};
            this.style.colors = { border: "#666666", shadow: "#888888", bgON: "white", fgON: "black", bgOVER: "#B6BDD2", fgOVER: "black" };
            this.style.itemStyle = { fontSize: "14px" };

            this.minItemWidth = 0;
            this.maxItemWidth = 0;
            this.maxHeight = 0;
            this.zIndex = this.options.zIndex;

            this.commandTemplate = "";
            this.parentElement = null;
            this.args = [];
            this.active = false;
        },

        _setOption: function (key, value) {
            if (arguments.length == 2) {
                this.options[key] = value;
                return this;
            }
            else {
                return this.options[key];
            }
        },


        _setSelectedItems: function (items, selectedIds) {
            var itemsLength = items ? items.length : 0;
            var item;
            for (var i = 0; i < itemsLength; i++) {
                item = items[i];
                if (item.items) {
                    this._setSelectedItems(item.items, selectedIds);
                }
                else {
                    item.selected = $.inArray(item.id, selectedIds) >= 0;
                }
            }
        },



        showMenu: function (options) {
            var self = this;

            //source, selectedIds, itemSelectedCallback, menuClosedCallback
            this._clearItemsMenuProps(this.options.items);

            self._itemSelectedCallback = options.itemSelectedCallback || null;
            self._menuClosedCallback = options.menuClosedCallback || null;
            self._itemFilterCallback = options.itemFilterCallback || null;
            //self.options.multiselect = options.multiselect || self.options.multiselect;

            var selectedIds = options.selectedIds || null;
            if (selectedIds) {
                if (typeof selectedIds === "string") {
                    selectedIds = selectedIds.split(",");
                }}
            else {
                selectedIds = [];
            }

            this.active = true;

            //crocodile
            this._setSelectedItems(self.options.items, selectedIds);

            var anchor = options.anchor || document.documentElement;

            var srcPos = getElementAbsolutePos(anchor.get(0), this.options.container);

            var anchorHeight = anchor.outerHeight(true);
            var anchorWidth = anchor.outerWidth(true);

            var pos = {
                x: srcPos.x,
                y: srcPos.y + anchorHeight + 2
            };
            var scroll = getScrollPos();
            var winSize = getWinSize();

            //show menu to the side that have more space available
            var leftSpace = pos.x + anchorWidth - scroll.left; //window.pageXOffset;
            var rightSpace = winSize.width - leftSpace + anchorWidth;
            var leftposx = pos.x;

            pos.x += 2; //anchor.get(0).offsetWidth - 2;
            //pos.y += 1;
            self._rootLevel.showAt(pos.x, pos.y, false, true);

            self._rootLevel.levelDiv.style.width = '';
            self._rootLevel.levelDiv.style.right = '';
            if ((rightSpace >= self._rootLevel.levelDiv.offsetWidth) || (rightSpace >= leftSpace)) {  //show level to the right
                if (rightSpace < self._rootLevel.levelDiv.offsetWidth) {
                    self._rootLevel.levelDiv.style.right = -scroll.left + 'px';
                }
            }
            else { //show level to the left
                if (leftSpace < self._rootLevel.levelDiv.offsetWidth) {
                    self._rootLevel.levelDiv.style.left = scroll.left + 4 + 'px';
                }
                else {
                    self._rootLevel.levelDiv.style.left = '';
                }
                self._rootLevel.levelDiv.style.right = $(window).width() - pos.x - anchorWidth + 'px'; //+ anchor.get(0).offsetWidth
            }

            $(self._rootLevel.levelDiv).css("visibility", "visible");
            self._rootLevel.focus();

            $(document).on("keyup", this._menuKeyUpHandler);
            $(document).on('mousedown', this._globalMouseDownHandler);
        },


        hideMenu: function () {
            $(document).off('mousedown', this._globalMouseDownHandler);
            $(document).off("keyup", this._menuKeyUpHandler);
            this._rootLevel.hide();
            if (this._menuClosedCallback) {
                this._menuClosedCallback.call();
            }

        },

        submitMenu: function (menuItem, selectedItems) {

            var data = { 'widget': this, 'menuItem': menuItem, 'selectedItems': selectedItems };

            if (this._itemSelectedCallback) {
                this._itemSelectedCallback.apply(this, [null, data]);
            }
            else {
                this._trigger("onMenuItemSelected", null, data);
            }

        },

        knockMenuStyle: function (menu) {
            menu.removeAttr('style');
            var hasUlStyle = menu.find('ul').first().prop('style');

            if (hasUlStyle !== "undefined" && hasUlStyle !== false) {
                menu.find('ul').first().prop('style', '');
            }
        },

        refreshItems: function () {
            this._rootLevel.refreshItems();
        },

        refreshCheckboxes: function () {
            this._rootLevel.refreshCheckboxes();
        }

    });

})(jQuery);

/*! jQuery Timepicker Addon - v1.5.5 - 2015-05-24
* http://trentrichardson.com/examples/timepicker
* Copyright (c) 2015 Trent Richardson; Licensed MIT */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery', 'jquery.ui'], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {

	/*
	* Lets not redefine timepicker, Prevent "Uncaught RangeError: Maximum call stack size exceeded"
	*/
	$.ui.timepicker = $.ui.timepicker || {};
	if ($.ui.timepicker.version) {
		return;
	}

	/*
	* Extend jQueryUI, get it started with our version number
	*/
	$.extend($.ui, {
		timepicker: {
			version: "1.5.5"
		}
	});

	/* 
	* Timepicker manager.
	* Use the singleton instance of this class, $.timepicker, to interact with the time picker.
	* Settings for (groups of) time pickers are maintained in an instance object,
	* allowing multiple different settings on the same page.
	*/
	var Timepicker = function () {
		this.regional = []; // Available regional settings, indexed by language code
		this.regional[''] = { // Default regional settings
			currentText: 'Now',
			closeText: 'Done',
			amNames: ['AM', 'A'],
			pmNames: ['PM', 'P'],
			timeFormat: 'HH:mm',
			timeSuffix: '',
			timeOnlyTitle: 'Choose Time',
			timeText: 'Time',
			hourText: 'Hour',
			minuteText: 'Minute',
			secondText: 'Second',
			millisecText: 'Millisecond',
			microsecText: 'Microsecond',
			timezoneText: 'Time Zone',
			isRTL: false
		};
		this._defaults = { // Global defaults for all the datetime picker instances
			showButtonPanel: true,
			timeOnly: false,
			timeOnlyShowDate: false,
			showHour: null,
			showMinute: null,
			showSecond: null,
			showMillisec: null,
			showMicrosec: null,
			showTimezone: null,
			showTime: true,
			stepHour: 1,
			stepMinute: 1,
			stepSecond: 1,
			stepMillisec: 1,
			stepMicrosec: 1,
			hour: 0,
			minute: 0,
			second: 0,
			millisec: 0,
			microsec: 0,
			timezone: null,
			hourMin: 0,
			minuteMin: 0,
			secondMin: 0,
			millisecMin: 0,
			microsecMin: 0,
			hourMax: 23,
			minuteMax: 59,
			secondMax: 59,
			millisecMax: 999,
			microsecMax: 999,
			minDateTime: null,
			maxDateTime: null,
			maxTime: null,
			minTime: null,
			onSelect: null,
			hourGrid: 0,
			minuteGrid: 0,
			secondGrid: 0,
			millisecGrid: 0,
			microsecGrid: 0,
			alwaysSetTime: true,
			separator: ' ',
			altFieldTimeOnly: true,
			altTimeFormat: null,
			altSeparator: null,
			altTimeSuffix: null,
			altRedirectFocus: true,
			pickerTimeFormat: null,
			pickerTimeSuffix: null,
			showTimepicker: true,
			timezoneList: null,
			addSliderAccess: false,
			sliderAccessArgs: null,
			controlType: 'slider',
			oneLine: false,
			defaultValue: null,
			parse: 'strict',
			afterInject: null
		};
		$.extend(this._defaults, this.regional['']);
	};

	$.extend(Timepicker.prototype, {
		$input: null,
		$altInput: null,
		$timeObj: null,
		inst: null,
		hour_slider: null,
		minute_slider: null,
		second_slider: null,
		millisec_slider: null,
		microsec_slider: null,
		timezone_select: null,
		maxTime: null,
		minTime: null,
		hour: 0,
		minute: 0,
		second: 0,
		millisec: 0,
		microsec: 0,
		timezone: null,
		hourMinOriginal: null,
		minuteMinOriginal: null,
		secondMinOriginal: null,
		millisecMinOriginal: null,
		microsecMinOriginal: null,
		hourMaxOriginal: null,
		minuteMaxOriginal: null,
		secondMaxOriginal: null,
		millisecMaxOriginal: null,
		microsecMaxOriginal: null,
		ampm: '',
		formattedDate: '',
		formattedTime: '',
		formattedDateTime: '',
		timezoneList: null,
		units: ['hour', 'minute', 'second', 'millisec', 'microsec'],
		support: {},
		control: null,

		/* 
		* Override the default settings for all instances of the time picker.
		* @param  {Object} settings  object - the new settings to use as defaults (anonymous object)
		* @return {Object} the manager object
		*/
		setDefaults: function (settings) {
			extendRemove(this._defaults, settings || {});
			return this;
		},

		/*
		* Create a new Timepicker instance
		*/
		_newInst: function ($input, opts) {
			var tp_inst = new Timepicker(),
				inlineSettings = {},
				fns = {},
				overrides, i;

			for (var attrName in this._defaults) {
				if (this._defaults.hasOwnProperty(attrName)) {
					var attrValue = $input.attr('time:' + attrName);
					if (attrValue) {
						try {
							inlineSettings[attrName] = eval(attrValue);
						} catch (err) {
							inlineSettings[attrName] = attrValue;
						}
					}
				}
			}

			overrides = {
				beforeShow: function (input, dp_inst) {
					if ($.isFunction(tp_inst._defaults.evnts.beforeShow)) {
						return tp_inst._defaults.evnts.beforeShow.call($input[0], input, dp_inst, tp_inst);
					}
				},
				onChangeMonthYear: function (year, month, dp_inst) {
					// Update the time as well : this prevents the time from disappearing from the $input field.
					// tp_inst._updateDateTime(dp_inst);
					if ($.isFunction(tp_inst._defaults.evnts.onChangeMonthYear)) {
						tp_inst._defaults.evnts.onChangeMonthYear.call($input[0], year, month, dp_inst, tp_inst);
					}
				},
				onClose: function (dateText, dp_inst) {
					if (tp_inst.timeDefined === true && $input.val() !== '') {
						tp_inst._updateDateTime(dp_inst);
					}
					if ($.isFunction(tp_inst._defaults.evnts.onClose)) {
						tp_inst._defaults.evnts.onClose.call($input[0], dateText, dp_inst, tp_inst);
					}
				}
			};
			for (i in overrides) {
				if (overrides.hasOwnProperty(i)) {
					fns[i] = opts[i] || this._defaults[i] || null;
				}
			}

			tp_inst._defaults = $.extend({}, this._defaults, inlineSettings, opts, overrides, {
				evnts: fns,
				timepicker: tp_inst // add timepicker as a property of datepicker: $.datepicker._get(dp_inst, 'timepicker');
			});
			tp_inst.amNames = $.map(tp_inst._defaults.amNames, function (val) {
				return val.toUpperCase();
			});
			tp_inst.pmNames = $.map(tp_inst._defaults.pmNames, function (val) {
				return val.toUpperCase();
			});

			// detect which units are supported
			tp_inst.support = detectSupport(
					tp_inst._defaults.timeFormat + 
					(tp_inst._defaults.pickerTimeFormat ? tp_inst._defaults.pickerTimeFormat : '') +
					(tp_inst._defaults.altTimeFormat ? tp_inst._defaults.altTimeFormat : ''));

			// controlType is string - key to our this._controls
			if (typeof(tp_inst._defaults.controlType) === 'string') {
				if (tp_inst._defaults.controlType === 'slider' && typeof($.ui.slider) === 'undefined') {
					tp_inst._defaults.controlType = 'select';
				}
				tp_inst.control = tp_inst._controls[tp_inst._defaults.controlType];
			}
			// controlType is an object and must implement create, options, value methods
			else {
				tp_inst.control = tp_inst._defaults.controlType;
			}

			// prep the timezone options
			var timezoneList = [-720, -660, -600, -570, -540, -480, -420, -360, -300, -270, -240, -210, -180, -120, -60,
					0, 60, 120, 180, 210, 240, 270, 300, 330, 345, 360, 390, 420, 480, 525, 540, 570, 600, 630, 660, 690, 720, 765, 780, 840];
			if (tp_inst._defaults.timezoneList !== null) {
				timezoneList = tp_inst._defaults.timezoneList;
			}
			var tzl = timezoneList.length, tzi = 0, tzv = null;
			if (tzl > 0 && typeof timezoneList[0] !== 'object') {
				for (; tzi < tzl; tzi++) {
					tzv = timezoneList[tzi];
					timezoneList[tzi] = { value: tzv, label: $.timepicker.timezoneOffsetString(tzv, tp_inst.support.iso8601) };
				}
			}
			tp_inst._defaults.timezoneList = timezoneList;

			// set the default units
			tp_inst.timezone = tp_inst._defaults.timezone !== null ? $.timepicker.timezoneOffsetNumber(tp_inst._defaults.timezone) :
							((new Date()).getTimezoneOffset() * -1);
			tp_inst.hour = tp_inst._defaults.hour < tp_inst._defaults.hourMin ? tp_inst._defaults.hourMin :
							tp_inst._defaults.hour > tp_inst._defaults.hourMax ? tp_inst._defaults.hourMax : tp_inst._defaults.hour;
			tp_inst.minute = tp_inst._defaults.minute < tp_inst._defaults.minuteMin ? tp_inst._defaults.minuteMin :
							tp_inst._defaults.minute > tp_inst._defaults.minuteMax ? tp_inst._defaults.minuteMax : tp_inst._defaults.minute;
			tp_inst.second = tp_inst._defaults.second < tp_inst._defaults.secondMin ? tp_inst._defaults.secondMin :
							tp_inst._defaults.second > tp_inst._defaults.secondMax ? tp_inst._defaults.secondMax : tp_inst._defaults.second;
			tp_inst.millisec = tp_inst._defaults.millisec < tp_inst._defaults.millisecMin ? tp_inst._defaults.millisecMin :
							tp_inst._defaults.millisec > tp_inst._defaults.millisecMax ? tp_inst._defaults.millisecMax : tp_inst._defaults.millisec;
			tp_inst.microsec = tp_inst._defaults.microsec < tp_inst._defaults.microsecMin ? tp_inst._defaults.microsecMin :
							tp_inst._defaults.microsec > tp_inst._defaults.microsecMax ? tp_inst._defaults.microsecMax : tp_inst._defaults.microsec;
			tp_inst.ampm = '';
			tp_inst.$input = $input;

			if (tp_inst._defaults.altField) {
				tp_inst.$altInput = $(tp_inst._defaults.altField);
				if (tp_inst._defaults.altRedirectFocus === true) {
					tp_inst.$altInput.css({
						cursor: 'pointer'
					}).focus(function () {
						$input.trigger("focus");
					});
				}
			}

			if (tp_inst._defaults.minDate === 0 || tp_inst._defaults.minDateTime === 0) {
				tp_inst._defaults.minDate = new Date();
			}
			if (tp_inst._defaults.maxDate === 0 || tp_inst._defaults.maxDateTime === 0) {
				tp_inst._defaults.maxDate = new Date();
			}

			// datepicker needs minDate/maxDate, timepicker needs minDateTime/maxDateTime..
			if (tp_inst._defaults.minDate !== undefined && tp_inst._defaults.minDate instanceof Date) {
				tp_inst._defaults.minDateTime = new Date(tp_inst._defaults.minDate.getTime());
			}
			if (tp_inst._defaults.minDateTime !== undefined && tp_inst._defaults.minDateTime instanceof Date) {
				tp_inst._defaults.minDate = new Date(tp_inst._defaults.minDateTime.getTime());
			}
			if (tp_inst._defaults.maxDate !== undefined && tp_inst._defaults.maxDate instanceof Date) {
				tp_inst._defaults.maxDateTime = new Date(tp_inst._defaults.maxDate.getTime());
			}
			if (tp_inst._defaults.maxDateTime !== undefined && tp_inst._defaults.maxDateTime instanceof Date) {
				tp_inst._defaults.maxDate = new Date(tp_inst._defaults.maxDateTime.getTime());
			}
			tp_inst.$input.bind('focus', function () {
				tp_inst._onFocus();
			});

			return tp_inst;
		},

		/*
		* add our sliders to the calendar
		*/
		_addTimePicker: function (dp_inst) {
			var currDT = $.trim((this.$altInput && this._defaults.altFieldTimeOnly) ? this.$input.val() + ' ' + this.$altInput.val() : this.$input.val());

			this.timeDefined = this._parseTime(currDT);
			this._limitMinMaxDateTime(dp_inst, false);
			this._injectTimePicker();
			this._afterInject();
		},

		/*
		* parse the time string from input value or _setTime
		*/
		_parseTime: function (timeString, withDate) {
			if (!this.inst) {
				this.inst = $.datepicker._getInst(this.$input[0]);
			}

			if (withDate || !this._defaults.timeOnly) {
				var dp_dateFormat = $.datepicker._get(this.inst, 'dateFormat');
				try {
					var parseRes = parseDateTimeInternal(dp_dateFormat, this._defaults.timeFormat, timeString, $.datepicker._getFormatConfig(this.inst), this._defaults);
					if (!parseRes.timeObj) {
						return false;
					}
					$.extend(this, parseRes.timeObj);
				} catch (err) {
					$.timepicker.log("Error parsing the date/time string: " + err +
									"\ndate/time string = " + timeString +
									"\ntimeFormat = " + this._defaults.timeFormat +
									"\ndateFormat = " + dp_dateFormat);
					return false;
				}
				return true;
			} else {
				var timeObj = $.datepicker.parseTime(this._defaults.timeFormat, timeString, this._defaults);
				if (!timeObj) {
					return false;
				}
				$.extend(this, timeObj);
				return true;
			}
		},

		/*
		* Handle callback option after injecting timepicker
		*/
		_afterInject: function() {
			var o = this.inst.settings;
			if ($.isFunction(o.afterInject)) {
				o.afterInject.call(this);
			}
		},

		/*
		* generate and inject html for timepicker into ui datepicker
		*/
		_injectTimePicker: function () {
			var $dp = this.inst.dpDiv,
				o = this.inst.settings,
				tp_inst = this,
				litem = '',
				uitem = '',
				show = null,
				max = {},
				gridSize = {},
				size = null,
				i = 0,
				l = 0;

			// Prevent displaying twice
			if ($dp.find("div.ui-timepicker-div").length === 0 && o.showTimepicker) {
				var noDisplay = ' ui_tpicker_unit_hide',
					html = '<div class="ui-timepicker-div' + (o.isRTL ? ' ui-timepicker-rtl' : '') + (o.oneLine && o.controlType === 'select' ? ' ui-timepicker-oneLine' : '') + '"><dl>' + '<dt class="ui_tpicker_time_label' + ((o.showTime) ? '' : noDisplay) + '">' + o.timeText + '</dt>' +
								'<dd class="ui_tpicker_time '+ ((o.showTime) ? '' : noDisplay) + '"></dd>';

				// Create the markup
				for (i = 0, l = this.units.length; i < l; i++) {
					litem = this.units[i];
					uitem = litem.substr(0, 1).toUpperCase() + litem.substr(1);
					show = o['show' + uitem] !== null ? o['show' + uitem] : this.support[litem];

					// Added by Peter Medeiros:
					// - Figure out what the hour/minute/second max should be based on the step values.
					// - Example: if stepMinute is 15, then minMax is 45.
					max[litem] = parseInt((o[litem + 'Max'] - ((o[litem + 'Max'] - o[litem + 'Min']) % o['step' + uitem])), 10);
					gridSize[litem] = 0;

					html += '<dt class="ui_tpicker_' + litem + '_label' + (show ? '' : noDisplay) + '">' + o[litem + 'Text'] + '</dt>' +
								'<dd class="ui_tpicker_' + litem + (show ? '' : noDisplay) + '"><div class="ui_tpicker_' + litem + '_slider' + (show ? '' : noDisplay) + '"></div>';

					if (show && o[litem + 'Grid'] > 0) {
						html += '<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';

						if (litem === 'hour') {
							for (var h = o[litem + 'Min']; h <= max[litem]; h += parseInt(o[litem + 'Grid'], 10)) {
								gridSize[litem]++;
								var tmph = $.datepicker.formatTime(this.support.ampm ? 'hht' : 'HH', {hour: h}, o);
								html += '<td data-for="' + litem + '">' + tmph + '</td>';
							}
						}
						else {
							for (var m = o[litem + 'Min']; m <= max[litem]; m += parseInt(o[litem + 'Grid'], 10)) {
								gridSize[litem]++;
								html += '<td data-for="' + litem + '">' + ((m < 10) ? '0' : '') + m + '</td>';
							}
						}

						html += '</tr></table></div>';
					}
					html += '</dd>';
				}
				
				// Timezone
				var showTz = o.showTimezone !== null ? o.showTimezone : this.support.timezone;
				html += '<dt class="ui_tpicker_timezone_label' + (showTz ? '' : noDisplay) + '">' + o.timezoneText + '</dt>';
				html += '<dd class="ui_tpicker_timezone' + (showTz ? '' : noDisplay) + '"></dd>';

				// Create the elements from string
				html += '</dl></div>';
				var $tp = $(html);

				// if we only want time picker...
				if (o.timeOnly === true) {
					$tp.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all">' + '<div class="ui-datepicker-title">' + o.timeOnlyTitle + '</div>' + '</div>');
					$dp.find('.ui-datepicker-header, .ui-datepicker-calendar').hide();
				}
				
				// add sliders, adjust grids, add events
				for (i = 0, l = tp_inst.units.length; i < l; i++) {
					litem = tp_inst.units[i];
					uitem = litem.substr(0, 1).toUpperCase() + litem.substr(1);
					show = o['show' + uitem] !== null ? o['show' + uitem] : this.support[litem];

					// add the slider
					tp_inst[litem + '_slider'] = tp_inst.control.create(tp_inst, $tp.find('.ui_tpicker_' + litem + '_slider'), litem, tp_inst[litem], o[litem + 'Min'], max[litem], o['step' + uitem]);

					// adjust the grid and add click event
					if (show && o[litem + 'Grid'] > 0) {
						size = 100 * gridSize[litem] * o[litem + 'Grid'] / (max[litem] - o[litem + 'Min']);
						$tp.find('.ui_tpicker_' + litem + ' table').css({
							width: size + "%",
							marginLeft: o.isRTL ? '0' : ((size / (-2 * gridSize[litem])) + "%"),
							marginRight: o.isRTL ? ((size / (-2 * gridSize[litem])) + "%") : '0',
							borderCollapse: 'collapse'
						}).find("td").click(function (e) {
								var $t = $(this),
									h = $t.html(),
									n = parseInt(h.replace(/[^0-9]/g), 10),
									ap = h.replace(/[^apm]/ig),
									f = $t.data('for'); // loses scope, so we use data-for

								if (f === 'hour') {
									if (ap.indexOf('p') !== -1 && n < 12) {
										n += 12;
									}
									else {
										if (ap.indexOf('a') !== -1 && n === 12) {
											n = 0;
										}
									}
								}
								
								tp_inst.control.value(tp_inst, tp_inst[f + '_slider'], litem, n);

								tp_inst._onTimeChange();
								tp_inst._onSelectHandler();
							}).css({
								cursor: 'pointer',
								width: (100 / gridSize[litem]) + '%',
								textAlign: 'center',
								overflow: 'hidden'
							});
					} // end if grid > 0
				} // end for loop

				// Add timezone options
				this.timezone_select = $tp.find('.ui_tpicker_timezone').append('<select></select>').find("select");
				$.fn.append.apply(this.timezone_select,
				$.map(o.timezoneList, function (val, idx) {
					return $("<option />").val(typeof val === "object" ? val.value : val).text(typeof val === "object" ? val.label : val);
				}));
				if (typeof(this.timezone) !== "undefined" && this.timezone !== null && this.timezone !== "") {
					var local_timezone = (new Date(this.inst.selectedYear, this.inst.selectedMonth, this.inst.selectedDay, 12)).getTimezoneOffset() * -1;
					if (local_timezone === this.timezone) {
						selectLocalTimezone(tp_inst);
					} else {
						this.timezone_select.val(this.timezone);
					}
				} else {
					if (typeof(this.hour) !== "undefined" && this.hour !== null && this.hour !== "") {
						this.timezone_select.val(o.timezone);
					} else {
						selectLocalTimezone(tp_inst);
					}
				}
				this.timezone_select.change(function () {
					tp_inst._onTimeChange();
					tp_inst._onSelectHandler();
					tp_inst._afterInject();
				});
				// End timezone options
				
				// inject timepicker into datepicker
				var $buttonPanel = $dp.find('.ui-datepicker-buttonpane');
				if ($buttonPanel.length) {
					$buttonPanel.before($tp);
				} else {
					$dp.append($tp);
				}

				this.$timeObj = $tp.find('.ui_tpicker_time');

				if (this.inst !== null) {
					var timeDefined = this.timeDefined;
					this._onTimeChange();
					this.timeDefined = timeDefined;
				}

				// slideAccess integration: http://trentrichardson.com/2011/11/11/jquery-ui-sliders-and-touch-accessibility/
				if (this._defaults.addSliderAccess) {
					var sliderAccessArgs = this._defaults.sliderAccessArgs,
						rtl = this._defaults.isRTL;
					sliderAccessArgs.isRTL = rtl;
						
					setTimeout(function () { // fix for inline mode
						if ($tp.find('.ui-slider-access').length === 0) {
							$tp.find('.ui-slider:visible').sliderAccess(sliderAccessArgs);

							// fix any grids since sliders are shorter
							var sliderAccessWidth = $tp.find('.ui-slider-access:eq(0)').outerWidth(true);
							if (sliderAccessWidth) {
								$tp.find('table:visible').each(function () {
									var $g = $(this),
										oldWidth = $g.outerWidth(),
										oldMarginLeft = $g.css(rtl ? 'marginRight' : 'marginLeft').toString().replace('%', ''),
										newWidth = oldWidth - sliderAccessWidth,
										newMarginLeft = ((oldMarginLeft * newWidth) / oldWidth) + '%',
										css = { width: newWidth, marginRight: 0, marginLeft: 0 };
									css[rtl ? 'marginRight' : 'marginLeft'] = newMarginLeft;
									$g.css(css);
								});
							}
						}
					}, 10);
				}
				// end slideAccess integration

				tp_inst._limitMinMaxDateTime(this.inst, true);
			}
		},

		/*
		* This function tries to limit the ability to go outside the
		* min/max date range
		*/
		_limitMinMaxDateTime: function (dp_inst, adjustSliders) {
			var o = this._defaults,
				dp_date = new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay);

			if (!this._defaults.showTimepicker) {
				return;
			} // No time so nothing to check here

			if ($.datepicker._get(dp_inst, 'minDateTime') !== null && $.datepicker._get(dp_inst, 'minDateTime') !== undefined && dp_date) {
				var minDateTime = $.datepicker._get(dp_inst, 'minDateTime'),
					minDateTimeDate = new Date(minDateTime.getFullYear(), minDateTime.getMonth(), minDateTime.getDate(), 0, 0, 0, 0);

				if (this.hourMinOriginal === null || this.minuteMinOriginal === null || this.secondMinOriginal === null || this.millisecMinOriginal === null || this.microsecMinOriginal === null) {
					this.hourMinOriginal = o.hourMin;
					this.minuteMinOriginal = o.minuteMin;
					this.secondMinOriginal = o.secondMin;
					this.millisecMinOriginal = o.millisecMin;
					this.microsecMinOriginal = o.microsecMin;
				}

				if (dp_inst.settings.timeOnly || minDateTimeDate.getTime() === dp_date.getTime()) {
					this._defaults.hourMin = minDateTime.getHours();
					if (this.hour <= this._defaults.hourMin) {
						this.hour = this._defaults.hourMin;
						this._defaults.minuteMin = minDateTime.getMinutes();
						if (this.minute <= this._defaults.minuteMin) {
							this.minute = this._defaults.minuteMin;
							this._defaults.secondMin = minDateTime.getSeconds();
							if (this.second <= this._defaults.secondMin) {
								this.second = this._defaults.secondMin;
								this._defaults.millisecMin = minDateTime.getMilliseconds();
								if (this.millisec <= this._defaults.millisecMin) {
									this.millisec = this._defaults.millisecMin;
									this._defaults.microsecMin = minDateTime.getMicroseconds();
								} else {
									if (this.microsec < this._defaults.microsecMin) {
										this.microsec = this._defaults.microsecMin;
									}
									this._defaults.microsecMin = this.microsecMinOriginal;
								}
							} else {
								this._defaults.millisecMin = this.millisecMinOriginal;
								this._defaults.microsecMin = this.microsecMinOriginal;
							}
						} else {
							this._defaults.secondMin = this.secondMinOriginal;
							this._defaults.millisecMin = this.millisecMinOriginal;
							this._defaults.microsecMin = this.microsecMinOriginal;
						}
					} else {
						this._defaults.minuteMin = this.minuteMinOriginal;
						this._defaults.secondMin = this.secondMinOriginal;
						this._defaults.millisecMin = this.millisecMinOriginal;
						this._defaults.microsecMin = this.microsecMinOriginal;
					}
				} else {
					this._defaults.hourMin = this.hourMinOriginal;
					this._defaults.minuteMin = this.minuteMinOriginal;
					this._defaults.secondMin = this.secondMinOriginal;
					this._defaults.millisecMin = this.millisecMinOriginal;
					this._defaults.microsecMin = this.microsecMinOriginal;
				}
			}

			if ($.datepicker._get(dp_inst, 'maxDateTime') !== null && $.datepicker._get(dp_inst, 'maxDateTime') !== undefined && dp_date) {
				var maxDateTime = $.datepicker._get(dp_inst, 'maxDateTime'),
					maxDateTimeDate = new Date(maxDateTime.getFullYear(), maxDateTime.getMonth(), maxDateTime.getDate(), 0, 0, 0, 0);

				if (this.hourMaxOriginal === null || this.minuteMaxOriginal === null || this.secondMaxOriginal === null || this.millisecMaxOriginal === null) {
					this.hourMaxOriginal = o.hourMax;
					this.minuteMaxOriginal = o.minuteMax;
					this.secondMaxOriginal = o.secondMax;
					this.millisecMaxOriginal = o.millisecMax;
					this.microsecMaxOriginal = o.microsecMax;
				}

				if (dp_inst.settings.timeOnly || maxDateTimeDate.getTime() === dp_date.getTime()) {
					this._defaults.hourMax = maxDateTime.getHours();
					if (this.hour >= this._defaults.hourMax) {
						this.hour = this._defaults.hourMax;
						this._defaults.minuteMax = maxDateTime.getMinutes();
						if (this.minute >= this._defaults.minuteMax) {
							this.minute = this._defaults.minuteMax;
							this._defaults.secondMax = maxDateTime.getSeconds();
							if (this.second >= this._defaults.secondMax) {
								this.second = this._defaults.secondMax;
								this._defaults.millisecMax = maxDateTime.getMilliseconds();
								if (this.millisec >= this._defaults.millisecMax) {
									this.millisec = this._defaults.millisecMax;
									this._defaults.microsecMax = maxDateTime.getMicroseconds();
								} else {
									if (this.microsec > this._defaults.microsecMax) {
										this.microsec = this._defaults.microsecMax;
									}
									this._defaults.microsecMax = this.microsecMaxOriginal;
								}
							} else {
								this._defaults.millisecMax = this.millisecMaxOriginal;
								this._defaults.microsecMax = this.microsecMaxOriginal;
							}
						} else {
							this._defaults.secondMax = this.secondMaxOriginal;
							this._defaults.millisecMax = this.millisecMaxOriginal;
							this._defaults.microsecMax = this.microsecMaxOriginal;
						}
					} else {
						this._defaults.minuteMax = this.minuteMaxOriginal;
						this._defaults.secondMax = this.secondMaxOriginal;
						this._defaults.millisecMax = this.millisecMaxOriginal;
						this._defaults.microsecMax = this.microsecMaxOriginal;
					}
				} else {
					this._defaults.hourMax = this.hourMaxOriginal;
					this._defaults.minuteMax = this.minuteMaxOriginal;
					this._defaults.secondMax = this.secondMaxOriginal;
					this._defaults.millisecMax = this.millisecMaxOriginal;
					this._defaults.microsecMax = this.microsecMaxOriginal;
				}
			}

			if (dp_inst.settings.minTime!==null) {				
				var tempMinTime=new Date("01/01/1970 " + dp_inst.settings.minTime);				
				if (this.hour<tempMinTime.getHours()) {
					this.hour=this._defaults.hourMin=tempMinTime.getHours();
					this.minute=this._defaults.minuteMin=tempMinTime.getMinutes();							
				} else if (this.hour===tempMinTime.getHours() && this.minute<tempMinTime.getMinutes()) {
					this.minute=this._defaults.minuteMin=tempMinTime.getMinutes();
				} else {						
					if (this._defaults.hourMin<tempMinTime.getHours()) {
						this._defaults.hourMin=tempMinTime.getHours();
						this._defaults.minuteMin=tempMinTime.getMinutes();					
					} else if (this._defaults.hourMin===tempMinTime.getHours()===this.hour && this._defaults.minuteMin<tempMinTime.getMinutes()) {
						this._defaults.minuteMin=tempMinTime.getMinutes();						
					} else {
						this._defaults.minuteMin=0;
					}
				}				
			}
			
			if (dp_inst.settings.maxTime!==null) {				
				var tempMaxTime=new Date("01/01/1970 " + dp_inst.settings.maxTime);
				if (this.hour>tempMaxTime.getHours()) {
					this.hour=this._defaults.hourMax=tempMaxTime.getHours();						
					this.minute=this._defaults.minuteMax=tempMaxTime.getMinutes();
				} else if (this.hour===tempMaxTime.getHours() && this.minute>tempMaxTime.getMinutes()) {							
					this.minute=this._defaults.minuteMax=tempMaxTime.getMinutes();						
				} else {
					if (this._defaults.hourMax>tempMaxTime.getHours()) {
						this._defaults.hourMax=tempMaxTime.getHours();
						this._defaults.minuteMax=tempMaxTime.getMinutes();					
					} else if (this._defaults.hourMax===tempMaxTime.getHours()===this.hour && this._defaults.minuteMax>tempMaxTime.getMinutes()) {
						this._defaults.minuteMax=tempMaxTime.getMinutes();						
					} else {
						this._defaults.minuteMax=59;
					}
				}						
			}
			
			if (adjustSliders !== undefined && adjustSliders === true) {
				var hourMax = parseInt((this._defaults.hourMax - ((this._defaults.hourMax - this._defaults.hourMin) % this._defaults.stepHour)), 10),
					minMax = parseInt((this._defaults.minuteMax - ((this._defaults.minuteMax - this._defaults.minuteMin) % this._defaults.stepMinute)), 10),
					secMax = parseInt((this._defaults.secondMax - ((this._defaults.secondMax - this._defaults.secondMin) % this._defaults.stepSecond)), 10),
					millisecMax = parseInt((this._defaults.millisecMax - ((this._defaults.millisecMax - this._defaults.millisecMin) % this._defaults.stepMillisec)), 10),
					microsecMax = parseInt((this._defaults.microsecMax - ((this._defaults.microsecMax - this._defaults.microsecMin) % this._defaults.stepMicrosec)), 10);

				if (this.hour_slider) {
					this.control.options(this, this.hour_slider, 'hour', { min: this._defaults.hourMin, max: hourMax, step: this._defaults.stepHour });
					this.control.value(this, this.hour_slider, 'hour', this.hour - (this.hour % this._defaults.stepHour));
				}
				if (this.minute_slider) {
					this.control.options(this, this.minute_slider, 'minute', { min: this._defaults.minuteMin, max: minMax, step: this._defaults.stepMinute });
					this.control.value(this, this.minute_slider, 'minute', this.minute - (this.minute % this._defaults.stepMinute));
				}
				if (this.second_slider) {
					this.control.options(this, this.second_slider, 'second', { min: this._defaults.secondMin, max: secMax, step: this._defaults.stepSecond });
					this.control.value(this, this.second_slider, 'second', this.second - (this.second % this._defaults.stepSecond));
				}
				if (this.millisec_slider) {
					this.control.options(this, this.millisec_slider, 'millisec', { min: this._defaults.millisecMin, max: millisecMax, step: this._defaults.stepMillisec });
					this.control.value(this, this.millisec_slider, 'millisec', this.millisec - (this.millisec % this._defaults.stepMillisec));
				}
				if (this.microsec_slider) {
					this.control.options(this, this.microsec_slider, 'microsec', { min: this._defaults.microsecMin, max: microsecMax, step: this._defaults.stepMicrosec });
					this.control.value(this, this.microsec_slider, 'microsec', this.microsec - (this.microsec % this._defaults.stepMicrosec));
				}
			}

		},

		/*
		* when a slider moves, set the internal time...
		* on time change is also called when the time is updated in the text field
		*/
		_onTimeChange: function () {
			if (!this._defaults.showTimepicker) {
                                return;
			}
			var hour = (this.hour_slider) ? this.control.value(this, this.hour_slider, 'hour') : false,
				minute = (this.minute_slider) ? this.control.value(this, this.minute_slider, 'minute') : false,
				second = (this.second_slider) ? this.control.value(this, this.second_slider, 'second') : false,
				millisec = (this.millisec_slider) ? this.control.value(this, this.millisec_slider, 'millisec') : false,
				microsec = (this.microsec_slider) ? this.control.value(this, this.microsec_slider, 'microsec') : false,
				timezone = (this.timezone_select) ? this.timezone_select.val() : false,
				o = this._defaults,
				pickerTimeFormat = o.pickerTimeFormat || o.timeFormat,
				pickerTimeSuffix = o.pickerTimeSuffix || o.timeSuffix;

			if (typeof(hour) === 'object') {
				hour = false;
			}
			if (typeof(minute) === 'object') {
				minute = false;
			}
			if (typeof(second) === 'object') {
				second = false;
			}
			if (typeof(millisec) === 'object') {
				millisec = false;
			}
			if (typeof(microsec) === 'object') {
				microsec = false;
			}
			if (typeof(timezone) === 'object') {
				timezone = false;
			}

			if (hour !== false) {
				hour = parseInt(hour, 10);
			}
			if (minute !== false) {
				minute = parseInt(minute, 10);
			}
			if (second !== false) {
				second = parseInt(second, 10);
			}
			if (millisec !== false) {
				millisec = parseInt(millisec, 10);
			}
			if (microsec !== false) {
				microsec = parseInt(microsec, 10);
			}
			if (timezone !== false) {
				timezone = timezone.toString();
			}

			var ampm = o[hour < 12 ? 'amNames' : 'pmNames'][0];

			// If the update was done in the input field, the input field should not be updated.
			// If the update was done using the sliders, update the input field.
			var hasChanged = (
						hour !== parseInt(this.hour,10) || // sliders should all be numeric
						minute !== parseInt(this.minute,10) || 
						second !== parseInt(this.second,10) || 
						millisec !== parseInt(this.millisec,10) || 
						microsec !== parseInt(this.microsec,10) || 
						(this.ampm.length > 0 && (hour < 12) !== ($.inArray(this.ampm.toUpperCase(), this.amNames) !== -1)) || 
						(this.timezone !== null && timezone !== this.timezone.toString()) // could be numeric or "EST" format, so use toString()
					);

			if (hasChanged) {

				if (hour !== false) {
					this.hour = hour;
				}
				if (minute !== false) {
					this.minute = minute;
				}
				if (second !== false) {
					this.second = second;
				}
				if (millisec !== false) {
					this.millisec = millisec;
				}
				if (microsec !== false) {
					this.microsec = microsec;
				}
				if (timezone !== false) {
					this.timezone = timezone;
				}

				if (!this.inst) {
					this.inst = $.datepicker._getInst(this.$input[0]);
				}

				this._limitMinMaxDateTime(this.inst, true);
			}
			if (this.support.ampm) {
				this.ampm = ampm;
			}

			// Updates the time within the timepicker
			this.formattedTime = $.datepicker.formatTime(o.timeFormat, this, o);
			if (this.$timeObj) {
				if (pickerTimeFormat === o.timeFormat) {
					this.$timeObj.text(this.formattedTime + pickerTimeSuffix);
				}
				else {
					this.$timeObj.text($.datepicker.formatTime(pickerTimeFormat, this, o) + pickerTimeSuffix);
				}
			}

			this.timeDefined = true;
			if (hasChanged) {
				this._updateDateTime();
				//this.$input.focus(); // may automatically open the picker on setDate
			}
		},

		/*
		* call custom onSelect.
		* bind to sliders slidestop, and grid click.
		*/
		_onSelectHandler: function () {
			var onSelect = this._defaults.onSelect || this.inst.settings.onSelect;
			var inputEl = this.$input ? this.$input[0] : null;
			if (onSelect && inputEl) {
				onSelect.apply(inputEl, [this.formattedDateTime, this]);
			}
		},

		/*
		* update our input with the new date time..
		*/
		_updateDateTime: function (dp_inst) {
			dp_inst = this.inst || dp_inst;
			var dtTmp = (dp_inst.currentYear > 0? 
							new Date(dp_inst.currentYear, dp_inst.currentMonth, dp_inst.currentDay) : 
							new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay)),
				dt = $.datepicker._daylightSavingAdjust(dtTmp),
				//dt = $.datepicker._daylightSavingAdjust(new Date(dp_inst.selectedYear, dp_inst.selectedMonth, dp_inst.selectedDay)),
				//dt = $.datepicker._daylightSavingAdjust(new Date(dp_inst.currentYear, dp_inst.currentMonth, dp_inst.currentDay)),
				dateFmt = $.datepicker._get(dp_inst, 'dateFormat'),
				formatCfg = $.datepicker._getFormatConfig(dp_inst),
				timeAvailable = dt !== null && this.timeDefined;
			this.formattedDate = $.datepicker.formatDate(dateFmt, (dt === null ? new Date() : dt), formatCfg);
			var formattedDateTime = this.formattedDate;
			
			// if a slider was changed but datepicker doesn't have a value yet, set it
			if (dp_inst.lastVal === "") {
                dp_inst.currentYear = dp_inst.selectedYear;
                dp_inst.currentMonth = dp_inst.selectedMonth;
                dp_inst.currentDay = dp_inst.selectedDay;
            }

			/*
			* remove following lines to force every changes in date picker to change the input value
			* Bug descriptions: when an input field has a default value, and click on the field to pop up the date picker. 
			* If the user manually empty the value in the input field, the date picker will never change selected value.
			*/
			//if (dp_inst.lastVal !== undefined && (dp_inst.lastVal.length > 0 && this.$input.val().length === 0)) {
			//	return;
			//}

			if (this._defaults.timeOnly === true && this._defaults.timeOnlyShowDate === false) {
				formattedDateTime = this.formattedTime;
			} else if ((this._defaults.timeOnly !== true && (this._defaults.alwaysSetTime || timeAvailable)) || (this._defaults.timeOnly === true && this._defaults.timeOnlyShowDate === true)) {
				formattedDateTime += this._defaults.separator + this.formattedTime + this._defaults.timeSuffix;
			}

			this.formattedDateTime = formattedDateTime;

			if (!this._defaults.showTimepicker) {
				this.$input.val(this.formattedDate);
			} else if (this.$altInput && this._defaults.timeOnly === false && this._defaults.altFieldTimeOnly === true) {
				this.$altInput.val(this.formattedTime);
				this.$input.val(this.formattedDate);
			} else if (this.$altInput) {
				this.$input.val(formattedDateTime);
				var altFormattedDateTime = '',
					altSeparator = this._defaults.altSeparator !== null ? this._defaults.altSeparator : this._defaults.separator,
					altTimeSuffix = this._defaults.altTimeSuffix !== null ? this._defaults.altTimeSuffix : this._defaults.timeSuffix;
				
				if (!this._defaults.timeOnly) {
					if (this._defaults.altFormat) {
						altFormattedDateTime = $.datepicker.formatDate(this._defaults.altFormat, (dt === null ? new Date() : dt), formatCfg);
					}
					else {
						altFormattedDateTime = this.formattedDate;
					}

					if (altFormattedDateTime) {
						altFormattedDateTime += altSeparator;
					}
				}

				if (this._defaults.altTimeFormat !== null) {
					altFormattedDateTime += $.datepicker.formatTime(this._defaults.altTimeFormat, this, this._defaults) + altTimeSuffix;
				}
				else {
					altFormattedDateTime += this.formattedTime + altTimeSuffix;
				}
				this.$altInput.val(altFormattedDateTime);
			} else {
				this.$input.val(formattedDateTime);
			}

			this.$input.trigger("change");
		},

		_onFocus: function () {
			if (!this.$input.val() && this._defaults.defaultValue) {
				this.$input.val(this._defaults.defaultValue);
				var inst = $.datepicker._getInst(this.$input.get(0)),
					tp_inst = $.datepicker._get(inst, 'timepicker');
				if (tp_inst) {
					if (tp_inst._defaults.timeOnly && (inst.input.val() !== inst.lastVal)) {
						try {
							$.datepicker._updateDatepicker(inst);
						} catch (err) {
							$.timepicker.log(err);
						}
					}
				}
			}
		},

		/*
		* Small abstraction to control types
		* We can add more, just be sure to follow the pattern: create, options, value
		*/
		_controls: {
			// slider methods
			slider: {
				create: function (tp_inst, obj, unit, val, min, max, step) {
					var rtl = tp_inst._defaults.isRTL; // if rtl go -60->0 instead of 0->60
					return obj.prop('slide', null).slider({
						orientation: "horizontal",
						value: rtl ? val * -1 : val,
						min: rtl ? max * -1 : min,
						max: rtl ? min * -1 : max,
						step: step,
						slide: function (event, ui) {
							tp_inst.control.value(tp_inst, $(this), unit, rtl ? ui.value * -1 : ui.value);
							tp_inst._onTimeChange();
						},
						stop: function (event, ui) {
							tp_inst._onSelectHandler();
						}
					});	
				},
				options: function (tp_inst, obj, unit, opts, val) {
					if (tp_inst._defaults.isRTL) {
						if (typeof(opts) === 'string') {
							if (opts === 'min' || opts === 'max') {
								if (val !== undefined) {
									return obj.slider(opts, val * -1);
								}
								return Math.abs(obj.slider(opts));
							}
							return obj.slider(opts);
						}
						var min = opts.min, 
							max = opts.max;
						opts.min = opts.max = null;
						if (min !== undefined) {
							opts.max = min * -1;
						}
						if (max !== undefined) {
							opts.min = max * -1;
						}
						return obj.slider(opts);
					}
					if (typeof(opts) === 'string' && val !== undefined) {
						return obj.slider(opts, val);
					}
					return obj.slider(opts);
				},
				value: function (tp_inst, obj, unit, val) {
					if (tp_inst._defaults.isRTL) {
						if (val !== undefined) {
							return obj.slider('value', val * -1);
						}
						return Math.abs(obj.slider('value'));
					}
					if (val !== undefined) {
						return obj.slider('value', val);
					}
					return obj.slider('value');
				}
			},
			// select methods
			select: {
				create: function (tp_inst, obj, unit, val, min, max, step) {
					var sel = '<select class="ui-timepicker-select ui-state-default ui-corner-all" data-unit="' + unit + '" data-min="' + min + '" data-max="' + max + '" data-step="' + step + '">',
						format = tp_inst._defaults.pickerTimeFormat || tp_inst._defaults.timeFormat;

					for (var i = min; i <= max; i += step) {
						sel += '<option value="' + i + '"' + (i === val ? ' selected' : '') + '>';
						if (unit === 'hour') {
							sel += $.datepicker.formatTime($.trim(format.replace(/[^ht ]/ig, '')), {hour: i}, tp_inst._defaults);
						}
						else if (unit === 'millisec' || unit === 'microsec' || i >= 10) { sel += i; }
						else {sel += '0' + i.toString(); }
						sel += '</option>';
					}
					sel += '</select>';

					obj.children('select').remove();

					$(sel).appendTo(obj).change(function (e) {
						tp_inst._onTimeChange();
						tp_inst._onSelectHandler();
						tp_inst._afterInject();
					});

					return obj;
				},
				options: function (tp_inst, obj, unit, opts, val) {
					var o = {},
						$t = obj.children('select');
					if (typeof(opts) === 'string') {
						if (val === undefined) {
							return $t.data(opts);
						}
						o[opts] = val;	
					}
					else { o = opts; }
					return tp_inst.control.create(tp_inst, obj, $t.data('unit'), $t.val(), o.min>=0 ? o.min : $t.data('min'), o.max || $t.data('max'), o.step || $t.data('step'));
				},
				value: function (tp_inst, obj, unit, val) {
					var $t = obj.children('select');
					if (val !== undefined) {
						return $t.val(val);
					}
					return $t.val();
				}
			}
		} // end _controls

	});

	$.fn.extend({
		/*
		* shorthand just to use timepicker.
		*/
		timepicker: function (o) {
			o = o || {};
			var tmp_args = Array.prototype.slice.call(arguments);

			if (typeof o === 'object') {
				tmp_args[0] = $.extend(o, {
					timeOnly: true
				});
			}

			return $(this).each(function () {
				$.fn.datetimepicker.apply($(this), tmp_args);
			});
		},

		/*
		* extend timepicker to datepicker
		*/
		datetimepicker: function (o) {
			o = o || {};
			var tmp_args = arguments;

			if (typeof(o) === 'string') {
				if (o === 'getDate'  || (o === 'option' && tmp_args.length === 2 && typeof (tmp_args[1]) === 'string')) {
					return $.fn.datepicker.apply($(this[0]), tmp_args);
				} else {
					return this.each(function () {
						var $t = $(this);
						$t.datepicker.apply($t, tmp_args);
					});
				}
			} else {
				return this.each(function () {
					var $t = $(this);
					$t.datepicker($.timepicker._newInst($t, o)._defaults);
				});
			}
		}
	});

	/*
	* Public Utility to parse date and time
	*/
	$.datepicker.parseDateTime = function (dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings) {
		var parseRes = parseDateTimeInternal(dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings);
		if (parseRes.timeObj) {
			var t = parseRes.timeObj;
			parseRes.date.setHours(t.hour, t.minute, t.second, t.millisec);
			parseRes.date.setMicroseconds(t.microsec);
		}

		return parseRes.date;
	};

	/*
	* Public utility to parse time
	*/
	$.datepicker.parseTime = function (timeFormat, timeString, options) {
		var o = extendRemove(extendRemove({}, $.timepicker._defaults), options || {}),
			iso8601 = (timeFormat.replace(/\'.*?\'/g, '').indexOf('Z') !== -1);

		// Strict parse requires the timeString to match the timeFormat exactly
		var strictParse = function (f, s, o) {

			// pattern for standard and localized AM/PM markers
			var getPatternAmpm = function (amNames, pmNames) {
				var markers = [];
				if (amNames) {
					$.merge(markers, amNames);
				}
				if (pmNames) {
					$.merge(markers, pmNames);
				}
				markers = $.map(markers, function (val) {
					return val.replace(/[.*+?|()\[\]{}\\]/g, '\\$&');
				});
				return '(' + markers.join('|') + ')?';
			};

			// figure out position of time elements.. cause js cant do named captures
			var getFormatPositions = function (timeFormat) {
				var finds = timeFormat.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|l{1}|c{1}|t{1,2}|z|'.*?')/g),
					orders = {
						h: -1,
						m: -1,
						s: -1,
						l: -1,
						c: -1,
						t: -1,
						z: -1
					};

				if (finds) {
					for (var i = 0; i < finds.length; i++) {
						if (orders[finds[i].toString().charAt(0)] === -1) {
							orders[finds[i].toString().charAt(0)] = i + 1;
						}
					}
				}
				return orders;
			};

			var regstr = '^' + f.toString()
					.replace(/([hH]{1,2}|mm?|ss?|[tT]{1,2}|[zZ]|[lc]|'.*?')/g, function (match) {
							var ml = match.length;
							switch (match.charAt(0).toLowerCase()) {
							case 'h':
								return ml === 1 ? '(\\d?\\d)' : '(\\d{' + ml + '})';
							case 'm':
								return ml === 1 ? '(\\d?\\d)' : '(\\d{' + ml + '})';
							case 's':
								return ml === 1 ? '(\\d?\\d)' : '(\\d{' + ml + '})';
							case 'l':
								return '(\\d?\\d?\\d)';
							case 'c':
								return '(\\d?\\d?\\d)';
							case 'z':
								return '(z|[-+]\\d\\d:?\\d\\d|\\S+)?';
							case 't':
								return getPatternAmpm(o.amNames, o.pmNames);
							default:    // literal escaped in quotes
								return '(' + match.replace(/\'/g, "").replace(/(\.|\$|\^|\\|\/|\(|\)|\[|\]|\?|\+|\*)/g, function (m) { return "\\" + m; }) + ')?';
							}
						})
					.replace(/\s/g, '\\s?') +
					o.timeSuffix + '$',
				order = getFormatPositions(f),
				ampm = '',
				treg;

			treg = s.match(new RegExp(regstr, 'i'));

			var resTime = {
				hour: 0,
				minute: 0,
				second: 0,
				millisec: 0,
				microsec: 0
			};

			if (treg) {
				if (order.t !== -1) {
					if (treg[order.t] === undefined || treg[order.t].length === 0) {
						ampm = '';
						resTime.ampm = '';
					} else {
						ampm = $.inArray(treg[order.t].toUpperCase(), $.map(o.amNames, function (x,i) { return x.toUpperCase(); })) !== -1 ? 'AM' : 'PM';
						resTime.ampm = o[ampm === 'AM' ? 'amNames' : 'pmNames'][0];
					}
				}

				if (order.h !== -1) {
					if (ampm === 'AM' && treg[order.h] === '12') {
						resTime.hour = 0; // 12am = 0 hour
					} else {
						if (ampm === 'PM' && treg[order.h] !== '12') {
							resTime.hour = parseInt(treg[order.h], 10) + 12; // 12pm = 12 hour, any other pm = hour + 12
						} else {
							resTime.hour = Number(treg[order.h]);
						}
					}
				}

				if (order.m !== -1) {
					resTime.minute = Number(treg[order.m]);
				}
				if (order.s !== -1) {
					resTime.second = Number(treg[order.s]);
				}
				if (order.l !== -1) {
					resTime.millisec = Number(treg[order.l]);
				}
				if (order.c !== -1) {
					resTime.microsec = Number(treg[order.c]);
				}
				if (order.z !== -1 && treg[order.z] !== undefined) {
					resTime.timezone = $.timepicker.timezoneOffsetNumber(treg[order.z]);
				}


				return resTime;
			}
			return false;
		};// end strictParse

		// First try JS Date, if that fails, use strictParse
		var looseParse = function (f, s, o) {
			try {
				var d = new Date('2012-01-01 ' + s);
				if (isNaN(d.getTime())) {
					d = new Date('2012-01-01T' + s);
					if (isNaN(d.getTime())) {
						d = new Date('01/01/2012 ' + s);
						if (isNaN(d.getTime())) {
							throw "Unable to parse time with native Date: " + s;
						}
					}
				}

				return {
					hour: d.getHours(),
					minute: d.getMinutes(),
					second: d.getSeconds(),
					millisec: d.getMilliseconds(),
					microsec: d.getMicroseconds(),
					timezone: d.getTimezoneOffset() * -1
				};
			}
			catch (err) {
				try {
					return strictParse(f, s, o);
				}
				catch (err2) {
					$.timepicker.log("Unable to parse \ntimeString: " + s + "\ntimeFormat: " + f);
				}				
			}
			return false;
		}; // end looseParse
		
		if (typeof o.parse === "function") {
			return o.parse(timeFormat, timeString, o);
		}
		if (o.parse === 'loose') {
			return looseParse(timeFormat, timeString, o);
		}
		return strictParse(timeFormat, timeString, o);
	};

	/**
	 * Public utility to format the time
	 * @param {string} format format of the time
	 * @param {Object} time Object not a Date for timezones
	 * @param {Object} [options] essentially the regional[].. amNames, pmNames, ampm
	 * @returns {string} the formatted time
	 */
	$.datepicker.formatTime = function (format, time, options) {
		options = options || {};
		options = $.extend({}, $.timepicker._defaults, options);
		time = $.extend({
			hour: 0,
			minute: 0,
			second: 0,
			millisec: 0,
			microsec: 0,
			timezone: null
		}, time);

		var tmptime = format,
			ampmName = options.amNames[0],
			hour = parseInt(time.hour, 10);

		if (hour > 11) {
			ampmName = options.pmNames[0];
		}

		tmptime = tmptime.replace(/(?:HH?|hh?|mm?|ss?|[tT]{1,2}|[zZ]|[lc]|'.*?')/g, function (match) {
			switch (match) {
			case 'HH':
				return ('0' + hour).slice(-2);
			case 'H':
				return hour;
			case 'hh':
				return ('0' + convert24to12(hour)).slice(-2);
			case 'h':
				return convert24to12(hour);
			case 'mm':
				return ('0' + time.minute).slice(-2);
			case 'm':
				return time.minute;
			case 'ss':
				return ('0' + time.second).slice(-2);
			case 's':
				return time.second;
			case 'l':
				return ('00' + time.millisec).slice(-3);
			case 'c':
				return ('00' + time.microsec).slice(-3);
			case 'z':
				return $.timepicker.timezoneOffsetString(time.timezone === null ? options.timezone : time.timezone, false);
			case 'Z':
				return $.timepicker.timezoneOffsetString(time.timezone === null ? options.timezone : time.timezone, true);
			case 'T':
				return ampmName.charAt(0).toUpperCase();
			case 'TT':
				return ampmName.toUpperCase();
			case 't':
				return ampmName.charAt(0).toLowerCase();
			case 'tt':
				return ampmName.toLowerCase();
			default:
				return match.replace(/'/g, "");
			}
		});

		return tmptime;
	};

	/*
	* the bad hack :/ override datepicker so it doesn't close on select
	// inspired: http://stackoverflow.com/questions/1252512/jquery-datepicker-prevent-closing-picker-when-clicking-a-date/1762378#1762378
	*/
	$.datepicker._base_selectDate = $.datepicker._selectDate;
	$.datepicker._selectDate = function (id, dateStr) {
		var inst = this._getInst($(id)[0]),
			tp_inst = this._get(inst, 'timepicker'),
			was_inline;

		if (tp_inst && inst.settings.showTimepicker) {
			tp_inst._limitMinMaxDateTime(inst, true);
			was_inline = inst.inline;
			inst.inline = inst.stay_open = true;
			//This way the onSelect handler called from calendarpicker get the full dateTime
			this._base_selectDate(id, dateStr);
			inst.inline = was_inline;
			inst.stay_open = false;
			this._notifyChange(inst);
			this._updateDatepicker(inst);
		} else {
			this._base_selectDate(id, dateStr);
		}
	};

	/*
	* second bad hack :/ override datepicker so it triggers an event when changing the input field
	* and does not redraw the datepicker on every selectDate event
	*/
	$.datepicker._base_updateDatepicker = $.datepicker._updateDatepicker;
	$.datepicker._updateDatepicker = function (inst) {

		// don't popup the datepicker if there is another instance already opened
		var input = inst.input[0];
		if ($.datepicker._curInst && $.datepicker._curInst !== inst && $.datepicker._datepickerShowing && $.datepicker._lastInput !== input) {
			return;
		}

		if (typeof(inst.stay_open) !== 'boolean' || inst.stay_open === false) {

			this._base_updateDatepicker(inst);

			// Reload the time control when changing something in the input text field.
			var tp_inst = this._get(inst, 'timepicker');
			if (tp_inst) {
				tp_inst._addTimePicker(inst);
			}
		}
	};

	/*
	* third bad hack :/ override datepicker so it allows spaces and colon in the input field
	*/
	$.datepicker._base_doKeyPress = $.datepicker._doKeyPress;
	$.datepicker._doKeyPress = function (event) {
		var inst = $.datepicker._getInst(event.target),
			tp_inst = $.datepicker._get(inst, 'timepicker');

		if (tp_inst) {
			if ($.datepicker._get(inst, 'constrainInput')) {
				var ampm = tp_inst.support.ampm,
					tz = tp_inst._defaults.showTimezone !== null ? tp_inst._defaults.showTimezone : tp_inst.support.timezone,
					dateChars = $.datepicker._possibleChars($.datepicker._get(inst, 'dateFormat')),
					datetimeChars = tp_inst._defaults.timeFormat.toString()
											.replace(/[hms]/g, '')
											.replace(/TT/g, ampm ? 'APM' : '')
											.replace(/Tt/g, ampm ? 'AaPpMm' : '')
											.replace(/tT/g, ampm ? 'AaPpMm' : '')
											.replace(/T/g, ampm ? 'AP' : '')
											.replace(/tt/g, ampm ? 'apm' : '')
											.replace(/t/g, ampm ? 'ap' : '') + 
											" " + tp_inst._defaults.separator + 
											tp_inst._defaults.timeSuffix + 
											(tz ? tp_inst._defaults.timezoneList.join('') : '') + 
											(tp_inst._defaults.amNames.join('')) + (tp_inst._defaults.pmNames.join('')) + 
											dateChars,
					chr = String.fromCharCode(event.charCode === undefined ? event.keyCode : event.charCode);
				return event.ctrlKey || (chr < ' ' || !dateChars || datetimeChars.indexOf(chr) > -1);
			}
		}

		return $.datepicker._base_doKeyPress(event);
	};

	/*
	* Fourth bad hack :/ override _updateAlternate function used in inline mode to init altField
	* Update any alternate field to synchronise with the main field.
	*/
	$.datepicker._base_updateAlternate = $.datepicker._updateAlternate;
	$.datepicker._updateAlternate = function (inst) {
		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			var altField = tp_inst._defaults.altField;
			if (altField) { // update alternate field too
				var altFormat = tp_inst._defaults.altFormat || tp_inst._defaults.dateFormat,
					date = this._getDate(inst),
					formatCfg = $.datepicker._getFormatConfig(inst),
					altFormattedDateTime = '', 
					altSeparator = tp_inst._defaults.altSeparator ? tp_inst._defaults.altSeparator : tp_inst._defaults.separator, 
					altTimeSuffix = tp_inst._defaults.altTimeSuffix ? tp_inst._defaults.altTimeSuffix : tp_inst._defaults.timeSuffix,
					altTimeFormat = tp_inst._defaults.altTimeFormat !== null ? tp_inst._defaults.altTimeFormat : tp_inst._defaults.timeFormat;
				
				altFormattedDateTime += $.datepicker.formatTime(altTimeFormat, tp_inst, tp_inst._defaults) + altTimeSuffix;
				if (!tp_inst._defaults.timeOnly && !tp_inst._defaults.altFieldTimeOnly && date !== null) {
					if (tp_inst._defaults.altFormat) {
						altFormattedDateTime = $.datepicker.formatDate(tp_inst._defaults.altFormat, date, formatCfg) + altSeparator + altFormattedDateTime;
					}
					else {
						altFormattedDateTime = tp_inst.formattedDate + altSeparator + altFormattedDateTime;
					}
				}
				$(altField).val( inst.input.val() ? altFormattedDateTime : "");
			}
		}
		else {
			$.datepicker._base_updateAlternate(inst);	
		}
	};

	/*
	* Override key up event to sync manual input changes.
	*/
	$.datepicker._base_doKeyUp = $.datepicker._doKeyUp;
	$.datepicker._doKeyUp = function (event) {
		var inst = $.datepicker._getInst(event.target),
			tp_inst = $.datepicker._get(inst, 'timepicker');

		if (tp_inst) {
		    if (tp_inst._defaults.timeOnly && (inst.input.val() !== inst.lastVal)) {
				try {
					$.datepicker._updateDatepicker(inst);
				} catch (err) {
					$.timepicker.log(err);
				}
			}
		}

		return $.datepicker._base_doKeyUp(event);
	};

	/*
	* override "Today" button to also grab the time.
	*/
	$.datepicker._base_gotoToday = $.datepicker._gotoToday;
	$.datepicker._gotoToday = function (id) {
		var inst = this._getInst($(id)[0]),
			$dp = inst.dpDiv;
		var tp_inst = this._get(inst, 'timepicker');
		selectLocalTimezone(tp_inst);
		var now = new Date();
		this._setTime(inst, now);
		this._setDate(inst, now);
		this._base_gotoToday(id);
	};

	/*
	* Disable & enable the Time in the datetimepicker
	*/
	$.datepicker._disableTimepickerDatepicker = function (target) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');
		$(target).datepicker('getDate'); // Init selected[Year|Month|Day]
		if (tp_inst) {
			inst.settings.showTimepicker = false;
			tp_inst._defaults.showTimepicker = false;
			tp_inst._updateDateTime(inst);
		}
	};

	$.datepicker._enableTimepickerDatepicker = function (target) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');
		$(target).datepicker('getDate'); // Init selected[Year|Month|Day]
		if (tp_inst) {
			inst.settings.showTimepicker = true;
			tp_inst._defaults.showTimepicker = true;
			tp_inst._addTimePicker(inst); // Could be disabled on page load
			tp_inst._updateDateTime(inst);
		}
	};

	/*
	* Create our own set time function
	*/
	$.datepicker._setTime = function (inst, date) {
		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			var defaults = tp_inst._defaults;

			// calling _setTime with no date sets time to defaults
			tp_inst.hour = date ? date.getHours() : defaults.hour;
			tp_inst.minute = date ? date.getMinutes() : defaults.minute;
			tp_inst.second = date ? date.getSeconds() : defaults.second;
			tp_inst.millisec = date ? date.getMilliseconds() : defaults.millisec;
			tp_inst.microsec = date ? date.getMicroseconds() : defaults.microsec;

			//check if within min/max times.. 
			tp_inst._limitMinMaxDateTime(inst, true);

			tp_inst._onTimeChange();
			tp_inst._updateDateTime(inst);
		}
	};

	/*
	* Create new public method to set only time, callable as $().datepicker('setTime', date)
	*/
	$.datepicker._setTimeDatepicker = function (target, date, withDate) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');

		if (tp_inst) {
			this._setDateFromField(inst);
			var tp_date;
			if (date) {
				if (typeof date === "string") {
					tp_inst._parseTime(date, withDate);
					tp_date = new Date();
					tp_date.setHours(tp_inst.hour, tp_inst.minute, tp_inst.second, tp_inst.millisec);
					tp_date.setMicroseconds(tp_inst.microsec);
				} else {
					tp_date = new Date(date.getTime());
					tp_date.setMicroseconds(date.getMicroseconds());
				}
				if (tp_date.toString() === 'Invalid Date') {
					tp_date = undefined;
				}
				this._setTime(inst, tp_date);
			}
		}

	};

	/*
	* override setDate() to allow setting time too within Date object
	*/
	$.datepicker._base_setDateDatepicker = $.datepicker._setDateDatepicker;
	$.datepicker._setDateDatepicker = function (target, _date) {
		var inst = this._getInst(target);
		var date = _date;
		if (!inst) {
			return;
		}

		if (typeof(_date) === 'string') {
			date = new Date(_date);
			if (!date.getTime()) {
				this._base_setDateDatepicker.apply(this, arguments);
				date = $(target).datepicker('getDate');
			}
		}

		var tp_inst = this._get(inst, 'timepicker');
		var tp_date;
		if (date instanceof Date) {
			tp_date = new Date(date.getTime());
			tp_date.setMicroseconds(date.getMicroseconds());
		} else {
			tp_date = date;
		}
		
		// This is important if you are using the timezone option, javascript's Date 
		// object will only return the timezone offset for the current locale, so we 
		// adjust it accordingly.  If not using timezone option this won't matter..
		// If a timezone is different in tp, keep the timezone as is
		if (tp_inst && tp_date) {
			// look out for DST if tz wasn't specified
			if (!tp_inst.support.timezone && tp_inst._defaults.timezone === null) {
				tp_inst.timezone = tp_date.getTimezoneOffset() * -1;
			}
			date = $.timepicker.timezoneAdjust(date, tp_inst.timezone);
			tp_date = $.timepicker.timezoneAdjust(tp_date, tp_inst.timezone);
		}

		this._updateDatepicker(inst);
		this._base_setDateDatepicker.apply(this, arguments);
		this._setTimeDatepicker(target, tp_date, true);
	};

	/*
	* override getDate() to allow getting time too within Date object
	*/
	$.datepicker._base_getDateDatepicker = $.datepicker._getDateDatepicker;
	$.datepicker._getDateDatepicker = function (target, noDefault) {
		var inst = this._getInst(target);
		if (!inst) {
			return;
		}

		var tp_inst = this._get(inst, 'timepicker');

		if (tp_inst) {
			// if it hasn't yet been defined, grab from field
			if (inst.lastVal === undefined) {
				this._setDateFromField(inst, noDefault);
			}

			var date = this._getDate(inst);
			var currDT = $.trim((tp_inst.$altInput && tp_inst._defaults.altFieldTimeOnly) ? tp_inst.$input.val() + ' ' + tp_inst.$altInput.val() : tp_inst.$input.val());
			if (date && tp_inst._parseTime(currDT, !inst.settings.timeOnly)) {
				date.setHours(tp_inst.hour, tp_inst.minute, tp_inst.second, tp_inst.millisec);
				date.setMicroseconds(tp_inst.microsec);

				// This is important if you are using the timezone option, javascript's Date 
				// object will only return the timezone offset for the current locale, so we 
				// adjust it accordingly.  If not using timezone option this won't matter..
				if (tp_inst.timezone != null) {
					// look out for DST if tz wasn't specified
					if (!tp_inst.support.timezone && tp_inst._defaults.timezone === null) {
						tp_inst.timezone = date.getTimezoneOffset() * -1;
					}
					date = $.timepicker.timezoneAdjust(date, tp_inst.timezone);
				}
			}
			return date;
		}
		return this._base_getDateDatepicker(target, noDefault);
	};

	/*
	* override parseDate() because UI 1.8.14 throws an error about "Extra characters"
	* An option in datapicker to ignore extra format characters would be nicer.
	*/
	$.datepicker._base_parseDate = $.datepicker.parseDate;
	$.datepicker.parseDate = function (format, value, settings) {
		var date;
		try {
			date = this._base_parseDate(format, value, settings);
		} catch (err) {
			// Hack!  The error message ends with a colon, a space, and
			// the "extra" characters.  We rely on that instead of
			// attempting to perfectly reproduce the parsing algorithm.
			if (err.indexOf(":") >= 0) {
				date = this._base_parseDate(format, value.substring(0, value.length - (err.length - err.indexOf(':') - 2)), settings);
				$.timepicker.log("Error parsing the date string: " + err + "\ndate string = " + value + "\ndate format = " + format);
			} else {
				throw err;
			}
		}
		return date;
	};

	/*
	* override formatDate to set date with time to the input
	*/
	$.datepicker._base_formatDate = $.datepicker._formatDate;
	$.datepicker._formatDate = function (inst, day, month, year) {
		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			tp_inst._updateDateTime(inst);
			return tp_inst.$input.val();
		}
		return this._base_formatDate(inst);
	};

	/*
	* override options setter to add time to maxDate(Time) and minDate(Time). MaxDate
	*/
	$.datepicker._base_optionDatepicker = $.datepicker._optionDatepicker;
	$.datepicker._optionDatepicker = function (target, name, value) {
		var inst = this._getInst(target),
			name_clone;
		if (!inst) {
			return null;
		}

		var tp_inst = this._get(inst, 'timepicker');
		if (tp_inst) {
			var min = null,
				max = null,
				onselect = null,
				overrides = tp_inst._defaults.evnts,
				fns = {},
				prop,
				ret,
				oldVal,
				$target;
			if (typeof name === 'string') { // if min/max was set with the string
				if (name === 'minDate' || name === 'minDateTime') {
					min = value;
				} else if (name === 'maxDate' || name === 'maxDateTime') {
					max = value;
				} else if (name === 'onSelect') {
					onselect = value;
				} else if (overrides.hasOwnProperty(name)) {
					if (typeof (value) === 'undefined') {
						return overrides[name];
					}
					fns[name] = value;
					name_clone = {}; //empty results in exiting function after overrides updated
				}
			} else if (typeof name === 'object') { //if min/max was set with the JSON
				if (name.minDate) {
					min = name.minDate;
				} else if (name.minDateTime) {
					min = name.minDateTime;
				} else if (name.maxDate) {
					max = name.maxDate;
				} else if (name.maxDateTime) {
					max = name.maxDateTime;
				}
				for (prop in overrides) {
					if (overrides.hasOwnProperty(prop) && name[prop]) {
						fns[prop] = name[prop];
					}
				}
			}
			for (prop in fns) {
				if (fns.hasOwnProperty(prop)) {
					overrides[prop] = fns[prop];
					if (!name_clone) { name_clone = $.extend({}, name); }
					delete name_clone[prop];
				}
			}
			if (name_clone && isEmptyObject(name_clone)) { return; }
			if (min) { //if min was set
				if (min === 0) {
					min = new Date();
				} else {
					min = new Date(min);
				}
				tp_inst._defaults.minDate = min;
				tp_inst._defaults.minDateTime = min;
			} else if (max) { //if max was set
				if (max === 0) {
					max = new Date();
				} else {
					max = new Date(max);
				}
				tp_inst._defaults.maxDate = max;
				tp_inst._defaults.maxDateTime = max;
			} else if (onselect) {
				tp_inst._defaults.onSelect = onselect;
			}

			// Datepicker will override our date when we call _base_optionDatepicker when 
			// calling minDate/maxDate, so we will first grab the value, call 
			// _base_optionDatepicker, then set our value back.
			if(min || max){
				$target = $(target);
				oldVal = $target.datetimepicker('getDate');
				ret = this._base_optionDatepicker.call($.datepicker, target, name_clone || name, value);
				$target.datetimepicker('setDate', oldVal);
				return ret;
			}
		}
		if (value === undefined) {
			return this._base_optionDatepicker.call($.datepicker, target, name);
		}
		return this._base_optionDatepicker.call($.datepicker, target, name_clone || name, value);
	};
	
	/*
	* jQuery isEmptyObject does not check hasOwnProperty - if someone has added to the object prototype,
	* it will return false for all objects
	*/
	var isEmptyObject = function (obj) {
		var prop;
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	};

	/*
	* jQuery extend now ignores nulls!
	*/
	var extendRemove = function (target, props) {
		$.extend(target, props);
		for (var name in props) {
			if (props[name] === null || props[name] === undefined) {
				target[name] = props[name];
			}
		}
		return target;
	};

	/*
	* Determine by the time format which units are supported
	* Returns an object of booleans for each unit
	*/
	var detectSupport = function (timeFormat) {
		var tf = timeFormat.replace(/'.*?'/g, '').toLowerCase(), // removes literals
			isIn = function (f, t) { // does the format contain the token?
					return f.indexOf(t) !== -1 ? true : false;
				};
		return {
				hour: isIn(tf, 'h'),
				minute: isIn(tf, 'm'),
				second: isIn(tf, 's'),
				millisec: isIn(tf, 'l'),
				microsec: isIn(tf, 'c'),
				timezone: isIn(tf, 'z'),
				ampm: isIn(tf, 't') && isIn(timeFormat, 'h'),
				iso8601: isIn(timeFormat, 'Z')
			};
	};

	/*
	* Converts 24 hour format into 12 hour
	* Returns 12 hour without leading 0
	*/
	var convert24to12 = function (hour) {
		hour %= 12;

		if (hour === 0) {
			hour = 12;
		}

		return String(hour);
	};

	var computeEffectiveSetting = function (settings, property) {
		return settings && settings[property] ? settings[property] : $.timepicker._defaults[property];
	};

	/*
	* Splits datetime string into date and time substrings.
	* Throws exception when date can't be parsed
	* Returns {dateString: dateString, timeString: timeString}
	*/
	var splitDateTime = function (dateTimeString, timeSettings) {
		// The idea is to get the number separator occurrences in datetime and the time format requested (since time has
		// fewer unknowns, mostly numbers and am/pm). We will use the time pattern to split.
		var separator = computeEffectiveSetting(timeSettings, 'separator'),
			format = computeEffectiveSetting(timeSettings, 'timeFormat'),
			timeParts = format.split(separator), // how many occurrences of separator may be in our format?
			timePartsLen = timeParts.length,
			allParts = dateTimeString.split(separator),
			allPartsLen = allParts.length;

		if (allPartsLen > 1) {
			return {
				dateString: allParts.splice(0, allPartsLen - timePartsLen).join(separator),
				timeString: allParts.splice(0, timePartsLen).join(separator)
			};
		}

		return {
			dateString: dateTimeString,
			timeString: ''
		};
	};

	/*
	* Internal function to parse datetime interval
	* Returns: {date: Date, timeObj: Object}, where
	*   date - parsed date without time (type Date)
	*   timeObj = {hour: , minute: , second: , millisec: , microsec: } - parsed time. Optional
	*/
	var parseDateTimeInternal = function (dateFormat, timeFormat, dateTimeString, dateSettings, timeSettings) {
		var date,
			parts,
			parsedTime;

		parts = splitDateTime(dateTimeString, timeSettings);
		date = $.datepicker._base_parseDate(dateFormat, parts.dateString, dateSettings);

		if (parts.timeString === '') {
			return {
				date: date
			};
		}

		parsedTime = $.datepicker.parseTime(timeFormat, parts.timeString, timeSettings);

		if (!parsedTime) {
			throw 'Wrong time format';
		}

		return {
			date: date,
			timeObj: parsedTime
		};
	};

	/*
	* Internal function to set timezone_select to the local timezone
	*/
	var selectLocalTimezone = function (tp_inst, date) {
		if (tp_inst && tp_inst.timezone_select) {
			var now = date || new Date();
			tp_inst.timezone_select.val(-now.getTimezoneOffset());
		}
	};

	/*
	* Create a Singleton Instance
	*/
	$.timepicker = new Timepicker();

	/**
	 * Get the timezone offset as string from a date object (eg '+0530' for UTC+5.5)
	 * @param {number} tzMinutes if not a number, less than -720 (-1200), or greater than 840 (+1400) this value is returned
	 * @param {boolean} iso8601 if true formats in accordance to iso8601 "+12:45"
	 * @return {string}
	 */
	$.timepicker.timezoneOffsetString = function (tzMinutes, iso8601) {
		if (isNaN(tzMinutes) || tzMinutes > 840 || tzMinutes < -720) {
			return tzMinutes;
		}

		var off = tzMinutes,
			minutes = off % 60,
			hours = (off - minutes) / 60,
			iso = iso8601 ? ':' : '',
			tz = (off >= 0 ? '+' : '-') + ('0' + Math.abs(hours)).slice(-2) + iso + ('0' + Math.abs(minutes)).slice(-2);
		
		if (tz === '+00:00') {
			return 'Z';
		}
		return tz;
	};

	/**
	 * Get the number in minutes that represents a timezone string
	 * @param  {string} tzString formatted like "+0500", "-1245", "Z"
	 * @return {number} the offset minutes or the original string if it doesn't match expectations
	 */
	$.timepicker.timezoneOffsetNumber = function (tzString) {
		var normalized = tzString.toString().replace(':', ''); // excuse any iso8601, end up with "+1245"

		if (normalized.toUpperCase() === 'Z') { // if iso8601 with Z, its 0 minute offset
			return 0;
		}

		if (!/^(\-|\+)\d{4}$/.test(normalized)) { // possibly a user defined tz, so just give it back
			return tzString;
		}

		return ((normalized.substr(0, 1) === '-' ? -1 : 1) * // plus or minus
					((parseInt(normalized.substr(1, 2), 10) * 60) + // hours (converted to minutes)
					parseInt(normalized.substr(3, 2), 10))); // minutes
	};

	/**
	 * No way to set timezone in js Date, so we must adjust the minutes to compensate. (think setDate, getDate)
	 * @param  {Date} date
	 * @param  {string} toTimezone formatted like "+0500", "-1245"
	 * @return {Date}
	 */
	$.timepicker.timezoneAdjust = function (date, toTimezone) {
		var toTz = $.timepicker.timezoneOffsetNumber(toTimezone);
		if (!isNaN(toTz)) {
			date.setMinutes(date.getMinutes() + -date.getTimezoneOffset() - toTz);
		}
		return date;
	};

	/**
	 * Calls `timepicker()` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * n.b. The input value must be correctly formatted (reformatting is not supported)
	 * @param  {Element} startTime
	 * @param  {Element} endTime
	 * @param  {Object} options Options for the timepicker() call
	 * @return {jQuery}
	 */
	$.timepicker.timeRange = function (startTime, endTime, options) {
		return $.timepicker.handleRange('timepicker', startTime, endTime, options);
	};

	/**
	 * Calls `datetimepicker` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * @param  {Element} startTime
	 * @param  {Element} endTime
	 * @param  {Object} options Options for the `timepicker()` call. Also supports `reformat`,
	 *   a boolean value that can be used to reformat the input values to the `dateFormat`.
	 * @param  {string} method Can be used to specify the type of picker to be added
	 * @return {jQuery}
	 */
	$.timepicker.datetimeRange = function (startTime, endTime, options) {
		$.timepicker.handleRange('datetimepicker', startTime, endTime, options);
	};

	/**
	 * Calls `datepicker` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * @param  {Element} startTime
	 * @param  {Element} endTime
	 * @param  {Object} options Options for the `timepicker()` call. Also supports `reformat`,
	 *   a boolean value that can be used to reformat the input values to the `dateFormat`.
	 * @return {jQuery}
	 */
	$.timepicker.dateRange = function (startTime, endTime, options) {
		$.timepicker.handleRange('datepicker', startTime, endTime, options);
	};

	/**
	 * Calls `method` on the `startTime` and `endTime` elements, and configures them to
	 * enforce date range limits.
	 * @param  {string} method Can be used to specify the type of picker to be added
	 * @param  {Element} startTime
	 * @param  {Element} endTime
	 * @param  {Object} options Options for the `timepicker()` call. Also supports `reformat`,
	 *   a boolean value that can be used to reformat the input values to the `dateFormat`.
	 * @return {jQuery}
	 */
	$.timepicker.handleRange = function (method, startTime, endTime, options) {
		options = $.extend({}, {
			minInterval: 0, // min allowed interval in milliseconds
			maxInterval: 0, // max allowed interval in milliseconds
			start: {},      // options for start picker
			end: {}         // options for end picker
		}, options);

		// for the mean time this fixes an issue with calling getDate with timepicker()
		var timeOnly = false;
		if(method === 'timepicker'){
			timeOnly = true;
			method = 'datetimepicker';
		}

		function checkDates(changed, other) {
			var startdt = startTime[method]('getDate'),
				enddt = endTime[method]('getDate'),
				changeddt = changed[method]('getDate');

			if (startdt !== null) {
				var minDate = new Date(startdt.getTime()),
					maxDate = new Date(startdt.getTime());

				minDate.setMilliseconds(minDate.getMilliseconds() + options.minInterval);
				maxDate.setMilliseconds(maxDate.getMilliseconds() + options.maxInterval);

				if (options.minInterval > 0 && minDate > enddt) { // minInterval check
					endTime[method]('setDate', minDate);
				}
				else if (options.maxInterval > 0 && maxDate < enddt) { // max interval check
					endTime[method]('setDate', maxDate);
				}
				else if (startdt > enddt) {
					other[method]('setDate', changeddt);
				}
			}
		}

		function selected(changed, other, option) {
			if (!changed.val()) {
				return;
			}
			var date = changed[method].call(changed, 'getDate');
			if (date !== null && options.minInterval > 0) {
				if (option === 'minDate') {
					date.setMilliseconds(date.getMilliseconds() + options.minInterval);
				}
				if (option === 'maxDate') {
					date.setMilliseconds(date.getMilliseconds() - options.minInterval);
				}
			}
			
			if (date.getTime) {
				other[method].call(other, 'option', option, date);
			}
		}

		$.fn[method].call(startTime, $.extend({
			timeOnly: timeOnly,
			onClose: function (dateText, inst) {
				checkDates($(this), endTime);
			},
			onSelect: function (selectedDateTime) {
				selected($(this), endTime, 'minDate');
			}
		}, options, options.start));
		$.fn[method].call(endTime, $.extend({
			timeOnly: timeOnly,
			onClose: function (dateText, inst) {
				checkDates($(this), startTime);
			},
			onSelect: function (selectedDateTime) {
				selected($(this), startTime, 'maxDate');
			}
		}, options, options.end));

		checkDates(startTime, endTime);
		
		selected(startTime, endTime, 'minDate');
		selected(endTime, startTime, 'maxDate');

		return $([startTime.get(0), endTime.get(0)]);
	};

	/**
	 * Log error or data to the console during error or debugging
	 * @param  {Object} err pass any type object to log to the console during error or debugging
	 * @return {void}
	 */
	$.timepicker.log = function () {
		if (window.console) {
			window.console.log.apply(window.console, Array.prototype.slice.call(arguments));
		}
	};

	/*
	 * Add util object to allow access to private methods for testability.
	 */
	$.timepicker._util = {
		_extendRemove: extendRemove,
		_isEmptyObject: isEmptyObject,
		_convert24to12: convert24to12,
		_detectSupport: detectSupport,
		_selectLocalTimezone: selectLocalTimezone,
		_computeEffectiveSetting: computeEffectiveSetting,
		_splitDateTime: splitDateTime,
		_parseDateTimeInternal: parseDateTimeInternal
	};

	/*
	* Microsecond support
	*/
	if (!Date.prototype.getMicroseconds) {
		Date.prototype.microseconds = 0;
		Date.prototype.getMicroseconds = function () { return this.microseconds; };
		Date.prototype.setMicroseconds = function (m) {
			this.setMilliseconds(this.getMilliseconds() + Math.floor(m / 1000));
			this.microseconds = m % 1000;
			return this;
		};
	}

	/*
	* Keep up with the version
	*/
	$.timepicker.version = "1.5.5";

}));
﻿; (function ($, window) {

    //Enusre that global variables exists
    var EQ = window.EQ = window.EQ || {};


    /// <namespace name="EQ.client" version="1.0.0">
    /// <summary>
    /// Contains several functions which help initilize and manage EasyQuery widgets and simplify the communications with server-side code.
    /// </summary>
    /// </namespace>

    EQ.client = {

        defaultQuery : new EQ.core.Query(),

        serviceUrl: "EasyQuery",
		
        locale: '', //English, default

        _currentOptions: {},

        _modelPromise: null,

        _updateActionUrls: function() {
            var eqCore = EQ.core;
            this.loadModelUrl = eqCore.combinePath(this.serviceUrl, "GetModel");
            this.newQueryUrl = eqCore.combinePath(this.serviceUrl, "NewQuery");
            this.loadQueryUrl = eqCore.combinePath(this.serviceUrl, "GetQuery");
            this.saveQueryUrl = eqCore.combinePath(this.serviceUrl, "SaveQuery");
            this.buildQueryUrl = eqCore.combinePath(this.serviceUrl, "BuildQuery");
            this.syncQueryUrl = eqCore.combinePath(this.serviceUrl, "SyncQuery");
            this.executeQueryUrl = eqCore.combinePath(this.serviceUrl, "ExecuteQuery");
            this.executeSqlUrl = eqCore.combinePath(this.serviceUrl, "ExecuteSql");
            this.listRequestUrl = eqCore.combinePath(this.serviceUrl, "GetList");
            this.loadQueryListUrl = eqCore.combinePath(this.serviceUrl, "GetQueryList");
            this.removeQueryUrl = eqCore.combinePath(this.serviceUrl, "RemoveQuery");
            
        },

        _addAntiForgeryToken: function (data) {
            if (!this.antiForgeryToken) return data;
            
            data.__RequestVerificationToken = this.antiForgeryToken;
            return data;
        },

        //Deprecated. Left for backward compatibility
        defaultListRequestHandler: function (listName, onResult) {
            //simply do nothing
        },
        
        //Deprecated. Left for backward compatibility
        queryChanged: function (callback, remove) {
            if (remove) {
                this.defaultQuery.removeChangedCallback(callback);
            }
            else {
                this.defaultQuery.addChangedCallback(callback);
            }
        },

        controls: {},

        initControlsDefault: function (options) {
            var opts = options || {};
            var queryContentInputId = options.queryContentInputId || "QueryContentJson"
            var queryPanelId = options.queryPanelId || "QueryPanel";
            var columnsPanelId = options.columnsPanelId || "ColumnsPanel";
            var columnsBarId = options.columnsBarId || "ColumnsBar";
            var entitiesPanelId = options.entitiesPanelId || "EntitiesPanel";
            var filterBarId = options.filterBarId || "FilterBar";

            var queryContentInput = $("#" + queryContentInputId);
            if (queryContentInput.length > 0) {
                this.controls.queryContentInput = queryContentInput;
            }


            var QP = $('#' + queryPanelId);
            if (QP.length > 0) {
                opts.queryPanel = opts.queryPanel || {};
                QP.QueryPanel(opts.queryPanel);
                QP.QueryPanel("setQuery", this.defaultQuery);

                this.controls.QPWidget = QP;
            }

            var CP = $('#' + columnsPanelId);
            if (CP.length > 0) {
                opts.columnsPanel = opts.columnsPanel || {};
                opts.columnsPanel.query = this.defaultQuery;
                CP.ColumnsPanel(opts.columnsPanel);
                CP.ColumnsPanel("setQuery", this.defaultQuery);
                this.controls.CPWidget = CP;
            }

            var CB = $('#' + columnsBarId);
            if (CB.length > 0) {
                opts.columnsBar = opts.columnsBar || {};
                opts.columnsBar.query = this.defaultQuery;
                CB.ColumnsBar(opts.columnsBar);
                CB.ColumnsBar("setQuery", this.defaultQuery);
                this.controls.CBWidget = CB;
            }

            var EP = $('#' + entitiesPanelId);
            if (EP.length > 0) {
                opts.entitiesPanel = opts.entitiesPanel || {};
                EP.EntitiesPanel(opts.entitiesPanel);
                EP.EntitiesPanel("setQuery", this.defaultQuery);

                this.controls.EPWidget = EP;
            }

            var FB = $('#' + filterBarId);
            if (FB.length > 0) {
                opts.filterBar = opts.filterBar || {};
                FB.FilterBar(opts.filterBar);
                FB.FilterBar("setQuery", this.defaultQuery);
                this.controls.FBWidget = FB;
            }
        },

        /// <function name="init" version="1.0.0">
        /// <summary>
        /// Initializes all EasyQuery objects and widgets.
        /// </summary>
        /// <notes>
        /// You don't need to call this function directly if eq.view.js or eq.report.js script is used since the initilization code of those scriptions calls this function automatically. 
        /// </notes>
        /// <param name="options" type="Object">
        /// A map of options to pass to EasyQuery core objects and widgets.
        /// By default all parameters are taken directly from easyQuerySettings global variable
        /// <prop name="serviceUrl" type="String" default="EasyQuery">
        /// an URL (absolute or relative) to the back-end service or controller which implements basic <see cref="/easyquery/javascript/server-side">EasyQuery actions</see>
        /// </prop>
        /// <prop name="modelName" type="String" default="">
        /// the name of the data model which will be automatically during initialization;
        /// </prop>
        /// <prop name="columnsPanel" type="Object" default="">
        /// A map of different options for <see cref="/easyquery/javascript/columnspanel-widget">ColumnsPanel widget</see>.
        /// </prop>
        /// </param>
        /// <example>
        /// <code>
        ///    EQ.client.init({
        ///        serviceUrl: "EQService.asmx",
        ///        modelName: "nwind",
        ///        columnsPanel: { allowAggrColumns: true, attrElementFormat: "{attr}", showColumnCaptions: false  },
        ///        queryPanel: { listRequestHandler: onListRequest }
        ///    });
        /// </code>
        /// </example>
        /// </function>
        init: function (options) {
            options = options || window.easyQuerySettings || this._currentOptions;
            this._currentOptions = options;

			this.defaultQuery.attrClassName = options.attrClassName || "ENTATTR";
			
            if (options.serviceUrl) {
                this.serviceUrl = options.serviceUrl;
            }

            if (options.menuOptions) {
                var mmo = this.menuOptions;
                var omo = options.menuOptions;
                for (var attr in mmo) {
                    if (mmo.hasOwnProperty(attr) && omo.hasOwnProperty(attr))
                        mmo[attr] = omo[attr];
                }
            }
            
            if (options.defaultQueryId) {
                this.defaultQuery.setId(options.defaultQueryId);                
            }


            this._updateActionUrls();

            if (options.loadModelUrl)
                this.loadModelUrl = options.loadModelUrl;
            
            if (options.newQueryUrl)
                this.newQueryUrl = options.newQueryUrl;

            if (options.loadQueryUrl)
                this.loadQueryUrl = options.loadQueryUrl;

            if (options.saveQueryUrl)
                this.saveQueryUrl = options.saveQueryUrl;
        
            if (options.buildQueryUrl)
                this.buildQueryUrl = options.buildQueryUrl;
            
            if (options.syncQueryUrl)
                this.syncQueryUrl = options.syncQueryUrl;
			
            if (options.executeQueryUrl)
                this.executeQueryUrl = options.executeQueryUrl;

            if (options.executeSqlUrl)
                this.executeSqlUrl = options.executeSqlUrl;

            if (options.listRequestUrl)
                this.listRequestUrl = options.listRequestUrl;

            if (options.useBootstrap)
                this.useBootstrap = options.useBootstrap;

            this.modelName = options.modelName || "";
            this.modelId = options.modelId || options.modelName;

            this.initialQuery = options.initialQuery;

            this.loadDefaultQuery = false;

            if (options.loadQueryOnStart)
                this.loadDefaultQuery = options.loadQueryOnStart;

            if (options.loadDefaultQuery)
                this.loadDefaultQuery = options.loadDefaultQuery;

            var defaultQueryName = options.defaultQueryName || "";
            var defaultQueryId = options.defaultQueryId || "";

            

            this.antiForgeryToken = options.antiForgeryToken;

            if (options.locale)
                this.locale = options.locale;

            options.queryPanel = options.queryPanel || {};

            var self = this;

            var serverListRequestHandler = function (params, onResult) {
                var requestData = self._addAntiForgeryToken(params);
                $.ajax({
                    type: "POST",
                    url: self.listRequestUrl,
                    data: requestData,
                    dataType: "json",
                    success: function (data) {
                        onResult(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        onResult(null);
                    }
                });
            }


            //this.defaultQuery.listRequestUrl = this.listRequestUrl;
            this.defaultQuery.clientListRequestHandler = options.listRequestHandler || options.queryPanel.listRequestHandler; //to support old style
            this.defaultQuery.serverListRequestHandler = serverListRequestHandler;
            //this.defaultQuery.antiForgeryToken = options.antiForgeryToken;

            if (options.onInit)
                this.onInit = options.onInit;

            this.initControlsDefault(options);

            if (this.modelId || options.loadDefaultModel) {
                var modelId = options.loadDefaultModel ? "" : this.modelId;

                this.loadModel({
                    "modelId": modelId,
                    "modelName" : modelId,
                    success: function (data) {
                        var query = self.getQuery();
                        if (self.initialQuery) {
                            query.setObject(self.initialQuery);
                        }


                        if (self.controls.queryContentInput) {
                            query.setObject(self.controls.queryContentInput.val())
                        }


                        if (self.loadDefaultQuery) {
                            self.loadQuery({ 
                                queryId: defaultQueryId || defaultQueryName,
                                success: function () {
                                    //if we load query on start - then we should call onInit only after its successful loading
                                    if (self.onInit)
                                        self.onInit();           
                                }
                            });
                        }
                        else {
                            if (self.onInit)
                                self.onInit();           
                        }

                        if (self.onInitialModelLoad)
                            self.onInitialModelLoad(data);

                        if (options.onLoadModel)
                            options.onLoadModel(data);
                    }
                });
            }
        },


        getQuery: function () {
            return this.defaultQuery;
        },


        refreshWidgets: function(includeModelBinded) {
            if (includeModelBinded && this.controls.EPWidget) {
                this.controls.EPWidget.EntitiesPanel("refresh");
            }

            if (this.controls.QPWidget) {
                this.controls.QPWidget.QueryPanel('refresh');
                //self.controls.QPWidget.QueryPanel('option', 'model', data);
                //query = self.controls.QPWidget.QueryPanel('option', 'query');
            }

            if (this.controls.CPWidget) {
                this.controls.CPWidget.ColumnsPanel("refresh");
                //self.controls.CPWidget.ColumnsPanel('setQuery', query);
            }

            if (this.controls.CBWidget) {
                this.controls.CBWidget.ColumnsBar("refresh");
            }

            if (this.controls.FBWidget) {
                this.controls.FBWidget.FilterBar("refresh");
            }

        },

        /// <function name="loadModel" version="1.0.0">
        /// <summary>
        /// Sends a "LoadModel" requests to the server and processes the response.
        /// </summary>
        /// <param name="options" type="Object">
        /// A map of options to pass to loadModel function.
        /// <prop name="modelName" type="String">
        /// The name of data model to load.
        /// </prop>
        /// <prop name="success" type="Function">
        /// The function that is called on successfull model loading. 
        /// Loaded model object is passed in function's parameter.
        /// </prop>
        /// <prop name="beforeSend" type="Function">
        /// A function that is called before LoadModel request call.
        /// </prop>
        /// </param>
        /// <example>
        /// <code>
        /// EQ.client.loadModel({modelName: "MyModel", success: function(modelJSON) {
        ///     alert("Model loaded!");
        /// });
        /// </code>
        /// </example>
        /// </function>
        loadModel: function (options) {
            var self = this;
            options = options || {};
            var modelId = options.modelId || "";
            var modelName = options.modelName || "";

            var requestData = this._addAntiForgeryToken({ "modelId": modelId, "modelName": modelName });

            if (self.controls.EPWidget) {
                self.controls.EPWidget.EntitiesPanel("startLoading");
            };

            this._modelPromise = $.ajax({
                type: "POST",
                url: EQ.client.loadModelUrl,

                data: requestData, //"{name:'" + modelName + "'}",
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: options.beforeSend,
                crossDomain: false,
                success: function (data) {
                    //console.log(data);
                    self.defaultQuery.loadModelObject(data);
                    self.refreshWidgets(true);

                    if (self.controls.EPWidget) {
                        self.controls.EPWidget.EntitiesPanel("finishLoading");
                    }

                    if (options.success) {
                        options.success(data);
                    }

                },
                error: function (request, textStatus, errorThrown) {
                    if (self.controls.EPWidget) {
                        self.controls.EPWidget.EntitiesPanel("finishLoading");
                    }

                    if (options.error) {
                        options.error(request.status, request.responseText, "LoadModel");
                    }
                    else {
                        alert("LoadModel error: \n" + request.responseText);
                    }
                }

            });
        },


        _doWhenModelLoaded: function (doWhat) {
            var self = this;
            if (self.defaultQuery.model && !self.defaultQuery.model.isEmpty()) {
                if (self._modelPromise) {
                    self._modelPromise.done(doWhat);
                }
            }
        },

        newQuery: function (options) {
            var self = this;
            var requestData = this._addAntiForgeryToken({ "queryName": options.queryName, "modelId": options.modelId });

            self._doWhenModelLoaded(function () {
                $.ajax({
                    type: "POST",
                    url: EQ.client.newQueryUrl,
                    data: requestData,
                    dataType: "json",
                    beforeSend: options.beforeSend,
                    success: function (data) {
                        self.defaultQuery.setObject(data);

                        self.refreshWidgets();

                        if (options.success) {
                            options.success(self.defaultQuery);
                        }

                    },

                    error: function (request, textStatus, errorThrown) {
                        if (options.error) {
                            options.error(request.status, request.responseText, "NewQuery");
                        }
                        else {
                            alert("NewQuery error: \n" + request.responseText);
                        }
                    }
                });
            });
        },

        /// <function name="loadQuery" version="1.0.0">
        /// <summary>
        /// Sends a "LoadQuery" request to the server and processes the response.
        /// </summary>
        /// <param name="options" type="Object">
        /// A map of options to pass to loadQuery function.
        /// <prop name="queryName" type="String">
        /// The name of query to load.
        /// </prop>
        /// <prop name="success" type="Function">
        /// A function that is called on successfull query load.
        /// Loaded data is passed in function parameter
        /// </prop>
        /// <prop name="beforeSend" type="Function">
        /// A function that is called before LoadQuery request call.
        /// </prop>
        /// <prop name="error" type="Function">
        /// A function that is called if some error occurrs during LoadQuery AJAX call.
        /// The function takes 3 parameters: response code (like 404), error message and the name of operation where the problem occurs ("LoadQuery" in this case)
        /// </prop>
        /// </param>
        /// <example>
        /// <code>
        /// EQ.client.loadQuery({queryName: "MyQuery", success: function(queryJSON) {
        ///     alert("Query loaded!");
        /// });
        /// </code>
        /// </example>
        /// </function>
        loadQuery: function (options) {
            var self = this;
            if (!options)
                options = {};
            if (!options.queryName)
                options.queryName = options.queryId;

            var requestData = this._addAntiForgeryToken({ "queryId": options.queryId, "queryName": options.queryName, "modelId": options.modelId });

            self._doWhenModelLoaded(function () {
                $.ajax({
                    type: "POST",
                    url: EQ.client.loadQueryUrl,
                    data: requestData,
                    dataType: "json",
                    beforeSend: options.beforeSend,
                    success: function (data) {
                        if (data.query)
                            self.defaultQuery.setObject(data.query, options.silent);
                        else
                            self.defaultQuery.setObject(data, options.silent);

                        self.refreshWidgets();

                        if (options.success) {
                            options.success(data);
                        }

                    },

                    error: function (request, textStatus, errorThrown) {
                        if (options.error) {
                            options.error(request.status, request.responseText, "LoadQuery");
                        }
                        else {
                            alert("LoadQuery error: \n" + request.responseText);
                        }
                    }
                });
            });

        },

        /// <function  version="1.0.0">
        /// <summary>
        /// Sends a "LoadQueryList" request to the server and processes the response.
        /// The request contains the name of current model
        /// </summary>
        /// <param name="options" type="Object">
        /// The map of options to pass to loadQuery function.
        /// <prop name="success" type="Function">
        /// The function that is called on successfull response.
        /// Requested list of queries is passed in the function parameter
        /// </prop>
        /// <prop name="beforeSend" type="Function">
        /// The function that is called before LoadQueryList request call.
        /// </prop>
        /// </param>
        /// <example>
        /// <code>
        /// EQ.client.loadQueryList({success: function(listJSON) {
        ///     alert("Queries: " + listJSON);
        /// });
        /// </code>
        /// </example>
        /// </function>
        loadQueryList: function (options) {
            var self = this;
            var modelId = options.modelId;
            var requestData = this._addAntiForgeryToken({ modelId: modelId });
            $.ajax({
                type: "GET",
                url: this.loadQueryListUrl,
                data: requestData,
                dataType: "json",
                beforeSend: options.beforeSend,
                success: function (data) {
                    if (options.success) {
                        options.success(data);
                    }

                },

                error: function (request, textStatus, errorThrown) {
                    if (options.error) {
                        options.error(request.status, request.responseText, "LoadQueryList");
                    }
                    else {
                        alert("LoadQueryList error: \n" + request.responseText);
                    }
                }
            });

        },

        removeQuery: function (options) {
            var query = this.getQuery();
            options = options || {};
            options.queryId = options.queryId || query.getId();

            var requestData = this._addAntiForgeryToken({ queryId: options.queryId });
            self = this;
            $.ajax({
                type: "POST",
                url: EQ.client.removeQueryUrl,
                data: requestData,
                dataType: "json",
                beforeSend: options.beforeSend,
                success: function (data) {
                    query.setId(null);
                    query.clear(true);

                    if (options.success) {
                        options.success(data);
                    }
                },
                error: function (request, textStatus, errorThrown) {
                    if (options.error) {
                        options.error(request.status, request.responseText, "SaveQuery");
                    }
                    else {
                        alert("RemoveQuery error: \n" + request.responseText);
                    }
                }
            });

        },


        /// <function version="1.0.0">
        /// <summary>
        /// Clears all conditions and columns in the current query.
        /// </summary>
        /// </function>
        clearQuery: function () {
            var self = this;
            var query = this.getQuery();
            query.clear();
        },




        /// <function name="saveQuery" version="1.0.0">
        /// <summary>
        /// Sends "SaveQuery" request to the server and processes the response.
        /// </summary>
        /// <param name="options" type="Object">
        /// The map of options to pass to SaveQuery function.
        /// <prop name="query" type="Object">
        /// The object that represents query to save.
        /// If not set - the current query is used.
        /// </prop>
        /// <prop name="queryName" type="String">
        /// The name of the query
        /// </prop>
        /// <prop name="success" type="Function">
        /// The function that is called on successfull query saving.
        /// </prop>
        /// <prop name="beforeSend" type="Function">
        /// The function that is called before SaveQuery request call.
        /// You can show some progress animation at this point.
        /// </prop>
        /// </param>
        /// </function>
        saveQuery: function (options) {
            options = options || {};
            var query = options.query || this.getQuery();
            var queryName;


            if (query) {
                queryName = options.queryName || query.getName();

                if (options.queryId)
                    query.setId(options.queryId);

                var requestData = this._addAntiForgeryToken({ queryJson: query.toJSON(), "queryName": queryName });
                self = this;
                $.ajax({
                    type: "POST",
                    url: EQ.client.saveQueryUrl,
                    data: requestData,
                    //contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    beforeSend: options.beforeSend,
                    success: function (data) {
                        if (data.query) //if a new query is returned - we put it into default query
                            self.defaultQuery.setObject(data.query);
                        self.refreshWidgets();

                        if (options.success) {
                            options.success(data);
                        }
                    },
                    error: function (request, textStatus, errorThrown) {
                        if (options.error) {
                            options.error(request.status, request.responseText, "SaveQuery");
                        }
                        else {
                            alert("SaveQuery error: \n" + request.responseText);
                        }
                    }
                });
            }
        },

        /// <function name="buildQuery" version="1.0.0">
        /// <summary>
        /// Sends "BuildQuery" request to the server and processes the response.
        /// </summary>
        /// <param name="params" type="Object">
        /// A map of parameters to pass to buildQuery function.
        /// <prop name="query" type="Object">
        /// An object that represents query to build. 
        /// </prop>
        /// <prop name="extraParams" type="String">
        /// A string that represents extra parameters which are added to the request
        /// </prop>
        /// <prop name="success" type="Function">
        /// A function that is called on successfull query build.
        /// This function takes one parameter which contains genereated statement in "statement" property
        /// or the error message in "error" property if some problem occurred during query building process.
        /// </prop>
        /// <prop name="beforeSend" type="Function">
        /// A function that is called before BuildQuery request call.
        /// </prop>
        /// </param>
        /// </function>
        buildQuery: function (params) {
            params = params || {};
            params.query = params.query || this.getQuery();

            if (params.query) {
                var options = params.options || {};
                var requestData = this._addAntiForgeryToken({ queryJson: params.query.toJSON(), optionsJson: JSON.stringify(options) });
                $.ajax({
                    type: "POST",
                    url: EQ.client.buildQueryUrl,
                    data: requestData,
                    //contentType: "application/json; charset=utf-8",
                    //contentType: "",
                    dataType: "json",
                    beforeSend: params.beforeSend,
                    success: function (data) {
                        if (params.success) {
                            params.success(data);
                        }
                    },
                    error: function (request, textStatus, errorThrown) {
                        if (params.error) {
                            params.error(request.status, request.responseText, "BuildQuery");
                        }
                        else {
                            alert("BuildQuery error: \n" + request.responseText);
                        }
                    }
                });
            }
        },

        /// <function name="syncQuery" version="1.0.0">
        /// <summary>
        /// Sends "SyncQuery" request to the server and processes the response.
        /// </summary>
        /// <param name="params" type="Object">
        /// A map of parameters to pass to buildQuery function.
        /// <prop name="query" type="Object">
        /// An object that represents query to build. 
        /// </prop>
        /// <prop name="extraParams" type="String">
        /// A string that represents extra parameters which are added to the request
        /// </prop>
        /// <prop name="success" type="Function">
        /// A function that is called on successfull query build.
        /// This function takes one parameter which contains genereated statement in "statement" property
        /// or the error message in "error" property if some problem occurred during query building process.
        /// </prop>
        /// <prop name="beforeSend" type="Function">
        /// A function that is called before BuildQuery request call.
        /// </prop>
        /// </param>
        /// </function>
        syncQuery: function (params) {
            params = params || {};
            params.query = params.query || this.getQuery();
            if (params.query) {
                var syncQueryOptions = window.easyQuerySettings ? window.easyQuerySettings.syncQueryOptions : null;
                var options = params.options || syncQueryOptions || {};
                var requestData = this._addAntiForgeryToken({ queryJson: params.query.toJSON(), optionsJson: JSON.stringify(options) });
                $.ajax({
                    type: "POST",
                    url: EQ.client.syncQueryUrl,
                    data: requestData,
                    dataType: "json",
                    beforeSend: params.beforeSend,
                    success: function (data) {
                        if (params.success) {
                            params.success(data);
                        }
                    },
                    error: function (request, textStatus, errorThrown) {
                        if (params.error) {
                            params.error(request.status, request.responseText, "SyncQuery");
                        }
                        else {
                            alert("SyncQuery error: \n" + request.responseText);
                        }
                    }
                });
            }

        },

        /// <function name="buildAndExecute" version="1.0.0">
        /// <summary>
        /// Sends "ExecuteQuery" request to the server and processes the response.
        /// </summary>
        /// <param name="params" type="Object">
        /// A map of parameters to pass to buildQuery function.
        /// <prop name="query" type="Object">
        /// An object that represents query to build and execute. 
        /// </prop>
        /// <prop name="extraParams" type="String">
        /// A string that represents extra parameters which are added to the request
        /// </prop>
        /// <prop name="success" type="Function">
        /// A function that is called on successfull query build.
        /// This function takes one parameter "data" - a plain object which contains genereated statement in its "statement" property
        /// and the result of query execution in "resultSet" property. <br />
        /// </prop>
        /// <prop name="beforeSend" type="Function">
        /// A function that is called before BuildQuery request call.
        /// </prop>
        /// </param>
        /// </function>
        buildAndExecute: function (params) {
            var self = this;
            params = params || {};
            params.query = params.query || this.getQuery();
            var options = params.options || {};
            var requestData = this._addAntiForgeryToken({ queryJson: params.query.toJSON(), optionsJson: JSON.stringify(options) });
            $.ajax({
                type: "POST",
                url: self.executeQueryUrl,
                data: requestData,
                //contentType: "application/json; charset=utf-8",
                dataType: "json",
                beforeSend: params.beforeSend,
                success: function (data) {
                    if (params.success) {
                        params.success(data);
                    }
                },
                error: function (request, textStatus, errorThrown) {
                    if (params.error) {
                        params.error(request.status, request.responseText, "ExecuteQuery");
                    }
                    else {
                        alert("ExecuteQuery error: \n" + request.responseText);
                    }
                }
            });
        }
        
    }

})(jQuery, window);
﻿;
var poweredByOption = {
    show: true
};﻿//----------------------------------
//  ConditionRow base widget
//----------------------------------
;(function ($, undefined) {

    $.widget("eqjs.ConditionRow", {
        _condition: null,
        _parentPredicate: null,
        _parentPredicateWidget: null,
        _buttonsBlock: null,
        _enableButton: null,
        _deleteButton: null,
        _addConditionButton: null,
        _addPredicateButton: null,
        _checkBox: null,

        _keepShowingButtons: false,
        _isMouseOverBlock: false,

        _active: false,

        options: {
            queryPanel: null
        },

        getQuery: function(){
            return this.options.queryPanel.getQuery();
        },

        getModel: function () {
            var query = this.getQuery();
            return query ? query.getModel() : null;
        },

        getCondition: function() {
            return this._condition;
        },

        getQueryPanel: function() {
            return this.options.queryPanel;
        },

        makeActive: function() {
            var queryPanel = this.getQueryPanel();
            if (queryPanel)
                queryPanel.setActiveConditionWidget(this);
        },

        init: function (condition, parent, parentWidget) {
            this.element.get(0).condition = condition;
            this._condition = condition;
            this._parentPredicate = parent;
            this._parentPredicateWidget = parentWidget;

            this.refresh();
            if (this._condition.initAsActive) {
                this.makeActive();
                delete this._condition.initAsActive;
            }
        },

        _render: function () {
            this._clear();
            if (this.getModel() && this._condition) {
                this._refreshByCondition();
                if (!this._condition.readOnly) {
                    this._initButtons();
                    this._initCheckbox();

                    if (this.getQueryPanel().options.activeCondition == this._condition) {
                        this.makeActive();
                    }
                }
                this._postRender();
            }
        },

        _postRender: function () {
        },

        refresh: function () {
            this._render();
        },

        _isDisabled: function() {
            return this._condition.enabled === false;
        },

        _isParameterized: function () {
            return this._condition.parameterized;
        },        

        _setOption: function (key, value) {
            if (arguments.length == 2) {
                if (key === "disabled") {
                    this._setConditionEnable(!value);
                }
                else if (key === "parameterized") {
                    this._setConditionParameterized(value);
                }
                else {
                    this.options[key] = value;
                    this._render();
                }
                return this;
            }
            else {
                if (key === "disabled")
                    return this._isDisabled();
                else if (key === "parameterized") {
                    return this._isParameterized();
                }
                else
                    return this.options[key];
            }
        },

        _setConditionEnable: function (value, avoidSubConditionsProcessing) {
            if (this._parentPredicate) { //otherwise it is root predicate, can't change Enable
                if (!value || !('enabled' in this._parentPredicate) || this._parentPredicate.enabled) { //can't enable condition/predicate, if parent predicate is disabled
                    this._setConditionEnableCore(this._condition, value, avoidSubConditionsProcessing);
                    if (!value) {
                        this._enableButton.removeClass('enabled');
                    }
                    else {
                        this._enableButton.addClass('enabled');
                    }
                    this._render();

                    this._fireConditionChange("change", this._condition);
                }
            }
        },

        _setConditionEnableCore: function (cond, value, avoidSubConditionsProcessing) {

            cond.enabled = value;
            if (cond.conditions && !avoidSubConditionsProcessing) {
                var condLength = cond.conditions.length;
                for (var condIdx = 0; condIdx < condLength; condIdx++) {
                    this._setConditionEnableCore(cond.conditions[condIdx], value);
                }
            }

            if (this._parentPredicateWidget) {
                this._parentPredicateWidget._checkAllDisabled();
            }
        },

        _setConditionParameterized: function(value){
            this._condition.parameterized = value;
            if (value) {
                this._paramButton.addClass('turnedon');
            }
            else {
                this._paramButton.removeClass('turnedon');
            }

            this._fireConditionChange("change", this._condition);
        },

        _clear: function () {
            this.element.html('');
            this.element.removeClass();
        },

        _refreshByCondition: function () {
        },


        _fireConditionChange: function (changeType, condition, conditionElement) {
            var self = this;
            this.getQuery().fireChangedEvent({
                "source": self.getQueryPanel(),
                "changeType": "condition." + changeType,
                "condition": condition,
                "element": conditionElement || self.element
            }, true);
        },


        remove: function () {
            var self = this;

            if (!self._parentPredicateWidget) return;

            self._parentPredicateWidget.removeCondition(self._condition);
        },

        isPredicate: function () {
            return false;
        },

        _getButtonsContainer: function () {
            return this.element;
        },


        _initButtons: function () {
            var self = this;

            var container = self._getButtonsContainer();
            var btnPlaceholder;

            if (!container) return;

            //navBlock.find('div').unbind();
            self._buttonsBlock = $("<div></div>")
                .addClass("eqjs-qp-condition-buttonsBlock")
                .appendTo(container);


            btnPlaceholder = $("<div></div>").addClass('eqjs-qp-button-placeholder').appendTo(self._buttonsBlock);
            self._addConditionButton = $("<div></div>")
                .addClass("eqjs-qp-condition-button eqjs-qp-condition-button-addCondition")
                .attr('title', EQ.core.getText('ButtonAddCondition'))
                .appendTo(btnPlaceholder)
                .click(function (evt) {
                    self._keepShowingButtons = true;
                    self.options.queryPanel.showEntitiesMenu({
                        anchor: self._addConditionButton, 
                        selectedIds:null, 
                        itemSelectedCallback: function (evt, data) {
                            var attrid = data.menuItem.data('id');
                            var attrobj = self.getModel().getAttributeById(attrid);
                            //var operid = attrobj.operators.length > 0 ? attrobj.operators[0] : 'Equal';

                            if ('addNewCondition' in self) {
                                self.addNewCondition(attrid);
                            }
                        },
                        menuClosesCallback: function () { //called when menu is closed
                            self._keepShowingButtons = false;
                            if (!self._isMouseOverBlock)
                                self._leaveButtonBlock();
                        }
                    });
                });

            

            btnPlaceholder = $("<div></div>").addClass('eqjs-qp-button-placeholder').appendTo(self._buttonsBlock);
            self._addPredicateButton = $("<div></div>")
                .addClass("eqjs-qp-condition-button eqjs-qp-condition-button-addPredicate")
                .attr('title', EQ.core.getText('ButtonAddPredicate'))
                .appendTo(btnPlaceholder)
                .click(function () {
                    if ('addNewPredicate' in self) {
                        self.addNewPredicate();
                    }
                });

            btnPlaceholder = $("<div></div>").addClass('eqjs-qp-button-placeholder').appendTo(self._buttonsBlock);
            self._paramButton = $("<div></div>")
                .addClass("eqjs-qp-condition-button eqjs-qp-condition-button-parameterization")
                .attr('title', EQ.core.getText('ButtonParameterization'))
                .appendTo(btnPlaceholder)
                .click(function () {
                    self.option('parameterized', !self._isParameterized());
                });


            btnPlaceholder = $("<div></div>").addClass('eqjs-qp-button-placeholder').appendTo(self._buttonsBlock);
            self._enableButton = $("<div></div>")
                .addClass("eqjs-qp-condition-button eqjs-qp-condition-button-enable")
                .attr('title', EQ.core.getText('ButtonEnable'))
                .appendTo(btnPlaceholder)
                .click(function () {
                    self.option('disabled', !self._isDisabled());

                    self._enableButton.trigger('mouseover');
                });

            btnPlaceholder = $("<div></div>").addClass('eqjs-qp-button-placeholder').appendTo(self._buttonsBlock);
            self._deleteButton = $("<div></div>")
                .addClass("eqjs-qp-condition-button eqjs-qp-condition-button-delete")
                .attr('title', EQ.core.getText('ButtonDelete'))
                .appendTo(btnPlaceholder)
                .click(function () {
                    self.remove();
                });

            if (self._isDisabled()) {
                self._enableButton.removeClass('enabled');
            }
            else {
                self._enableButton.addClass('enabled');
            }

            container.find('[class*=eqjs-qp-condition-button]').hover(
                function () {
                    $(this).addClass('eqjs-qp-condition-button-active');
                },
                function () {
                    $(this).removeClass('eqjs-qp-condition-button-active');
                }
            );

            container.bind('mouseenter', function (event) {
                self._isMouseOverBlock = true;
                self._enterButtonBlock();
                event.stopPropagation();
                return false;
            })
            .bind('mouseleave', function (event) {
                self._isMouseOverBlock = false;
                if (!self._keepShowingButtons && self._buttonsBlock.is(':visible')) {
                    self._leaveButtonBlock();
                }

                event.stopPropagation();
                return false;
            });

            self._hideButtons();
            self._adjustButtonsVisibility();
        },

        _initCheckbox: function () {
            var self = this;
            var container = self._getButtonsContainer();

            if (!container) return;

            if (self.options.queryPanel.options.showCheckboxes) {
                self._checkBox = $('<div></div>')
                    .addClass("eqjs-qp-condelement eqjs-qp-condition-checkbox")
                    .attr('title', EQ.core.getText('ButtonEnable'))
                    .prependTo(container)
                    .click(function () {
                        self.option('disabled', !self._isDisabled());
                        self._adjustCheckbox();

                        self._checkBox.trigger('mouseover');
                    });
                self._adjustCheckbox();
            }
        },

        _isFirstConditionInGroup: function () {
            var index = this._parentPredicate ? $.inArray(this._condition, this._parentPredicate.conditions) : 0;
            return (index == 0);
        },

        _renderConjunction: function () {
            var self = this;
            var container = self._getButtonsContainer();

            if (!container) return;

            if (self.options.queryPanel.options.showConjunctions && !self._isFirstConditionInGroup()) {
                var linkType = self._parentPredicate.linkType;
                var conjuctionText = EQ.core.getText("Conj" + linkType);
                if (conjuctionText) {
                    self._conjuction = $("<span>" + conjuctionText + "</span>")
                        .addClass("eqjs-qp-condelement eqjs-qp-condition-conjuction")
                        .prependTo(container);
                }
            }
        },

        _adjustCheckbox: function () {
            var self = this;

            if (!self._checkBox) return;

            if (self._condition.enabled === false) {
                self._checkBox.removeClass('enabled');
            }
            else {
                self._checkBox.addClass('enabled');
            }
        },

        _adjustButtonsVisibility: function () {

        },

        _enterButtonBlock: function () {
            this._showButtons();
        },

        _leaveButtonBlock: function () {
        },

        _showButtons: function () {

        },

        _hideButtons: function () {
            if (this._addConditionButton) {
                this._addConditionButton.hide();
            }
            if (this._addPredicateButton) {
                this._addPredicateButton.hide();
            }

            if (this._enableButton) {
                this._enableButton.hide();
            }

            if (this._paramButton) {
                this._paramButton.hide();
            }

            if (this._deleteButton) {
                this._deleteButton.hide();
            }

        },

        internalActivate: function () {
            this._active = true;
            this.adjustActiveClass();

            this._hideButtons();
            this._adjustButtonsVisibility();
            //this.refresh();
        },

        internalDeactivate: function () {
            this._active = false;
            this.adjustActiveClass();

            this._hideButtons();
            this._adjustButtonsVisibility();
            //this.refresh();
        },

        adjustActiveClass: function () {
            if (this._active && this.options.queryPanel.options.accentActiveCondition) {
                this.element.addClass("active");
            }
            else {
                this.element.removeClass("active");
            }
        },

/*
        setActiveConditionWidget: function () {
            this.options.queryPanel.setActiveConditionWidget(this);
        },
*/
        isActive: function () {
            return this._active;
        },

        getLevel: function () {
            if (this._parentPredicateWidget) {
                return this._parentPredicateWidget.getLevel() + 1;
            }
            else {
                return 0;
            }
        },

        _renderLevelOffset: function () {
            var level = this.getLevel();
            var offsetDiv;
            for (var i = 0; i < level - 1; i++) {
                offsetDiv = $('<div></div>')
                    .addClass('eqjs-qp-level-offset')
                    .prependTo(this._getButtonsContainer());
            }

        }

    })
})(jQuery);


//----------------------------------
//  ConditionRow_SMPL widget
//----------------------------------
(function ($, undefined) {

    $.widget("eqjs.ConditionRow_SMPL", $.eqjs.ConditionRow, {

        _postRender: function () {
            if (this.options.queryPanel.options.spreadValueElement) {
                //adjust value elements max-width

                var veList = this.element.find('.eqjs-qp-valueelement');
                if (veList.length == 0) return;


                var elList = this.element.find('.eqjs-qp-condelement');
                var oddWidth = 0;
                for (var i = 0; i < elList.length; i++) {
                    if (!$(elList[i]).hasClass('eqjs-qp-valueelement')) {
                        oddWidth = oddWidth + $(elList[i]).outerWidth(true);
                    }
                }

                var offset = $(veList[0]).outerWidth(true) - $(veList[0]).width();
                oddWidth = oddWidth + this._buttonsBlock.width() + veList.length * offset;
                var usefulWidth = this.element.width() - oddWidth;

                for (var i = 0; i < veList.length; i++) {
                    $(veList[i]).css('max-width', (usefulWidth / veList.length >> 0) + 'px');
                }
            }
        },

        _refreshByCondition: function () {
            var model = this.getModel();
            if (!this._condition || !model) {
                return;
            }

            var self = this;

            self.options.disabled = !self._condition.enabled || self._condition.readOnly;
            //$.data(this.element, 'condition', this._condition);
                
            this.element.addClass('eqjs-qp-row eqjs-qp-row-condition');
            if (this._condition.enabled === false)
                this.element.addClass('eqjs-qp-disabled');
                
            if (this._condition.readOnly)
                this.element.addClass('eqjs-qp-readonly');

            if (this._condition.justAdded) {
                //condition is just added. We need to add/setup expressions
                this._updateValueExpressions();
                this._condition.justAdded = false;
            }

            var operator = model.getOperatorById(self._condition.operatorID);

            var arrFormat = EQ.core.parseOperatorFormat(operator);

            var item = null;
            var arrLength = arrFormat.length;

            for (var idx = 0; idx < arrLength; idx++) {
                item = arrFormat[idx];

                var baseExprElement, operatorLink;
                if (item.type === 'operator') {
                    //var linkText = self._getOperatorMainText(operator); 

                    if (this._condition.enabled !== false && !this._condition.readOnly) {
                        operatorLink = $('<a></a>', {
                            href: 'javascript:void(0)',
                            text: item.text
                        });
                    }
                    else {
                        operatorLink = $('<span></span>', {
                            text: item.text
                        });
                    }

                    var operatorBlock = $('<div></div>');
                
                    operatorBlock.addClass('eqjs-qp-condelement eqjs-qp-operelement');
                    operatorLink.appendTo(operatorBlock);
                    operatorBlock.appendTo(this.element);
                    if (this._condition.enabled !== false && !this._condition.readOnly) {
                        var menuOperatorsBlock = self._createOperatorsMenu(operatorLink);
                        operatorLink.click(function (e) {
                            e.preventDefault();
                            menuOperatorsBlock.PopupMenu('showMenu', {
                                anchor: operatorLink
                            });
                        });
                    }

                }
                else if (item.type === 'expression') {
                    if (item.index === 0) {//base expression
                        var baseAttrElement = this._createAttrElement(this._condition.expressions[0], function (attrobj, oldAttrId) {
                            var operid = attrobj.operators[0];

//                            var exprCount = self._condition.expressions.length;
//                            self._condition.expressions.splice(1, exprCount - 1);

                            var oldOperId = self._condition.operatorID;
                            self._condition.operatorID = operid;
                            self._updateValueExpressions(oldOperId, oldAttrId);
                        });

                        baseAttrElement.appendTo(this.element);
                    }
                    else {
                        var valueElement;
                        var valExpr = this._condition.expressions[item.index];

                        //check if value expression has a correct data type
                        if (!valExpr.dataType || valExpr.dataType == "Unknown") {
                            self._updateExprDataType(valExpr, item.index);
                        }
                      
                        if (valExpr.kind === "Attribute") {
                            valueElement = this._createAttrElement(valExpr);
                            valueElement.appendTo(this.element);
                        }
                        else {
                            valueElement = $('<div></div>');
                            valueElement.appendTo(this.element);

                            this._createValueEditor(valueElement, valExpr, item.index);
                        }
                    }
                }
                else if (item.type === 'text') {
                    var textBlock = $('<span></span>')
                    .addClass('eqjs-qp-condelement')
                    .text(item.text)
                    .attr("title", item.text)
                    .appendTo(this.element);
                }
            }


            if (self.options.queryPanel.options.accentActiveCondition) {
                self.element.click(function () {
                    if (!self._active) {
                        self.makeActive();
                    }
                })
            }

            self.adjustActiveClass();

            self._adjustCheckbox();

            this._renderConjunction();
            this._renderLevelOffset();
        },

        _updateExprDataType: function (expr, index) {
            var model = this.getModel();
            var attributeID = this._condition.expressions[0].id;
            var attribute = model.getAttributeById(attributeID);
            if (!attribute) return;

            var operatorID = this._condition.operatorID;
            var operator = model.getOperatorById(operatorID);

            var operand = model.getOperand(attribute, operator, index);
            expr.dataType = operand.dataType;
        },

        _createAttrElement: function (expr, callback) {
            var self = this;

            var model = this.getModel();

            var attrElementDiv = $('<div></div>');
            
            var attrId = expr.id;
            var attrObj = attrId ? this.getModel().getAttributeById(attrId) : null;

            var attrElement;

            var attrFormat = self.options.queryPanel.options.attrElementFormat;

            if (this._condition.enabled !== false && !this._condition.readOnly) {
                attrText = attrObj ? model.getAttributeText(attrObj, attrFormat) : EQ.core.getText("MsgEmptyAttrValue");
                attrElement = $('<a href="javascript:void(0)">' + attrText + '</a>');
                attrElement.attr("title", attrText);
                attrElement.click(function (e) {
                    e.preventDefault();

                    self.options.queryPanel.showEntitiesMenu({
                        anchor: attrElement,
                        selectedIds: null, 
                        itemSelectedCallback: function (evt, data) {
                            var newAttrId = data.menuItem.data('id');
                            var newAttrObj = self.getModel().getAttributeById(newAttrId);
                            expr.id = newAttrId;

                            if (callback) {
                                callback(newAttrObj, attrId);
                            }

                            self.refresh();

                            self._fireConditionChange("change", self._condition);
                            return false;
                        },
                        itemFilterCallback: function (item) {
                            return EQ.core.areCompatibleDataTypes(expr.dataType, item.dataType);
                        }
                    });
                });
            }
            else {
                attrElement = $('<span>' + model.getAttributeText(attrObj, attrFormat) + '</span>');
            }

            attrElementDiv.addClass('eqjs-qp-condelement eqjs-qp-attrelement');
            attrElement.appendTo(attrElementDiv);
            return attrElementDiv;
        },

        _getOperatorCaption: function (operator) {
            // tries to get it from EQ.core.texts.Operators list
            // if not found - uses the one from the model

            var caption = EQ.core.getText('Operators', operator.id, 'caption');
            if (!caption)
                caption = operator.caption;

            return caption;
        },

        _operatorChanged: function(oldOperID, newOperID) {
            var self = this;

            self._updateValueExpressions(oldOperID);
            self.refresh();
            self._fireConditionChange("change", self._condition);
        },

        _areCompatibleTypes : function (expr1, expr2) {
            if (typeof(expr1.dataType) === "undefined") 
                return true;
            
//            if (type2 == "WideString" || type2 == "String")
//                return true;

            return (expr1.dataType == expr2.dataType) && (expr1.kind == expr2.kind);
        },

        _areCompatibleEditors : function (editor1, editor2) {
            if (!editor1 || !editor2) {
                if (editor1 == editor2) 
                    return true; //if both editors null
                else
                    return false;
            }

            if (editor1 == editor2) return true; //if editors are equal
            
            if (editor1.type == editor2.type) {
                if (editor1.type == "EDIT" || editor1.type == "DATETIME") 
                    return true;
               
                if (editor1.type == "CUSTOMLIST" && editor1.name == editor2.name)
                    return true;

                if (editor1.id == editor2.id)
                    return true;
            }

            return false;
        },

        _updateValueExpressions: function(oldOperatorId, oldAttrId) {
            var self = this;

            var model = this.getModel();

            var attributeID = self._condition.expressions[0].id;
            var attribute = model.getAttributeById(attributeID);
            if (!attribute) return;

            var operatorID = self._condition.operatorID;
            var operator = model.getOperatorById(operatorID);
            if (!operator) return;

            //var exprType = (operator.exprType && operator.exprType !== 'Unknown') ? operator.exprType : attribute.dataType;
            var exprCount = self._condition.expressions.length; 

            //var newEditor = self._getDefaultEditor(operatorID, attributeID);

            var operand;
            var oldOperator;
            var oldOperand;

            if (oldOperatorId) {
                oldOperator = model.getOperatorById(oldOperatorId);
            //    var oldExprType = (oldOperator && oldOperator.exprType && oldOperator.exprType !== 'Unknown') ? oldOperator.exprType : attribute.dataType;
            //    var oldEditor = self._getDefaultEditor(oldOperatorID, attributeID);
            }

            //add  necessary expressions
            var i = 1;
            while (i < operator.paramCount) {
                operand = model.getOperand(attribute, operator, i);
                if (oldOperator) {
                    oldOperand = model.getOperand(attribute, oldOperator, i);
                }

                if (!operand.dataType || operand.dataType == 'Unknown') {
                    operand.dataType = attribute.dataType;
                }

                if (i >= exprCount) {
                    var valExpr = self._createValueExpression(operand);
                    self._condition.expressions.push(valExpr); //exprType, operator.kind));
                }
                else {
                    var oldExpr = $.extend({}, self._condition.expressions[i]);
                    //recreate value expressions according to attribute and operator
                    var newExpr = self._createValueExpression(operand); //exprType, operator.kind);

                    var oldExprDefault;
                    if (oldOperand) {
                        oldExprDefault = self._createValueExpression(oldOperand).value;
                    }

                    self._condition.expressions[i] = newExpr;

                    var oldEditor = self._getExprEditor(oldExpr, i, oldOperatorId, oldAttrId);
                    var newEditor = self._getExprEditor(newExpr, i);

                    if ((!oldExprDefault || oldExprDefault != oldExpr.value) && self._areCompatibleEditors(oldEditor, newEditor)) {
                        self._tryToAssignExprValue(newExpr, oldExpr);
                    }
                }

                i++;
            }

            if (exprCount > i) {
                //remove all redundant expressions
                self._condition.expressions.splice(i, exprCount - i);
            }
        },

        //set the value of some expression by the type of another expression (if their types are compatible)
        _tryToAssignExprValue: function (expr, oldExpr) {
            if (!oldExpr.value || oldExpr.value == '') return;

            if (this._areCompatibleTypes(oldExpr, expr)) {
                expr.value = oldExpr.value;
            }
        },

        _createValueExpression: function (operand) {  
            var self = this;

            var newExpr;

            if (operand.kind === 'Query') {
                newExpr = {
                            'typeName': 'QUERY',
                            'dataType': operand.dataType,
                            'kind': operand.kind,
                            'value': EQ.core.getEmptyQueryObject(),
                            'text': ''
                };
            }
            else if (operand.kind === 'Attribute') {
                var defAttr = self.getModel().getFirstAttributeByFilter(function (attr) {
                    return attr.uic == true && (!operand.dataType || attr.dataType == operand.dataType);
                });

                var attrId = defAttr ? defAttr.id : null;

                newExpr = {
                    'typeName': 'ENTATTR',
                    'dataType': operand.dataType,
                    'kind': operand.kind,
                    'id': attrId,
                    'value': attrId,
                    'text': ''
                };

            }
            else {
                var defValue;
                if (operand.defValue && operand.defValue != "") {
                    defValue = operand.defValue;
                }
                else if (operand.editor && operand.editor.defValue) {
                    defValue = operand.editor.defValue;
                }
                else {
                    defValue = '';
                }
                newExpr = {
                    'typeName': 'CONST',
                    'dataType': operand.dataType,
                    'kind': operand.kind,
                    'value': defValue,
                    'text': ''
                };

/*
/////////////////////////////////////////////
//  set default value / text for new expression
/////////////////////////////////////////////
                var editor = self._getDefaultEditor(self._condition.operatorID, self._condition.expressions[0].id);
                if (editor) {
                    newExpr.value = editor.value.?
                }
*/
            };

            return newExpr;


        },

        _createOperatorsMenu: function (operatorLink) {
            var self = this;

            if (!self._condition || !self.getModel()) return;


            var items = [];

            var attr = self.getModel().getAttributeById(self._condition.expressions[0].id);
            if (attr) {
                var operator = null;
                var operLength = attr.operators.length;
                for (var opIndex = 0; opIndex < operLength; opIndex++) {
                    operator = self.getModel().findOperatorById(attr.operators[opIndex]);
                    if (operator && !(self.options.queryPanel.options.isSubQuery && operator.kind === 'Query')) {
                        var caption = self._getOperatorCaption(operator);
                        items.push({ id: operator.id, text: caption });
                    }
                }
            }

            var menuOperatorsBlock = $('<div></div>')
                .appendTo(operatorLink.parent())
                .hide();

            var menuId = self.element.attr('id');
            if (menuId) {
                menuId += '-OperatorsMenu';
            }

            menuOperatorsBlock.PopupMenu({ items: items, id: menuId, domWriteItemsId: self.options.queryPanel.options.domWriteItemsId, onMenuItemSelected:
                function (evt, data) {
				    operatorLink.text(data.menuItem.text);
                    var oldOperatorID = self._condition.operatorID;
				    self._condition.operatorID = data.menuItem.id; //parent().

                    self._operatorChanged(oldOperatorID, self._condition.operatorID);

				    return false;
				}
            });



            return menuOperatorsBlock;
        },



/*
        _getDefaultEditor: function (operatorId, attributeId) {
            var editor = null;
        
            var operator = this.getModel().findOperatorById(operatorId);
            var attribute = this.getModel().getAttributeById(attributeId);

            if (operator && operator.defaultEditor) {
                editor = operator.defaultEditor;
            }
            else if (attribute && attribute.defaultEditor) {
                editor = attribute.defaultEditor;
            };

            return editor;
        },
*/

        _getExprEditor: function (expr, index, operatorID, attrId) {
            var model = this.getModel();

            var attributeId = attrId || this._condition.expressions[0].id;
            var attribute = model.getAttributeById(attributeId);


            operatorID = operatorID || this._condition.operatorID;
            var operator = model.getOperatorById(operatorID);
            var operand = model.getOperand(attribute, operator, index);

            var editor;

            if (operand && operand.editor && operand.editor.type !== "Unknown") {
                editor = $.extend({}, operand.editor);
            }
            else {
                if (attribute && attribute.defaultEditor) {
                    editor = $.extend({}, attribute.defaultEditor);
                }
            }

            if (expr && expr.kind === 'Query') {
                editor.type = 'SUBQUERY';
            }

//            else if (expr && expr.kind === 'Scalar' && (expr.dataType === 'Date' || expr.dataType === 'DateTime')) {
//                editor.type = 'DATETIME';
//            }

            if (!editor.type || editor.type == 'Unknown') {
                editor.type = 'EDIT';
            }

            return editor;
        },


        _createValueEditor: function (element, expr, index) {
            var self = this;
            var editor = self._getExprEditor(expr, index); // this._getDefaultEditor(this._condition.operatorID, this._condition.expressions[0].id);

            //var editorType = this._getEditorType(editor, expr);

            if (editor) {
                var funcBody = "element.ValueEditor_" + editor.type + "({parentWidget:self, editor: editorObj, onChange:exprChangedCallback}); " +
                               "element.ValueEditor_" + editor.type + "('init', expr);";
                var addWidget = new Function("self, element, expr, editorObj, exprChangedCallback", funcBody);

                var exprChangedCallback = function () {
                    var model = self.getModel();
                    var op = model.getOperatorById(self._condition.operatorID);
                    if (op.isRange) {
                        var expr1 = self._condition.expressions[1];
                        var expr2 = self._condition.expressions[2];
                        if (self._compareExpressions(expr1, expr2) > 0) {
                            if (expr1 == expr) {
                                self._copyExpr(expr1, expr2);
                            }
                            else {
                                self._copyExpr(expr2, expr1);
                            }
                            self.refresh();

                        }
                    }
                    self._fireConditionChange("change", self._condition);
                };

                addWidget(this, element, expr, editor, exprChangedCallback);
            }
        },

        _compareExpressions: function (expr1, expr2) {
            var val1,
                val2,
                dtp = expr1.dataType,
                model = this.getModel();
            if (dtp === "Date" || dtp === "DateTime") {
                val1 = model.getDateOrMacroDateValue(expr1.value);
                val2 = model.getDateOrMacroDateValue(expr2.value);
                return val1 >= val2 ? 1 : -1;
            }
            else if (dtp === "Time") {
                val1 = model.getTimeOrMacroTimeValue(expr1.value);
                val2 = model.getTimeOrMacroTimeValue(expr2.value);
                return val1 >= val2 ? 1 : -1;
            }
            else if (dtp === "Int" || dtp === "Int32" || dtp === "Int64" || dtp === "Byte" || dtp === "Word") {
                val1 = expr1.value !== "" ? parseInt(expr1.value) : 0;
                val2 = expr2.value !== "" ? parseInt(expr2.value) : 0;
                return val1 - val2;
            }
            else if (dtp === "Float" || dtp === "Currency") {
                val1 = expr1.value !== "" ? parseFloat(expr1.value) : 0;
                val2 = expr2.value !== "" ? parseFloat(expr2.value) : 0;
                return val1 - val2;
            }
            return 0;
        },

        _copyExpr: function(expr1, expr2) {
            expr2.value = expr1.value;
            expr2.text = expr1.text;
        },

        _showButtons: function () {
            var queryPanel = this.options.queryPanel;
            
            if (queryPanel.options.allowParameterization && this._paramButton && this._condition.enabled != false) {
                this._paramButton.show();
                if (this._condition.parameterized) {
                    this._paramButton.addClass('turnedon');
                }

            }

            if (!queryPanel.options.showCheckboxes && this._enableButton) {
                this._enableButton.show();
            }

            if (this._deleteButton) {
                this._deleteButton.show();
            }

        },

        _adjustButtonsVisibility: function () {
            if (this.options.queryPanel.options.alwaysShowButtonsInConditions || (this.options.queryPanel.options.accentActiveCondition && this._active)) {
                this._showButtons();
            }
        },

        _leaveButtonBlock: function() {
            if (this.options.queryPanel.options.alwaysShowButtonsInConditions != true && (!this._active || this.options.queryPanel.options.accentActiveCondition != true)) {
                this._hideButtons();
            }
        },

//        getMaxValueWidth: function () {
//            return '300px';
//        }

    });
})(jQuery);


//----------------------------------
//  ConditionRow_PDCT widget
//----------------------------------
(function ($, undefined) {

    $.widget("eqjs.ConditionRow_PDCT", $.eqjs.ConditionRow, {
        
        _predicateRowBlock: null,

        _getButtonsContainer: function () {
            return this._predicateRowBlock;
        },

        _parsePredicateText: function (predicateRowBlock, key) {
            var self = this;

            var linkTypeChanged = function() {
                self.refresh();
                self._fireConditionChange("change", self._condition);
            };


            var predString = EQ.core.getText(key);
            var pos = predString.indexOf('{lt}');
            
            if (pos < 0) {//invalid format
                predicateRowBlock.text(EQ.core.getText('ErrIncorrectPredicateTitleFormat'));
                predicateRowBlock.addClass('eqjs-qp-error');
            }
            else {
                if (pos > 0) {
                    var predicateText1 = $('<span></span>')
                    .addClass('eqjs-qp-predelement')
                    .text(predString.substring(0, pos))
                    .appendTo(predicateRowBlock);
                }

                var predicateLinkTypeDiv = $('<div></div>');
                predicateLinkTypeDiv.PredicateLinkType({queryPanel: self.options.queryPanel, parentWidget:self, onChange: linkTypeChanged});
                predicateLinkTypeDiv.PredicateLinkType('init', self._condition);
                predicateLinkTypeDiv.appendTo(predicateRowBlock);

                var predicateText2 = $('<span></span>')
                .addClass('eqjs-qp-predelement')
                .text(predString.substring(pos+4))
                .appendTo(predicateRowBlock);
            }
        },


        _refreshPredicateRow: function () {
            var self = this;

            if (!self._predicateRowBlock) return;

            self._predicateRowBlock.html('');
            self._predicateRowBlock.addClass('eqjs-qp-row eqjs-qp-row-predicate');
            if (self._condition.enabled === false) {
                self._predicateRowBlock.addClass('eqjs-qp-disabled');
            }

            self._parsePredicateText(self._predicateRowBlock, 'PredicateTitle');

            if (self.options.queryPanel.options.accentActiveCondition) {
                self._predicateRowBlock.click(function () {
                    if (!self._active) {
                        self.makeActive();
                    }
                })
            }

            self.adjustActiveClass();

            this._renderConjunction();
            this._renderLevelOffset();
        },

        _refreshByCondition: function () {
            var self = this;

            self.element.addClass('eqjs-qp-predicate');
            self._predicateRowBlock = $('<div></div>');
            self._predicateRowBlock.appendTo(self.element);

            self._refreshPredicateRow();
            self._addConditions(self.element);
        },

        _addConditions: function(element) {
            //Conditions block
            var conditionsBlock = $('<div></div>');
            
            conditionsBlock.addClass('eqjs-qp-conditions');
            conditionsBlock.appendTo(element);

            var condCount = this._condition.conditions.length;
            for (var condIdx = 0; condIdx < condCount; condIdx++) {
                var cond = this._condition.conditions[condIdx];
                var newCondBlock = $('<div></div>');
                if (!cond.blockId) {
                    this.trySetBlockId(cond);
                }
                if (cond.blockId) {
                    newCondBlock.attr('id', cond.blockId);
                }
                newCondBlock.appendTo(conditionsBlock);
                var funcBody = "element.ConditionRow_" + cond.typeName + "({queryPanel: self.options.queryPanel, model: self.getModel()}); " + 
                               "element.ConditionRow_" + cond.typeName + "('init', self._condition.conditions[idx], self._condition, self);"

                var addWidget = new Function("self, element, idx", funcBody);
                
                addWidget(this, newCondBlock, condIdx);
            }

            (!conditionsBlock.children().length) ? conditionsBlock.hide() : conditionsBlock.show();
            
            return conditionsBlock;
        },

        _checkAllDisabled: function () {
            if (this._parentPredicate) {
                var allDisabled = true;

                var condLength = this._condition.conditions.length;
                for (var condIdx = 0; condIdx < condLength; condIdx++) {
                    if (this._condition.conditions[condIdx].enabled) {
                        allDisabled = false;
                        break;
                    }
                }

                if (allDisabled) {
                    this._setConditionEnable(false, true);
                }
            }



        },


        /*
        _sortablePredicate: function(element){
            var self = this,
                conditions = self._condition,
                oldIdx, newIdx, overDrop, dropped = false, draggableAttr;

            element.find('.eqjs-qp-conditions').sortable({
                //containment: element.find('.eqjs-qp-row'),
                connectWith: ".eqjs-qp-predicate",
                items: ".eqjs-qp-row-condition",
                tolerance: 'touch',
                cancel: '.eqjs-qp-condition-buttonsBlock',
                placeholder: "ui-state-highlight eqjs-highlight",
                scrollSpeed: 3,
                delay: 100,
                distance: 13,
                start: function (event, ui) {
                    oldIdx = ui.item.index();
                    ui.item.addClass('eqjs-qc-column-sort');
                    overDrop = true;
                },
                update: function (event, ui) {
                    newIdx = ui.item.index();

                    if (dropped) {
                        self.addNewColumn(draggableAttr, newIdx);
                        dropped = false;
                    }
                    
                    var parent = ($(this).parent().length != 0) ? $(this).parent() : element;
                    self._moveDraggedItem(conditions, parent, newIdx);       
                },
                stop: function (event, ui) {
                    ui.item.removeClass('eqjs-qc-column-sort');
                }
            });
            //
            element.droppable({
                hoverClass: "eqjs-drophover",
                scope: "entityAttr",

                drop: function (event, ui) {
                    console.log(ui.draggable.data("id"));
                    console.log('drop');
                    self.addNewCondition(ui.draggable.data("id"));
                },
                over: function (event, ui) {
                    ui.helper.addClass('eqjs-qc-column-drag');
                    console.log('drop ower');
                },
                out: function (event, ui) {
                    ui.helper.removeClass('eqjs-qc-column-drag');
                    console.log('drop out');
                },
                activate: function (event, ui) {
                    //draggableAttr = ui.draggable.attr('data-id');
                }
            });
            //
        },*/
        
        _moveDraggedItem : function (condition, newPredicate, newIdx) {
            //console.log(condition, newPredicate, newIdx);
        },

        isPredicate: function () {
            return true;
        },

        _containsActiveCondition: function (predicate) {
            var self = this;
            var predicateCond = predicate || self._condition;

            var activeCond = self.options.queryPanel._activeConditionWidget;
            if (activeCond) {
                activeCond = activeCond.getCondition();
            }

            return self.options.queryPanel.predicateContainsCondition(predicateCond, activeCond);
        },

        removeCondition: function (condition) {
            var self = this;

            var index = $.inArray(condition, self._condition.conditions);
            if (index >= 0) {
                if (self._condition.conditions.length == 1 && self._parentPredicate) { //the last condition in the predicate, need to remove the predicate themself
                    self.remove();
                }
                else {
                    //if (self._containsActiveCondition()) {
                    if (condition == self.options.queryPanel.options.activeCondition) {
                        self.makeActive();
                    }
                    self._condition.conditions.splice(index, 1);
                    self.refresh();

                    self._fireConditionChange("delete", condition);
                }
            }
        },

        addCondition: function (condition, index) {
            if (!condition || ($.isArray(condition) && condition.length == 0)) { return; }

            var self = this;

            if (typeof index == "number") {
                self._condition.conditions.push.apply(self._condition.conditions, [index, 0].concat(condition));
            }
            else {
                self._condition.conditions.push.apply(self._condition.conditions, [].concat(condition));
            }

            var condArr = [].concat(condition);
            $.each(condArr, function (index, value) {
                self.trySetBlockId(value);
            });

            condition.initAsActive = true;

            self.refresh();
            self._fireConditionChange("add", condition);
        },

        trySetBlockId: function (cond) {
            var parentPanel = this.getQueryPanel();
            var blockId = (cond.typeName == 'PDCT') ? parentPanel.getNewPredId() : parentPanel.getNewCondId();
            if (blockId) {
                cond.blockId = blockId;
            }
        },

        addNewCondition: function (attrid, operid, index) {
            var self = this;
            var attribute,
                condToAdd,
                cond,
                realOperId;

            var query = this.getQuery();
            var model = query.getModel();

            var createConditionObject = function (attr, operIdNew) {
                if (!attr) {
                    return null;
                }

                if (!model.checkAttrProperty(attr, "uic")) {
                    return null;
                }

                return {
                    justAdded: true,
                    typeName: 'SMPL',
                    enabled: true,
                    operatorID: operIdNew,
                    expressions: [
                        {
                            "kind": "Attribute",
                            "typeName": query.attrClassName, //'ENTATTR',
                            "id": attr.id
                        }
                    ]
                };
            };


            if ($.isArray(attrid)) {
                condToAdd = [];
                var attrLength = attrid.length;
                for (var i = 0; i < attrLength; i++) {
                    attribute = model.getAttributeById(attrid[i]);
                    if (!attribute) { continue; }

                    realOperId = operid ? operid : model.getDefaultOperatorIdForAttr(attribute);

                    cond = createConditionObject(attribute, realOperId);
                    if (cond)
                        condToAdd.push(cond);
                }
            }
            else {
                attribute = model.getAttributeById(attrid);
                if (!attribute) { return; }
                
                realOperId = operid ? operid : model.getDefaultOperatorIdForAttr(attribute);
                condToAdd = createConditionObject(attribute, realOperId);
            }

            self.addCondition(condToAdd, index);
            return condToAdd;
        },

        addNewPredicate: function () {
            var self = this;
            
            //define the condition automatically added to the new predicate
            var attribute = self.getModel().getFirstUICAttr();
            var attrid = attribute ? attribute.id : -1;
            var operid = attribute ? attribute.operators[0] : -1;

            var query = this.getQuery();

            var condition = {
                blockId: self.getQueryPanel().getNewCondId(),
                justAdded: true,
                typeName: "SMPL",
                enabled: true,
                operatorID: operid,
                expressions: [
                    {
                        "typeName": query.attrClassName, //'ENTATTR',
                        "id": attrid,
                        "kind": "Attribute"
                    }
                ]
            }

            var lType = self._condition.linkType === 'All' ? 'Any' : 'All';
            var predicate = {
				    typeName: "PDCT",
				    linkType: lType,
				    conditions: []
            };

            predicate.conditions.push(condition);

            this.addCondition(predicate);
        },


        _showButtons: function () {
            if (this._condition.enabled != false)  {
                if (this._addConditionButton) {
                    this._addConditionButton.show();
//                    this._addConditionButton.removeClass("eqjs-qp-condition-button-hidden");
//                    this._addConditionButton.css('background-image', '');
                }
                if (this._addPredicateButton) {
                    this._addPredicateButton.show();
//                    this._addPredicateButton.removeClass("eqjs-qp-condition-button-hidden");
//                    this._addPredicateButton.css('background-image', '');
                }
            }

            if (!this.options.queryPanel.options.showCheckboxes && this._enableButton) {
                this._enableButton.show();
//                this._enableButton.removeClass("eqjs-qp-condition-button-hidden");
//                this._enableButton.css('background-image', '');
            }

            if (this._deleteButton) {
                this._deleteButton.show();
//                this._deleteButton.removeClass("eqjs-qp-condition-button-hidden");
//                this._deleteButton.css('background-image', '');
            }
        },


        _adjustButtonsVisibility: function () {
            if (this.options.queryPanel.options.alwaysShowButtonsInPredicates || (this.options.queryPanel.options.accentActiveCondition && this._active)) {
                this._showButtons();
            }
        },

        _leaveButtonBlock: function () {
            if (this.options.queryPanel.options.alwaysShowButtonsInPredicates != true && (!this._active || this.options.queryPanel.options.accentActiveCondition != true)) {
                this._hideButtons();
            }
        },

        internalActivate: function () {
            this._active = true;
            this.adjustActiveClass();

            this._hideButtons();
            this._adjustButtonsVisibility();
        },

        internalDeactivate: function () {
            this._active = false;
            this.adjustActiveClass();

            this._hideButtons();
            this._adjustButtonsVisibility();
        },

        adjustActiveClass: function () {
            if (this._active && this.options.queryPanel.options.accentActiveCondition) {
                this._predicateRowBlock.addClass("active");
            }
            else {
                this._predicateRowBlock.removeClass("active");
            }
        }

    })
})(jQuery);


//----------------------------------
//  RootPredicate widget
//----------------------------------
(function ($, undefined) {

    $.widget("eqjs.RootPredicate", $.eqjs.ConditionRow_PDCT, {

        _showButtons: function () {
            if (this._addConditionButton) {
                this._addConditionButton.show();
//                this._addConditionButton.removeClass("eqjs-qp-condition-button-hidden");
//                this._addConditionButton.css('background-image', '');
            }
            if (this._addPredicateButton) {
                this._addPredicateButton.show();
//                this._addPredicateButton.removeClass("eqjs-qp-condition-button-hidden");
//                this._addPredicateButton.css('background-image', '');
            }
        },

        _initCheckbox: function () {
        },
        
        _renderConjunction: function () {
        },

        _refreshPredicateRow: function () {
            var self = this;

            if (!self._predicateRowBlock) return;

            self._predicateRowBlock.html('');
            self._predicateRowBlock.addClass('eqjs-qp-row eqjs-qp-row-predicate eqjs-qp-row-predicate-root');
                    
            self._parsePredicateText(self._predicateRowBlock, 'RootPredicateTitle');
                
            if (self.options.queryPanel.options.accentActiveCondition) {
                self._predicateRowBlock.click(function () {
                    if (!self._active) {
                        self.makeActive();
                    }
                })
            }

            self.adjustActiveClass();
        },

        _refreshByCondition: function () {
            var self = this;

            self.element.addClass('eqjs-qp-predicate eqjs-qp-predicate-root');

            var minusHeight = 0;

            //Root row block
            if (self.options.queryPanel && self.options.queryPanel.options.showRootRow){
                self._predicateRowBlock = $('<div></div>');
                self._predicateRowBlock.appendTo(self.element);

                self._refreshPredicateRow();

                minusHeight += self._predicateRowBlock.outerHeight();
            }

            var condBlock = self._addConditions(self.element);

            if (self.options.queryPanel.options.showAddRow) {
                var addRowHeight = self.options.queryPanel.addRowHeight;
                minusHeight += addRowHeight + 9;
            }

            var panelHeight = self.options.queryPanel.element.innerHeight();
            if (condBlock) {
                condBlock.css({ 'max-height': (panelHeight - minusHeight) + 'px' });
            }
        }
    })
})(jQuery);

/// <widget name="QueryPanel" version="1.0.0">
/// <summary>
/// This widget represents “query panel” - a rectangular area of your web-page which contains hierarchical list of query conditions 
/// and provides some operations for manipulating with that list: add a new condition or condition group, remove an existing condition, enable/disable conditions, etc.
/// All options of **QueryPanel** widgets can be set through ''queryPanel'' property of ''easyQuerySettings'' global variable. 
/// Of course you can also set options and call methods of **QueryPanel** in an usual for jQuery widgets way.
/// </summary>
/// <example>
/// Here is an example how to set **QueryPanel** options when you initialize ''easyQuerySettings'' variable:
/// <code>
/// window.easyQuerySettings = {
///     serviceUrl: "/EasyQuery",
///     modelName: "YourModelName", //put the name of your model here
///     .   .   .   .   .   .   .
///     queryPanel: {
///         showCheckBoxes: true,
///         attrElementFormat: "{attr}", //show only attribute instead of "{entity} {attr}" format used by default.
///         .   .   .   .   .   .
///     }
///     .   .   .   .   .   .
/// }
/// </code>
/// An example of seting some **QueryPanel** option in code using ''option'' method:
/// <code>
/// var QPDiv = $('#QueryPanel');
/// if (QPDiv.length > 0) {
///    QPDiv.QueryPanel("option", "showRootRow", false);
/// }
/// </code>
/// </example>
/// <notes>
/// If you include ''eq.view.js'' script on your page then this widget (as well as **ColumnsPanel** and **EntitiesPanel**) is initilized implicitly (on page load) for all DOM elements with id "QueryPanel". So all you need to do to add on your page is:
/// \\
/// 1. Define a placeholder
/// <code><div id="QueryPanel"></div></code>
/// 2. Include ''eq.all.min.js'' and ''eq.view.js'' on your page (after jQuery and jQuery UI).
/// </notes>
/// </widget>
;(function ($, undefined) {

    $.widget("eqjs.QueryPanel", {
        _activeConditionWidget: null,
        _rootPredicateWidget: null,
        _query: null,

        _globalCondCounter: 0,
        _globalPredCounter: 0,

        _defaultMenuOptions: {
            showSearchBoxAfter: 30,
            searchBoxAutoFocus: true,
            activateOnMouseOver: true
        },


        options: {
            isSubQuery: false,
            activeCondition: null,

            listRequestHandler: null, //deprecated
            entitiesPopupHandler: null,
            entitiesListFilter: null,
            menuContainer: document.body,

            /// <option name="showRootRow" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether query panel must show a root row which represents the main group of conditions</summary>
            /// </option>
            showRootRow: true,

            /// <option name="showAddRow" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether query panel must show a special [add condition] link at the bottom</summary>
            /// </option>
            showAddRow: true,


            /// <option name="showCheckboxes" type="Boolean" default="false">
            /// <summary>Gets or sets a value indicating whether query panel must show a checkbox at the beginning of each condition row. 
            /// User will be able to use these checkboxes to enable/disable corresponding query conditions
            /// </summary>
            /// </option>
            showCheckboxes: false,


            /// <option name="allowParameterization" type="Boolean" default="false">
            /// <summary>Gets or sets a value indicating whether query panel shows "toggle parameterization" button which aloows to mark each condition as parameterized. 
            /// </summary>
            /// </option>
            allowParameterization: false,

            /// <option name="showPoweredBy" type="Boolean" default="true">
            /// <summary>Allows to turn off "Powered by EasyQuery" link shown in the bottom right cornder of query panel. Works only in the full version of the script.</summary>
            /// </option>
            showPoweredBy: true,

            /// <option name="alwaysShowButtonsInPredicates" type="Boolean" default="false">
            /// <summary>
            /// If true QueryPanel widget will always show button in predicate (group) rows.
            /// Instead of default behaviour when they are shown only on mouse over.
            /// </summary>
            /// </option>
            alwaysShowButtonsInPredicates: false,

            /// <option name="alwaysShowButtonsInConditions" type="Boolean" default="false">
            /// <summary>
            /// If true QueryPanel widget will always show button in condition rows.
            /// Instead of default behaviour when they are shown only on mouse over.
            /// </summary>
            /// </option>
            alwaysShowButtonsInConditions: false,

            /// <option name="showConjunctions" type="Boolean" default="true">
            /// <summary>
            /// If true QueryPanel widget will show conjunction elements ("and" or "or") at the beginning of each condition.
            /// </summary>
            /// </option>
            showConjunctions: true,

            /// <option name="accentActiveCondition" type="Boolean" default="true">
            /// <summary>
            /// If true the active condition (the one user clicked on previously) will have accent background color.
            /// </summary>
            /// </option>
            accentActiveCondition: true,

            /// <option name="activateRootOnStart" type="Boolean" default="true">
            /// <summary>
            /// If true root predicate row become active at the beginning.
            /// </summary>
            /// </option>
            activateRootOnStart: true,

            /// <option name="dateFormatValue" type="String" default="">
            /// <summary>
            /// A string that represents the format of date values used in date/time picker widget. 
            /// For a full list of the possible formats see documention for JQuery UI Datepicker Widget: http://api.jqueryui.com/datepicker/#utility-formatDate 
            /// </summary>
            /// </option>
            dateFormatValue: '', //'mm/dd/yy',

            /// <option name="dateFormatDisplay" type="String" default="d MM, yy">
            /// <summary>
            /// The format of date values used in condition rows.
            /// For a full list of the possible formats see documention for JQuery UI Datepicker Widget: http://api.jqueryui.com/datepicker/#utility-formatDate 
            /// </summary>
            /// </option>
            dateFormatDisplay: 'd MM, yy',

            /// <option name="yearRange" type="String" default="c-10:c+10">
            /// <summary>
            /// The range of years displayed in the year drop-down: either relative to today's year ("-nn:+nn"), relative to the currently selected year ("c-nn:c+nn"), absolute ("nnnn:nnnn"), or combinations of these formats ("nnnn:-nn"). 
            /// </summary>
            /// </option>
            yearRange: 'c-10:c+10',

            /// <option name="attrElementFormat" type="String" default="{entity} {attr}">
            /// <summary>
            /// The format of entity attributes used in query panel conditions.
            /// You can set it to '{attr}' to shown only attribute part (without entity name)
            /// </summary>
            /// </option>
            attrElementFormat: '{entity} {attr}',

            /// <option type="Object">
            /// <summary>
            /// Contains different options for popup menu that appears for selecting attributes, operators or values in condition.\\
            /// Includes the following sub-options:
            /// </summary>
            /// <prop name="showSearchBoxAfter" type="integer" default="30">
            /// If the number of items in drop down menu exceeds this number then a search box will be displayed. 
            /// Set this option to 0 if want to show the search box in any case
            /// </prop> 
            /// <prop name="activateOnMouseOver" type="boolean" default="true">
            /// If true  - the row in query panel will be highlighted when user moves mouse cursor over it.
            /// </prop> 
            /// </option>
            menuOptions: {
                showSearchBoxAfter: 30,
                searchBoxAutoFocus: true,
                activateOnMouseOver: true
            },

            /// <option name="allowDragDrop" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether it's possible to drag attributes from EntitiesPanel and drop them into QueryPanel to create new conditions.</summary>
            /// </option>
            allowDragDrop: true,

            /// <option name="attrPlacement" type="Integer" default="0">
            /// <summary>
            /// Defines where to display attributes in the tree:
            /// 0 - attributes are displayed after entities
            /// 1 - attributes are displayed before entities
            /// 2 - attributes and entities are mixed, and displayed in alphabetical order. In this case the "sortEntities" option value dosn't matter.
            /// </summary>
            /// </option>
            attrPlacement: 0,

            /// <option name="sortEntities" type="Integer" default="false">
            /// <summary>
            /// Defines whether entities and attributes should be sorted alphabetically. If false, they are displayed as listed in the model.
            /// </summary>
            /// </option>
            sortEntities: false,

            /// <option type="Integer" default="600">
            /// <summary>
            /// Sets or gets the width of sub-query dialog
            /// </summary>
            /// </option>
            subQueryDialogWidth: 600,

            /// <option type="Integer" default="300">
            /// <summary>
            /// Sets or gets the height of sub-query dialog
            /// </summary>
            /// </option>
            subQueryDialogHeight: 300,


            /// <option type="Integer" default="100000">
            /// <summary>
            /// Sets or gets the ZIndex property of the different dialogs used in QueryPanel (including the sub-query dialog)
            /// </summary>
            /// </option>
            dialogZIndex: 100000,

            /// <option type="String" default=".">
            /// <summary>
            /// Sets or gets the symbol which is used as decimal separator
            /// </summary>
            /// </option>
            numberDecimalSeparatorDisplay: '.',

            /// <option type="List" default="[',', ';']">
            /// <summary>
            /// Sets or gets the symbols which are recognized as list items separators 
            /// (for example when user is supposed to enter a list of values in a text box).
            /// </summary>
            /// </option>
            numberListSeparators: [',', ';'],

            /// <option type="Boolean" default="false">
            /// <summary>
            /// If true the QueryPanel will automaticall show value editor for any new (just added) condition.
            /// </summary>
            /// </option>
            autoEditNewCondition: false,

            //attrClassName: 'ENTATTR',
            defaultQuery: {
                root: {
                    linkType: "All",
                    enabled: true,
                    conditions: []
                },
                columns: [],
                justsorted: []
            }
        },

        addRowHeight: 0,

        getSelf: function () {
            return this;
        },

        getQuery: function() {
            return this._query;
        },

        setQuery: function (query) {
            if (query && query.getObject) {
                this._setQueryObserver(true); //removing old query observer
                this._query = query;
                this._setQueryObserver();
                this.refresh();
            }
            else if (query) {
                var q = this.getQuery();
                q.setObject(query);
            }
            else {
                this._setQueryObserver(true); //removing old query observer
                this._query = null;
            }
        },

        isQueryNullOrEmpty: function() {
            var query = this.getQuery();
            return !query || query.isEmptyConditions();
        },

        getModel: function () {
            var query = this.getQuery();
            return query ? query.getModel() : null;
        },

        isModelNullOrEmpty: function() {
            var model = this.getModel();
            return !model || model.isEmpty();
        },

        _updateLists: function () {
            var constLists = EQ.core.constLists;

            for (var prop in constLists) {
                if (constLists.hasOwnProperty(prop)) {
                    this._updateList(constLists[prop]);
                }
            };

            this._updateList(EQ.core.predicateLinkTypeList);
        },

        _updateList: function (list) {
            if (!list) return;
            
            var listLength = list.length;
            for (var i = 0; i < listLength; i++) {
                list[i].text = EQ.core.getText(list[i].key);
                if (!list[i].text)
                    list[i].text = list[i].key;
            }
        },

        _create: function () {
            var self = this;
            
            if (typeof(poweredByOption) == "undefined") {
                poweredByOption = {};
            }

        },

        _render: function () {
            var self = this;

            var model = this.getModel();

            self._clear();

            self._updateLists();


            self.element.addClass('eqjs-qp-panel');

            if (!self.isModelNullOrEmpty()) {

                self.options.entitiesList = self.getEntitiesList({ addUIC: true, addUIR: false, addUIS: false, attrPlacement: self.options.attrPlacement, sortEntities: self.options.sortEntities });
                self.options.entitiesMenu = self._createEntitiesMenu();


                //Conditions
                var rootBlock = $('<div></div>');
                if (self.element.attr('id')) {
                    rootBlock.attr('id', self.element.attr('id') + '-pred-root');
                }
                rootBlock.appendTo(self.element);

                //AddRow
                if (self.options.showAddRow) {
                    var addRowBlock = $('<div class="eqjs-addrow eqjs-qp-addrow"></div>');
                    addRowBlock.appendTo(self.element);

                    if (!self.options.showRootRow && (!self.isQueryNullOrEmpty())) {
                        addRowBlock.addClass('eqjs-addrow-empty');
                    }


                    var addRowLink = $('<a href="javascript:void(0)">' + EQ.core.getText('CmdClickToAddCondition') + '</a>');
                    addRowLink.appendTo(addRowBlock);

                    addRowLink.click(function (e) {
                        e.preventDefault();
                        self.showEntitiesMenu({
                            anchor: addRowLink, 
                            selectedIds: null, 
                            itemSelectedCallback: function (evt, data) {
                                var attrid = data.menuItem.data('id');

                                self.addNewCondition(attrid);
                                return false;
                            }
                        });
                    });

                    self.addRowHeight = addRowBlock.outerHeight();
                }

                self._refreshByQuery(rootBlock);

            }

            if (self.options.allowDragDrop) {
                self.element.droppable({
                    hoverClass: "eqjs-drophover",
                    scope: "entityAttr",

                    drop: function (event, ui) {
                        self.addNewCondition(ui.draggable.data("id"));
                    },
                    over: function (event, ui) {
                        ui.helper.addClass('eqjs-qc-column-drag');

                        var attrId = ui.draggable.data("id");

                        if (!model.checkAttrProperty(attrId, "uic")) {
                            ui.helper.addClass('eqjs-qc-column-drag-forbidden');
                        }
                    },
                    out: function (event, ui) {
                        ui.helper.removeClass('eqjs-qc-column-drag');
                        ui.helper.removeClass('eqjs-qc-column-drag-forbidden');
                    }
                });
            }

            if (self.options.showPoweredBy || poweredByOption.show === true) {
                // "Powered By" link rendering
                var poweredByLink = $('<a></a>', {
                    'text': 'Powered by EasyQuery',
                    'href': 'https://korzh.com/easyquery/',
                    'target': '_blank',
                    'css': {
                        'color': '#4676AE',
                        'font': '11px Calibri',
                        'text-decoration': 'underline'
                    }
                }).appendTo(self.element);


                var placePoweredByLink = function () {
                    poweredByLink.css({
                        'position': 'absolute',
                        'bottom': '-15px',
                        'right': '0px'
                        //'top': self.element.height() + self.element.offset().top + 10,
                        //'top': self.element.height() - poweredByLink.outerHeight() - 10,
                        //'left': (self.element.width() + self.element.offset().left) - poweredByLink.outerWidth() - 6
                    });

                    if (poweredByLink.parents('div[class*=ui-dialog]').length != 0)
                        poweredByLink.parents('div[class*=ui-dialog]').find(poweredByLink).hide();

                }
                placePoweredByLink();
            }

        },


        _checkActivateRootPredicate: function () {
            if (this.options.activateRootOnStart) {
                this._activateRootPredicate();
            }
        },

        _activateRootPredicate: function () {
            //Activate root predicate
            if (this.options.showRootRow) { // && this.options.accentActiveCondition && this.options.activateRootOnStart) {
                if (this._rootPredicateWidget) {
                    this.setActiveConditionWidget(this._rootPredicateWidget);
                }
            }
        },

        _setOption: function (key, value) {
            if (arguments.length == 2) {
                if (key == 'model') {
                    this.clearQuery(false);
                    this.options[key] = value;
                    this._render();
                    this._checkActivateRootPredicate();
                }
                else if (key == 'query') {
                    this.setQuery(value);
                }
                else if (key == 'menuOptions') {
                    this.options.menuOptions = $.extend({}, this._defaultMenuOptions, value);
                }
                else if (key == 'searchBoxAfter') {
                    this.options[key] = value;
                    this.options.menuOptions.showSearchBoxAfter = value;
                }
                else {
                    this.options[key] = value;
                    this._render();
                }

                return this;
            }
            else {
                return this.options[key];
            }
        },



        _setQueryObserver: function (remove) {
            var self = this;
            var query = this.getQuery();

            var queryObserver = function (params) {
                //if something has changed, and that is related to conditions
                if (!params) return;

                if (params.source !== self &&
                        params.changeType && params.changeType.indexOf("column") < 0) {
                    self.refresh();
                }
                if (self.options.autoEditNewCondition && params.changeType == "condition.add")
                    self.editConditionValue(params.condition);

                //if (params.changeType == "condition.change") {
                //    self._updateDynamicListsByCondition(params.condition);
                //}
                //else if (params.changeType == "query") {
                //    self._updateAllDynamicLists();
                //}
            };

            if (query) {
                if (remove)
                    query.removeChangedCallback(queryObserver);
                else
                    query.addChangedCallback(queryObserver);
            }
        },


        _clear: function () {
            this.setActiveConditionWidget(null);
            this.element.html('');
        },

        _refreshByQuery: function (rootBlock) {
            rootBlock.RootPredicate({ queryPanel: this, model: this.getModel() });
            rootBlock.RootPredicate('init', this.getQuery().getRootPredicate(), null, null);
            this._rootPredicateWidget = rootBlock.data('RootPredicate'); //jQuery before 1.9
            if (!this._rootPredicateWidget) {
                this._rootPredicateWidget = rootBlock.data('eqjs-RootPredicate'); //jQuery after 1.9
            }

            return rootBlock;
        },


        /// <method name="clearConditions">
        /// <summary>Clears the list of conditions in associated query and redraws a panel if needed</summary>
        /// <example>
        ///     var QueryPanelDiv = $("#QueryPanel");
        ///     QueryPanelDiv.QueryPanel('clearConditions');
        /// </example>
        /// </method>
        clearConditions: function (needRefresh) {
            var query = this.getQuery();

            query.clearConditions();

            if (needRefresh !== false)
                this.refresh();
        },

        /// <method name="clearQuery">
        /// <summary>Clears all parts (list of conditions, list of columns) in associated query and redraws a panel if needed</summary>
        /// <example>
        ///     var QueryPanelDiv = $("#QueryPanel");
        ///     QueryPanelDiv.QueryPanel('clearQuery');
        /// </example>
        /// </method>
        clearQuery: function (needRefresh) {
            var query = this.getQuery();

            query.clear();

            if (needRefresh !== false) {
                this.refresh();
            }
        },

        _fireQueryChange: function (changeType) {
            var self = this;

            var query = this.getQuery();
            query.fireChangedEvent({
                "source": self,
                "changeType": "query." + changeType
            }, true);
        },

        _fireEntitiesPopup: function (eventArgs) {
            var self = this;

            if (this.options.entitiesPopupHandler) {
                return this.options.entitiesPopupHandler({
                    "query": self.getQuery(),
                    "items": eventArgs.items
                });
            }
            else
                return false;
        },

        showEntitiesMenu: function(menuOptions) {
            var self = this;
            var items = self.options.entitiesMenu.PopupMenu("option", "items");
            var needRefresh = self._fireEntitiesPopup({
                "items" : items                
            });

            if (needRefresh) {
                self.options.entitiesMenu.PopupMenu("refreshItems", items);
            }

            self.options.entitiesMenu.PopupMenu("showMenu", menuOptions);
        },

        getEntitiesList: function (listOptions) {
            var model = this.getModel();

            var listItems = model.getEntitiesTree(listOptions);
            if (this.options.entitiesListFilter) {
                this.options.entitiesListFilter(listItems, listOptions);
            }
            return listItems;
        },


        
        /// <method name="editConditionValue">
        /// <summary>
        /// Turns the row for condition passed in parameter into "edit" mode. 
        /// If no parameter is passed then it switch on edit mode for current active row.
        /// </summary>
        /// <example>
        ///     var QueryPanelDiv = $("#QueryPanel");
        ///     QueryPanelDiv.QueryPanel('editConditionValue');
        /// </example>
        /// </method>
        editConditionValue: function (condition) {
            //if conidition is not defined - then we take the first one in the query
            if (!condition && !this.isQueryNullOrEmpty()) {
                condition = this.getQuery().getRootPredicate().conditions[0];
            }

            //if query is empty - go away
            if (!condition) return;

            //search for the row element which corresponds to the passed condition
            var condElement = this.element.find('[class*=eqjs-qp-row-condition]')
                .filter(function (index) {
                    return (this.condition == condition);
                });

            //take first value element is this row
            var valueElement = condElement.find('[class*=eqjs-qp-valueelement]').first();
            if (valueElement.length == 0) return;

            var data = $(valueElement).data();
            for (var prop in data) {
                if (prop.indexOf("ValueEditor_") >= 0) {
                    var valueEditor = data[prop];
                    valueEditor.showEditor();
                }
            }

            //$(firstValElement).ValueEditor("showEditor");
        },

        _createEntitiesMenu: function () {
            if (this.isModelNullOrEmpty()) return null;

            var self = this;
            var menuDiv = $('<div></div>')
                .hide()
                .appendTo(self.element);

            var menuId = self.element.attr('id');
            if (menuId) {
                menuId += '-EntitiesMenu';
            }

            var options = { "items": self.options.entitiesList, id: menuId, domWriteItemsId: self.options.domWriteItemsId };
            $.extend(options, self.options.menuOptions);
            if (self.options.isSubQuery) {
                options.zIndex = self.options.dialogZIndex + 1000;
            }

            menuDiv.PopupMenu(options);

            return menuDiv;
        },

        /// <method name="addNewCondition">
        /// <summary>
        /// Creates a new simple condition with attribute and operator based on their IDs passed in parameters 
        /// and then adds this new condition into the root predicate. 
        /// </summary>
        /// <param name="attrid" type="String">
        /// Attribute ID. By default attribute ID is equals to TableName.FieldName of corresponding column.
        /// </param>
        /// <param name="operid" type="String">
        /// Operator ID (e.g. 'Equals', 'StartsWith', etc).
        /// </param>
        /// <example>
        ///     var QueryPanelDiv = $("#QueryPanel");
        ///     QueryPanelDiv.QueryPanel('addNewCondition', 'Orders.Paid', 'IsTrue');
        /// </example>
        /// </method>
        addNewCondition: function (attrid, operid) {
            var self = this;

            if (self._rootPredicateWidget) {
                return self._rootPredicateWidget.addNewCondition(attrid, operid);
            }
            return null;
        },

        addNewConditionIntoActivePredicate: function (attrid, operid) {
            var self = this;

            if (this._activeConditionWidget) {
                var activePredicateWidget;
                if (this._activeConditionWidget.isPredicate()) {
                    activePredicateWidget = this._activeConditionWidget;
                }
                else {
                    activePredicateWidget = this._activeConditionWidget._parentPredicateWidget;
                }

                return activePredicateWidget.addNewCondition(attrid, operid);
            }
            else {
                return this.addNewCondition(attrid, operid);
            }

        },

        refresh: function () {
            this._render();
            this._checkActivateRootPredicate();
        },

        resize: function () {
            this.refresh();
        },

        /// <method name="setActiveConditionWidget">
        /// <summary>Activates the particular condition in the panel</summary>
        /// <param name="conditionWidget" type="Object">
        /// <summary>The ConditionRow_SMPL or ConditionRow_PDCT object to activate.</summary>
        /// </param>
        /// </method>
        setActiveConditionWidget: function (conditionWidget) {
            if (this._activeConditionWidget) {
                this._activeConditionWidget.internalDeactivate();
                this.options.activeCondition = null;
            }

            this._activeConditionWidget = conditionWidget;
            if (this._activeConditionWidget) {
                this._activeConditionWidget.internalActivate();
                this.options.activeCondition = this._activeConditionWidget.getCondition();
            }
        },

        predicateContainsCondition: function (predicate, condition) {
            var self = this;
            if (!predicate || !condition) { return false; }

            if (predicate.conditions) {
                var condLength = predicate.conditions.length;
                for (var i = 0; i < condLength; i++) {
                    if (predicate.conditions[i] == condition) { return true; }

                    if (self.predicateContainsCondition(predicate.conditions[i], condition)) { return true; }
                }
            }

            return false;
        },

        getNewPredId: function () {
            if (this.element.attr('id')) {
                return this.element.attr('id') + '-pred-' + ++this._globalPredCounter;
            }
        },

        getNewCondId: function () {
            if (this.element.attr('id')) {
                return this.element.attr('id') + '-cond-' + ++this._globalCondCounter;
            }
        }

    })
})(jQuery);﻿//----------------------------------
//  ValueEditor base widget
//----------------------------------
;(function ($, undefined) {

    $.widget("eqjs.ValueEditor", {
        _expr: { value: "", text: "" },

        _linkElement: null,

        options: {
            model: null,
            parentWidget: null,
            editor: null,
            onChange: null,
            emptyText: null
        },

        getModel: function () {
            return this.options.parentWidget ? this.options.parentWidget.getModel() : null;
        },

        getQuery: function() {
            return this.options.parentWidget ? this.options.parentWidget.getQuery() : null;

        },

        getCondition: function() {
            return this.options.parentWidget && this.options.parentWidget.getCondition ? this.options.parentWidget.getCondition() : null;
        },

        getQueryPanel: function() {
            return this.options.parentWidget && this.options.parentWidget.getQueryPanel ? this.options.parentWidget.getQueryPanel() : null;
        },

        init: function (expr) {
            this._expr = expr;
            this._expr.value = this._adjustNewValue(expr.value);
            this._adjustExprText();
            this.refresh();
        },

        getResText: function () {
            if (!EQ.core.getText) {
                return undefined;
            }

            return EQ.core.getText.apply(this.getQueryPanel(), arguments);
        },

        _getEmptyText: function () {
            return this.options.emptyText || this.getResText('MsgEmptyScalarValue'); //'[enter value]';
        },

        _render: function () {
            this.clear();
            if (this.getModel() && this._expr) {
                this._renderCommonPart();
                //                if (this.options.condition.enabled !== false) {
                this._renderEditor();
                //				}

                var qp = this.getQueryPanel();
                if (qp && qp.options && qp.options.spreadValueElement) {
                    //var maxWidth = this.options.parentWidget.getMaxValueWidth();

                    //this.element.css('max-width', maxWidth);
                    this._linkElement.css('width', '100%');
                    this._linkElement.css('max-width', '100%');
                }
                var txt = this._getDisplayText();
                this._linkElement.text(txt);
                this._linkElement.attr("title", txt);
            }
        },

        _getClassesToAdd: function () {
            return 'eqjs-qp-condelement eqjs-qp-valueelement';
        },

        _renderCommonPart: function () {
            var self = this;
            self.element.addClass(self._getClassesToAdd());
            var cond = this.getCondition();

            if (!cond || (cond.enabled !== false && !cond.readOnly)) {
                self._linkElement = $('<a></a>', {
                    href: 'javascript:void(0)',
                    text: '-'
                }).appendTo(self.element);

                self._linkElement.click(function () {
                    self.showEditor();
                    return false;
                });
            }
            else {
                self._linkElement = $('<span></span>', {
                    text: '-'
                }).appendTo(self.element);
            }
        },

        showEditor: function () {
            if (this._beforeShowEditor()) {
                this._showEditor();

                if (this.options.parentWidget) {
                    this.options.parentWidget.makeActive();
                }
            }
        },

        _renderEditor: function () {
        },

        refresh: function () {
            this._render();
        },

        _beforeShowEditor: function() {
            return true;
        },

        _showEditor: function () {
            //console.log("showEditorBase");
        },

        _setOption: function (key, value) {
            if (arguments.length == 2) {
                this.options[key] = value;
                this._render();
                return this;
            }
            else {
                return this.options[key];
            }
        },

        clear: function () {
            if (this._linkElement)
                this._linkElement.unbind();
            this.element.removeClass();
            this.element.empty();
        },

        _setValueSilent: function(newValue) {
            var adjustedValue = this._adjustNewValue(newValue);
            var res = this._validate(adjustedValue);
            if (res && res.result) {
                this._expr.value = adjustedValue;
                this._expr.text = newValue;
                this._adjustExprText();
                var txt = this._getDisplayText();
                this._linkElement.text(txt);
                this._linkElement.html(this._linkElement.html().replace(/ /g, '&nbsp'));
                this._linkElement.attr("title", txt);
                return true;
            }
            else {
                this._validateError(res);
            }
            return false;
        
        },

        _setValue: function (newValue) {
            if (this._setValueSilent(newValue) && this.options.onChange) {
                this.options.onChange(this._expr.value);
            }
        },

        _validate: function (val) {
            //console.log("validate BASE: " + val);
            return { result: true, message: "" };
        },


        _validateError: function (res) {
            alert("Invalid value!\n" + res.message);
        },


        _getValue: function () {
            return this._expr.value;
        },

        _getText: function () {
            return this._expr.text;
        },

        _isEmptyValue: function() {
            var v = this._getValue();
            return (typeof(v) === "undefined" || v === null || !v);
        },
               

        _adjustExprText: function () {
            var ev = this._expr.value;
            if (ev && !EQ.core.isObject(ev) && ev != '') {  //if not null, not object and not empty
                this._expr.text = ev;
            }
            else {
                this._expr.text = '';
            }
        },

        _adjustNewValue: function (newValue) {
            return newValue;
        },

        _getDisplayText: function () {
            this._adjustExprText();

            if (this._expr.text && this._expr.text != '')
                return this._expr.text;
            else if (this._expr.value && this._expr.value != '')
                return this._expr.value;
            else
                return this._getEmptyText();
        }

    });
})(jQuery);



(function ($, undefined) {

    $.widget("eqjs.ValueEditor_EDIT", $.eqjs.ValueEditor, {
        _numberDecimalSeparatorValue: '.', //constant
        _numberListSeparatorValue: ',', //constant

        _numberDecimalSeparatorDisplay: '.',
        _numberListSeparators: [',', ';'],

        _editBox: null,
        _editBoxClass: 'eqjs-qp-ve-editbox',

        _create: function () {
            var queryPanel = this.getQueryPanel();

            if (queryPanel) {
                if (queryPanel.options.numberDecimalSeparatorDisplay)
                    this._numberDecimalSeparatorDisplay = queryPanel.options.numberDecimalSeparatorDisplay;

                if (queryPanel.options.numberListSeparators)
                    this._numberListSeparators = queryPanel.options.numberListSeparators;
            }
        },

        _adjustNewValue: function (newValue) {
            if (newValue.length > 0 && this._expr.kind == "List") {
                var reg = new RegExp("\\s*[" + this._numberListSeparators.join('') + "]\\s*", "i");
                var arrVal = newValue.split(reg);
                var arrLength = arrVal.length;
                for (var idx = 0; idx < arrLength; idx++ ) {
                    arrVal[idx] = this._adjustScalarValue(arrVal[idx]);
                }
                return arrVal.join(this._numberListSeparatorValue);
            }
            else {
                return this._adjustScalarValue(newValue);
            }
        },

        _adjustScalarValue: function (val) {
            var result = val.split(this._numberDecimalSeparatorDisplay).join(this._numberDecimalSeparatorValue);

            return result;
        },

//        _adjustExprText: function () {
//            //nothing to do
//        },

        _renderEditor: function () {
            var self = this;
            var dontProcessBlur = false;
            self._editBox = $('<input />', {
                'type' : 'text',
                'class' : self._editBoxClass,
                blur: function (e) {
                    if (self._editBox.is(':visible') && !dontProcessBlur) {
                        self._setValue(self._editBox.val());
                        self._editBox.hide();
                        self._linkElement.show();
                        e.stopPropagation();
                        return false;
                    }
                },
                keydown: function (e) {
                    if (e.keyCode == 13) {  // if - enter
                        if (self._editBox.is(':visible')) {
                            dontProcessBlur = true;
                            self._setValue(self._editBox.val());
                            self._editBox.hide();
                            self._linkElement.show();
                            e.stopPropagation();
                            dontProcessBlur = false;
                            return false;
                        }
                    }
                    if (e.keyCode == 27) {   // if - esc
                        self._editBox.hide();
                        self._linkElement.show();
                        e.stopPropagation();
                        return false;
                    }
                }
            }).appendTo(this.element).hide();

        },

        _checkScalarValue: function (val) {
            var parsedVal = +val;
            if (isNaN(parsedVal) || (EQ.core.isNumericType(this._expr.dataType) && ($.trim(val) != val))) {
                return {
                    result : false,
                    message : '"' + val + '"' + this.getResText('ErrNotNumber')
                }
            }
            else if (EQ.core.isIntType(this._expr.dataType) && parsedVal != parseInt(val, 10)) {
                return {
                    result : false,
                    message : val + ' - ' + this.getResText('ErrIncorrectInteger')
                }
            }

            return { result : true, message : ''}
        },

        _validate: function (val) {
            var scalarRes;
            if (EQ.core.isNumericType(this._expr.dataType)) {
                if (val.length > 0 && this._expr.kind == "List") {
                    var arrVal = val.split(/\s*,\s*/);
                    var arrLength = arrVal.length;
                    for (var idx = 0; idx < arrLength; idx++) {
                        scalarRes = this._checkScalarValue(arrVal[idx]);
                        if (!scalarRes || !scalarRes.result) {
                            return {
                                result: false,
                                message: this.getResText('ErrIncorrectNumberList')
                            }
                        }
                    }
                    return { result : true }
                }
                else {
                    return this._checkScalarValue(val);
                }
            }
            else {
                return { result : true };
            }
        },


        _getZIndex: function () {
            var queryPanel = this.getQueryPanel();
            return (queryPanel && queryPanel.options.isSubQuery) ? queryPanel.options.dialogZIndex + 1000: 100000;
        },

        _showEditor: function () {
            var self = this;

            var width = self.element.width();
            self._linkElement.hide();

            self._editBox
            .val(self._getText())
            .css('min-width', width)
            .show()
            .focus();
        }
    })
})(jQuery);


(function ($, undefined) {

    $.widget("eqjs.ValueEditor_DATETIME", $.eqjs.ValueEditor_EDIT, {
        _dateFormatInternal: 'yy-mm-dd',
        _dateFormatValue: 'mm/dd/yy',
        _dateFormatDisplay: 'd mm, yy',
        _dateValue : '',
        _timeFormatInternal: 'HH:mm',
        _timeFormatValue: 'HH:mm',
        _timeFormatDisplay: 'HH:mm',
        _yearRange: 'c-10:c+10',

        _create: function () {
            var queryPanel = this.getQueryPanel();

            var qpOptions = queryPanel ? queryPanel.options : {};
            this._dateFormatValue = this.options.dateFormatValue || qpOptions.dateFormatValue || this._dateFormatValue;
            this._dateFormatDisplay = this.options.dateFormatDisplay || qpOptions.dateFormatDisplay || this._dateFormatDisplay;
            this._timeFormatValue = this.options.timeFormatValue || qpOptions.timeFormatValue || this._timeFormatValue;
            this._timeFormatDisplay = this.options.timeFormatDisplay || qpOptions.timeFormatDisplay || this._timeFormatDisplay;
            this._yearRange = this.options.yearRange || qpOptions.yearRange || this._yearRange;

            $.datepicker.setDefaults($.datepicker.regional[EQ.client.locale]);
            $.timepicker.setDefaults($.timepicker.regional[EQ.client.locale]);
        },

        _renderEditor: function () {
            var self = this;

            self._editBox = $('<input />', {
                'type' : 'text',
                'class' : 'eqjs-qp-ve-editbox'
            }).appendTo(self.element).hide();

            self._editBox.on('keydown', function (e) {
                if (e.keyCode == 27) {
                    self._editBox.val(self.lastValue);
                }
            });

            if (self._expr.dataType == "Time") { 
                self._editBox.timepicker({
                    onClose: function (dateText, inst) {
                        if (dateText != "") {
                            var model = self.getModel();
                            //var lastVal = inst.lastVal;
                            var timeVal = self._convertTime($(this).datepicker('getDate'), self._timeFormatInternal);

                            //if (timeVal != self._convertTimeString(lastVal, self._timeFormatValue, self._timeFormatInternal)) {
                            if (dateText != self.lastValue) {
                                self._setValue(timeVal);
                            }
                            self._editBox.hide();
                        }
                        else {
                            self._editBox.hide();
                            self._editBox.timepicker('hide');
                        }
                    }
                });
                if (self._timeFormatValue) {
                    self._editBox.timepicker("option", "timeFormat", self._timeFormatValue);
                }
                else {
                    self._timeFormatValue = self._editBox.datepicker("option", "timeFormat");
                }

            }
            else if (self._expr.dataType == "Date") { //Date
                var model = this.getModel();

                self._editBox.datepicker({
                    changeMonth: true,
                    changeYear: true,
                    beforeShow: function () {
                        self._editBox.show();
                    },

                    onClose: function (dateText, inst) {
                        if (dateText != "") {
                            var model = self.getModel();
                            //var lastVal = inst.lastVal;
                            var dateVal = self._convertDate($(this).datepicker('getDate'), self._dateFormatInternal);

                            //if (dateVal != self._convertDateString(lastVal, self._dateFormatValue, self._dateFormatInternal)) {
                            if (dateText != self.lastValue) {
                                self._setValue(dateVal);
                            }
                            self._editBox.hide();
                        }
                        else {
                            self._editBox.hide();
                            self._editBox.datepicker('hide');
                        }
                    }
                });
                if (self._dateFormatValue) {
                    self._editBox.datepicker("option", "dateFormat", self._dateFormatValue);
                }
                else {
                    self._dateFormatValue = self._editBox.datepicker("option", "dateFormat");
                }
                if (self._yearRange) {
                    self._editBox.datepicker("option", "yearRange", self._yearRange);
                }
                else {
                    self._yearRange = self._editBox.datepicker("option", "yearRange");
                }
            }
            else if (self._expr.dataType == "DateTime") { //DateTime
                self._editBox.datetimepicker({
                    changeMonth: true,
                    changeYear: true,
                    beforeShow: function () {
                        self._editBox.show();
                    },

                    onClose: function (dateText, inst) {
                        if (dateText != "") {
                            var model = self.getModel();
                            var lastVals = self.lastValue.split(' '); //inst.lastVal.split(' ');
                            var lastDate = '';
                            var lastTime = '';
                            lastDate = lastVals[0];
                            if (lastVals.length > 1) {
                                lastTime = lastVals[1];
                            }

                            var dateVal = self._convertDate($(this).datepicker('getDate'), self._dateFormatInternal);
                            var timeVal = self._convertTime($(this).datepicker('getDate'), self._timeFormatInternal);

                            var resDate = '';
                            var resTime = '';
                            var origVals = self._expr.value.split(' ');

                            if (dateVal != self._convertDateString(lastDate, self._dateFormatValue, self._dateFormatInternal)) {
                                resDate = dateVal;
                            }
                            else {
                                resDate = origVals[0];
                            }

                            if (timeVal != self._convertTimeString(lastTime, self._timeFormatValue, self._timeFormatInternal)) {
                                resTime = timeVal;
                            }
                            else if (origVals.length > 1) {
                                resTime = origVals[1];
                            }

                            if (dateText != self.lastValue) { //($.trim(resDate + " " + resTime) != self._expr.value) {
                                self._setValue($.trim(resDate + " " + resTime));
                            }

                            self._editBox.hide();
                        }
                        else {
                            self._editBox.hide();
                            self._editBox.datepicker('hide');
                        }
                    }
                });
                if (self._dateFormatValue) {
                    self._editBox.datepicker("option", "dateFormat", self._dateFormatValue);
                }
                else {
                    self._dateFormatValue = self._editBox.datepicker("option", "dateFormat");
                }
                if (self._yearRange) {
                    self._editBox.datepicker("option", "yearRange", self._yearRange);
                }
                else {
                    self._yearRange = self._editBox.datepicker("option", "yearRange");
                }
                if (self._timeFormatValue) {
                    self._editBox.timepicker("option", "timeFormat", self._timeFormatValue);
                }
                else {
                    self._timeFormatValue = self._editBox.datepicker("option", "timeFormat");
                }
            }
        },
        
        _showEditor: function () {
            var self = this;
            var model = this.getModel();

            if (self._expr.dataType == "Time") { 
                var timeValue = this._expr.value;  //self._getValue();

                var time = model.getMacroTimeValue(timeValue);
                if (time) {
                    timeValue = this._convertTime(time, this._timeFormatInternal);
                }
                self._editBox.val(this._convertTimeString(timeValue, this._timeFormatInternal, this._timeFormatValue));

            }
            else if (self._expr.dataType == "Date") { //Date
                var dateValue = this._expr.value;  

                var date = model.getMacroDateValue(dateValue);
                if (date) {
                    dateValue = this._convertDate(date, this._dateFormatInternal);
                }
                self._editBox.val(this._convertDateString(dateValue, this._dateFormatInternal, this._dateFormatValue));
            }
            else if (self._expr.dataType == "DateTime") {  //DateTime
                var dtValues = this._expr.value.split(' ');
                var dateTimeValue = this._expr.value;
                var dateValue = '';
                var timeValue = '';
                dateValue = dtValues[0];
                if (dtValues.length > 1) {
                    timeValue = dtValues[1];
                }

                var date = model.getMacroDateValue(dateValue);
                if (date) {
                    dateValue = this._convertDate(date, this._dateFormatInternal);
                }
                var time = model.getMacroTimeValue(timeValue);
                if (time) {
                    timeValue = this._convertTime(time, this._timeFormatInternal);
                }

                self._editBox.val(this._convertDateString(dateValue, this._dateFormatInternal, this._dateFormatValue) + " " + this._convertTimeString(timeValue, this._timeFormatInternal, this._timeFormatValue));
            }

            self.lastValue = self._editBox.val();

            var queryPanel = this.getQueryPanel();

            var zindex = (queryPanel && queryPanel.options.isSubQuery) ? queryPanel.options.dialogZIndex + 1000: 100000;

            var l = self._linkElement.position().left;
            var t = self._linkElement.position().top;
            self._editBox
            .css({
                left: l,
                top: t,
                width: self._expr.dataType == "DateTime" ? "150px" : "115px",
                "min-width": self._linkElement.width(),
                position: 'absolute',
                zIndex: zindex
            })
            .show()
            .focus();
        },

        _adjustNewValue: function (newValue) {
            var model = this.getModel();

            if (this._expr.dataType == "Date") {
                if (model && ($.inArray(newValue, model.dateMacroList) >= 0)) {
                    return newValue;
                }
                else {
                    return this._convertDateValueString(newValue, this._dateFormatInternal, this._dateFormatInternal);
                }
            }
            else if (this._expr.dataType == "DateTime") {
                var dtValues = newValue.split(' ');
                var dateValue = '';
                var timeValue = '';
                dateValue = dtValues[0];
                if (dtValues.length > 1) {
                    timeValue = dtValues[1];
                }

                if (model && ($.inArray(dateValue, model.dateMacroList) < 0)) {
                    dateValue = this._convertDateValueString(dateValue, this._dateFormatInternal, this._dateFormatInternal);
                }

                if (timeValue == '') {
                    return $.trim(dateValue);
                }
                else {
                    if (model && ($.inArray(timeValue, model.timeMacroList) < 0)) {
                        timeValue = this._convertTimeValueString(timeValue, this._timeFormatInternal, this._timeFormatInternal);
                    }
                    return $.trim(dateValue + " " + timeValue);
                }
            }
            else if (this._expr.dataType == "Time") {
                if (model && ($.inArray(newValue, model.timeMacroList) >= 0)) {
                    return newValue;
                }
                else {
                    return this._convertTimeValueString(newValue, this._timeFormatInternal, this._timeFormatInternal);
                }
            }
        },


        _adjustExprText: function () {
            try {
                if (this._expr.value && this._expr.value != '') {
                    if (this._expr.dataType == "Date") { 
                        this._expr.text = this._convertDateValueString(this._expr.value, this._dateFormatInternal, this._dateFormatDisplay);
                    }
                    else if (this._expr.dataType == "DateTime") {
                        var dtValues = this._expr.value.split(' ');
                        var dateValue = this._expr.value;
                        var timeValue = "";
                        if (dtValues.length > 1) {
                            dateValue = dtValues[0];
                            timeValue = dtValues[1];
                        }

                        try {
                            dateValue = this._convertDateValueString(dateValue, this._dateFormatInternal, this._dateFormatDisplay);
                        }
                        catch (err) {
                            dateValue = '';
                        }

                        try {
                            timeValue = this._convertTimeValueString(timeValue, this._timeFormatInternal, this._timeFormatDisplay);
                        }
                        catch (err) {
                            timeValue = '';
                        }

                        this._expr.text = (dateValue == '' || timeValue == '') ? dateValue + timeValue : dateValue + " " + timeValue;
                    }
                    else if (this._expr.dataType == "Time") { 
                        this._expr.text = this._convertTimeValueString(this._expr.value, this._timeFormatInternal, this._timeFormatDisplay);
                    }
                }
                else {
                    this._expr.text = '';
                }
            }
            catch (err) {
                this._expr.text = '';
            }
        },

        _validate: function (val) {
            //console.log("validate DATETIME: " + val);
            return { result: true, message: "" };
        },


        _convertDateValueString: function (value, from, to) {
            var model = this.getModel();
            var defValue = '${Today}';

            if (model && ($.inArray(value, model.dateMacroList) >= 0)) {
                var macroText = value.substring(2, value.length - 1);
                var res = this.getResText(macroText);
                return res ? res : defValue;
            }
            else {
                var res = this._convertDateString(value, from, to);
                return res ? res : defValue;
            }
        },

        _convertDateString: function (value, from, to) {
            try {
                var theDate = $.datepicker.parseDate(from, value);
                return this._convertDate(theDate, to);
            }
            catch (err) {
                return '';
            }
        },

        _convertDate: function (value, to) {
            return $.datepicker.formatDate(to, value);
        },

        _convertTime: function (value, to) {
            var time = {
                hour: value.getHours(),
                minute: value.getMinutes(),
                second: value.getSeconds(),
                millisec: value.getMilliseconds(),
                microsec: value.getMicroseconds(),
                timezone: value.getTimezoneOffset() * -1
            };

            return $.datepicker.formatTime(to, time);
        },

        _convertTimeValueString: function (value, from, to) {
            var model = this.getModel();

            if (model && ($.inArray(value, model.timeMacroList) >= 0)) {
                var macroText = value.substring(2, value.length - 1);
                var res = this.getResText(macroText);
                return res ? res : '';
            }
            else {
                var res = this._convertTimeString(value, from, to);
                return res ? res : '';
            }
        },

        _convertTimeString: function (value, from, to) {
            try {
                var theTime = $.datepicker.parseTime(from, value);
                return theTime ? $.datepicker.formatTime(to, theTime) : '';
            }
            catch (err) {
                return '';
            }
        }
         
    })
})(jQuery);


(function ($, undefined) {

    $.widget("eqjs.ValueEditor_LIST", $.eqjs.ValueEditor, {
        _menuBlock: null,
        _menuItemsList: null,
        
        _emptyListText: '<empty list>',

        _showWhenReady: false,

        _getEmptyText: function () {
            if (this._menuItemsList && (this._menuItemsList.length > 0)) {
                return this.options.emptyText || this.getResText('MsgEmptyListValue'); //'[select value]';
            }
            else {
                return this.options.emptyText || this._emptyListText;
            }
        },

        _getListName: function() {
            return this.options.editor.name;
        },

        _renderEditor: function () {

            var self = this;

            self._fillMenuItemsList();
            self._renderMenuBlock();
        },

        _renderMenuBlock: function () {
            var self = this;
       
            var multiSelect = false;
            
            if (this._expr) {
                multiSelect = this._expr.kind == "List";
            }

            var queryPanel = this.getQueryPanel();

            var options = {
                "items": self._menuItemsList,
                "multiselect": multiSelect,
                "container": queryPanel ? queryPanel.options.menuContainer : null,
                onMenuItemSelected:
					function (evt, data) {
                        if (!multiSelect) {
						    self._setValue(data.menuItem.id);
                        }
                        else if (data.selectedItems) {
                            var selectedIds = [];
                            var selLength = data.selectedItems.length;
                            for (var i = 0; i < selLength; i++)
                                selectedIds.push(data.selectedItems[i].id);

                            self._setValue(selectedIds);
                            //console.log(data.selectedIds);
                        }
						return false;
					}
            };

            if (queryPanel) {
                $.extend(options, queryPanel.options.menuOptions);
            };

            if (queryPanel && queryPanel.options.isSubQuery) {
                options.zIndex = queryPanel.options.dialogZIndex + 1000;
            }


            var menuId = self.options.parentWidget.element.attr('id');
            if (menuId) {
                options.id = menuId + '-EditorMenu';
            }

            if (queryPanel) {
                options.domWriteItemsId = queryPanel.options.domWriteItemsId;
            };

            options.buttons = {
                submit : EQ.core.getText('ButtonApply'),
                cancel : EQ.core.getText('ButtonCancel')  
            }

			self._menuBlock = $('<div></div>')
				.hide()
				.appendTo(self.element)
				.PopupMenu(options);
        },

        _beforeShowEditor: function () {
            var listName = this._getListName();
            if (listName && listName.match(/{{.+?}}/)) {
                this._showWhenReady = true;
                this._renderEditor();
                return false;
            }
            else
                return true;
        },

        _showEditor: function () {
            var self = this;
            if (self._menuBlock) {
                this._menuBlock.PopupMenu('showMenu', { anchor: self._linkElement, selectedIds: self._getValueAsArray() });
            }
            else {
                this._showWhenReady = true;
            }
        },

        _getValueAsArray: function () {
            var self = this;

            if (self._expr.kind != 'List') {
                return [self._expr.value];
            }
            else {
                var res = self._expr.value.match(/"[^"\\]*(?:\\.[^"\\]*)*"|[^,]+/g);
                if (res) {
                    return $.map(res, function (a) {
                        if (a.charAt(0) == '"' && a.charAt(a.length - 1) == '"') {
                            a = a.substring(1, a.length - 1);
                            return a.replace(/\"/g, '"');
                        }
                        else {
                            return a;
                        }
                    });
                }
                else {
                    return [];
                }
            }

        },

        _adjustNewValue: function (newValue) {
            if ($.isArray(newValue)) {
                var arr = $.map(newValue, function (a) {
                    if (a.indexOf(',') >= 0) {
                        a = a.replace(/"/g, '\"');
                        return '"' + a + '"';
                    }
                    else {
                        return a;
                    }
                });

                return arr.join(',');
            }
            else {
                return newValue;
            }
        },

        _adjustExprText: function () {
            var self = this;

            var arrValues,
                arrTexts = [],
                match;

            if (self._expr.value && self._menuItemsList) {
                arrValues = self._getValueAsArray();


                self._expr.text = '';
                var arrLength = arrValues.length;

                var fillTexts = function (menuItems) {
                    var item;
                    for (var idx = 0; idx < menuItems.length; idx++) {
                        item = menuItems[idx];
                        if (item.items) {
                            fillTexts(item.items);
                        }
                        else {
                            match = $.grep(arrValues, function (value) {
                                return (item.id == value);
                            });

                            if (match.length > 0) {
                                arrTexts.push(item.text);
                            }
                        }
                    }
                };

                fillTexts(self._menuItemsList);


                self._expr.text = arrTexts.join(',');
			}
            else {
                self._expr.text = '';
			}
        },

        _takeFirstItemInList: function () {
            if (this._menuItemsList && this._menuItemsList.length > 0) {
                this._setValueSilent(this._menuItemsList[0].id);
            }
        
        },

        _takeDefaultValue: function () {
            if (!this._menuItemsList) return;
            var itemLen = this._menuItemsList.length;
            for (var i = 0; i < itemLen; i++) {
                var item = this._menuItemsList[i];
                if (item.isDefault) {
                    this._setValueSilent(item.id);
                    break;    
                }
            }
        },


        _fillMenuItemsList: function () {
            this._menuItemsList = this.options.editor.values;
            //this._takeFirstItemInList();
        }
        
    });
})(jQuery);



(function ($, undefined) {

    $.widget("eqjs.ValueEditor_CUSTOMLIST", $.eqjs.ValueEditor_LIST, {
        
        _loaderElement: null,

        _renderEditor: function () {
            var self = this;

            this._linkElement.hide();
            if (!this._loaderElement) {
                this._loaderElement = $('<div></div>', {
                    'class': 'eqjs-qp-ve-loader'
                }).appendTo(self.element);
            }

            this._loaderElement.show();

            if (this._loading) return;
            this._loading = true;
            this._fillMenuItemsList(function () {
                self._loading = false;
                var txt = self._getDisplayText();
                self._linkElement.text(txt);
                self._linkElement.attr("title", txt);
                self._loaderElement.hide();
                self._linkElement.show();
                self._renderMenuBlock();
                if (self._isEmptyValue()) {
                    self._takeDefaultValue();
                }
                //self._takeFirstItemInList();
                if (self._showWhenReady) {
                    self._showWhenReady = false;
                    self._showEditor();
                }
            });
        },


        _fillMenuItemsList: function (onComplete) {
            var self = this,
				listName = this._getListName(),
                listRequestHandler = this.getQuery().getListRequestHandler();

            var queryPanel = this.getQueryPanel();

            if (EQ.core.constLists[listName]) {
                self._menuItemsList = EQ.core.constLists[listName];
                if (onComplete) {
                    onComplete();
				}
            }
            else if (listName === "EntityTree") {
                self._menuItemsList = queryPanel.options.entitiesList;
                if (onComplete) {
                    onComplete();
				}
            }
            else if (listRequestHandler) {
                    listRequestHandler({"listName":listName}, function (list) { 
                        self._menuItemsList = list; 
                        if (onComplete) {
                            onComplete();
						}
                    });
            }
        }

    });
})(jQuery);


(function ($, undefined) {

    $.widget("eqjs.ValueEditor_SQLLIST", $.eqjs.ValueEditor_CUSTOMLIST, {
        
        _fillMenuItemsList : function(onComplete) {
            var self = this;
            var query = this.getQuery();
            var editor = this.options.editor;
            var listRequestHandler = query.getListRequestHandler();
            if (listRequestHandler) {
                var requestData = { 
                    listName: "SQL", 
                    editorId: editor.id
                };

                //requestData.sql = editor.sql;
                listRequestHandler(requestData, function (list) {
                    self._menuItemsList = list; 
                    if (onComplete) {
                        onComplete();
                    }
                });
            }
        }

    });
})(jQuery);



(function ($, undefined) {

    $.widget("eqjs.ValueEditor_SUBQUERY", $.eqjs.ValueEditor, {

        _dialogBlock: null,
        _queryPanelBlock: null,
        _columnElement: null,

        _colEntitiesList : null,

        _getEmptyText: function () {
            return this.getResText('MsgSubQueryValue'); //'[edit sub-query]';
        },

        _renderEditor: function () {
            var self = this;

            this._dialogBlock = $('<div></div>', {
                'class' : 'eqjs-qp-ve-subquery'
            }).hide().appendTo(self.element);
            
            var parentPanel = this.getQueryPanel();
            var model = this.getModel();

            var exprType = this._expr.dataType;

            this._colEntitiesList = model.getEntitiesTreeWithFilter(function (item) {
                if (item.attributes && item.uic) //if it's entity - return true
                    return true;
                return item.uic && (!item.dataType || item.dataType == exprType);
            });

            var colEntitiesMenu = $('<div></div>')
                .hide()
                .appendTo(self._dialogBlock);

            var menuId = self.options.parentWidget.element.attr('id');
            if (menuId) {
                menuId += '-SubColumnMenu';
            }

            colEntitiesMenu.PopupMenu({
                id: menuId,
                "items": self._colEntitiesList,
                "zIndex": parentPanel.options.dialogZIndex + 1000,
                domWriteItemsId: parentPanel.options.domWriteItemsId
            });
            
            var columnBlock = $('<div></div>')
                .addClass('eqjs-qp-ve-subquery-column')
                .appendTo(self._dialogBlock);

            var columnTitle = $('<div></div>')
                .addClass('eqjs-qp-ve-subquery-column-title')
                .text(self.getResText('SubQueryColumnTitle')) //'Column:';
                .appendTo(columnBlock);

            var columnElementBlock = $('<div></div>')
                .addClass('eqjs-qp-ve-subquery-column-element')
                .appendTo(columnBlock);

            self._columnElement = $('<a></a>')
                .attr('href', "javascript:void(0)")
                .appendTo(columnElementBlock);
            self._columnElement.click(function (e) {
                colEntitiesMenu.PopupMenu('showMenu', {
                    anchor: self._columnElement, 
                    selectedIds: null, 
                    itemSelectedCallback: function (evt, data) {
                        return self._columnElementMenuClick(evt, data);
                    }
                });
            });

            var queryPanelCaptionBlock = $('<div></div>')
                .addClass('eqjs-qp-ve-subquery-qp-caption')
                .text(self.getResText('SubQueryQueryPanelCaption')) //'Conditions';
                .appendTo(self._dialogBlock);

            self._queryPanelBlock = $('<div class="eqjs-qp-ve-subquery-qp"></div>').appendTo(self._dialogBlock);
            var qpId = self.options.parentWidget.element.attr('id');
            if (qpId) {
                self._queryPanelBlock.attr('id', qpId + '-SubQueryPanel');
            }



            self._dialogBlock.dialog({
			    autoOpen: false,
                draggable: false,
                resizable: false,
                //closeOnEscape: false,
			    title: self.getResText('SubQueryDialogTitle'), //'edit sub-query',
                dialogClass: 'eq-js-dialog',
                closeText: "X",
                modal: true,
                width: parentPanel.options.subQueryDialogWidth,
                minHeight: parentPanel.options.subQueryDialogHeight,
                zIndex : parentPanel.options.dialogZIndex,
                buttons : [
                    {
                        name: 'eqjs-subquery-button-ok',
                        text: self.getResText('ButtonOK'),
                        click: function () {
                            var subQuery = self.getSubQuery();
                            self._expr.value = subQuery.getObject();
                            $(this).dialog("close");
                            var query = self.getQuery();
                            query.fireChangedEvent({
                                "source": self.getQueryPanel(),
                                "changeType": "condition.changed",
                                "condition": self.getCondition()
                            }, true);
                        }
                    },
                    {
                        name: 'eqjs-subquery-button-cancel',
                        text: self.getResText('ButtonCancel'),
                        click: function() {
                            $(this).dialog("close");
                        }
                    }
                ],
                open: function(){
                    $('.ui-widget-overlay').addClass('eq-js-dialog-overlay');
                    $('body').css('overflow', 'hidden');
                },
                beforeClose: function(){
                    $('.ui-widget-overlay').removeClass('eq-js-dialog-overlay');
                    $('body').css('overflow', 'auto');
                },
                close: function(event, ui) {
                    //self._columnsPanelBlock.ColumnsPanel('destroy');
                    self._queryPanelBlock.QueryPanel('destroy');
                }
            });

        },
            
        _columnElementMenuClick: function (evt, data) {
            var self = this;

			var attrid = data.menuItem.data('id');
            
			this._setResultAttributeId(attrid);

			return false;
        },

        _setResultAttributeId: function (attrId) {
            var attrObj = this.getModel().getAttributeById(attrId);

            if (attrObj) {
                var subQuery = this.getSubQuery();

                var cols = subQuery.getColumns();
                var column;

                if (cols.length > 0) {
                    column = cols[0];
                    column.expr.id = attrId;
                    column.expr.dataType = attrObj.dataType;;
                }
                else {
                    column = {
                        caption: "",
                        sorting: "None",
                        sortIndex: -1,
                        expr: {
                            "typeName": "ENTATTR",
                            "id": attrId,
                            "kind": "Attribute",
                            "dataType": attrObj.dataType
                        }
                    };
                    cols.push(column);
                }

                var parentQuery = this.getQuery();
                var parentPanel = this.getQueryPanel();


                parentQuery.fireChangedEvent({
                    "source": parentPanel,
                    "changeType": "subQuery.column.change",
                    "column": column
                }, true);


                this._columnElement.text(this._getAttributeText(attrObj));
                this._okButtonEnable(true);
            }
        },

        _getAttributeText: function (attribute) {
            var self = this;

            if (!attribute) return self.getResText('SubQueryEmptyColumn');

            var attrText = EQ.core.getText('Attributes', attribute.id);
            if (!attrText)
                attrText = attribute.caption;

            var parentPanel = this.getQueryPanel();

            var format = parentPanel.options.attrElementFormat;
            if (!format) return attrText;

            var result = format.replace(new RegExp("{attr}",'g'), attrText);
			var entityPath = self.getModel().getFullEntityPathByAttr(attribute.id, '.');
			result = result.replace(new RegExp("{entity}",'g'), entityPath);

            return result;        

        },

        _showEditor: function () {
            var self = this;


            var parentQuery = this.getQuery();
            var parentPanel = this.getQueryPanel();

            self._queryPanelBlock.empty();
            var queryObj = jQuery.extend(true, {}, self._getValue());

            var subQuery = new EQ.core.Query(this.getModel(), queryObj);
            subQuery.clientListRequestHandler = parentQuery.clientListRequestHandler;
            subQuery.serverListRequestHandler = parentQuery.serverListRequestHandler;
            
            subQuery.addChangedCallback(function (params) {
                var mqep = $.extend({}, params);
                mqep.source = parentPanel;
                mqep.changeType = "subQuery." + mqep.changeType;
                parentQuery.fireChangedEvent(mqep);
            });
           

            self._queryPanelBlock.QueryPanel({
                isSubQuery: true,
                showRootRow: parentPanel.options.showRootRow,
                showAddRow: true,
                menuContainer: self._dialogBlock.get(0),
                showCheckboxes: parentPanel.options.showCheckboxes,
                dateFormatValue: parentPanel.options.dateFormatValue,
                dateFormatDisplay: parentPanel.options.dateFormatDisplay,
//                listRequestHandler: parentPanel.options.listRequestHandler,
//                sqlListRequestHandler: parentPanel.options.sqlListRequestHandler,
                entitiesListFilter: function (listItems, listOptions) {
                    if (parentPanel.options.entitiesListFilter) {
                        var subQueryPanelListOptions = listOptions || {};
                        subQueryPanelListOptions.isSubQuery = true;
                        parentPanel.options.entitiesListFilter(listItems, subQueryPanelListOptions);
                    }
                }
            });

            self._queryPanelBlock.QueryPanel("setQuery", subQuery);

            var attrId = null;

            var cols = subQuery.getColumns();;

            if (cols.length == 0) {
                var condition = this.getCondition();
                if (condition.expressions.length > 0) {
                    var attrExpr =  condition.expressions[0];
                    attrId = (attrExpr.typeName == "ENTATTR" || attrExpr.kind == "Attribute") ? attrExpr.id : null;
                }
            }
            else {
                attrId = cols[0].expr.id;
            }

            if (attrId) {
                this._setResultAttributeId(attrId);
            }
            else {
                this._columnElement.text(this.getResText("SubQueryEmptyColumn"));
            }

            self._dialogBlock.dialog('open');
            //self._okButtonEnable(attrobj);
        },

        getSubQuery: function() {
			return this._queryPanelBlock.QueryPanel("getQuery");

        },


        _okButtonEnable: function (enabled) {
            var buttonOk = this._dialogBlock.next(".ui-dialog-buttonpane").find("[name='eqjs-subquery-button-ok']"); 
            if (buttonOk) {
                if (enabled) {
                    buttonOk.button("enable");
                }
                else {
                    buttonOk.button("disable");
                }
            }
        },

        _getDisplayText: function () {
            return this._getEmptyText();
        }

    });
})(jQuery);





//=====================================

(function ($, undefined) {

    $.widget("eqjs.PredicateLinkType", $.eqjs.ValueEditor_LIST, {
        _predicate: null,

        options: {
            queryPanel: null
        },

        getCondition: function() {
            return this._predicate;
        },

        init: function (predicate) {
            this._predicate = predicate;


            this.refresh();
        },

        _render: function () {
            this.clear();
            if (this._predicate) {
                this._renderCommonPart();
                if (this._predicate.enabled !== false)
                    this._renderEditor();
                this._linkElement.text(this._getDisplayText());
            }
        },

        _showEditor: function () {
            var self = this;
            self._menuBlock.PopupMenu('showMenu', { anchor: self._linkElement }); //, self._predicate.linkType);
        }, 

        _fillMenuItemsList: function () {
            this._menuItemsList = EQ.core.predicateLinkTypeList;
        },

        _setValue: function (newValue) {
            this._predicate.linkType = newValue;
            
            this._linkElement.text(this._getDisplayText());

            if (this.options.onChange) {
                this.options.onChange(newValue);
            }
        },

        _beforeShowEditor: function () {
            return true;
        },

        _getClassesToAdd: function () {
            return 'eqjs-qp-predelement eqjs-qp-predvalueelement';
        },

        _getDisplayText: function () {
            var self = this,
				result = this._getEmptyText();

            if (self._predicate.linkType && self._predicate.linkType != '') {
                $.each(EQ.core.predicateLinkTypeList, function () {
                    if (this.id === self._predicate.linkType) {
                        result = this.text;
					}
                });
            }

            return result;
        }

    });
})(jQuery);
﻿/// <widget name="ColumnsPanel" version="1.0.0">
/// <summary>
/// This widget represents "columns panel" - a rectangular area of your web-page which contains the list of query result columns 
/// and provides some operations for manipulating with that list: add/remove a column, change its type, set column's sorting, etc.\\
/// All options of **ColumnsPanel** widgets can be set through ''columnsPanel'' property of ''easyQuerySettings'' global variable. 
/// Of course you can also set options and call methods of **ColumnsPanel** in an usual for jQuery widgets way.
/// </summary>
/// <example>
/// Here is an example how to set **ColumnsPanel** options when you initialize ''easyQuerySettings'' variable:
/// <code>
/// window.easyQuerySettings = {
///     serviceUrl: "/EasyQuery",
///     modelName: "YourModelName", //put the name of your model here
///     .   .   .   .   .   .   .
///     columnsPanel: {
///         allowAggrColumns: true,
///         attrElementFormat: "{attr}", //show only attribute instead of "{entity} {attr}" format used by default.
///         showColumnCaptions: true,
///         .   .   .   .   .   .
///     }
///     .   .   .   .   .   .
/// }
/// </code>
/// An example of seting some **ColumnsPanel** option in code using ''option'' method:
/// <code>
/// var QCDiv = $('#QueryColumn');
/// if (QCDiv.length > 0) {
///    QCDiv.ColumnsPanel("option", "showHeader", false)
/// }
/// </code>
/// </example>
/// <notes>
/// If you include ''eq.view.js'' script on your page then this widget (as well as **QueryPanel** and **EntitiesPanel**) is initilized implicitly (on page load) for all DOM elements with id "ColumnsPanel". So all you need to do to add on your page is:\\
/// \\
/// 1. Define a placeholder
/// <code><div id="ColumnsPanel"></div></code>
/// 2. Include ''eq.all.min.js'' and ''eq.view.js'' on your page (after jQuery and jQuery UI).
/// </notes>
/// </widget>
;(function ($, undefined) {

    $.widget("eqjs.ColumnsContainer", {
        _activeColumnWidget: null,

        _globalColCounter: 0,

        _defaultMenuOptions: {
            showSearchBoxAfter: 30,
            searchBoxAutoFocus: true,
            activateOnMouseOver: true
        },

        _query: null,
        
        options: {

            isSubQuery: false,
            activeColumn: null,

            /// <option name="showAddRow" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether columns panel must show a special [add column] link at the bottom</summary>
            /// </option>
            showAddRow: true,

            /// <option name="showHeader" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether columns panel must show a header at the top</summary>
            /// </option>
            showHeader: true,

            /// <option name="showColumnCaptions" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether columns panel must show an editable caption for each column (i.e. "SELECT ColumnName AS ColumnCaption...")</summary>
            /// </option>
            showColumnCaptions: true,

            /// <option name="allowAggrColumns" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether columns panel allows user to use aggregated columns</summary>
            /// </option>
            allowAggrColumns: true,

            /// <option name="allowDuplicates" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether it's allowed to add exactly the same column more than once</summary>
            /// </option>
            allowDuplicates: true,

            /// <option name="allowSorting" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether columns panel allows user to set columns sorting</summary>
            /// </option>
            allowSorting: true,

            /// <option name="attrElementFormat" type="String" default="'{entity} {attr}'">
            /// <summary>Gets or sets the format of the attribute display name. '{entity}' is replaced with entity name, '{attr}' is replaced with attribute name</summary>
            /// </option>
            attrElementFormat: '{entity} {attr}',

            /// <option name="titleElementFormat" type="String" default="null">
            /// <summary>
            /// Gets or sets the format of column's title display name. '{entity}' is replaced with entity name, '{attr}' is replaced with attribute name.
            /// Default value is null which means that columns panel will use the same format as it's set to attrElementFormat option
            ///</summary>
            /// </option>
            titleElementFormat: null, 

            /// <option name="alwaysShowButtons" type="Boolean" default="false">
            /// <summary>Gets or sets a value indicating whether the service buttons are permanently displayed in all columns (true), or just in active column and the column user moves the cursor over (false)</summary>
            /// </option>
            alwaysShowButtons: false,

            /// <option name="accentActiveColumn" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether the active column should be backlighted and permanently display the service buttons</summary>
            /// </option>
            accentActiveColumn: true,

            /// <option name="menuSearchBoxAfter" type="Number" default="30">
            /// <summary>If the number of items in drop down menu exceeds this number then a search box will be displayed. Set this option to 0 if want to show the search box in any case</summary>
            /// </option>
            menuSearchBoxAfter: 30,

            /// <option name="allowDragDrop" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether the columns may be dragged and dropped</summary>
            /// </option>
            allowDragDrop: true,

            /// <option type="Object">
            /// <summary>
            /// Contains different options for popup menu that appears for selecting attributes in columns.\\
            /// Includes the following sub-options:
            /// </summary>
            /// <prop name="showSearchBoxAfter" type="integer" default="30">
            /// If the number of items in drop down menu exceeds this number then a search box will be displayed. 
            /// Set this option to 0 if want to show the search box in any case
            /// </prop> 
            /// <prop name="activateOnMouseOver" type="boolean" default="true">
            /// If true  - the row in query panel will be highlighted when user moves mouse cursor over it.
            /// </prop> 
            /// </option>
            menuOptions: {
                showSearchBoxAfter: 30,
                searchBoxAutoFocus: true,
                activateOnMouseOver: true,
                adjustHeight: true
            },

            /// <option name="attrPlacement" type="Integer" default="0">
            /// <summary>
            /// Defines where to display attributes in the tree:
            /// 0 - attributes are displayed after entities
            /// 1 - attributes are displayed before entities
            /// 2 - attributes and entities are mixed, and displayed in alphabetical order. In this case the "sortEntities" option value dosn't matter.
            /// </summary>
            /// </option>
            attrPlacement: 0,

            /// <option name="sortEntities" type="Integer" default="false">
            /// <summary>
            /// Defines whether entities and attributes should be sorted alphabetically. If false, they are displayed as listed in the model.
            /// </summary>
            /// </option>
            sortEntities: false

        },

        _create: function () {

        },

        getQuery: function(){
            return this._query;
        },

        setQuery: function(query) {
            this._setQueryObserver(true); //removing old query observer
            this._query = query;
            this._setQueryObserver();
            this.refresh();
        },

        getModel: function () {
            var query = this.getQuery();
            return query ? query.getModel() : null;
        },

        getColumns: function(){
            var query = this.getQuery();
            return query ? query.getColumns() : null;
        },

        _getCssPrefix: function() {
            return "";
        },

        _allowCustomExpressions: true,

        _render: function () {
            var self = this;

            self._clear();

            var model = this.getModel();

            self._updateLists();

            var cssClassPrefix = this._getCssPrefix();

            self.element.addClass(cssClassPrefix + '-panel');

            if (model && !model.isEmpty()) {

                self.options.entitiesList = model.getEntitiesTree({ addUIC: false, addUIR: true, addUIS: false, attrPlacement: self.options.attrPlacement, sortEntities: self.options.sortEntities });
                self.options.entitiesMenu = self._createEntitiesMenu();

                if (self.options.allowSorting != false) {
                    self.options.sortMenuList = [
                        { id: 'None', text: EQ.core.getText('CmdNotSorted') },
                        { id: 'Ascending', text: EQ.core.getText('CmdAscending') },
                        { id: 'Descending', text: EQ.core.getText('CmdDescending') },
                        { id: '---', text: '---' }
                    ];
                }
                else {
                    self.options.sortMenuList = [];
                }

                self.options.sortMenuList.push(
                    { id: 'MoveTop', text: EQ.core.getText('CmdMoveToFirst') },
                    { id: 'MoveUp', text: EQ.core.getText('CmdMoveToPrev') },
                    { id: 'MoveDown', text: EQ.core.getText('CmdMoveToNext') },
                    { id: 'MoveBottom', text: EQ.core.getText('CmdMoveToLast') }
                );

                self.options.sortMenu = self._createSortMenu();

                var minusHeight = 0;
                var columns = self.getColumns();

                //Header row
                var headerCssPrefix = cssClassPrefix + "-header";
                if (self.options.showHeader != false) {
                    headerBlock = $('<div class="' + headerCssPrefix + '"></div>')
                            .appendTo(this.element);

                    var exprBlock = $('<div class="' + headerCssPrefix + '-expression"></div>')
                            .text(EQ.core.getText('HeaderExpression'))
                            .appendTo(headerBlock);

                    if (self.options.showColumnCaptions) {
                        var titleBlock = $('<div class="' + headerCssPrefix + '-title"></div>')
                            .text(EQ.core.getText('HeaderTitle'))
                            .appendTo(headerBlock);
                    }

                    minusHeight += headerBlock.outerHeight() + 5;

                    this._headerBlock = headerBlock;
                }

                this._updateHeaderBlock();

                //Columns
                var colBlock = self._refreshByQuery(true);

                //AddRow
                if (self.options.showAddRow) {

                    var addRowBlock = $('<div class="eqjs-addrow ' + cssClassPrefix + '-addrow"></div>');
                    addRowBlock.appendTo(this.element);

                    if (! columns || columns.length === 0) {
                        addRowBlock.addClass('eqjs-addrow-empty');
                    }

                    var addRowLink = $('<a href="javascript:void(0)">' + EQ.core.getText('CmdClickToAddColumn') + '</a>');
                    addRowLink.appendTo(addRowBlock);

                    addRowLink.click(function (e) {
                        e.preventDefault();

                        self.showEntitiesMenu({
                            anchor: addRowLink, 
                            selectedIds: null, 
                            itemSelectedCallback: function (evt, data) {
                                var attrid = data.menuItem.id;
                                var attrobj = model.getAttributeById(attrid);

                                self.addNewColumn(attrid);
                                return false;
                            }
                        }, 
                        {});
                    });

                    minusHeight += addRowBlock.outerHeight()+9;
                }

                if (colBlock) {
                    colBlock.show();
                    colBlock.css({'max-height': self.element.innerHeight() - minusHeight + 5 + 'px'});
                }
            }
        },

        _updateHeaderBlock: function () {
            if (this._headerBlock) {
                var columns = this.getColumns();

                if (columns && columns.length > 0) {
                    this._headerBlock.show();
                }
                else {
                    this._headerBlock.hide();
                }
            }
        },

        _updateLists: function () {
        },

        _setOption: function (key, value) {
            if (key == 'menuOptions') {
                this.options.menuOptions = $.extend({}, this._defaultMenuOptions, value);
            }
            else if (key == 'searchBoxAfter') {
                this.options[key] = value;
                this.options.menuOptions.showSearchBoxAfter = value;
            }
            else if (key == 'query') {
                this.setQuery(value);
            }
            else if (arguments.length == 2) {
                this.options[key] = value;
                this.refresh();
                return this;
            }

            else {
                return this.options[key];
            }
        },


        _setQueryObserver: function (remove) {
            var self = this;
            var query = this.getQuery();

            var queryObserver = function (params) {
                //if something has changed, and that is related to columns
                if (params && params.source !== self &&
                        params.changeType && params.changeType.indexOf("condition") < 0) {
                    self._render();
                }
            };

            if (query) {
                if (remove)
                    query.removeChangedCallback(queryObserver);
                else
                    query.addChangedCallback(queryObserver);
            }
        },

        _clear: function () {
            this.element.html('');
        },

        _addColumnElement: function (columnsBlock, column, index) {
            var self = this;

            var newColBlock = $('<div></div>');
            var rows = columnsBlock.find('[class*=' + self._getCssPrefix() + '-row]');

            if (index == 0) {
                newColBlock.prependTo(columnsBlock);
            }
            else if (index > 0 && index < rows.length) {
                newColBlock.insertAfter(rows[index - 1]);
            }
            else {
                newColBlock.appendTo(columnsBlock);
            }

            if (!column.blockId) {
                this.trySetBlockId(column);
            }
            if (column.blockId) {
                newColBlock.attr('id', column.blockId);
            }

            var funcBody = "element.ColumnRow_" + column.expr.typeName + "({columnsPanel: self}); " +
                           "element.ColumnRow_" + column.expr.typeName + "('init', column);"

            var addWidget = new Function("self, element, column", funcBody);

            addWidget(self, newColBlock, column);
        },

        _refreshByQuery: function (hide) {
            var self = this;

            if (!this.getQuery()) { return; }

            //Columns block
            var columnsBlock = $('<div></div>'),
                contentBlock = $('<div></div>');

            var cssClassPrefix = this._getCssPrefix();

            columnsBlock.addClass(cssClassPrefix + '-columns');
            columnsBlock.appendTo(contentBlock);
            contentBlock.appendTo(self.element);
            if (hide) {
                columnsBlock.hide();
            }

            var columns = self.getColumns();

            var colLength = columns.length;
            for (var colIdx = 0; colIdx < colLength; colIdx++) {
                self._addColumnElement(columnsBlock, columns[colIdx]);
            }

            var oldIdx, newIdx, newIdxDrop,
                justDropped = false,
                toReturn = false,
                draggableAttr = null,
                overSortable = false,
                overDroppable = false;
            var model = self.getModel();

            if (self.options.allowDragDrop) {
                columnsBlock.sortable({
                    containment: contentBlock,
                    tolerance: 'pointer', 
                    axis: 'y',
                    //cancel: '.' + cssClassPrefix + '-column-buttonsBlock, .' + cssClassPrefix + '-colelement, .' + cssClassPrefix + '-sortbutton',
                    placeholder: "ui-state-highlight eqjs-highlight",
                    scrollSpeed: 3,
                    delay: 100,
                    distance: 13,
                    cursorAt: { top: 10 },
                    forceHelperSize: true,
                    handle: 'div, a',
                    start: function (event, ui) {
                        oldIdx = ui.item.index();
                        ui.item.addClass(cssClassPrefix + "-column-sort");
                        overSortable = true;
                    },
                    update: function (event, ui) {
                        overSortable = false;

                        if (!justDropped && !ui.item.hasClass(cssClassPrefix + "-row")) {
                            ui.item.remove();
                            return; //not a column - so do nothing
                        }

                        //var attrid = ui.item.attr("data-id");
                        //if (attrid) {
                        //    var attr = model.getAttributeById(attrid);
                        //    if (attr.uir != true) {
                        //        ui.item.remove();
                        //        return;
                        //    }
                        //}

                        newIdx = ui.item.index();

                        toReturn = false;
                        if (justDropped) {
                            self.addNewColumn(draggableAttr, newIdx);
                            ui.item.remove();
                            justDropped = false;
                        }
                        else if (oldIdx != newIdx) {
                            self.getQuery().moveColumn(oldIdx, newIdx, self);
                        };
                    },
                    over: function (event, ui) {
                        overSortable = true;
                    },
                    out: function (event, ui) {
                        overSortable = false;
                    },
                    stop: function (event, ui) {
                        overSortable = false;
                        ui.item.removeClass(cssClassPrefix + '-column-sort');
                        return true;
                    }
                });

                self.element.droppable({
                    hoverClass: "eqjs-drophover",
                    scope: "entityAttr",

                    drop: function (event, ui) {
                        overDroppable = false;
                        var attrId = ui.draggable.attr('data-id');

                        if (!model.checkAttrProperty(attrId, "uir")) {
                            return;
                        }

                        if (!overSortable) { //!columns || columns.length === 0 || 
                            self.addNewColumn(attrId);
                            self.refresh();
                        }
                        else {
                            justDropped = true;
                        }
                    },
                    over: function (event, ui) {
                        overDroppable = true;

                        ui.helper.addClass(cssClassPrefix + '-column-drag');
                        var attrId = ui.draggable.attr('data-id');
                        if (!model.checkAttrProperty(attrId, "uir")) {
                            ui.helper.addClass(cssClassPrefix + '-column-drag-forbidden');
                        }
                    },
                    out: function (event, ui) {
                        overDroppable = false;

                        ui.helper.removeClass(cssClassPrefix + '-column-drag');
                        ui.helper.removeClass(cssClassPrefix + '-column-drag-forbidden');
                    },
                    activate: function (event, ui) {
                        draggableAttr = ui.draggable.attr('data-id');
                    }
                });
            }
            //(!columnsBlock.children().length) ? contentBlock.hide() : contentBlock.show();

            return columnsBlock;
        },


        /// <method name="clearColumns">
        /// <summary>Clears the list of columns in associated query and redraws a panel, if needed.</summary>
        /// <notes>
        /// This method is deprecated. Use Query.clearColumns() instead. 
        /// </notes>
        /// </method>
        clearColumns: function (needRefresh) {
            var query = this.getQuery();
            if (!query) return;
            query.clearColumns();

            if (needRefresh !== false)
                this.refresh();
        },

        _createEntitiesMenu: function () {
            var model = this.getModel();
            if (!model || model.isEmpty()) return null;

            var self = this;
            var menuDiv = $('<div></div>')
                .hide()
                .appendTo(this.element);

            var menuId = self.element.attr('id');
            if (menuId) {
                menuId += '-EntitiesMenu';
            }
            var options = { "items": this.options.entitiesList, adjustHeight: self.options.adjustEntitiesMenuHeight, id: menuId, domWriteItemsId: self.options.domWriteItemsId }
            $.extend(options, self.options.menuOptions);
            menuDiv.PopupMenu(options);

            return menuDiv;
        },

        showEntitiesMenu: function (menuOptions, eventArgs) {
            var self = this;

            self.options.entitiesMenu.PopupMenu("showMenu", menuOptions);
        },

        _createSortMenu: function () {
            var model = this.getModel();
            if (!model || model.isEmpty()) return null;

            var menuDiv = $('<div></div>')
                .hide()
                .appendTo(this.element);

            var self = this;
            var menuId = self.element.attr('id');
            if (menuId) {
                menuId += '-SortMenu';
            }
            menuDiv.PopupMenu({ "items": this.options.sortMenuList, id: menuId, domWriteItemsId: this.options.domWriteItemsId });

            return menuDiv;
        },

        //_fireQueryChange: function (changeType) {
        //    var self = this;
        //    this.getQuery().fireChangedEvent({
        //        "source": self,
        //        "changeType": "query." + changeType
        //    });
        //},

        _fireColumnChange: function (changeType, column) {
            var self = this;

            column = column || self._column;

            this.getQuery().fireChangedEvent({
                "source": self,
                "changeType": "column." + changeType,
                "column": column
            }, true);
        },

        _getDefaultColumnCaption: function (attr) {
            var format = this.options.titleElementFormat || this.options.attrElementFormat;
            var model = this.getModel();
            return model.getAttributeText(attr, format);
        },

        /// <method name="addNewColumn">
        /// <summary>Adds a new column to the query and updates the columns panel</summary>
        /// <param name="attrid" type="String (or Array of Strings)">
        /// <summary>The ID (or the array of IDs) of the attribute the new column is based on.</summary>
        /// </param>
        /// <param name="index" type="Integer">
        /// <summary>The position in the columns list the new column(s) should be inserted to. If undefined, the column is added to the end of the list.</summary>
        /// </param>
        /// <returns type="PlainObject">
        /// The added column object
        /// </returns>
        /// </method>
        addNewColumn: function (attrid, index) {
            var self = this;
            var model = this.getModel();

            var getColumnByAttrId = function (attrid) {
                var attribute = model.getAttributeById(attrid);

                if (!attribute) { return null; }
                if (!attribute.uir) {
                    if (attribute.lookupAttr) {
                        attrid = attribute.lookupAttr;
                        attribute = model.getAttributeById(attrid);
                        if (!attribute || !attribute.uir) {
                            return null;
                        }
                    }
                    else
                        return null;
                }

                return {
                    caption: self._getDefaultColumnCaption(attribute),
                    sorting: 'None',
                    sortIndex: -1,
                    expr: {
                        'typeName': 'ENTATTR',
                        'id': attrid
                    },
                    params: $.extend([], attribute.params)
                };
            };

            if (!this.getQuery()) { return; }

            var colToAdd, col;

            if ($.isArray(attrid)) {
                colToAdd = [];
                var attrLength = attrid.length;
                for (var i = 0; i < attrLength; i++) {
                    col = getColumnByAttrId(attrid[i]);
                    if (col) {
                        colToAdd.push(col);
                    }
                }
            }
            else
                colToAdd = getColumnByAttrId(attrid);

            self.addColumn(colToAdd, index);

            return colToAdd;
        },

        _checkColumn: function (col) {
            if (!this.options.allowDuplicates) {
                var query = this.getQuery();
                var columns = query.getColumns();
                
                var clen = columns.length;
                var colJson = JSON.stringify(col.expr);
                for (var i = 0; i < clen; i++) {
                    var qcolJson = JSON.stringify(columns[i].expr);
                    if (qcolJson === colJson) {
                        return null;
                    }
                }
            }
            return col;
        },

        _checkColumnsArray: function(cols) {
            var i = 0, len = cols.length;
            var result = [];
            for (; i < len; i++) {
                if (this._checkColumn(cols[i]))
                    result.push(cols[i]);
            }
            return result;
        },

        /// <method name="addColumn">
        /// <summary>Adds a new column to the query and updates the columns panel</summary>
        /// <param name="column" type="PlainObject (or Array of PlainObject)">
        /// <summary>The column object (or the array of such objects) to be added.</summary>
        /// </param>
        /// <param name="index" type="Integer">
        /// <summary>The position in the columns list the new column(s) should be inserted to. If undefined, the column is added to the end of the list.</summary>
        /// </param>
        /// </method>
        addColumn: function (column, index) {
            var self = this;

            var query = this.getQuery();
            if (!query) { return; }

            if ($.isArray(column))
                column = this._checkColumnsArray(column)
            else
                column = this._checkColumn(column);

            if (!column || ($.isArray(column) && column.length == 0)) { return; }

            query.addColumn(column, index, self);

            var columnsBlock = self.element.find('[class*=' + self._getCssPrefix() + '-columns]');
            if (columnsBlock.length > 0) {
                if (column.length) {
                    var i;
                    for (i = 0; i < column.length; ++i) {
                        self._addColumnElement(columnsBlock, column[i], index + i);
                    }
                }
                else {
                    self._addColumnElement(columnsBlock, column, index);
                }

                this._updateHeaderBlock();
            }
            else {
                self.refresh();
            }
            //self._fireColumnChange("add", column);
        },

        trySetBlockId: function (col) {
            var blockId = this.getNewColId();
            if (blockId) {
                col.blockId = blockId;
            }
        },

        /// <method name="removeColumn">
        /// <summary>Remove the column object from the list of columns and updates the columns panel</summary>
        /// <param name="column" type="PlainObject">
        /// <summary>The column object to be removed.</summary>
        /// </param>
        /// </method>
        removeColumn: function (column) {
            var self = this;

            var query = this.getQuery();
            if (!query || !column) {
                return;
            }


            if (column.length) {
                var i;
                for (i = 0; i < column.length; ++i) {
                    self._removeColumnElement(column[i]);
                }
                query.removeColumns(column, this);
            }
            else {
                self._removeColumnElement(column);
                query.removeColumn(column, this);
            }

        },

        _removeColumnElement: function (column) {
            var cssClassPrefix = this._getCssPrefix();
            var query = this.getQuery();
            var columns = query.getColumns();
            var index = $.inArray(column, columns);

            if (index >= 0) {

                var colElement = this.element.find('[class*=' + cssClassPrefix + '-row]')
                    .filter(function (index) {
                        return (this.column == column);
                    });

                if (colElement) {
                    colElement.detach();
                    colElement.remove();
                }
            }
        },

        /// <method name="removeColumnByAttrId">
        /// <summary>Remove the column object from the list of columns and updates the columns panel</summary>
        /// <param name="attrId" type="String">
        /// <summary>The ID of the attribute. The first found column with such an attribute ID will be removed.</summary>
        /// </param>
        /// </method>
        removeColumnByAttrId: function (attrId) {
            var self = this;


            var isColumn;

            if ( $.isArray(attrId)) {
                isColumn = function (id) {
                    var arrLen = attrId.length;
                    for (var i = 0; i < arrLen; i++) {
                        if (attrId[i] == id) {
                            return true;
                        }
                    }
                    return false;
                }
            }
            else {
                isColumn = function (id) {
                    return attrId == id;
                }
            }

            var query = this.getQuery();
            if (!query) { return; }

            var colsToRemove = [];
            var index = 0;
            var columns = query.getColumns();
            var colCount = columns.length;
            while (index < colCount) {
                var col = columns[index];
                if (col.expr.typeName == "ENTATTR" && isColumn(col.expr.id)) {
                    colsToRemove.push(columns[index]);
                }
                index++;
            }

            self.removeColumn(colsToRemove);
        },

        _moveColumn: function (index1, index2) {
            var self = this;
            var query = this.getQuery();
            if (!query) return;

            var columnsBlock = self.element.find('[class*=' + self._getCssPrefix() + '-columns]');
            var rows = columnsBlock.find('[class*=' + self._getCssPrefix() + '-row]')
            var colToMove = $(rows[index1]);

            if (index2 == 0) {
                colToMove.prependTo(columnsBlock);
            }
            else if (index2 > 0 && index2 < rows.length - 1) {
                if (index1 < index2) {
                    colToMove.insertAfter(rows[index2]);
                }
                else {
                    colToMove.insertAfter(rows[index2 - 1]);
                }
            }
            else {
                colToMove.appendTo(columnsBlock);
            }

            query.moveColumn(index1, index2, self);
        },

        /// <method name="moveColumn">
        /// <summary>Moves the column object from its current position to specified direction</summary>
        /// <param name="column" type="PlainObject">
        /// <summary>The column object to be moved.</summary>
        /// </param>
        /// <param name="direction" type="String">
        /// <summary>One of the following: 'MoveTop', 'MoveUp', 'MoveDown', 'MoveBottom'</summary>
        /// </param>
        /// </method>
        moveColumn: function (column, direction) {
            var self = this;
            var query = this.getQuery();
            var columns = query.getColumns();
            var index = $.inArray(column, columns);

            if (index >= 0) {
                switch (direction) {
                    case 'MoveTop':
                        if (index == 0) {
                            return;
                        }
                        self._moveColumn(index, 0);    
                        break;
                    case 'MoveUp':
                        if (index == 0) {
                            return;
                        }
                        self._moveColumn(index, index-1);    
                        break;
                    case 'MoveDown':
                        if (index == columns.length-1) {
                            return;
                        }
                        self._moveColumn(index, index+1);    
                        break;
                    case 'MoveBottom':
                        if (index == columns.length-1) {
                            return;
                        }
                        self._moveColumn(index, columns.length-1);    
                        break;
                };
            }
        },

        /// <method name="refresh">
        /// <summary>Re-renders the panel</summary>
        /// </method>
        refresh: function () {
            this._render();
        },

        resize: function () {
            this._render();
        },

        /// <method name="setActiveColumnWidget">
        /// <summary>Activates the particular column in the panel</summary>
        /// <param name="columnWidget" type="Object">
        /// <summary>The ColumnRow_ENTATTR or ColumnRow_AGGRFUNC object to activate.</summary>
        /// </param>
        /// </method>
        setActiveColumnWidget: function (columnWidget) {
            if (this._activeColumnWidget) {
                this._activeColumnWidget.internalDeactivate();
                this.options.activeColumn = null;
            }

            this._activeColumnWidget = columnWidget;
            if (this._activeColumnWidget) {
                this._activeColumnWidget.internalActivate();
                this.options.activeColumn = this._activeColumnWidget.getColumn();
            }
        },

        getNewColId: function () {
            if (this.element.attr('id')) {
                return this.element.attr('id') + '-col-' + ++this._globalColCounter;
            }
        }

    });

    $.widget("eqjs.ColumnsPanel", $.eqjs.ColumnsContainer, {
        _getCssPrefix: function () {
            return "eqjs-qc";
        }
    });

    $.widget("eqjs.ColumnsBar", $.eqjs.ColumnsContainer, {
        _create: function () {
            this.options.allowDragDrop = false;
            this.options.showHeader = false;
        },

        _getCssPrefix: function () {
            return "eqjs-cb";
        },

        _allowCustomExpressions: false
    });

})(jQuery);﻿//----------------------------------
//  ColumnRow base widget
//----------------------------------
; (function ($, undefined) {

    $.widget("eqjs.ColumnRow", {
        _column: null,
        _baseExprBlock: null,
        _captionEditorBlock: null,
        _buttonsBlock: null,
        //        _enableButton: null,
        _columnTypeButton: null,
        _deleteButton: null,

        _keepShowingButtons: false,
        _isMouseOverBlock: false,

        _sortingButton: null,

        _panelCssPrefix: 'eqjs-qc',
        _classesToAdd: '',

        _active: false,

        options: {
            columnsPanel: null
        },

        getQuery: function () {
            return this.options.columnsPanel ? this.options.columnsPanel.getQuery() : null;
        },

        getModel: function () {
            var query = this.getQuery();
            return query ? query.getModel() : null;
        },

        getColumn: function () {
            return this._column;
        },

        isModelNullOrEmpty: function () {
            var model = this.getModel();
            return !model || model.isEmpty();
        },

        _initCssPrefixes: function () {

        },

        init: function (column) {
            var self = this;

            this._initCssPrefixes();

            self._column = column;
            self.element.get(0).column = column;

            self.refresh();
        },

        _render: function () {
            this._clear();
            if (!this.isModelNullOrEmpty() && this._column) {
                this._refreshByColumn();
                this._initButtons();

                if (this.options.columnsPanel.options.activeColumn == this._column) {
                    this.makeActive();
                }
            }
        },


        _fireColumnChange: function (changeType, column) {
            var self = this;

            column = column || self._column;
            var query = this.getQuery();
            query.fireChangedEvent({
                "source": self.options.columnsPanel,
                "changeType": "column." + changeType,
                "column": column
            }, true);
        },

        refresh: function () {
            this._render();
        },

        _setOption: function (key, value) {
            if (arguments.length == 2) {
                this.options[key] = value;
                if (key === "disabled") {
                    this._column.enabled = !value;
                }

                this._render();
                return this;
            }
            else {
                if (key === "disabled")
                    return this._column.enabled === false;
                else
                    return this.options[key];
            }
        },

        _clear: function () {
            this.element.unbind();
            this.element.html('');
            this.element.removeClass();
        },

        _refreshByColumn: function () {
        },

        remove: function () {
            var self = this;

            if (!self.options.columnsPanel) { return; }
            self.options.columnsPanel.removeColumn(self._column);
        },

        _getButtonsContainer: function () {
            return this.element;
        },

        _initButtons: function () {
            var self = this;

            var btnPlaceholder = $("<div></div>")
                .addClass('eqjs-button-placeholder')
                .addClass(this._panelCssPrefix + '-button-placeholder')
                .addClass(this._panelCssPrefix + '-colelement')
                .prependTo(self.element);

            self._sortingButton = $('<div></div>')
                .addClass('eqjs-column-sortbutton')
                .appendTo(btnPlaceholder);

            var container = self._getButtonsContainer();

            if (!container || self._column.readOnly) return;

            self._buttonsBlock = $("<div></div>")
                .addClass("eqjs-column-buttonsBlock")
                .appendTo(container);

            btnPlaceholder = $("<div></div>").addClass('eqjs-button-placeholder').appendTo(self._buttonsBlock);
            self._columnTypeButton = $("<div></div>")
                .addClass("eqjs-button")
                .addClass("eqjs-column-button")
                .addClass("eqjs-column-button-type")
                .attr('title', EQ.core.getText('ButtonToAggr'))
                .appendTo(btnPlaceholder);

            btnPlaceholder = $("<div></div>").addClass('eqjs-button-placeholder').appendTo(self._buttonsBlock);
            self._deleteButton = $("<div></div>")
                .addClass("eqjs-button")
                .addClass("eqjs-column-button")
                .addClass("eqjs-column-button-delete")
                .attr('title', EQ.core.getText('ButtonDelete'))
                .appendTo(btnPlaceholder)
                .click(function () {
                    self.remove();
                });




            self._sortingButton
                .attr('title', EQ.core.getText('ButtonSorting'))
                .click(function () {
                    self._keepShowingButtons = true;
                    self.options.columnsPanel.options.sortMenu.PopupMenu('showMenu', {
                        anchor: self._sortingButton,
                        selectedIds: null,
                        itemSelectedCallback: function (evt, data) {
                            if (data.menuItem.id == 'None' || data.menuItem.id == "Ascending" || data.menuItem.id == "Descending") {
                                self._column.sorting = data.menuItem.id;
                                self.refresh();
                                self._fireColumnChange("change");
                            }
                            else {
                                self.options.columnsPanel.moveColumn(self._column, data.menuItem.id);
                            }
                        },
                        menuClosedCallback: function () { //called when menu is closed
                            self._keepShowingButtons = false;
                            if (!self._isMouseOverBlock) {
                                self._sortingButton.trigger('mouseleave')
                            }
                        }
                    });
                });

            var sortButtonCssPrefix = 'eqjs-column-sortbutton';
            self._sortingButton.addClass("eqjs-button");

            if (self._column.sorting === 'None') {
                self._sortingButton.addClass(sortButtonCssPrefix + '-none')
            }

            self._sortingButton.hover(
                function () {
                    $(this).addClass(sortButtonCssPrefix + '-active');
                },
                function () {
                    $(this).removeClass(sortButtonCssPrefix + '-active');
                }
            );

            if (self._column.sorting === 'Ascending') {
                self._sortingButton
                    .addClass(sortButtonCssPrefix + '-asc')
                    .attr('title', EQ.core.getText('ButtonSorting'));
            }
            else if (self._column.sorting === 'Descending') {
                self._sortingButton
                    .addClass(sortButtonCssPrefix + '-desc')
                    .attr('title', EQ.core.getText('ButtonSorting'));
            }



            //            (self.options.disabled) ? self._enableButton.removeClass('enabled') : self._enableButton.addClass('enabled');

            var buttonCssPrefix = this._panelCssPrefix + '-button';
            container.find('[class*=' + buttonCssPrefix + ']').hover(
                function () {
                    $(this).addClass(buttonCssPrefix + '-active');
                },
                function () {
                    $(this).removeClass(buttonCssPrefix + '-active');
                }
            )

            container.bind('mouseenter', function (event) {
                self._isMouseOverBlock = true;
                self._enterButtonBlock();
                event.stopPropagation();
                return false;
            })
            .bind('mouseleave', function (event) {
                self._isMouseOverBlock = false;
                if (!self._keepShowingButtons) { //&& self._buttonsBlock.is(':visible')) {
                    self._leaveButtonBlock();
                }

                event.stopPropagation();
                return false;
            })

            self._setupButtonListeners();
            self._hideButtons();
            self._adjustButtonsVisibility();
        },

        _setupButtonListeners: function () {

        },

        _adjustButtonsVisibility: function () {
        },

        _enterButtonBlock: function () {
            this._showButtons();
        },

        _leaveButtonBlock: function () {
            if (this.options.columnsPanel.options.alwaysShowButtons != true && (!this._active || this.options.columnsPanel.options.accentActiveColumn != true)) {
                this._hideButtons();
            }
        },

        _showButtons: function () {
        },

        _hideButtons: function () {
            this._columnTypeButton.hide();
            //            this._columnTypeButton.css('background-image', 'none');
            this._deleteButton.hide();
            //            this._deleteButton.css('background-image', 'none');

            if (this._column.sorting === 'None') {
                this._sortingButton.hide();
                //                this._sortingButton.css('background-image', 'none');
            }

        },

        internalActivate: function () {
            this._active = true;
            this.adjustActiveClass();

            this._hideButtons();
            this._adjustButtonsVisibility();
        },

        internalDeactivate: function () {
            this._active = false;
            this.adjustActiveClass();

            this._hideButtons();
            this._adjustButtonsVisibility();
        },

        adjustActiveClass: function () {
            if (this._active && this.options.columnsPanel.options.accentActiveColumn) {
                this.element.addClass("active");
            }
            else {
                this.element.removeClass("active");
            }
        },

        getColumnsPanel: function () {
            return this.options.columnsPanel;
        },

        isActive: function () {
            return this._active;
        },

        makeActive: function () {
            var columnsPanel = this.getColumnsPanel();
            if (columnsPanel)
                columnsPanel.setActiveColumnWidget(this);
        }
        /*
                setActiveColumnWidget: function () {
                    this.options.columnsPanel.setActiveColumnWidget(this);
                }
        */
    })
})(jQuery);


//----------------------------------
//  ColumnRow_ENTATTR widget
//----------------------------------
; (function ($, undefined) {

    $.widget("eqjs.ColumnRow_ENTATTR", $.eqjs.ColumnRow, {
        _baseAttr: null,
        _menuFunctionsBlock: null,
        _paramsBlock: null,

        _initCssPrefixes: function () {
            this._panelCssPrefix = this.options.columnsPanel._getCssPrefix();
            this._classesToAdd = this._panelCssPrefix + '-row ' + this._panelCssPrefix + '-row-column-entattr';
        },

        _baseExprMenuClick: function (evt, data) {
            var self = this;

            var attrid = data.menuItem.data('id');
            var attrobj = self.getModel().getAttributeById(attrid);

            self._column.expr.id = attrid;
            self._column.caption = '';
            self.refresh();
            self._fireColumnChange("change");

            return false;
        },

        _getBaseExpr: function () {
            var self = this;

            var baseExpr = null;

            if (self._column.enabled !== false && !self._column.readOnly) {
                baseExpr = $('<a></a>')
                    .attr('href', "javascript:void(0)")
                    .text(self._getAttributeText(self._baseAttr))
                    .attr('title', self._getAttributeText(self._baseAttr))
                    .click(function (e) {
                        e.preventDefault();

                        self.options.columnsPanel.options.entitiesMenu.PopupMenu('showMenu', {
                            anchor: baseExpr,
                            selectedIds: null,
                            itemSelectedCallback: function (evt, data) {
                                return self._baseExprMenuClick(evt, data);
                            }
                        });
                    });
            }
            else
                baseExpr = $('<span></span>')
                    .text(self._getAttributeText(self._baseAttr))
                    .attr('title', self._getAttributeText(self._baseAttr));



            return baseExpr;
        },

        _fillBaseBlock: function (baseBlock) {
            var self = this;

            baseBlock.addClass(this._panelCssPrefix + '-expr-block')

            self._baseExprBlock = $('<div></div>')
                .addClass(this._panelCssPrefix + '-colelement')
                .addClass(this._panelCssPrefix + '-attrelement')
                .appendTo(baseBlock);

            //var baseAttrId = this._column.expr.id;

            var baseExpr = self._getBaseExpr();

            baseExpr.appendTo(self._baseExprBlock);

            if (self._column.params && self._column.params.length > 0) {  // there are some parameters 
                self._paramsBlock = $('<div></div>')
                .addClass(this._panelCssPrefix + '-params-block')
                .appendTo(baseBlock);

                self._fillParamsBlock(self._paramsBlock);
            };

            if (!self._column.readOnly) {
                self._createFunctionMenu();
            };
        },

        _fillParamsBlock: function (paramsBlock) {
            var self = this;

            $('<span>(</span>')
            .addClass("eqjs-qc-colelement")
            .addClass("eqjs-qp-valueelement")
            .appendTo(paramsBlock);

            self._column.params.forEach(function (item, idx, arr) {
                var paramElement = $('<div></div>');
                paramElement.appendTo(paramsBlock);

                self._createParamEditor(paramElement, item);

                if (idx < arr.length - 1) {
                    $('<span>,&nbsp</span>')
                    .addClass("eqjs-qc-colelement")
                    .addClass("eqjs-qp-valueelement")
                    .appendTo(paramsBlock);
                };
            });
            $('<span>)</span>')
            .addClass("eqjs-qc-colelement")
            .addClass("eqjs-qp-valueelement")
            .appendTo(paramsBlock);
        },

        _getParamEditor: function (param) {
            var self = this;

            var model = self.getModel();
            var attribute = self._getAttribute();

            var editor = {};

            if (param && param.editor && param.editor.type !== "Unknown") {
                editor = $.extend({}, param.editor);
            }
            else if (param && (param.dataType == "Date" || param.dataType == "DateTime" || param.dataType == "Time")) {
                editor.type = "DATETIME";
            }
            else {            //if (!editor.type || editor.type == 'Unknown') {
                editor.type = 'EDIT';
            }

            return editor;
        },

        _createParamEditor: function (element, param) {
            //$('<a href=#></a>').text(param.caption).appendTo(element);

            var self = this;
            var editor = self._getParamEditor(param);

            param.kind = "Scalar";
            //param.text = 

            if (editor) {
                var funcBody = "element.ValueEditor_" + editor.type + "({parentWidget:self, editor: editorObj, onChange:paramChangedCallback, emptyText: emptyTxt}); " +
                               "element.ValueEditor_" + editor.type + "('init', expr);";
                var addWidget = new Function("self, element, expr, editorObj, paramChangedCallback, emptyTxt", funcBody);

                var paramChangedCallback = function () {
                    self._fireColumnChange("change", self._column);
                };

                addWidget(this, element, param, editor, paramChangedCallback, "<"+param.caption+">");
            }

        },


        _refreshByColumn: function () {
            if (!this._column || this.isModelNullOrEmpty()) return;

            var self = this;

            self._baseAttr = self._getAttribute();

            self.element.addClass(self._classesToAdd);

            if (self._column.readOnly)
                this.element.addClass('eqjs-qp-readonly');

            var baseBlock = $('<div></div>')
                .appendTo(self.element);

            self._fillBaseBlock(baseBlock);

            if (self.options.columnsPanel.options.accentActiveColumn) {
                self.element.click(function () {
                    if (!self._active) {
                        self.makeActive();
                    }
                })
            }

            if (self.options.columnsPanel.options.showColumnCaptions) {

                if (!self._column.caption || self._column.caption == '') {
                    self._column.caption = self._getDefaultCaption();
                }

                if (!self._column.readOnly) {
                    this._captionEditorBlock = $('<div></div>');
                    this._captionEditorBlock.appendTo(this.element);

                    var captionChanged = function () {
                        self._column.captionChanged = true;
                        self._fireColumnChange("change");
                    }

                    this._captionEditorBlock.ColumnRow_CaptionEditor({ parentWidget: self, cssClassPrefix: this._panelCssPrefix });
                    this._captionEditorBlock.ColumnRow_CaptionEditor('init', self._column, self._column.caption, captionChanged); //self._getDefaultCaption()
                }
                else {
                    var captionElement = $('<span></span>')
                        .addClass(this._panelCssPrefix + '-colelement')
                        .addClass(this._panelCssPrefix + '-captionelement')
                        .text(self._column.caption) //self._getDefaultCaption())
                        .attr('title', self._column.caption)
                        .appendTo(this.element);
                }
            }

            self.adjustActiveClass();
        },

        _getDefaultTitleText: function (attr) {
            var columnsPanel = this.options.columnsPanel;
            var format = columnsPanel.options.titleElementFormat || columnsPanel.options.attrElementFormat;
            var model = this.getModel();
            return model.getAttributeText(attr, format);
        },

        _getDefaultCaption: function () {
            return this._getDefaultTitleText(this._baseAttr);
        },

        _getAttribute: function () {
            return this.getModel().getAttributeById(this._column.expr.id)
        },

        _getAttributeText: function (attr) {
            var self = this;

            if (!attr) return '';

            var model = this.getModel();

            var format = self.options.columnsPanel.options.attrElementFormat;
            return model.getAttributeText(attr, format);

        },

        _adjustButtonsVisibility: function () {
            var self = this;

            self._columnTypeButton
                .removeClass('aggregated')
                .attr('title', EQ.core.getText('ButtonToAggr'));

            if (this.options.columnsPanel.options.alwaysShowButtons || (this.options.columnsPanel.options.accentActiveColumn && this._active)) {
                this._showButtons();
            }

        },

        _changeTypeToAggr: function (funcId) {
            var self = this;

            if (!funcId)
                funcId = self._menuFunctionsBlock.PopupMenu('option', 'items')[0].id;

            var id = self._column.expr.id;
            self._column.caption = '';

            self._column.expr = {
                'func': funcId,
                'distinct': false,
                'typeName': 'AGGRFUNC',
                'argument': {
                    'typeName': 'ENTATTR',
                    'id': id
                }
            }

            var column = self._column;
            var isActive = self._active;
            self.destroy();

            self._clear();
            self.element.ColumnRow_AGGRFUNC({ columnsPanel: self.options.columnsPanel });
            self.element.ColumnRow_AGGRFUNC('init', column);
            self._fireColumnChange("change");

            if (isActive) {
                self.options.columnsPanel._activeColumn = null;
                self.element.ColumnRow_AGGRFUNC('makeActive');
            }
        },

        _changeTypeToCustomSql: function () {
            var self = this;

            var id = self._column.expr.id;
            self._column.caption = '';

            var sqlText = '';
            var model = self.getModel();
            if (model) {
                sqlText = model.getAttributeById(id).sqlExpr;
            }

            self._column.expr = {
                'sql': sqlText,
                'baseAttrId': id,
                'typeName': 'CUSTOMSQL'
            }

            var column = self._column;
            var isActive = self._active;
            self.destroy();

            self._clear();
            self.element.ColumnRow_CUSTOMSQL({ columnsPanel: self.options.columnsPanel });
            self.element.ColumnRow_CUSTOMSQL('init', column);
            self._fireColumnChange("change");

            if (isActive) {
                self.options.columnsPanel._activeColumn = null;
                self.element.ColumnRow_CUSTOMSQL('makeActive');
            };
            self.element.ColumnRow_CUSTOMSQL('showSqlEditor');
        },

        _createFunctionMenu: function () {
            var self = this;

            var items = [];
            var funcs = self.getModel().getAggrFunctions();
            var toInclude = true;
            var funcAllowed = true;

            var item = null;

            var attribute = self._getAttribute();
            var funcCaption;

            var funcsLen = funcs.length;
            for (var idx = 0; idx < funcsLen; idx++) {
                if (!funcs[idx]) continue;

                toInclude = true;

                if (funcs[idx].id === 'SUM' || funcs[idx].id === 'AVG') {
                    toInclude = $.inArray(attribute.dataType, ["Autoinc", "Byte", "Currency", "Float", "Int", "Int64", "Word"]) >= 0;
                }
                else if (funcs[idx].id === 'MIN' || funcs[idx].id === 'MAX') {
                    toInclude = $.inArray(attribute.dataType, ["Autoinc", "BCD", "Byte", "Currency", "Date", "DateTime", "Float", "Int", "Int64", "Time", "Word"]) >= 0;
                }

                if (self._column.expr.func === funcs[idx].id && !toInclude) {
                    funcAllowed = false;
                }

                if (toInclude) {
                    funcCaption = self.getModel().getAggrFunctionCaption(funcs[idx].id);
                    item = {
                        id: funcs[idx].id,
                        text: funcCaption
                    };

                    items.push(item);
                }
            }

            if (!funcAllowed) {
                self._column.expr.func = items[0].id;
            }


            //Add "Custom Expression" menu
            if (self.options.columnsPanel.options.allowCustomExpressions && self.options.columnsPanel._allowCustomExpressions) {
                item = {
                    id: 'CustomSqlDivider',
                    text: '---'
                };

                items.push(item);

                funcCaption = EQ.core.getText('CustomExpression');
                item = {
                    id: 'CUSTOMSQL',
                    text: funcCaption
                };

                items.push(item);
            }

            self._menuFunctionsBlock = $('<div></div>')
                .hide()
                .appendTo(self.element);

            var menuId = self.element.attr('id');
            if (menuId) {
                menuId += '-FunctionsMenu';
            }

            self._menuFunctionsBlock.PopupMenu({ items: items, id: menuId, domWriteItemsId: self.options.columnsPanel.options.domWriteItemsId });

            return self._menuFunctionsBlock;
        },

        _showButtons: function () {
            if (this.options.columnsPanel.options.allowAggrColumns != false) {
                this._columnTypeButton.show();
            }
            else {
                this._columnTypeButton.attr('title', '');
            }
            this._deleteButton.show();


            this._sortingButton.show();

        },

        _setupButtonListeners: function () {
            var self = this;
            if (self._columnTypeButton) {
                self._columnTypeButton.click(function (e) {
                    if (self.options.columnsPanel.options.allowAggrColumns !== false && self._column.enabled !== false) {
                        self._keepShowingButtons = true;
                        self._menuFunctionsBlock.PopupMenu('showMenu', {
                            anchor: self._columnTypeButton,
                            selectedIds: null,
                            itemSelectedCallback: function (evt, data) {
                                if (data.menuItem.id == "CUSTOMSQL") {
                                    self._changeTypeToCustomSql();
                                }
                                else {
                                    self._changeTypeToAggr(data.menuItem.id);
                                }

                                return false;
                            },
                            menuClosedCallback: function () { //called when menu is closed
                                self._keepShowingButtons = false;
                                if (!self._isMouseOverBlock) {
                                    self._columnTypeButton.trigger('mouseleave');
                                }
                            }
                        });
                    }
                });
            }
        }

    })
})(jQuery);


//----------------------------------
//  ColumnRow_AGGRFUNC widget
//----------------------------------
; (function ($, undefined) {

    $.widget("eqjs.ColumnRow_AGGRFUNC", $.eqjs.ColumnRow_ENTATTR, {


        _displayFormatParser: {

            formatStr: '',
            pos: 0,
            //exprNum: 0,
            token: 'text',
            tokenText: '',

            start: function (s) {
                this.formatStr = s;
                this.pos = 0;
                //this.exprNum = 0;
                this.tokenText = '';
            },

            skipSpaces: function () {
                while (this.pos < this.formatStr.length && this.formatStr.charAt(this.pos) === ' ') this.pos++;
            },

            next: function () {
                this.skipSpaces();
                if (this.pos >= this.formatStr.length) return false;

                var npos = 0;
                if (this.formatStr.charAt(this.pos) === '{') {
                    npos = this.formatStr.indexOf('}', this.pos);
                    if (npos < 0) return false;
                    this.tokenText = this.formatStr.substring(this.pos, npos + 1);
                    if (this.tokenText.indexOf('{attr') === 0) {
                        this.token = 'attribute';
                        //this.exprNum = parseInt(this.tokenText.substring(5, this.tokenText.length));
                    }
                    this.pos = npos + 1;
                }
                else if (this.formatStr.charAt(this.pos) === '[' && this.pos < this.formatStr.length - 1 && this.formatStr.charAt(this.pos + 1) === '[') {
                    this.pos += 2;
                    npos = this.formatStr.indexOf(']]', this.pos);
                    this.token = 'function';
                    this.tokenText = this.formatStr.substring(this.pos, npos);
                    this.pos = npos + 2;
                }
                else {
                    this.token = 'text';
                    var npos1 = this.formatStr.indexOf('{', this.pos);
                    if (npos1 < 0) npos1 = this.formatStr.length;
                    var npos2 = this.formatStr.indexOf('[[', this.pos);
                    if (npos2 < 0) npos2 = this.formatStr.length;
                    npos = Math.min(npos1, npos2);
                    this.tokenText = $.trim(this.formatStr.substring(this.pos, npos));
                    this.pos = npos;
                }
                return true;
            }

        },

        _initCssPrefixes: function () {
            this._panelCssPrefix = this.options.columnsPanel._getCssPrefix();
            this._classesToAdd = this._panelCssPrefix + '-row ' + this._panelCssPrefix + '-row-column-aggr';
        },

        _parseDisplayFormat: function (format) {
            if (!format) return [];

            var result = [];

            var parser = this._displayFormatParser;
            parser.start(format);

            while (parser.next()) {
                if (parser.token === 'function') {
                    result.push({ type: 'function', text: parser.tokenText });
                }
                else if (parser.token === 'attribute') {
                    result.push({ type: 'attribute' });
                }
                else if (parser.token === 'text') {
                    result.push({ type: 'text', text: parser.tokenText });
                }
            }

            return result;
        },

        _baseExprMenuClick: function (evt, data) {
            var self = this;

            var attrid = data.menuItem.data('id');
            var attrobj = self.getModel().getAttributeById(attrid);

            self._column.expr.argument.id = attrid;
            self._column.caption = '';
            self.refresh();
            self._fireColumnChange("change");

            return false;
        },

        _fillBaseBlock: function (baseBlock) {
            var self = this;

            baseBlock.addClass(this._panelCssPrefix + '-expr-block ' + this._panelCssPrefix + '-expr-block-aggr')

            var baseExpr, functionLink;

            var functionBlock = $('<div></div>')
                .addClass(this._panelCssPrefix + '-colelement')
                .addClass(this._panelCssPrefix + '-aggrfuncelement');

            if (self._column.enabled !== false && !self._column.readOnly) {
                functionLink = $('<a></a>', {
                    href: 'javascript:void(0)'
                }).appendTo(functionBlock);

                self._createFunctionMenu();
            }
            else
                functionLink = $('<span></span>').appendTo(functionBlock);


            //var aggrFunc = findItemById(EQ.core.AggrFunctions, self._column.expr.func);
            //if (!aggrFunc) return;

            var format = self.getModel().getAggrFunctionFormat(self._column.expr.func);
            if (!format || format === '') return;

            var arrFormat = self._parseDisplayFormat(format);
            if (arrFormat.length === 0) return;

            var item = null;
            var arrLength = arrFormat.length;
            for (var idx = 0; idx < arrLength; idx++) {
                item = arrFormat[idx];

                if (item.type === 'function') {
                    functionLink.text(item.text);

                    functionBlock.appendTo(baseBlock);

                    if (self._column.enabled !== false) {
                        functionLink.click(function (e) {
                            self._menuFunctionsBlock.PopupMenu('showMenu', {
                                anchor: functionLink,
                                selectedIds: null,
                                itemSelectedCallback: function (evt, data) {
                                    self._column.expr.func = data.menuItem.id; //parent().
                                    self._column.caption = '';

                                    self.refresh();
                                    self._fireColumnChange("change");

                                    return false;
                                }
                            });
                        });
                    }
                }
                else if (item.type === 'attribute') {
                    //var baseAttrId = self._column.expr.argument.id;
                    self._baseAttr = self._getAttribute();


                    baseExpr = this._getBaseExpr();

                    self._baseExprBlock = $('<div></div>')
                        .addClass(this._panelCssPrefix + '-colelement')
                        .addClass(this._panelCssPrefix + '-attrelement')
                        .appendTo(baseBlock);

                    baseExpr.appendTo(self._baseExprBlock);
                }
                else if (item.type === 'text') {
                    var textBlock = $('<span></span>')
                    .addClass(this._panelCssPrefix + '-colelement')
                    .text(item.text)
                    .attr('title', item.text)
                    .appendTo(baseBlock);
                }
            }
        },

        _getDefaultCaption: function () {
            return this._getDefaultTitleText(this._baseAttr) + ' ' + this.getModel().getAggrFunctionCaption(this._column.expr.func);
        },

        _getAttribute: function () {
            return this.getModel().getAttributeById(this._column.expr.argument.id)
        },

        _setupButtonListeners: function () {
            var self = this;
            self._columnTypeButton.click(function () {
                if (self._column.enabled !== false) {
                    self._changeTypeToSimple();

                    return false;
                }
            });

        },

        _adjustButtonsVisibility: function () {
            var self = this;

            self._columnTypeButton
                .addClass('aggregated')
                .attr('title', EQ.core.getText('ButtonToSimple'));

            if (this.options.columnsPanel.options.alwaysShowButtons || (this.options.columnsPanel.options.accentActiveColumn && this._active)) {
                this._showButtons();
            }
        },

        _changeTypeToSimple: function () {
            var self = this;

            var id = self._column.expr.argument.id;
            self._column.caption = '';
            self._column.expr = {
                'typeName': 'ENTATTR',
                'id': id
            }

            var column = self._column;
            var isActive = self._active;
            self.destroy();

            self._clear();
            self.element.ColumnRow_ENTATTR({ columnsPanel: self.options.columnsPanel });
            self.element.ColumnRow_ENTATTR('init', column);
            self._fireColumnChange("change");

            if (isActive) {
                self.options.columnsPanel._activeColumn = null;
                self.element.ColumnRow_ENTATTR('makeActive');
            }
        }

    })

})(jQuery);


//----------------------------------
//  ColumnRow_CUSTOMSQL widget
//----------------------------------
; (function ($, undefined) {

    $.widget("eqjs.ColumnRow_CUSTOMSQL", $.eqjs.ColumnRow_ENTATTR, {

        _fillBaseBlock: function (baseBlock) {
            var self = this;

            baseBlock.addClass(this._panelCssPrefix + '-expr-block')

            self._baseExprBlock = $('<div></div>')
                .addClass(this._panelCssPrefix + '-colelement')
                .addClass(this._panelCssPrefix + '-attrelement')
                .appendTo(baseBlock);

            var sqlChanged = function () {
                self._fireColumnChange("change");
                self._changeCaption();
            }

            self._column.captionChanged = false;
            self._baseExprBlock.ColumnRow_CustomSqlExprEditor({ parentWidget: self, cssClassPrefix: this._panelCssPrefix });
            self._baseExprBlock.ColumnRow_CustomSqlExprEditor('init', self._column, self._getExprText(), sqlChanged);
        },

        showSqlEditor: function() {
            this._baseExprBlock.ColumnRow_CustomSqlExprEditor('showEditor');
        },

        _changeCaption: function() {
            if (!this._column.captionChanged) {
                this._column.caption = this._getExprText();
                this._captionEditorBlock.ColumnRow_CaptionEditor('updateLink');
            }
        },

        _getExprText: function () {
            var text = this._column.expr.sql;

            var model = this.getModel();
            if (model) {
                var attr = model.getAttributeById(this._column.expr.baseAttrId);
                text = text.replace(new RegExp(attr.sqlExpr, 'g'), this._getAttributeText(attr));
            }

            return text;
        },

        _getDefaultCaption: function () {
            return this._getExprText();
        },

        _adjustButtonsVisibility: function () {
            var self = this;

            self._columnTypeButton
                .addClass('aggregated')
                .attr('title', EQ.core.getText('ButtonToSimple'));

            if (this.options.columnsPanel.options.alwaysShowButtons || (this.options.columnsPanel.options.accentActiveColumn && this._active)) {
                this._showButtons();
            }
        },

        _setupButtonListeners: function () {
            var self = this;
            self._columnTypeButton.click(function () {
                if (self._column.enabled !== false) {
                    self._changeTypeToSimple();

                    return false;
                }
            });

        },

        _changeTypeToSimple: function () {
            var self = this;

            var id = self._column.expr.baseAttrId;
            self._column.caption = '';
            self._column.expr = {
                'typeName': 'ENTATTR',
                'id': id
            }

            var column = self._column;
            var isActive = self._active;
            self.destroy();

            self._clear();
            self.element.ColumnRow_ENTATTR({ columnsPanel: self.options.columnsPanel });
            self.element.ColumnRow_ENTATTR('init', column);
            self._fireColumnChange("change");

            if (isActive) {
                self.options.columnsPanel._activeColumn = null;
                self.element.ColumnRow_ENTATTR('makeActive');
            }
        }

    })

})(jQuery);


//----------------------------------
//  ColumnRow_CaptionEditor widget
//----------------------------------

;(function ($, undefined) {

    $.widget("eqjs.ColumnRow_CaptionEditor", $.eqjs.ValueEditor_EDIT, {
        _column: null,
        _defaultValue: '',
        _editBoxClass: 'eqjs-qc-ce-editbox',
        _onChange: null,

        options: {
            cssClassPrefix: 'eqjs-qc'
        },

        init: function (column, defaultValue, changeCallback) {
            this._editBoxClass = this.options.cssClassPrefix + '-ce-editbox';
            this._expr.value = column.caption;
            this._expr.text = column.caption;
            this._column = column;
            this._defaultValue = defaultValue;
            this._onChange = changeCallback;
            this.refresh();
        },

        _render: function () {
            this.clear();
            if (this._column) {
                this._renderCommonPart();
                this._renderEditor();
                this._linkElement.text(this._getDisplayText());
                this._linkElement.attr('title', this._getDisplayText());
            }
        },

        _renderCommonPart: function () {
            var self = this;

            self.element.addClass(self._getClassesToAdd());

            self._linkElement = $('<a></a>', {
                href: 'javascript:void(0)',
                text: '-'
            }).appendTo(self.element);

            self._linkElement.click(function () {
                self._showEditor();
                return false;
            });
        },

        _getClassesToAdd: function () {
            return this.options.cssClassPrefix + '-colelement ' + this.options.cssClassPrefix + '-captionelement';
        },

        _setValue: function (newValue) {
            if (!newValue || newValue == '')
                this._column.caption = this._defaultValue;
            else
                this._column.caption = newValue;

            this.updateLink();

            if (this._onChange) {
                this._onChange(newValue);
            }

        },

        updateLink: function() {
            this._linkElement.text(this._column.caption);
            this._linkElement.attr('title', this._column.caption)
        },

        _getValue: function () {
            return this._column.caption;
        },

        _getText: function () {
            return this._column.caption;
        },

        _getDisplayText: function () {
            return this._column.caption;
        },

        _getZIndex: function () {
            return 100000;
        }
    })
})(jQuery);


//----------------------------------
//  ColumnRow_CustomSqlExprEditor widget
//----------------------------------
;(function ($, undefined) {

    $.widget("eqjs.ColumnRow_CustomSqlExprEditor", $.eqjs.ValueEditor_EDIT, {
        _column: null,
        _defaultValue: '',
        _editBoxClass: 'eqjs-qc-ce-editbox',
        _onChange: null,

        options: {
            cssClassPrefix: 'eqjs-qc'
        },

        init: function (column, defaultValue, changeCallback) {
            this._editBoxClass = this.options.cssClassPrefix + '-ce-editbox';
            this._expr.value = column.expr.sql;
            this._expr.text = column.expr.sql;
            this._column = column;
            this._defaultValue = defaultValue;
            this._onChange = changeCallback;
            this.refresh();
        },

        _render: function () {
            this.clear();
            if (this._column) {
                this._renderCommonPart();
                this._renderEditor();
                this._linkElement.text(this._getDisplayText());
                this._linkElement.attr('title', this._getDisplayText());
            }
        },

        _renderCommonPart: function () {
            var self = this;

            self.element.addClass(self._getClassesToAdd());

            self._linkElement = $('<a></a>', {
                href: 'javascript:void(0)',
                text: '-'
            }).appendTo(self.element);

            self._linkElement.click(function () {
                self._showEditor();
                return false;
            });
        },

        _getClassesToAdd: function () {
            return this.options.cssClassPrefix + '-colelement ' + this.options.cssClassPrefix + '-attrelement';
        },

        _setValue: function (newValue) {
            if (!newValue || newValue == '')
                this._column.expr.sql = this._defaultValue;
            else
                this._column.expr.sql = newValue;

            this._linkElement.text(this._column.expr.sql);
            this._linkElement.attr('title', this._column.expr.sql)

            if (this._onChange) {
                this._onChange(newValue);
            }

        },

        _getValue: function () {
            return this._column.expr.sql;
        },

        _getText: function () {
            return this._column.expr.sql;
        },

        _getDisplayText: function () {
            if (this._column.expr.sql != '') {
                return this._column.expr.sql;
            }
            else {
                return EQ.core.getText('MsgEmptyCustomSql');
            }
        },

        _getZIndex: function () {
            return 100000;
        }
    })
})(jQuery);
﻿/// <widget name="EntitiesPanel" version="1.0.0">
/// <summary>
/// This widget represents "entities panel" - a rectangular area of your web-page which contains the tree of entities/attributes found in your model
/// and provides the way to add a column(s) to the columns panel and to add a condition(s) to query panel. This also includes drag-and-drop support.
/// </summary>
/// <example>
/// <code>
/// var EPDiv = $('#EntitiesPanel');
/// if (EPDiv.length &gt; 0) {
///    EPDiv.EntitiesPanel({
///      showAddColumnButton: false,
///      showAttributes: { usedInConditions: true, usedInColumns: false, usedInSorting: false }
///    });
/// }
/// </code>
/// </example>
/// <notes>
/// Usually this widget is initilized implicitly, through <see cref="F:EQ.client.init" /> function call 
/// </notes>
/// </widget>
; (function ($, undefined) {

    $.widget("eqjs.EntitiesPanel", {
        _rootEntityBlock: null,
        _entityTreeBlock: null,
        _query: null,

        _progressBlock: null,

        options: {
            /// <option name="queryPanelId" type="String" default="QueryPanel">
            /// <summary>Gets or sets an ID of the query panel on the same page that will be used to add conditions to</summary>
            /// </option>
            queryPanelId: "QueryPanel",
            
            /// <option name="columnsPanelId" type="String" default="ColumnsPanel">
            /// <summary>Gets or sets an ID of the columns panel on the same page that will be used to add columns to</summary>
            /// </option>
            columnsPanelId: "ColumnsPanel",

            /// <option name="showToolbar" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether entities panel should show a toolbar with buttons at the bottom</summary>
            /// </option>
            showToolbar: true,


            /// <option type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether entities panel should show the "Select all" button on the toolbar</summary>
            /// </option>
            showSelectAllButton : false,

            /// <option type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether entities panel should show the "Select none" button on the toolbar</summary>
            /// </option>
            showClearSelectionButton: true,

            /// <option name="showAddColumnButton" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether entities panel should show the "Add column" button on the toolbar</summary>
            /// </option>
            showAddColumnButton: true,

            /// <option name="showAddConditionButton" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether entities panel should show the "Add condition" button on the toolbar</summary>
            /// </option>
            showAddConditionButton: true,

            /// <option name="showCheckboxes" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether tree nodes in entities panel should contain checkboxes that allow to select/deselect the nodes</summary>
            /// </option>
            showCheckboxes: true,

            /// <option name="showTooltips" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether description property of the attribute/entity should be displayed as tooltip on hover</summary>
            /// </option>
            showTooltips: true,

            /// <option name="clickableAttributes" type="Integer" default="0">
            /// <summary>
            /// Gets or sets a value defining what should happen when user clicks on the attribute node. Values:
            ///   0 - nothing happen. Default behaviour.
            ///   1 - attibute is added to conditions.
            ///   2 - attribute is added to columns.
            /// "draggableAttributes" option should be set to "false" in order to get values 1 and 2 worked.
            /// </summary>
            /// </option>
            clickableAttributes: 0, 
            
            /// <option name="draggableAttributes" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether attributes may be dragged to be droppen at query panel or columns panel</summary>
            /// </option>
            draggableAttributes: true,
            
            /// <option name="showAttributes" type="PlainObject" default="{ usedInConditions: true, usedInColumns: true, usedInSorting: false }">
            /// <summary>Gets or sets a value defining which attributes from the model should be shown in the tree. Each attribute in the model has "Use in conditions", "Use in columns", "Use in sorting" properties. This option allows to filter all the attributes by these properties values.</summary>
            /// </option>
            showAttributes: { usedInConditions: true, usedInColumns: true, usedInSorting: false },

            /// <option name="showFilterBox" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether filtef box should be show to allow filtering of visible entities/attributes</summary>
            /// </option>
            showFilterBox: false,

            /// <option name="showIndicatorOnLoad" type="Boolean" default="true">
            /// <summary>Gets or sets a value indicating whether a progress indicator should appear while th emodel is loading</summary>
            /// </option>
            showIndicatorOnLoad: true,

            /// <option name="attrPlacement" type="Integer" default="0">
            /// <summary>
            /// Defines where to display attributes in the tree:
            /// 0 - attributes are displayed after entities
            /// 1 - attributes are displayed before entities
            /// 2 - attributes and entities are mixed, and displayed in alphabetical order. In this case the "sortEntities" option value dosn't matter.
            /// </summary>
            /// </option>
            attrPlacement: 0,

            /// <option name="sortEntities" type="Integer" default="false">
            /// <summary>
            /// Defines whether entities and attributes should be sorted alphabetically. If false, they are displayed as listed in the model.
            /// </summary>
            /// </option>
            sortEntities: false,

            /// <option name="autoClearSelection" type="Integer" default="false">
            /// <summary>
            /// Defines whether all selections will be cleared automatically after "add columns" or "add conditions" operation.
            /// </summary>
            /// </option>
            autoClearSelection: true,

            syncWithColumns : false

        },

        getSelf: function () {
            return this;
        },

        
        getModel: function() {
            var query = this.getQuery();
            return query ? query.getModel() : null;
        },

        getQuery: function() {
            return this._query;
        },

        setQuery: function(query) {
            this._setQueryObserver(true); //removing old query observer
            this._query = query;
            this._setQueryObserver();
            this.refresh();
        },

        _setQueryObserver: function (remove) {
            var self = this;
            var query = this.getQuery();

            var queryObserver = function (params) {
                if (self.options.syncWithColumns) {
                    //if something has changed, and that is related to columns
                    if (params && params.source !== self &&
                            params.changeType && params.changeType.indexOf("condition") < 0) {

                        var attrNode,
                            query = self.getQuery(),
                            columns = query.getColumns(),
                            colLen = columns.length,
                            i = 0, col, attrInput, entNode, entChildren, entInput;

                        self._deselectAll();

                        for (; i < colLen; i++) {
                            col = columns[i];
                            if (col.expr.typeName == "ENTATTR") {
                                attrNode = self._rootEntityBlock.find('.eqjs-ep-entity-attr[data-id="' + col.expr.id + '"]');
                                attrInput = attrNode.find("input");
                                attrInput.prop("checked", true);

                                entChildren = attrNode.parent();    //getting entity-children node
                                entChildren.show();
                                entNode = entChildren.prev();       //getting entity node (previous to entity-children div)
                                entInput = entNode.find("input");   //getting entity node input
                                entInput.prop("checked", true);
                            }
                        }        
                    }
                }
            };

            if (query) {
                if (remove)
                    query.removeChangedCallback(queryObserver);
                else
                    query.addChangedCallback(queryObserver);
            }
        },

        _create: function () {
            var self = this;
        },

        _renderProgressBlock: function () {
            this._progressBlock = $('<div class="eqjs-progress-win8"><div class="wBall" id="wBall_1"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5"><div class="wInnerBall"></div></div></div>');
        },

        _render: function () {
            var self = this;

            this._clear();

            var model = this.getModel();

            this.element.addClass('eqjs-ep-panel');

            if (model != null && !model.isEmpty()) {
                this._rootEntityBlock = $('<div></div>');
                var entTree = model.getEntitiesTree({ addUIC: true, addUIR: true, addUIS: false, attrPlacement: self.options.attrPlacement, sortEntities: self.options.sortEntities, includeRootData: true });
                this._entityTreeBlock = this.element.append(this._renderEntity(entTree, this._rootEntityBlock, 0)); //model.getRootEntity()
            }

            if (this.options.showFilterBox) {
                this._createFilterBox();
            }
            else {
                this._rootEntityBlock.css('top', '0');
            }

            if (this.options.showToolbar && !this.options.syncWithColumns) {
                this._createToolPanel();
            }
            else {
                this._rootEntityBlock.css('bottom', '0');
            }

            this._renderProgressBlock();
        },

        _renderEntity: function (entity, block, offset) {

            var self = this;

            var defaultClass = 'eqjs-ep-entity',
                entityBlock,
                entityNode = $('<div></div>', { 'class': defaultClass + '-node' }),
                entityChildren = $('<div></div>', { 'class': defaultClass + '-children' }),
                nodeLabel = $('<label></label>', { 'class': defaultClass + '-node-label' }),
                nodeInput = $('<input />', { 'type': 'checkbox' }),
                nodeToggleButton = $('<a></a>', { 'href': 'javascript:void(0)', 'class': defaultClass + '-node-button' }),
                attrNode, attrLabel, attrInput,
                i, ent, attr,
                caption,
                emptyBlock = $('<div></div>'),
                curOffset = offset;


            var isAttributeInTree = function (attrId, entityBlock) {
                var res = entityBlock.find('.' + defaultClass + '-attr[data-id="' + attrId + '"]');
                return res.length > 0;
            };

            var isObjectToBeShown = function (object) {
                return (self.options.showAttributes.usedInConditions && object.uic) || (self.options.showAttributes.usedInColumns && object.uir) || (self.options.showAttributes.usedInSorting && object.uis);
            };

            if (block) {
                entityBlock = block;
                entityBlock.html('').addClass(defaultClass);
            }
            else {
                entityBlock = $('<div></div>', { 'class': defaultClass });
            }


            if (entity.id && entity.id != "") {
                nodeLabel.text(entity.text).appendTo(entityNode); //caption
                if (self.options.showCheckboxes) {
                    nodeLabel.prepend(nodeInput);
                }
                nodeToggleButton.prependTo(entityNode);

                if (self.options.showTooltips && entity.description) {
                    nodeLabel.attr('title', entity.description);
                }

                for (var i = 0; i < curOffset; i++) {
                    entityNode.prepend($('<div></div>', { 'class': defaultClass + '-offset' }));
                }

                entityBlock.append(entityNode);

                entityChildren.hide();

                curOffset++;
            }

            var itemsLength = entity.items ? entity.items.length : 0;
            for (var i = 0; i < itemsLength; i++) {
                var item = entity.items[i];
                if (item.isEntity) {
                    entityChildren.append(self._renderEntity(item, null, curOffset));
                }
                else {
                    if (!item.lookupAttr || !(isAttributeInTree(item.lookupAttr, entityChildren) || isAttributeInTree(item.lookupAttr, this._rootEntityBlock))) {
                        attrLabel = $('<label></label>', {
                            'text': item.text,
                            'class': defaultClass + '-attr-label'
                        });

                        if (self.options.showCheckboxes) {
                            attrInput = $('<input />', { 'type': 'checkbox' });
                            attrLabel.prepend(attrInput);

                            attrInput.change(function () {
                                if (self.options.syncWithColumns) {
                                    var ColumnsPanel = $("#" + self.options.columnsPanelId);

                                    var b = $(this).prop("checked");
                                    var anode = $(this).parent().parent(); //getting attribute node
                                    var attrId = anode.data("id");
                                    if (b) {
                                        ColumnsPanel.ColumnsPanel("addNewColumn", attrId);
                                    }
                                    else {
                                        ColumnsPanel.ColumnsPanel("removeColumnByAttrId", attrId);
                                    }
                                }
                            });
                        }

                        if (self.options.showTooltips && item.description) {
                            attrLabel.attr('title', item.description);
                        }

                        for (var j = 0; j < curOffset + 1; j++) {
                            attrLabel.prepend($('<div></div>', { 'class': defaultClass + '-offset' }));
                        }

                        attrNode = $('<div></div>').attr('class', function () {
                            var className = defaultClass + '-attr ';

                            if (entityNode.html().length == 0) {
                                className += defaultClass + '-attr-root';
                            }

                            return className;
                        }).html(attrLabel).attr('data-id', item.id);

                        if (self.options.draggableAttributes) {
                            attrNode.draggable({
                                containment: "document",
                                cursor: "move",
                                helper: "clone",
                                revert: "invalid",
                                scope: "entityAttr",
                                distance: 20,
                                connectToSortable: ".ui-sortable",
                                cursorAt: { bottom: 20, left: 10 },
                                start: function (event, ui) {
                                    ui.helper.find("input").hide();

                                    var label = ui.helper.find("label");
                                    label.css("max-width", "400px")
                                        .css("overflow", "hidden")
                                        .css("text-overflow", "ellipsis");

                                },
                                appendTo: 'body'
                            });
                        }

                        if (self.options.clickableAttributes == 1) {
                            attrNode.click(function () {
                                var QueryPanelWidget = $("#" + self.options.queryPanelId);
                                QueryPanelWidget.QueryPanel("addNewConditionIntoActivePredicate", $(this).data('id'));
                            });
                        }

                        entityChildren.append(attrNode);
                    }
                }
            }

            if (entityChildren.html().length) {
                entityBlock.append(entityChildren);

                nodeToggleButton.click(function (event) {
                    entityChildren.toggle();
                    $(this).toggleClass(defaultClass + '-node-button-open');
                    event.preventDefault();
                });
            }


            if (entityChildren) {
                entityChildren.find('label input').click(function (e) {
                    if ($(this).prop('checked') && !(nodeInput.prop('checked'))) {
                        nodeInput.prop('checked', true);
                    }
                    else if (entityChildren.find('input:checked').length == 0) {
                        nodeInput.prop('checked', false)
                    }
                });
            }

            nodeInput.click(function () {
                var nodeChecked = $(this).prop('checked');
                if (nodeChecked) {
                    entityChildren.find('label input').prop('checked', true);
                }
                else {
                    entityChildren.find('label input').prop('checked', false);
                }



                if (self.options.syncWithColumns) {
                    var attrs = [];
                    var attrNodes = entityChildren.find("div.eqjs-ep-entity-attr");
                    attrNodes.each(function () {
                        attrs.push($(this).data("id"));
                    });

                    var ColumnsPanel = $("#" + self.options.columnsPanelId);

                    if (nodeChecked) {
                        ColumnsPanel.ColumnsPanel("addNewColumn", attrs);
                    }
                    else {
                        ColumnsPanel.ColumnsPanel("removeColumnByAttrId", attrs);
                    }
                }

            });

            return entityBlock;
        },

        _createFilterBox: function () {
            var self = this;
        
            var defClass = 'eqjs-ep-filter-box',
                filterBoxBlock = $('<div></div>', { 'class': defClass }),
                filterBoxInput = $('<input></input>', { 'class': defClass + "-input"});

            filterBoxBlock.append(filterBoxInput);
            self.element.prepend(filterBoxBlock);

        },

        _createToolPanel: function () {
            var self = this;

            var defClass = 'eqjs-ep-tool-panel',
                toolPanelBlock = $('<div></div>', { 'class': defClass }),
                toolSelectAll = $('<div></div>', { 'class': defClass + '-select-all', 'title': 'Select all' }),
                toolDeselectAll = $('<div></div>', { 'class': defClass + '-deselect-all', 'title': 'Clear selection' }),
                toolAddColumns = $('<div></div>', { 'class': defClass + '-add-columns', 'title': 'Add column' }),
                toolAddCond = $('<div></div>', { 'class': defClass + '-add-cond', 'title': 'Add condition' }),
                toolLeftBlock = $('<div></div>', { 'class': defClass + '-left-side' }),
                toolRightBlock = $('<div></div>', { 'class': defClass + '-right-side' });

            var model = self.getModel();

            if (this.options.showSelectAllButton) {
                toolSelectAll.attr("title", EQ.core.getText("ButtonSelectAll"));
                toolLeftBlock.append(toolSelectAll);
            }

            if (this.options.showClearSelectionButton) {
                toolDeselectAll.attr("title", EQ.core.getText("ButtonDeselectAll"));
                toolLeftBlock.append(toolDeselectAll);
            }

            toolAddColumns.attr("title", EQ.core.getText("ButtonAddColumns"));
            toolAddCond.attr("title", EQ.core.getText("ButtonAddConditions"));


            toolRightBlock.append(toolAddColumns, toolAddCond);
            //toolPanelBlock.append(toolDeselectAll, toolAddColumns, toolAddCond);
            toolPanelBlock.append(toolLeftBlock, toolRightBlock);

            toolSelectAll.click(function () {
                self._selectAll();
            });

            toolDeselectAll.click(function () {
                self._deselectAll();
            });

            toolAddColumns.click(function () {
                var attrElements = self.element.find(".eqjs-ep-entity-attr");
                var attrList = [];
                var attrId,
                    attribute;

                var query = self.getQuery();

                query.fireProcessEvent({
                    source: self,
                    status: "start"
                });


                $.each(attrElements, function (index, attrElem) {
                    attrElem = $(attrElem);
                    var input = attrElem.find("input").first();
                    //                    if (input.attr("checked")) {
                    if (input.prop("checked")) {
                        attrId = attrElem.data('id');
                        if (model.checkAttrProperty(attrId, "uir")) {
                            attrList.push(attrId);
                        }
                    }

                });

                var columnsPanel = $("#" + self.options.columnsPanelId);
                columnsPanel.ColumnsPanel("addNewColumn", attrList);

                if (self.options.autoClearSelection) {
                    self._deselectAll();
                }

                query.fireProcessEvent({
                    source: self,
                    status: "finish"
                });

            });

            toolAddCond.click(function () {
                var attrElements = self.element.find(".eqjs-ep-entity-attr");
                var attrList = [];
                var attrId,
                    attribute;


                var query = self.getQuery();

                query.fireProcessEvent({
                    source: self,
                    status: "start"
                });

                $.each(attrElements, function (index, attrElem) {
                    attrElem = $(attrElem);
                    var input = attrElem.find("input").first();
                    //                    if (input.attr("checked")) {
                    if (input.prop("checked")) {
                        attrId = attrElem.data('id');
                        if (model.checkAttrProperty(attrId, "uic")) {
                            attrList.push(attrId);
                        }

                    }
                });

                var queryPanel = $("#" + self.options.queryPanelId);
                queryPanel.QueryPanel("addNewCondition", attrList);

                if (self.options.autoClearSelection) {
                    self._deselectAll();
                }

                query.fireProcessEvent({
                    source: self,
                    status: "finish"
                });

            });


            this.element.append(toolPanelBlock)

        },

        _selectAll: function() {
            this._entityTreeBlock.find('input').prop('checked', true);
        },

        _deselectAll: function() {
            this._entityTreeBlock.find('input').prop('checked', false);
        },

        _setOption: function (key, value) {
            if (arguments.length == 2) {
                this.options[key] = value;
                this._render();
                return this;
            }
            else {
                return this.options[key];
            }
        },

        _clear: function () {
            this.element.html('');
        },

        /// <method name="refresh">
        /// <summary>Re-renders the panel</summary>
        /// </method>
        refresh: function () {
            this._render();
        },

        resize: function () {
            this._render();
        },

        startLoading: function () {
            if (this.options.showIndicatorOnLoad) {
                this.element.append(this._progressBlock);
            }
        },

        finishLoading: function () {
            if (this.options.showIndicatorOnLoad) {
                this.element.find(this._progressBlock).remove();
            }
        }
    });

})(jQuery);﻿;(function ($, undefined) {
    var swapArrayItems = function (arr, x, y) {
        if (x === y) return;

        var tmp = arr[x];
        arr[x] = arr[y];
        arr[y] = tmp;
        delete tmp;
    };

    $.widget('eqjs.ColumnsBarOld', {
        _query: null,
        _activeColumn: null,
        _activeColumnIndex: null,
        _contentBlockClass: 'eqjs-cb-inner-wrapper',
        _colsBlockClass: 'eqjs-cb-inner',
        _width: 0, //of ^
        
        _leftBtn: null,
        _rightBtn: null,
        
        _uiUpdaterId: null,

        options: {
            showAddButton: true,
            addButtonSide: 'left',
            addButtonHTML: '+',
            innerPaddingCompensation: {
                right: 38,
                left: 35
            },
            allowAggrColumns: true,
            allowSorting: true,
            sortByList: [
                'None',
                'Ascending',
                'Descending'
            ],
            placeholderHeight: 22,
            adjustEntitiesMenuHeight: true,
            attrElementFormat: '{entity} {attr}',
            alwaysShowButtons: false,
            accentActiveColumn: true,
            uiUpdateInterval: 200,
            scrollSpeed: 15,
            showScrollBar: true,
            scrollButtonsScrollBy: 500,
            scrollButtonsLeftHTML: '&lt; ...',
            scrollButtonsRightHTML: '... &gt;'
        },

        _setOption: function (key, value) {
            if (key == 'query') {
                this.setQuery(value);
            }
            else if (arguments.length == 2) {
                this.options[key] = value;
                this._render();
                return this;
            }
            else {
                return this.options[key];
            }
        },

        _create: function () {this._render()},
        _clear: function () {this.element.html('')},

        getModel: function(){
            var query = this.getQuery();
        	return query ? query.getModel() : null;
        },

        getQuery: function() {
            return this._query;
        },

        setQuery: function (query) {
            this._query = query;
            this.refresh();
        },

        init: function (query) {this.setQuery(query)},
        refresh: function () {this._render()},
        resize: function () {this._render()},

        _render: function () {
            this._clear();

            if (!this.getModel()) return;

            this.options.entitiesList = this.getModel().getEntitiesTree({addUIC:false, addUIR:true, addUIS:false});
            this.options.entitiesMenu = this._createEntitiesMenu();

            this._refreshByQuery();
            
            
            var prefix = 'eqjs-cb-with-add-button-on-';
            
            this.element.removeClass(prefix + 'left').removeClass(prefix + 'right');
            if (this.options.showAddButton) {
                this.element.addClass(prefix + this.options.addButtonSide);
                this._showAddButton();
            }
        },

        _refreshByQuery: function () {
            if (!this.getQuery()) return;

            var self = this;

            var colsBlock = $('<div></div>').addClass(
                    self._colsBlockClass
                ),
                contentBlock = $('<div></div>').addClass(
                    self._contentBlockClass
                );

            var query = self.getQuery();    
            var columns = query ? query.getColumns() : null,
                addWidget = function (self, element, idx) {
                    var col = columns[colIdx];
                    
                    var wfn = element['ColumnsBarColumn_' + col.expr.typeName];
                    wfn.call(element, {
                        columnsBar: self,
                        query: self.getQuery()
                    });
                    wfn.call(element, 'init', col);
                    return {wfn: wfn, element: element};
                };
            
            var activateByIdx = (typeof self._activeColumnIndex) === 'number';
            
            for (colIdx in columns) {
                var d = addWidget(
                    self, $('<div></div>').appendTo(colsBlock), colIdx
                );
                if (activateByIdx && +colIdx === self._activeColumnIndex) {
                    d.wfn.call(d.element, 'setActiveColumn');
                    d.element.click();
                }
            }

            var colsDivs = colsBlock.children('div');

            //inner -> inner-wrapper
            colsBlock.appendTo(contentBlock);

            //inner-wrapper -> self.element
            contentBlock.appendTo(self.element);

            if (!self.options.showScrollBar) {
                contentBlock.css('overflow-x', 'hidden');
                
                self._leftBtn = self._makeScrollButton({
                    html: self.options.scrollButtonsLeftHTML,
                    t: 'left',
                    otherT: 'right',
                    scrollLeft: '-=' + self.options.scrollButtonsScrollBy
                });
                self._rightBtn = self._makeScrollButton({
                    html: self.options.scrollButtonsRightHTML,
                    t: 'right',
                    otherT: 'left',
                    scrollLeft: '+=' + self.options.scrollButtonsScrollBy
                });
                
                self.element.prepend(self._leftBtn.hide());
                self.element.prepend(self._rightBtn.hide());
            } else {
                contentBlock.css('overflow-x', 'auto');
                self._leftBtn = null;
                self._rightBtn = null;
            }

            //hack to update width of cols block ($div.*width() sometimes is 0)
            if (self._uiUpdaterId) {
                clearInterval(self._uiUpdaterId);
            }
            
            self._uiUpdaterId = window.setInterval(function () {
                var initial = 2;
                var total = initial;
                colsDivs.each(function () {
                    total += $(this).outerWidth(true);
                });
                if (total > initial && total !== self._width) {
                    self._width = total;
                    self.element.find('.' + self._colsBlockClass).css({
                        width: total
                    });
                }
                if (self._leftBtn && self._rightBtn) {
                    //depend on total width
                    self._updateScrollButtonVisibility(self._leftBtn, 'left');
                    self._updateScrollButtonVisibility(self._rightBtn, 'right');
                }
            }, self.options.uiUpdateInterval);


            var oldIdx, newIdx, addedColumn = false;

            colsBlock.sortable({
                cursor: 'move',
                //containment: 'parent' breaks this
                tolerance: 'pointer',
                cancel: '.eqjs-cb-column-buttonsBlock, .eqjs-cb-colelement, .eqjs-cb-sortbutton, .eqjs-ce-editbox',
                placeholder: 'eqjs-cb-column-placeholder',
                forcePlaceholderSize: true,
                scroll: true,
                scrollSpeed: this.options.scrollSpeed,
                delay: 100,
                distance: 13,
                forceHelperSize: true,
                start: function (event, ui) {
                    oldIdx = ui.item.index();
                    ui.item.addClass('eqjs-cb-column-sort');
                    ui.placeholder.height(self.options.placeholderHeight);
                },
                update: function (event, ui) {
                    newIdx = ui.item.index();

                    ///!!!!!!!!!!!!!!!!!!!!!!! change to Query class method calls
                    if (addedColumn) {
                        addedColumn = false;
                        columns.splice(newIdx, 0, columns.pop());
                        self.refresh();
                    } else {
                        swapArrayItems(columns, oldIdx, newIdx);
                    }
                },
                stop: function (event, ui) {
                    ui.item.removeClass('eqjs-cb-column-sort');
                    ui.item.click();  //activate column
                    self._fireQueryChange('change');
                }
            });

            self.element.droppable({
                tolerance: 'touch',
                hoverClass: 'eqjs-drophover',
                scope: 'entityAttr',
                drop: function (event, ui) {
                    self.addNewColumn(ui.draggable.attr('data-id'));
                    addedColumn = true;
                },
                over: function (event, ui) {
                    ui.helper.addClass('eqjs-cb-column-drag');
                },
                out: function (event, ui) {
                    ui.helper.removeClass('eqjs-cb-column-drag');
                }
            });

            (!colsBlock.children().length) ? contentBlock.hide() : contentBlock.show();
        },

        _makeScrollButton: function (opts) {
            var self = this,
                t = opts.t,
                otherT = opts.otherT;

            var makeClass = function (t) {return 'eqjs-cb-button-' + t};

            var btn = $('<span></span>').addClass(makeClass(t)).html(opts.html);
            
            btn.click(function () {
                $(this).parent().find('.' + self._contentBlockClass).animate({
                    scrollLeft: opts.scrollLeft
                });
            });

            return btn;
        },

        _updateScrollButtonVisibility: function (btn, t) {
            var innerWrapper = btn.parent().find(
                    '.' + this._contentBlockClass
                );

            var offset = innerWrapper.scrollLeft(),
                width = innerWrapper.innerWidth(),
                totalWidth = this._width;
            
            if (this.options.showAddButton) {
                totalWidth += this.options.innerPaddingCompensation[
                    this.options.addButtonSide
                ];
            }
            
            if ((width >= totalWidth) || !width || offset === null) return btn.hide();

            var edgeOffset = {
                left: function () {return offset},
                right: function () {return totalWidth - (width + offset)}
            }[t]();

            (edgeOffset <= 0) ? btn.hide() : btn.show();
        },

        _showAddButton: function () {
            var side = this.options.addButtonSide;
            var addColumnBlock = $('<div class="eqjs-cb-add-button"></div>');
                addColumnBlock.prependTo(this.element).css(
                    side,
                    this.element.css('padding-' + side)
                );

            var addColumnLink = $('<a href="javascript:void(0)"></a>').html(
                this.options.addButtonHTML
            ).appendTo(addColumnBlock);

            var self = this;

            addColumnLink.click(function () {
                self.showEntitiesMenu({
                    anchor: addColumnLink,
                    selectedIds: null,
                    itemSelectedCallback: function (evt, data) {
                        var attrid = data.menuItem.id;
                        var attrobj = self.getModel().getAttributeById(attrid);
                        self.addNewColumn(attrid);
                        return false;
                    }
                });
            });
        },

        showEntitiesMenu: function (menuOptions, eventArgs) {
            var self = this;

            self.options.entitiesMenu.PopupMenu('showMenu', menuOptions);
        },

        clearColumns: function (needRefresh) {
            this.getQuery().clearColumns();

            if (needRefresh !== false) this.refresh();
        },

        _createEntitiesMenu: function () {
            if (!this.getModel()) return null;

            var menuDiv = $('<div></div>').hide().appendTo(this.element);

            menuDiv.PopupMenu({
                items: this.options.entitiesList,
                adjustHeight: this.options.adjustEntitiesMenuHeight
            });

            return menuDiv;
        },

        _fireQueryChange: function (changeType) {
            var self = this;
            this.getQuery().fireChangedEvent({
                "source": self,
                changeType: 'query.' + changeType
            }, true);
        },

        _fireColumnChange: function (changeType, column) {
            var self = this;

            column = column || self._column;

            this.getQuery().fireChangedEvent({
                "source": self,
                changeType: 'column.' + changeType,
                column: column
            }, true);
        },

        addNewColumn: function (attrid, index) {
            var self = this;
            var getColumnByAttrId = function (attrid) {
                var attribute = self.getModel().getAttributeById(attrid);

                if (!attribute) { return null; }

                if (!attribute.uir) {
                    if (attribute.lookupAttr) {
                        attrid = attribute.lookupAttr;
                        attribute = self.getModel().getAttributeById(attrid);
                        if (!attribute || !attribute.uir) {
                            return null;
                        }
                    }
                    else
                        return null;
                }

                return {
                    caption: '',
                    sorting: 'None',
                    sortIndex: -1,
                    expr: {
                        typeName: 'ENTATTR',
                        id: attrid
                    }
                };
            };

            if (!self.getQuery()) { return; }

            var colToAdd,
                col;

            if ($.isArray(attrid)) {
                colToAdd = [];
                for (var i = 0; i < attrid.length; i++) {
                    col = getColumnByAttrId(attrid[i]);
                    if (col) {
                        colToAdd.push(col);
                    }
                }
            }
            else
                colToAdd = getColumnByAttrId(attrid);

            self.addColumn(colToAdd, index);

            return colToAdd;
        },

        addColumn: function (column, index) {
            var self = this;

            var query = this.getQuery();
            if (!query) { return; }
            var columns = query.getColumns();

            if (!column || ($.isArray(column) && column.length == 0)) { return; }

            if (typeof index == 'number')
                columns.splice.apply(columns, [index, 0].concat(column));
            else
                columns.push.apply(columns, [].concat(column));

            self._width += (self._initialWidth * 4);
            self.refresh();
            self._fireColumnChange('add', column);
        },

        removeColumn: function (column) {
            var self = this;

            var query = this.getQuery();
            if (!query) { return; }
            var columns = query.getColumns();

            var index = $.inArray(column, columns);
            if (index >= 0) {
                if (index === self._activeColumnIndex) {
                    self._activeColumnIndex = null;
                };
                
                columns.splice(index, 1);
                self.refresh();
                self._fireColumnChange('remove', column);
            }
        },

        removeColumnByAttrId: function (attrId) {
            var self = this;

            var query = this.getQuery();
            if (!query) { return; }
            var columns = query.getColumns();

            var index = 0;
            var colCount = columns.length;
            while (index < colCount) {
                var col = columns[index];
                if (col.expr.typeName == 'ENTATTR' && col.expr.id == attrId) break;

                index++;
            }

            if (index < colCount) {
                columns.splice(index, 1);
                self._fireColumnChange('remove', col);
                self.refresh();
            }
        },

        setActiveColumn: function (column) {
            if (this._activeColumn) {
                this._activeColumn.deactivate();
            }

            this._activeColumn = column;
            if (this._activeColumn) {
                this._activeColumn.activate();
            }
        },
        
        getActiveColumn: function () {
            return this._activeColumn;
        },
        
        setActiveColumnIndex: function (idx) {
            this._activeColumnIndex = idx;
        }
    });


    var swapColumns = function (ctx, x, y) {
        var cols = ctx.self.options.columnsBar._query.getColumns();
        if (!cols.length) return;
        
        swapArrayItems(cols, x, y);
        
        var activeCol = ctx.self.options.columnsBar.getActiveColumn();
        if (activeCol && activeCol._active && activeCol.element.length) {
            var idx = activeCol.element.index();
            if (idx === x) {
                return y
            } else if (idx === y) {
                return x;
            };
        }
    };

    var refreshByColumnElement = function (activeColIndex, el) {
        var cb = el.parent().parent().parent();
        
        if ((typeof activeColIndex) !== 'undefined') {
            cb.ColumnsBar('setActiveColumnIndex', activeColIndex);
        };
        
        cb.ColumnsBar('refresh');
    };


    var COLUMN_MENU_BUTTON_MENU_COMMON_ITEMS = [
        {
            id: '|<-',
            text: EQ.core.getText('CmdMoveToStart'),
            fn: function (ctx) {
                refreshByColumnElement(
                    swapColumns(ctx, 0, ctx.self.element.index()),
                    ctx.self.element
                );
            }
        },
        {
            id: '->',
            text: EQ.core.getText('CmdMoveRight'),
            fn: function (ctx) {
                var currentEl = ctx.self.element;
                var nextEl = currentEl.next();

                if (!nextEl.length) return;

                refreshByColumnElement(
                    swapColumns(ctx, nextEl.index(), currentEl.index()),
                    currentEl
                );
            }
        },
        {
            id: '<-',
            text: EQ.core.getText('CmdMoveLeft'),
            fn: function (ctx) {
                var currentEl = ctx.self.element;
                var prevEl = currentEl.prev();

                if (!prevEl.length) return;

                refreshByColumnElement(
                    swapColumns(ctx, prevEl.index(), currentEl.index()),
                    currentEl
                );
            }
        },
        {
            id: '->|',
            text: EQ.core.getText('CmdMoveToEnd'),
            fn: function (ctx) {
                var currentEl = ctx.self.element;
                var lastEl = currentEl.parent().children().last();

                if (!lastEl.length) return;

                refreshByColumnElement(
                    swapColumns(ctx, lastEl.index(), currentEl.index()),
                    currentEl
                );
            }
        }
    ];
    
    var rrNext = function (arr, currEl) {
        var nextIdx = arr.indexOf(currEl) + 1;
        return (nextIdx == arr.length) ? arr[0] : arr[nextIdx];
    };

    $.widget('eqjs.ColumnsBarColumn', {
        _column: null,

        _sortingButton: null,

        _buttonsBlock: null,
        _menuButton: null,
        _menuButtonMenu: null,
        _deleteButton: null,

        _keepShowingButtons: false,
        _isMouseOverBlock: false,

        _classesToAdd: '',

        _active: false,

        options: {
            columnsBar: null,
            query: null
        },

        getQuery: function(){
            return this.options.columnsBar.getQuery();
        }, 

        getModel: function(){
            var query = this.getQuery();
            return query ? query.getModel() : null;
        },

        init: function (column) {
            this._column = column;
            this.refresh();
        },

        _render: function () {
            this._clear();
            if (this.getModel() && this._column) {
                this._refreshByColumn();
                this._initButtons();
            }
        },

        _fireColumnChange: function (changeType, column) {
            var self = this;

            column = column || self._column;
            var query = this.qetQuery();
            if (!query) return;    
            
            query.fire({
                query: self.options.columnsBar.options.query,
                changeType: 'column.' + changeType,
                condition: column
            });
        },

        refresh: function () {this._render()},

        _setOption: function (key, value) {
            if (arguments.length == 2) {
                this.options[key] = value;
                if (key === 'disabled') {
                    this._column.enabled = !value;
                }

                this._render();
                return this;
            }
            else {
                if (key === 'disabled')
                    return this._column.enabled === false;
                else
                    return this.options[key];
            }
        },

        _clear: function () {
            this.element.unbind();
            this.element.html('');
            this.element.removeClass();
        },

        _refreshByColumn: function () {},

        remove: function () {
            var self = this;

            if (!self.options.columnsBar) return;

            self.options.columnsBar.removeColumn(self._column);
            self._fireColumnChange('delete');
        },

        _initMenu: function () {
            var items = this._getMenuButtonMenuItems();

            var callIfFound = function (its, id, ctx) {
                for (var i = 0, length = its.length; i < length; i++) {
                    var current = its[i];
                    if (current.items) {
                        var r = callIfFound(current.items, id, ctx);
                        if (r) {
                            return true;
                        }
                    } else {
                        if (id == current.id) {
                            if (current.fn) {
                                current.fn(ctx);
                            }
                            return true;
                        }
                    }
                }
                return false;
            }

            this._menuButtonMenu = $('<div></div>').hide().appendTo(this.element);
            this._menuButtonMenu.PopupMenu({items: items});

            var self = this;

            self._menuButton.click(function () {
                self._menuButtonMenu.PopupMenu('showMenu', {
                    anchor: self._menuButton,
                    selectedIds: null,
                    itemSelectedCallback: function (evt, data) {
                        callIfFound(items, data.menuItem.id, {
                            self: self,
                            evt: evt,
                            data:data
                        });
                        return false;
                    },
                    menuClosedCallback: function () {
                        if (!self._isMouseOverBlock) {
                            self._menuButtonMenu.trigger('mouseleave');
                        }
                    }
                });
            });
        },

        _initButtons: function () {
            var self = this;

            var container = self.element;

            if (!container) return;

            self._buttonsBlock = $('<span></span>')
                .addClass('eqjs-cb-column-buttonsBlock')
                .appendTo(container);

            self._menuButton = $('<span></span>')
                .addClass('eqjs-cb-column-button-menu')
                .attr('title', EQ.core.getText('ButtonMenu'))
                .appendTo(self._buttonsBlock);
            self._initMenu();

            self._deleteButton = $('<span></span>')
                .addClass('eqjs-cb-column-button-delete')
                .attr('title', EQ.core.getText('ButtonDelete'))
                .appendTo(self._buttonsBlock)
                .click(function () {
                    self.remove();
                });

            //sorting button setup
            self._sortingButton = $('<span></span>')
                .addClass('eqjs-colelement eqjs-cb-button-sort')
                .prependTo(self.element);

            if (self.options.columnsBar.options.allowSorting != false) {
                self._sortingButton
                    .attr('title', EQ.core.getText('ButtonSorting'))
                    .click(function () {
                        self._column.sorting = rrNext(
                            self.options.columnsBar.options.sortByList,
                            self._column.sorting
                        );
                        self.refresh();
                        self._fireColumnChange('change');
                    });

                if (self._column.sorting === 'None') {
                    self._sortingButton.addClass('eqjs-cb-column-button-sort-none')
                }

                self._sortingButton.hover(
                    function () {
                        $(this).addClass('eqjs-cb-column-button-sort-active');
                    },
                    function () {
                        $(this).removeClass('eqjs-cb-column-button-sort-active');
                    }
                );
            }

            if (self._column.sorting === 'Ascending') {
                self._sortingButton
                    .addClass('eqjs-cb-column-button-sort-asc')
                    .attr('title', EQ.core.getText('ButtonSorting'));
            }
            else if (self._column.sorting === 'Descending') {
                self._sortingButton
                    .addClass('eqjs-cb-column-button-sort-desc')
                    .attr('title', EQ.core.getText('ButtonSorting'));
            }

            container.find('[class*=eqjs-column-button]').hover(
                function () {
                    $(this).addClass('eqjs-cb-column-button-sort-active');
                },
                function () {
                    $(this).removeClass('eqjs-cb-column-button-sort-active');
                }
            )

            container.bind('mouseenter', function (event) {
                self._isMouseOverBlock = true;
                self._enterButtonBlock();
                event.stopPropagation();
                return false;
            })
            .bind('mouseleave', function (event) {
                self._isMouseOverBlock = false;
                if (!self._keepShowingButtons) {
                    self._leaveButtonBlock();
                }

                event.stopPropagation();
                return false;
            })

            self._hideButtons();
            self._adjustButtonsVisibility();
        },

        _adjustButtonsVisibility: function () {
            if (
                this.options.columnsBar.options.alwaysShowButtons ||
                (
                    this.options.columnsBar.options.accentActiveColumn &&
                    this._active
                )
            ) {
                this._showButtons();
            }

        },

        _enterButtonBlock: function () {this._showButtons()},

        _leaveButtonBlock: function () {
            if (this.options.columnsBar.options.alwaysShowButtons != true && (!this._active || this.options.columnsBar.options.accentActiveColumn != true)) {
                this._hideButtons();
            }
        },

        _showButtons: function () {
            var show = function (obj) {obj.css('visibility', 'visible')};

            show(this._deleteButton);
            show(this._menuButton);

            if (this.options.columnsBar.options.allowSorting != false) {
                show(this._sortingButton);
            }
        },

        _hideButtons: function () {
            var hide = function (obj) {obj.css('visibility', 'hidden')};

            hide(this._deleteButton);
            hide(this._menuButton);

            if (this._column.sorting === 'None') {
                hide(this._sortingButton);
            }

        },

        activate: function () {
            this._active = true;
            this.adjustActiveClass();

            this._hideButtons();
            this._adjustButtonsVisibility();
        },

        deactivate: function () {
            this._active = false;
            this.adjustActiveClass();

            this._hideButtons();
            this._adjustButtonsVisibility();
        },

        adjustActiveClass: function () {
            if (this._active) {
                this.element.addClass('active');
            }
            else {
                this.element.removeClass('active');
            }
        },

        isActive: function () {
            return this._active;
        },

        setActiveColumn: function () {
            this.options.columnsBar.setActiveColumn(this);
        }

    });
    
    var _prependMenuSeparator = function (l) {
        return [{id: 'sep', text: '-------'}].concat(l);
    }
    
    $.widget('eqjs.ColumnsBarColumn_ENTATTR', $.eqjs.ColumnsBarColumn, {
        _classesToAdd: 'eqjs-cb-column eqjs-cb-column-entattr',
        _baseAttr: null,
        _menuFunctionsBlock: null,

        _getMenuButtonMenuItems: function () {
            if (!this.options.columnsBar.options.allowAggrColumns) {
                return COLUMN_MENU_BUTTON_MENU_COMMON_ITEMS;
            }

            var fnmis = this._createFunctionMenuItems(function (ctx) {
                    ctx.self._changeTypeToAggr(ctx.data.menuItem.id);
                }),
                cmenu = COLUMN_MENU_BUTTON_MENU_COMMON_ITEMS;
            
            if (fnmis) {
                cmenu = _prependMenuSeparator(cmenu);
            }
            
            return fnmis.concat(cmenu);
        },

        _fillBaseBlock: function (baseBlock) {
            baseBlock.addClass('eqjs-expr-block');

            this._baseAttr = this._getAttribute();
            
            if (!this._column.caption) {
                this._column.caption = this._getDefaultCaption();
            }
        },

        _refreshByColumn: function () {
            if (!this._column || !this.getModel()) return;
            var self = this;

            self.element.addClass(self._classesToAdd);

            var baseBlock = $('<span></span>')
                .appendTo(self.element);

            self._fillBaseBlock(baseBlock);

            if (self.options.columnsBar.options.accentActiveColumn) {
                self.element.click(function () {
                    if (!self._active) {
                        self.setActiveColumn();
                    }
                })
            }
            
            if (!self._column.caption || self._column.caption == '') {
                self._column.caption = self._getDefaultCaption();
            }

            var captionEditorBlock = $('<span></span>');
            captionEditorBlock.appendTo(this.element);

            var captionChanged = function() {
                self._fireColumnChange('change');
            }

            captionEditorBlock.ColumnsBarColumn_CaptionEditor();
            captionEditorBlock.ColumnsBarColumn_CaptionEditor('init', self._column, self._getDefaultCaption(), captionChanged);

            self.adjustActiveClass();
        },

        _getDefaultCaption: function () {
            return this._getAttributeText(this._baseAttr);
        },

        _getAttribute: function () {
            return this.getModel().getAttributeById(this._column.expr.id)
        },

        _getAttributeText: function (attribute) {
            var self = this;

            if (!attribute) return '';

            var attrText = EQ.core.getText('Attributes', attribute.id);
            if (!attrText)
                attrText = attribute.caption;

            if (!self.options.columnsBar) return attrText;

            var format = self.options.columnsBar.options.attrElementFormat;
            if (!format) return attrText;

            var result = format.replace(new RegExp('{attr}','g'), attrText);
            var entityPath = self.getModel().getFullEntityPathByAttr(attribute.id, '.');
            result = result.replace(new RegExp('{entity}','g'), entityPath);

            return result;
        },

        _changeTypeToAggr: function (funcId) {
            var self = this;

            if (!funcId)
                funcId = self._menuFunctionsBlock.PopupMenu('option', 'items')[0].id;

            var id = self._column.expr.id;

            self._column.expr = {
                func: funcId,
                distinct: false,
                typeName: 'AGGRFUNC',
                argument: {
                    typeName: 'ENTATTR',
                    id: id
                }
            };

            var column = self._column;
            var isActive = self._active;
            self.destroy();

            self._clear();
            self.element.ColumnsBarColumn_AGGRFUNC({columnsBar: self.options.columnsBar, model: self.getModel()});
            self.element.ColumnsBarColumn_AGGRFUNC('init', column);
            self._fireColumnChange('change');

            if (isActive) {
                self.options.columnsBar._activeColumn = null;
                self.element.ColumnsBarColumn_AGGRFUNC('setActiveColumn');
            }
        },

        _createFunctionMenuItems: function (fn) {
            var self = this;

            var items = [];
            var list = self.getModel().aggrFunctions; // EQ.core.AggrFunctions;
            var toInclude = true;
            var funcAllowed = true;

            var item = null;

            var attribute = self._getAttribute();
            var funcCaption;

            for (var idx in list) {
                if (!list[idx]) continue;

                toInclude = true;

                if (list[idx].id === 'SUM' || list[idx].id === 'AVG') {
                    toInclude = $.inArray(attribute.dataType, ['Autoinc', 'Byte', 'Currency', 'Float', 'Int', 'Int64', 'Word']) >= 0;
                }
                else if (list[idx].id === 'MIN' || list[idx].id === 'MAX') {
                    toInclude = $.inArray(attribute.dataType, ['Autoinc', 'BCD', 'Byte', 'Currency', 'Date', 'DateTime', 'Float', 'Int', 'Int64', 'Time', 'Word']) >= 0;
                }

                if (self._column.expr.func === list[idx].id && !toInclude) {
                    funcAllowed = false;
                }

                if (toInclude) {
                    funcCaption = self.getModel().getAggrFunctionCaption(list[idx].id);

                    item = {
                        id: list[idx].id,
                        text: funcCaption,
                        fn: fn
                    };
                    
                    if (self._column.expr.func !== item.id) items.push(item);
                }
            }

            if (items && !funcAllowed) {
                self._column.expr.func = items[0].id;
            }

            return items;
        }
    });

    $.widget('eqjs.ColumnsBarColumn_AGGRFUNC', $.eqjs.ColumnsBarColumn_ENTATTR, {

        _classesToAdd: 'eqjs-cb-column eqjs-cb-column-aggr',

        _getMenuButtonMenuItems: function () {
            return [
                {
                    id: 'to-simple',
                    text: EQ.core.getText('CmdToSimple'),
                    fn: function (ctx) {
                        ctx.self._changeTypeToSimple();
                    }
                }
            ].concat(this._createFunctionMenuItems(function (ctx) {
                ctx.self._changeTypeToSimple();
                ctx.self._changeTypeToAggr(ctx.data.menuItem.id);
                
                ctx.self.refresh();
                ctx.self._fireColumnChange('change');
            })).concat(
                _prependMenuSeparator(COLUMN_MENU_BUTTON_MENU_COMMON_ITEMS)
            );
        },

        _displayFormatParser: {

            formatStr: '',
            pos: 0,
            token: 'text',
            tokenText: '',

            start: function (s) {
                this.formatStr = s;
                this.pos = 0;
                this.tokenText = '';
            },

            skipSpaces: function () {
                while (this.pos < this.formatStr.length && this.formatStr.charAt(this.pos) === ' ') this.pos++;
            },

            next: function () {
                this.skipSpaces();
                if (this.pos >= this.formatStr.length) return false;

                var npos = 0;
                if (this.formatStr.charAt(this.pos) === '{') {
                    npos = this.formatStr.indexOf('}', this.pos);
                    if (npos < 0) return false;
                    this.tokenText = this.formatStr.substring(this.pos, npos+1);
                    if (this.tokenText.indexOf('{attr') === 0) {
                        this.token = 'attribute';
                    }
                    this.pos = npos + 1;
                }
                else if (this.formatStr.charAt(this.pos) === '[' && this.pos < this.formatStr.length-1 && this.formatStr.charAt(this.pos+1) === '[') {
                    this.pos += 2;
                    npos = this.formatStr.indexOf(']]', this.pos);
                    this.token = 'function';
                    this.tokenText = this.formatStr.substring(this.pos, npos);
                    this.pos = npos + 2;
                }
                else {
                    this.token = 'text';
                    var npos1 = this.formatStr.indexOf('{', this.pos);
                    if (npos1 < 0) npos1 = this.formatStr.length;
                    var npos2 = this.formatStr.indexOf('[[', this.pos);
                    if (npos2 < 0) npos2 = this.formatStr.length;
                    npos = Math.min(npos1, npos2);
                    this.tokenText = $.trim(this.formatStr.substring(this.pos, npos));
                    this.pos = npos;
                }
                return true;
            }

        },

        _parseDisplayFormat: function (format) {
            if (!format) return [];

            var result = [];

            var parser = this._displayFormatParser;
            parser.start(format);

            while (parser.next()) {
                if (parser.token === 'function') {
                    result.push({type: 'function', text: parser.tokenText});
                }
                else if (parser.token === 'attribute') {
                    result.push({type: 'attribute'});
                }
                else if (parser.token === 'text') {
                    result.push({type: 'text', text: parser.tokenText});
                }
            }

            return result;
        },

        _fillBaseBlock: function (baseBlock) {
            var self = this;

            baseBlock.addClass('eqjs-expr-block eqjs-expr-block-aggr');

            var format = self.getModel().getAggrFunctionFormat(self._column.expr.func);
            if (!format || format === '') return;

            var arrFormat = self._parseDisplayFormat(format);
            if (arrFormat.length === 0) return;
            
            var chunks = [];
            
            var item, type;
            for (var i = 0, length = arrFormat.length; i < length; i++) {
                item = arrFormat[i];
                type = item.type;
                
                if (type === 'function' || type === 'text') {
                    chunks.push(item.text);
                }
                else if (type === 'attribute') {
                    self._baseAttr = self._getAttribute();
                    chunks.push(self._getAttributeText(self._baseAttr));
                }
            }
            
            this._column.caption = chunks.join(' ');
        },

        _getDefaultCaption: function () {
            return this._getAttributeText(this._baseAttr) + ' ' + this.getModel().getAggrFunctionCaption(this._column.expr.func);
        },

        _getAttribute: function () {
            return this.getModel().getAttributeById(this._column.expr.argument.id)
        },

        _changeTypeToSimple: function () {
            var self = this;

            var id = self._column.expr.argument.id;
            self._column.caption = '';
            self._column.expr = {
                typeName: 'ENTATTR',
                id: id
            };

            var column = self._column;
            var isActive = self._active;
            self.destroy();

            self._clear();
            self.element.ColumnsBarColumn_ENTATTR({columnsBar: self.options.columnsBar, model: self.getModel()});
            self.element.ColumnsBarColumn_ENTATTR('init', column);
            self._fireColumnChange('change');

            if (isActive) {
                self.options.columnsBar._activeColumn = null;
                self.element.ColumnsBarColumn_ENTATTR('setActiveColumn');
            }
        }

    });

    $.widget('eqjs.ColumnsBarColumn_CaptionEditor', $.eqjs.ValueEditor_EDIT, {
        _column : null,
        _defaultValue: '',
        _editBoxClass: 'eqjs-ce-editbox',
        _onChange : null,

        init: function (column, defaultValue, changeCallback) {
            this._expr.value = column.caption;
            this._expr.text = column.caption;
            this._column = column;
            this._defaultValue = defaultValue;
            this._onChange = changeCallback;
            this.refresh();
        },

        _render: function () {
            this.clear();
            if (this._column) {
                this._renderCommonPart();
                this._renderEditor();
                this._linkElement.text(this._getDisplayText());
            }
        },

        _renderCommonPart: function () {
            var self = this;

            self.element.addClass(self._getClassesToAdd());

            self._linkElement = $('<span></span>', {text: '-'}).appendTo(
                self.element
            );

            self._linkElement.dblclick(function () {
                self._showEditor();
                return false;
            });
        },

        _getClassesToAdd: function () {
            return 'eqjs-colelement eqjs-captionelement';
        },

        _setValue: function (newValue) {
            if (!newValue || newValue == '')
                this._column.caption = this._defaultValue;
            else
                this._column.caption = newValue;

            this._linkElement.text(this._column.caption);

            if (this._onChange) {
                this._onChange(newValue);
            }

        },

        _getValue: function () {
            return this._column.caption;
        },

        _getText: function () {
            return this._column.caption;
        },

        _getDisplayText: function () {
            return this._column.caption;
        },

        _getZIndex: function () {
            return 100000;
        }
    });
})(jQuery);

;(function ($, undefined) {

    $.widget("eqjs.FilterBar", {
        _queryPanelWidget: null,
        _query: null,
        _queryIsChanged: false,

        _headerElement: null,
        _headerIconElement: null,
        _headerTextBlock: null,
        _headerTextElement: null,
        _headerLinkElement: null,
        _headerArrowBlock: null,
        _headerArrowElement: null,
        _qpBlock: null,
        _qpElement: null,

        _buttonsBlock: null,
        _btnApply: null,
        _btnClear: null,

        options: {
            applyOnClose: true,

            showApplyButton: true,

            showClearButton: true,

            useBootstrapIcons: true,

            applyFilterCallback: null,

            queryPanel: {
                showAddRow: true,
                showCheckboxes: true,
                alwaysShowButtonsInPredicates: true
            }
        },

        getQuery: function () {
            return this._query;
        },

        setQuery: function (query) {
            if (this._query) {
                this._query.removeChangedCallback($.proxy(this._queryChangedHandler, this)); //removing old query observer
            }
            this._query = query;
            this._query.addChangedCallback($.proxy(this._queryChangedHandler, this));
            this._queryIsChanged = true;

            this._qpElement.QueryPanel("setQuery", this._query);

            this._updateHeader();
        },

        _showQueryPanel: function (func) {
            var self = this;

            self._qpBlock.slideDown(400, function () {
                self._updateHeader();
                if (func) {
                    func();
                }
            });
        },

        _hideQueryPanel: function () {
            var self = this;
            self._qpBlock.slideUp(400, function () {
                self._qpBlock.hide();
                self._updateHeader();

                if (self.options.applyOnClose) {
                    self.applyFilter();
                }

            });
        },

        applyFilter: function (applyForcibly) {
            if (this._queryIsChanged || applyForcibly == true) {
                if (this.options.applyFilterCallback) {
                    this.options.applyFilterCallback();
                    this._queryIsChanged = false;
                }
            }
        },

        clearFilter: function () {
            if (this._query) {
                this._query.clearConditions();
            }
        },

        _queryChangedHandler: function (eventArgs) {
            this._updateHeader();
            this._queryIsChanged = true;

            if (eventArgs && eventArgs.changeType == "condition.add") {
                this._queryPanelWidget.editConditionValue(eventArgs.condition);
            }
        },

        _headerClickHandler: function () {
            var self = this;
            if (self._qpBlock.is(':visible')) {  // close query panel
                self._hideQueryPanel();
            }
            else {  //open query panel
                self._showQueryPanel();
            }
        },

        _create: function () {
            var self = this;

            this.element.addClass('eqjs-fb-container');
            this._headerElement = $('<div></div>')
                .addClass('eqjs-fb-header');
            this.element.append(this._headerElement);

            this._headerIconElement = $('<div></div>')
                .addClass('eqjs-fb-header-icon');
            this._headerElement.append(this._headerIconElement);

            this._headerTextBlock = $('<div></div>')
                .addClass('eqjs-fb-header-textblock');
            this._headerElement.append(this._headerTextBlock);

            this._headerTextElement = $('<span></span>')
                .addClass('eqjs-fb-header-text');
            this._headerTextBlock.append(this._headerTextElement);

            this._headerLinkElement = $('<a href="javascript:void(0)">' + EQ.core.getText('StrNoFilterClickToAdd') + '</a>')
                .addClass('eqjs-fb-header-link')
                .hide()
                .click(function () {
                    self._queryPanelWidget.showEntitiesMenu({
                        anchor: self._headerLinkElement,
                        selectedIds: null,
                        itemSelectedCallback: function (evt, data) {
                            var attrid = data.menuItem.data('id');
                            
                            self._showQueryPanel(function () {
                                self._queryPanelWidget.addNewCondition(attrid);
                            });
                        }
                    });
                });
            this._headerTextBlock.append(this._headerLinkElement);

            /// Up/Down arrow
            this._headerArrowBlock = $('<div></div>')
                .addClass('eqjs-fb-header-arrowblock');
            this._headerElement.append(this._headerArrowBlock);

            this._headerArrowElement = $('<div></div>')
                .addClass('eqjs-fb-header-arrow');
            this._headerArrowBlock.append(this._headerArrowElement);

            /// QueryPanel block
            this._qpBlock = $('<div></div>').hide();
            this._qpBlock.addClass('eqjs-fb-querypanelblock');
            this.element.append(this._qpBlock);

            /// QueryPanel
            this._qpElement = $('<div></div>');
            this._qpElement.addClass('query-panel eqjs-fb-querypanel');
            this._qpElement.QueryPanel(this.options.queryPanel);
            this._qpElement.QueryPanel("setQuery", this._query);
            this._qpBlock.append(this._qpElement);

            this._queryPanelWidget = this._qpElement.data('QueryPanel'); //jQuery before 1.9
            if (!this._queryPanelWidget) {
                this._queryPanelWidget = this._qpElement.data('eqjs-QueryPanel'); //jQuery after 1.9
            }


            /// Buttons
            if (this.options.showApplyButton || this.options.showClearButton) {
                this._buttonsBlock = $('<div></div>')
                    .addClass('eqjs-fb-buttonsblock');
                this._qpBlock.append(this._buttonsBlock);
            }

            if (this.options.showApplyButton) {
                this._btnApply = $('<a href="javascript:void(0)"></a>')
                    .addClass('eqjs-fb-button eqjs-fb-button-apply')
                    .text(EQ.core.getText('ButtonApply'))
                    .on('click', $.proxy(this.applyFilter, this));
                this._buttonsBlock.append(this._btnApply);
            }

            if (this.options.showClearButton) {
                this._btnClear = $('<a href="javascript:void(0)"></a>')
                    .addClass('eqjs-fb-button eqjs-fb-button-clear')
                    .text(EQ.core.getText('ButtonClear'))
                    .on('click', $.proxy(this.clearFilter, this));
                this._buttonsBlock.append(this._btnClear);
            }

            $(window).resize(function () {
                self.textResize(self);
            });

            setTimeout(function () { self.textResize(self); }, 500);

            this._render();
        },

        textResize: function (self) {
            if (!self) {
                self = this;
            }
            self._headerTextBlock.css("width", self.element.width() - self._headerIconElement.outerWidth(true) - (self._headerArrowBlock.is(':visible') ? self._headerArrowBlock.outerWidth(true) : 0) + "px");
        },

        _render: function () {
            var self = this;

            this._headerIconElement.empty();
            if (this.options.useBootstrapIcons) {
                this._headerIconElement.append($('<span></span>')
                        .addClass('glyphicon glyphicon-filter')
                    );
            }

            this._updateHeader();
            this._qpElement.QueryPanel("refresh");

            this.textResize(self);
        },

        refresh: function () {
            this._render();
        },

        _updateHeader: function () {
            var text = this._query ? this._query.getConditionsText() : '';
            if (text == '') {
                text = EQ.core.getText('StrNoFilterDefined');
            }
            this._headerTextElement.text(text).attr('title', text);

            if (!this._query || this._query.isEmptyConditions()) {  //empty query, don't show query panel and arrow, show link in header
                this._headerTextElement.hide();
                this._headerLinkElement.show();
                if (!this._qpBlock.is(':visible')) {
                    this._headerArrowBlock.hide();
                    this._headerElement
                        .off('click.FilterBar')
                        .css('cursor', '');
                }
            }
            else {
                this._headerElement
                    .off('click.FilterBar')
                    .on('click.FilterBar', $.proxy(this._headerClickHandler, this))
                    .css('cursor', 'pointer');

                this._headerTextElement.show();
                this._headerLinkElement.hide();
                this._headerArrowBlock.show();
            }

            if (this._qpBlock.is(':visible')) {  // close query panel
                this._headerArrowElement.addClass('eqjs-fb-header-arrowUp');
            }
            else {
                this._headerArrowElement.removeClass('eqjs-fb-header-arrowUp');
            }

            this.textResize(this);
        }


    })
})(jQuery);﻿;(function ($, window) {

    //Ensure that global variables exist
    var EQ = window.EQ = window.EQ || {};


    /// <namespace name="EQ.view" version="1.0.0">
    /// <summary>
    /// Contains different functions for managing core EasyQuery pages (views): process user input, render result set, etc.
    /// </summary>
    /// </namespace>
    EQ.view = {

        EqDataTable: function (data) {
            if (typeof data === 'string') {
                this.table = JSON.parse(data);
            }
            else {
                this.table = data;
            }
        },

        beforeTableRendering: null,
        formatColumnHeader: null,
        formatGridCell: null,
        useEasyChart : false,
        
        //applies options commong for all "view" objects (like "view.basic", "view.grid" or "view.report")
        applyCommonOptions: function(options) {
            if (options.beforeTableRendering)
                this.beforeTableRendering = options.beforeTableRendering;
            if (options.formatColumnHeader)
                this.formatColumnHeader = options.formatColumnHeader;
            if (options.formatGridCell)
                this.formatGridCell = options.formatGridCell;
            if (typeof options.useEasyChart !== "undefined")
                this.useEasyChart = options.useEasyChart;
        },

        isGoogleVisualizationDefined: function () {
            return (typeof google != 'undefined') && (typeof google.visualization != 'undefined');
        },

        isGoogleChartDefined: function () {
            return this.isGoogleVisualizationDefined() && (typeof google.visualization.PieChart != 'undefined');
        },

        getDataTableClass: function () {
            var result = this.EqDataTable;
            if (this.isGoogleVisualizationDefined() && (typeof google.visualization.DataTable != 'undefined')) {
                result = google.visualization.DataTable;
            }
            return result;
        },

        renderGridByDataTable: function (dataTable) {
            if (this.beforeTableRendering)
                this.beforeTableRendering(dataTable);

            var tbl = $('<table></table>').css('width', '100%');

            var colCount = dataTable.getNumberOfColumns();
            for (var i = 0; i < colCount; i++) {
                var colLabel = dataTable.getColumnLabel(i);
                if (this.formatColumnHeader)
                    colLabel = this.formatColumnHeader(dataTable, i, colLabel);
                tbl.append('<th>' + colLabel + '</th>');
            }
            tbl.wrapInner('<tr class="result-grid-header"></tr>');

            var rowCount = dataTable.getNumberOfRows();
            for (i = 0; i < rowCount; i++) {
                var trbody = '';
                for (var j = 0; j < colCount; j++) {
                    var val = dataTable.getFormattedValue(i, j);
                    if (this.formatGridCell)
                        val = this.formatGridCell(dataTable, i, j, val);
                    var td = '<td>' + val + '</td>';
                    trbody += td;
                }
                tbl.append('<tr>' + trbody + '</tr>');
            }

            return tbl;
        },

        renderGridOldStyle: function (resultSet) {
            var tbl = $('<table />').css('width', '100%');

            for (var i = 0; i < resultSet.cols.length; i++) {
                tbl.append('<th>' + resultSet.cols[i] + '</th>');
            }

            tbl.wrapInner('<tr class="result-grid-header"></tr>');
            for (i = 0; i < resultSet.rows.length; i++) {
                var trbody = '';
                var row = resultSet.rows[i];

                for (var j = 0; j < row.length; j++) {
                    trbody += '<td>' + row[j] + '</td>';
                }
                tbl.append('<tr>' + trbody + '</tr>');
            }
            return tbl;
        },

        renderPageNavigator: function (options) {
            var pageIndex = options.pageIndex || 1;
            var pageCount = options.pageCount || 1;

            var buttonClick = function () {
                var pageNum = $(this).data("page");
                if (options.pageSelectedCallback)
                    options.pageSelectedCallback(pageNum);
                //do nothing by default
            };

            var maxButtonCount = options.maxButtonCount || 10;

            var zeroBasedIndex = pageIndex - 1;
            var firstPageIndex = zeroBasedIndex - (zeroBasedIndex % maxButtonCount) + 1;
            var lastPageIndex = firstPageIndex + maxButtonCount - 1;
            if (lastPageIndex > pageCount)
                lastPageIndex = pageCount;

            var ul = $("<ul></ul>");
            if (EQ.client.useBootstrap) {
                ul.addClass("pagination");
            }
            else {
                ul.addClass("eqview-pagination");
            }
            if (options.cssClass)
                ul.addClass(options.cssClass);

            var li = $("<li></li>");
            var a = $("<span aria-hidden='true'>&laquo;</span>");
            if (firstPageIndex == 1) {
                li.addClass("disabled");
            }
            else {
                a = $("<a href='javascript:void(0)' data-page='" + (firstPageIndex - 1) + "'></a>").append(a);
                a.on("click", buttonClick);
            }
            li.append(a);
            ul.append(li);

            for (var i = firstPageIndex; i <= lastPageIndex; i++) {
                li = $("<li></li>");
                if (i == pageIndex)
                    li.addClass("active");
                a = $("<a href='javascript:void(0)' data-page='" + i + "'>" + i + "</a>");
                a.on("click", buttonClick);
                li.append(a);
                ul.append(li);
            }

            li = $("<li></li>");
            a = $("<span aria-hidden='true'>&raquo;</span>");
            if (lastPageIndex == pageCount) {
                li.addClass("disabled");
            }
            else {
                a = $("<a href='javascript:void(0)' data-page='" + (lastPageIndex + 1) + "'></a>").append(a);
                a.on("click", buttonClick);
            }
            li.append(a);
            ul.append(li);

            return ul;
        },

        _prepareForChart: function (dataTable) {
            if (!this.isGoogleChartDefined()) return false;
            if (dataTable.getNumberOfColumns() < 2) return false;
            var type1 = dataTable.getColumnType(0);
            if (type1 != "string") return false;
            if (dataTable.getColumnType(1) != "number") return false;

            return true;
        },



        drawChart: function (dataTable, placeHolder, options) {
            if (this.useEasyChart) {
                this.drawEasyChart(dataTable, placeHolder, options);
            }
            else {
                this.drawSimpleChart(dataTable, placeHolder, options);
            }
        },

        drawSimpleChart: function(dataTable, placeHolder, options){
            if (this._prepareForChart(dataTable)) {
                // Set chart options
                options = options || { 'width': 300 };

                // Instantiate and draw our chart, passing in some options.
                var chart = new google.visualization.PieChart(placeHolder);
                chart.draw(dataTable, options);
            }
        },

        drawEasyChart: function (dataTable, placeHolder, options) {
            var self = this;
            options = options || { 'width': 300 };
            var chartElement =  $(placeHolder);
            chartElement.EasyChart(options);
            chartElement.EasyChart("init", dataTable, this.chartState, function (state) {
                self.chartState = state;
            });
        }

    };


    EQ.view.EqDataTable.prototype = {
        getNumberOfColumns: function () {
            return this.table.cols.length;
        },

        getColumnObject: function(colIndex) {
            return colIndex < this.table.cols.length ? this.table.cols[colIndex] : null;
        }, 

        getColumnId: function (colIndex) {
            var col = this.getColumnObject(colIndex);
            return col ? col.id : null;
        },

        getColumnLabel: function (colIndex) {
            var col = this.getColumnObject(colIndex);
            return col ? col.label : null;
        },

        getColumnType: function (colIndex) {
            var col = this.getColumnObject(colIndex);
            return col ? col.type : null;
        },

        getColumnProperties: function(colIndex) {
            var col = this.getColumnObject(colIndex);
            return col ? col.p : null;
        },

        getNumberOfRows: function () {
            return this.table.rows.length;
        },

        getFormattedValue: function (rowIndex, colIndex) {
            var row = rowIndex < this.table.rows.length ? this.table.rows[rowIndex] : null;
            if (row) {
                var cell = colIndex < this.table.cols.length ? row.c[colIndex] : null;
                if (cell) {
                    if (typeof cell.f != 'undefined') {
                        return cell.f;
                    }

                    var v = cell.v;
                    var dt;
                    if (typeof v != 'undefined' && v !== null) {                    
                        var colType = this.getColumnType(colIndex);
                        if (colType == 'date' || colType == 'datetime') {
                            dt = eval("new " + v);
                            if (colType == 'date') {
                                v = dt.toLocaleDateString();
                            }
                            else {
                                v = dt.toLocaleString();
                            }
                        }
                        else if (colType == 'timeofday') {
                            dt = new Date();
                            dt.setHours(v[0], v[1], v[2], v[3]);
                            v = dt.toLocaleTimeString();
                        }

                    }
                    return v;
                }
            }
            return null;
        }
    };


})(jQuery, window);


