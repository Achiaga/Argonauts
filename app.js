var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	flash = require('connect-flash'),
	seedDB = require('./seeds'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	User = require('./models/user'),
	methodOverride = require('method-override');

// Requiring Routes
var commentsRoutes = require('./routes/comments'),
	campgroundsRoutes = require('./routes/campgrounds'),
	indexRoutes = require('./routes/index');

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//seedDB(); // seed the data base

// PASSPORT configuration
app.use(
	require('express-session')({
		secret: 'Fonsi Musk is the best',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);
app.use('/campgrounds', campgroundsRoutes);

mongoose
	.connect(
		`mongodb+srv://Musk:Qf0u3RpiKsUFBaty@cluster0-e7g9i.mongodb.net/test?retryWrites=true&w=majority`
	)
	.then(() => {
		app.listen(port, function() {
			console.log('Our app is running on http://localhost:' + port);
		});
	})
	.catch(err => {
		console.log(err);
	});
