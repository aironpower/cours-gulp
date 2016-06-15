/**
 * Test
 * Require permet de définir toutes les dépendances dont on a besoin
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');

/**
 * On crée un objet pour gérer les différents chemins
 * src correspond aux fichiers sources,
 * dist correspond aux fichiers de sortie (output)
 */
var path = {
	src: {
		markup: 'src/markup/', // Pourrait être du Markdown, Pug, etc.
		styles: 'src/scss/', // Peut-être du Sass, Less, Stylus, voire du CSS.
		scripts: 'src/js/', // Javascript, Coffee-sript, etc.
		images: 'src/img/' // Les images à utiliser (en CSS ou autre)
	},
	dist: {
		markup: 'dist/',
		styles: 'dist/assets/css/',
		scripts: 'dist/assets/js/',
		images: 'dist/assets/img/',
		maps: '../maps/' // maps est particulier, le chemin est relatif au fichier de sortie, pas à la racine
	}
};


/**
 * Tâche Styles: compile et compresse les fichiers sass
 * ajoute les préfixes automatiquement
 * crée un fichier map
 * envoie le fichier css dans le dossier dist
 */
gulp.task('styles', function() {
	return gulp.src(path.src.styles + 'main.scss') //  Chemin du fichier source à "builder"
		.pipe(sourcemaps.init()) // Début du pipe "sourcemaps"
		.pipe(autoprefixer({ // sert à ajouter les préfixes navigateurs
			browser: ['last 3 versions'] // options: checker les 3 dernières versions (cf. caniuse.com)
		}))
		.pipe(sass({ // process sass : compile les fichier sass
			outputStyle: 'compressed' // option : compression maximale du fichier de sortie
		}).on('error', sass.logError))
		.pipe(sourcemaps.write(path.dist.maps)) // fin du pipe "sourcemaps": écriture du fichier
		.pipe(gulp.dest(path.dist.styles)) // envoi du fichier final (output) dans le deossier de destination
		.pipe(livereload()); // Rechargement du navigateur
});

/**
 * Scripts: concatène et compresse les JS
 */
gulp.task('scripts', function() {
	return gulp.src([ // On donne plusieurs chemins possibles comme source dans un array. L'intérêt est de créer un ordre de priorité.
			path.src.scripts + 'vendors/*.js',
			path.src.scripts + 'plugins/*.js',
			path.src.scripts + '*.js'
		])
		.pipe(sourcemaps.init()) // pipe sourcemap (cf. styles)
		.pipe(uglify({ // permet de minifier au maximum les fichiers js
			preserveComments: 'some' // option: on garde les commentaires qui ont un !
		}))
		.pipe(concat('main.min.js')) // on importe tous les fichiers JS dans un seul fichier de sortie, nommé "main.min.js"
		.pipe(sourcemaps.write(path.dist.maps)) // écriture du sourcemap
		.pipe(gulp.dest(path.dist.scripts)) // on place le fichier final (output) dans le dossier de destination
		.pipe(livereload()); // Rechargment du navigateur
});

/**
 * Tâche reload -> rechargement auto de la page dans le navigateur
 * Nécessite un plugin "livereload" à installer sur votre navigateur préféré
 */
gulp.task('reload', function() {
	livereload();
});

/**
 * Watch: permet de bosser sans avoir à relance les commandes en CLI
 * À chaque fois qu'un des fichiers matche, on lance une tâche et on recharge le navigateur
 */
gulp.task('watch', function() {
	livereload.listen(); // On lance un "écouteur" pour livereload
	gulp.watch(path.src.styles + '**/*.scss', ['styles']); // On écoute tous les fichiers .scss, et on lance la tâche "styles"
	gulp.watch(path.src.scripts + '**/*.js', ['scripts']); // Idem fichiers js
});

/**
 * Build: une tâche qui lance toutes les compilations
 */
gulp.task('build', ['styles', 'scripts'], function() {});
