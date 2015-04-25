/*
 * List Deps
 */

 var async = require('async');

/*
 * @method paginate
 * @param {Object} query Mongoose Query Object
 * @param {Object} options
 * Extend Mongoose Models to paginate queries
 */

function paginate(q, options, callback) {
    var model = this;

    options = options || {};
    callback = callback || function() {};

    var page = options.page || 1;
    var limit = options.limit || 10;
    var columns = options.columns || null;
    var sortBy = options.sortBy || null;
    var populate = options.populate || null;
    var lean = options.lean || false;
    var skip = (page * limit) - limit;

    var query = model.find(q);
    if (columns !== null) {
        query = query.select(columns);
    }
    query = query.skip(skip).limit(limit);
    if (sortBy !== null) {
        query.sort(sortBy);
    }
    if (populate) {
        if (Array.isArray(populate)) {
            populate.forEach(function(field) {
                query = query.populate(field);
            });
        } else {
            query = query.populate(populate);
        }
    }
    if (lean) {
        query.lean();
    }

    async.parallel({
        results: function(callback) {
            query.exec(callback);
        },
        count: function(callback) {
            model.count(q, function(err, count) {
                callback(err, count);
            });
        }
    }, function(error, data) {
        if (error) {
            return callback(error);
        }
        callback(null, data.results, data.count, Math.ceil(data.count / limit) || 1);
    });
}

module.exports = function(schema) {
    schema.statics.paginate = paginate;
};
