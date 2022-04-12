const express = require('express');
const app = express();
const garments = require('./garments.json');



const bodyParser = require('body-parser')
// enable the req.body object - to allow us to use HTML forms
// when doing post requests
// put this before you declare any routes

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// enable the static folder...
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// app.engine('handlebars', exphbs({ defaultLayout: 'main', layoutsDir: __dirname + '/images' }));
app.set('view engine', 'express.handlebars');

// import the dataset to be used here

const PORT = process.env.PORT || 4017;

// API routes to be added here



app.get('/api/garments', function (req, res) {

    const gender = req.query.gender;
    const season = req.query.season;

    const filteredGarments = garments.filter(garment => {
        // if both gender & season was supplied
        if (gender != 'All' && season != 'All') {
            return garment.gender === gender
                && garment.season === season;
        } else if (gender != 'All') { // if gender was supplied
            return garment.gender === gender
        } else if (season != 'All') { // if season was supplied
            return garment.season === season
        }
        return true;
    });

    // note that this route just send JSON data to the browser
    // there is no template
    res.json({
        garments: filteredGarments
    });
});

function filterData() {
    axios
        .get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`)
        .then(function (result) {
            searchResultsElem.innerHTML = garmentsTemplate({
                garments: result.data.garments
            })
        });
}

app.get('/api/garments/price/:price', function (req, res) {
    const maxPrice = Number(req.params.price);
    const filteredGarments = garments.filter(garment => {
        // filter only if the maxPrice is bigger than maxPrice
        if (maxPrice > 0) {
            return garment.price <= maxPrice;
        }
        return true;
    });

    res.json({
        garments: filteredGarments
    });
});

app.post('/api/garments', (req, res) => {

    // get the fields send in from req.body
    const {
        description,
        img,
        gender,
        season,
        price
    } = req.body;
    console.log(req.body);
    // add some validation to see if all the fields are there.
    // only 3 fields are made mandatory here
    // you can change that

    if (!description || !img || !price) {
        res.json({
            status: 'error',
            message: 'Required data not supplied',
        });
    } else {

        // you can check for duplicates here using garments.find

        // add a new entry into the garments list
        garments.push({
            description,
            img,
            gender,
            season,
            price
        });

        res.json({
            status: 'success',
            message: 'New garment added.',
        });
    }

});


app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`)
});