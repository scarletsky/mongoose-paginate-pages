# mongoose-paginate-pages

## Install

```bash
npm install mongoose-paginate-pages
```

## Usage

```javascript
var paginate = require('mongoose-paginate-pages');

Schema.plugin(paginate);

Model.paginate(query, options, function(err, results, total, pages) {
     ......   
});
```

- Options

  - `page`
  - `limit`
  - `lean`
  - `sortBy`
  - `columns`
  - `populate`

- Callback(err, results, total, pages)

  - `results` the results of query
  - `total` equals Model.count(query)
  - `pages` equals Math.ceil(total / limit)

## Test

```bash
npm install && npm test
```

## Thanks
[edwardhotchkiss/mongoose-paginate](https://github.com/edwardhotchkiss/mongoose-paginate)

## LISCENSE

MIT
