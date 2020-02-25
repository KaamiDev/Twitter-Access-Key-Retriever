const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/main.js'));
app.use('/add', require('./routes/addacc.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('Now listening on port ' + PORT);
});
