import { IAdaptableBlotter } from '../Core/Interface/IAdaptableBlotter'

//All custom pipelines should extend from pipelineBase
export let DataSourceBase = (<any>window).fin.Hypergrid.Base.extend('DataSourceIndexed', {

    replaceIndent: '_',

    isNullObject: true,

    drillDownCharMap: {
        OPEN: '\u25bc', // BLACK DOWN-POINTING TRIANGLE aka '▼'
        CLOSE: '\u25b6', // BLACK RIGHT-POINTING TRIANGLE aka '▶'
        undefined: '' // for leaf rows
    },
    initialize: function (dataSource: any) {
        this.dataSource = dataSource;
        if (this.type) {
            // find this type's DCI if already defined, else create it
            var pipe = dataSource;
            while (pipe) {
                if (pipe.type === this.type) {
                    /** @summary Data control interface.
                     * @desc A DCI is create for all data sources that have a defined type. Data sources that share the same type also share the same DCI instance.
                     */
                    this.controller = pipe.controller;
                    break;
                }
                pipe = pipe.dataSource;
            }
            if (this.controller === undefined) {
                this.controller = this.newController();
            }
        }
    },

    // GETTERS/SETTERS

    get schema() {
        if (this.dataSource) {
            return this.dataSource.schema;
        }
    },
    set schema(schema) {
        if (this.dataSource) {
            this.dataSource.schema = schema;
        }
    },
    // "SET" METHODS (ALWAYS HAVE ARGS)

    setSchema: function () {
        if (this.dataSource) {
            return this.dataSource.setSchema.apply(this.dataSource, arguments);
        }
    },

    setData: function () {
        if (this.dataSource) {
            return this.dataSource.setData.apply(this.dataSource, arguments);
        }
    },

    setValue: function () {
        if (this.dataSource) {
            return this.dataSource.setValue.apply(this.dataSource, arguments);
        }
    },    /**
     * @summary Set the `controller` property of the matching data source(s).
     * @param {string} type - Refers to _all_ data sources in the pipeline with matching `type` property.
     * @param {undefined|*} controller - If `undefined`, resets the DCI.
     * @returns {undefined|*} - `controller` or a null DCI generated by data model if `controller` is falsy or `undefined` if no such type.
     * @memberOf DataSourceBase#
     */
    setController: function (type: any, controller: any) {
        var result: any, pipe: any;

        if (controller === undefined) {
            controller = this.newController.call(pipe);
        }

        pipe = this;
        do {
            if (pipe.type === type) {
                result = pipe.controller = controller;
            }
            pipe = pipe.dataSource;
        } while (pipe);

        return result;
    },

    /**
     * @summary Get the DCI (`controller` property) of the first matching data source.
     * @param {string} type - Refers to first data source in the pipeline with matching `type` property. (All such data sources share the same value.)
     * @returns {undefined|*} The DCI; or `undefined` if no such type.
     * @memberOf DataSourceBase#
     */
    getController: function (type: any) {
        var pipe: any;

        pipe = this;
        do {
            if (pipe.type === type) {
                return pipe.controller;
            }
            pipe = pipe.dataSource;
        } while (pipe);
    },


    // "GET" METHODS WITHOUT ARGS

    getSchema: function () {
        if (this.dataSource) {
            return this.dataSource.getSchema();
        }
    },

    getRowCount: function () {
        if (this.dataSource) {
            return this.dataSource.getRowCount();
        }
    },

    getColumnCount: function () {
        if (this.dataSource) {
            return this.dataSource.getColumnCount();
        }
    },

    getGrandTotals: function () {
        //row: Ideally this should be set and get bottom/top totals
        //Currently this function is just sending the same for both in aggregations
        if (this.dataSource) {
            return this.dataSource.getGrandTotals();
        }
    },


    // "GET" METHODS WITH ARGS

    getProperty: function getProperty(propName: any) {
        if (propName in this) {
            return this[propName];
        }

        if (this.dataSource) {
            return getProperty.call(this.dataSource, propName);
        }
    },

    getDataIndex: function () {
        if (this.dataSource) {
            return this.dataSource.getDataIndex.apply(this.dataSource, arguments);
        }
    },

    getRow: function () {
        if (this.dataSource) {
            return this.dataSource.getRow.apply(this.dataSource, arguments);
        }
    },

    findRow: function () {
        if (this.dataSource) {
            return this.dataSource.findRow.apply(this.dataSource, arguments);
        }
    },

    revealRow: function () {
        if (this.dataSource) {
            return this.dataSource.revealRow.apply(this.dataSource, arguments);
        }
    },

    getValue: function () {
        if (this.dataSource) {
            return this.dataSource.getValue.apply(this.dataSource, arguments);
        }
    },

    click: function () {
        if (this.dataSource) {
            return this.dataSource.click.apply(this.dataSource, arguments);
        }
    },


    // BOOLEAN METHODS

    isDrillDown: function (colIndex: any) {
        if (this.dataSource) {
            return this.dataSource.isDrillDown(colIndex);
        }
    },

    viewMakesSense: function () {
        if (this.dataSource) {
            return this.dataSource.viewMakesSense();
        }
    },


    // OTHER METHODS

    apply: function () {
        throw 'Nothing to apply.';
    },


    /**
     * Get new object with name and index given the name or the index.
     * @param {string|number} columnOrIndex - Column name or index.
     * @returns {{name: string, index: number}}
     */
    getColumnInfo: function (columnOrIndex: any) {
        var name: any, index: any, result: any;

        if (typeof columnOrIndex === 'number') {
            index = columnOrIndex;
            name = this.schema[index].name;
        } else {
            name = columnOrIndex;
            index = this.schema.findIndex(function (columnSchema: any) {
                return columnSchema.name === name;
            });
        }

        if (name && index >= 0) {
            result = {
                name: name,
                index: index
            };
        }

        return result;
    },

    fixIndentForTableDisplay: function (string: any) {
        var count = string.search(/\S/);
        var end = string.substring(count);
        var result = Array(count + 1).join(this.replaceIndent) + end;
        return result;
    },

    dump: function (max: number) {
        max = Math.min(this.getRowCount(), max || Math.max(100, this.getRowCount()));
        var data: any[] = [];
        var fields: any[] = this.schema ? this.schema.map(function (cs: any) { return cs.name; }) : this.getHeaders();
        var cCount = this.getColumnCount();
        var viewMakesSense = this.viewMakesSense;
        for (var r = 0; r < max; r++) {
            var row: any[] = [];
            for (var c = 0; c < cCount; c++) {
                var val = this.getValue(c, r);
                if (c === 0 && viewMakesSense) {
                    val = this.fixIndentForTableDisplay(val);
                }
                row[fields[c]] = val;
            }
            data[r] = row;
        }
        console.table(data);
    }
});