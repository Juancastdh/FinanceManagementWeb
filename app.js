const express = require('express');
const port = 3000;

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Successful response.');
});

app.listen(port, () => console.log('Listening on port ' + port + '.'));