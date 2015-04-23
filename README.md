# gulp-cordova-create

> First step in creating a cordova project with gulp

## Installation

```bash
npm install --save-dev gulp-cordova-create
```

**Not yet available**

## Usage

```JavaScript
var gulp = require('gulp'),
    create = require('gulp-cordova-create');

gulp.task('build', function() {
    return gulp.src('www')
        .pipe(create());
});
```

This will generate a Cordova project in the ```.cordova``` directory. It will use directory
provided in ```gulp.src``` for the contents of the ```www``` directory.

## Related

See [`gulp-cordova-plugin`](https://github.com/SamVerschueren/gulp-cordova-plugin) for adding a plugin to your cordova project.

## Contributors

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren
