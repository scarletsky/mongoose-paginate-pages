var assert = require('assert');
var async = require('async');
var should = require('should');
var mongoose = require('mongoose');
var paginate = require('../lib/mongoose-paginate-pages');

mongoose.connect(process.env.MONGO_DB || 'mongodb://localhost/test');

var PostSchema = new mongoose.Schema({
    index: Number,
    title: String
});
PostSchema.plugin(paginate);
var Post = mongoose.model('posts', PostSchema);

describe('Paginate', function() {

    before(function(done) {
        var array = [];
        for (var i = 1; i <= 100; i++) {
            array.push(i);
        }

        async.eachSeries(array, function(i, callback) {
            new Post({title: 'this is title ' + i, index: i}).save(function(err) {
                callback();
            });
        }, function(err) {
            done();
        })
    });

    after(function(done) {
        Post.remove({}, function(err) {
            done();
        })
    });

    it('should return three params: results, totalRecords, pagesCount', function(done){
        Post.paginate({}, {page: 1, sortBy: 'index'}, function(err, results, total, pages) {
            typeof(results).should.be.a.Array;
            typeof(total).should.be.a.Number;
            typeof(pages).should.be.a.Number;

            results.length.should.equal(10);
            total.should.equal(100);
            pages.should.equal(10);

            done();
        })
    });

    it('should paginate well with page params', function(done) {

        async.parallel([
            function(callback) {
                Post.paginate({}, {page: 2, sortBy: 'index'}, function(err, results) {
                    results[0].index.should.equal(11);
                    results[4].index.should.equal(15);
                    results[9].index.should.equal(20);
                    callback();
                });
            },
            function(callback) {
                Post.paginate({}, {page: 6, sortBy: 'index'}, function(err, results) {
                    results[0].index.should.equal(51);
                    results[3].index.should.equal(54);
                    results[6].index.should.equal(57);
                    callback();
                });
            }
        ], function(err) {
            done();
        });
    });

    it('should paginate well with page and limit params', function(done) {
        async.parallel([
            function(callback) {
                Post.paginate({}, {page: 3, limit: 3, sortBy: 'index'}, function(err, results) {
                    results.length.should.equal(3);
                    results[0].index.should.equal(7);
                    results[1].index.should.equal(8);
                    callback();
                });
            },
            function(callback) {
                Post.paginate({}, {page: 6, limit: 6, sortBy: 'index'}, function(err, results) {
                    results.length.should.equal(6);
                    results[2].index.should.equal(33);
                    results[4].index.should.equal(35);
                    callback();
                });
            }
        ], function(err) {
            done();
        });
    });

});
