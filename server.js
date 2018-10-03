var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.post('/rest/count', function (req, res) {
	console.log("inside");
})

app.get('/*', function (req, res) {
	//   console.log("request",req)
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// let's set the port on which the server will run
app.set('port', 3003);
// start the server
app.listen(
	app.get('port'),
	() => {
		const port = app.get('port');
		console.log('Server Running at http://127.0.0.1' + port);
	}
);
