/* @flow */

const del = require("del");
const gulp = require("gulp");
const babel = require("gulp-babel");
const mocha = require("gulp-mocha");
const sourcemaps = require("gulp-sourcemaps");
const rollup = require("rollup").rollup;
const rollupAlias = require("rollup-plugin-alias");
const rollupCommonjs = require("rollup-plugin-commonjs");
const rollupReplace = require("rollup-plugin-replace");
const rollupResolve = require("rollup-plugin-node-resolve");
const rollupSourcemaps = require("rollup-plugin-sourcemaps");
const rollupUglify = require("rollup-plugin-uglify").uglify;

function _rollup(input, file, env) {
    return rollup({
        input,
        plugins: ([
            rollupSourcemaps(),
            rollupReplace({
                "process.env.NODE_ENV": JSON.stringify(env),
            }),
            rollupAlias({
                "flow-runtime": require.resolve("flow-runtime/dist/flow-runtime.umd.js"),
            }),
            rollupResolve(),
            rollupCommonjs(),
        ]).concat(env === "production" ? [
            rollupUglify(),
        ] : []),
    }).then(bundle => {
        bundle.write({
            file,
            format: "umd",
            name: "postfix",
            sourcemap: true,
        });
    });
};

gulp.task("clean", () =>
    del([
        "cjs/",
        "esm/",
        "dist/",
    ]),
);

gulp.task("build:esm", () =>
    gulp
        .src("src/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel({
            plugins: [
                "@babel/plugin-transform-runtime",
                [
                    "babel-plugin-flow-runtime",
                    {
                        assert: true,
                    },
                ],
            ],
            presets: [
                [
                    "@babel/preset-env",
                    {
                        modules: false,
                    },
                ],
                "@babel/preset-flow",
            ],
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("esm/")),
);

gulp.task("build:cjs", () =>
    gulp
        .src("esm/**/*.js")
        .pipe(sourcemaps.init({
            loadMaps: true,
        }))
        .pipe(babel({
            plugins: [
                "@babel/plugin-transform-modules-commonjs",
                "@babel/plugin-transform-runtime",
            ],
        }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("cjs/")),
);

gulp.task("test", () =>
    gulp
        .src("cjs/**/*.test.js", {
            read: false,
        })
        .pipe(mocha())
        .on("error", () =>
            process.exit(1),
        ),
);

gulp.task("bundle:development", () =>
    _rollup("./esm/index.umd.js", "./dist/postfix.js", "development"),
);

gulp.task("bundle:production", () =>
    _rollup("./esm/index.umd.js", "./dist/postfix.min.js", "production"),
);

gulp.task("default", gulp.series(
    "clean",
    "build:esm",
    "build:cjs",
    "test",
    "bundle:development",
    "bundle:production",
));
