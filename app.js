//npm start
//nodemon

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

//init app
const app = express();

//view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser
app.use(bodyParser.urlencoded({ extend: false }));
//parse application
app.use(bodyParser.json());

//Public folder
app.use(express.static(path.join(__dirname, 'public')));



// home 
app.get('/', function (req, res) {
    res.render('index');
});

// make search
app.post('/search', function (req, res) {

    // app data
    let content = {

        brands: ["Gap", "Banana Republic", "Boss", "Hugo Boss", "Taylor", "Rebecca Taylor"],
        clothingT: ["Denim", "Pants", "Sweaters", "Skirts", "Dresses"]

    };

    var searchInp = req.body.search; //input from layout form

    let analysis ={}; // contains the appearances of brands and clothes
   
    var results = []; // all possible responses

    for (const [key, value] of Object.entries(content)) {
        for (element in value) {
            var word = value[element];
            var pathern = new RegExp(word, "ig");
            let m;

            while ((m = pathern.exec(searchInp)) !== null) {
                // To avoid zero
                if (m.index === pathern.lastIndex) {
                    pathern.lastIndex++;
                }
                
                // filling the dict
                if(!(word in analysis)){
                    analysis[word]=1;
                } else {
                    analysis[word] ++;
                }

                // acording to the type change the tag
                if (key == "brands") var newText = "<b>" + m[0] + "</b>";
                else var newText = "<ins><i>" + m[0] + "</i></ins>"
                
                results.push({ content: searchInp.replace(m[0], newText), type: key })
            }
        }
    }

    // console.log(results);
    // console.log(analysis);

    //send the different recognized words and # of appearances to the view
    res.render('results', {
        results: results,
        analysis: analysis
    });
});


//start server
app.listen(3000, function () {
    console.log('Server Started on port 3000...')
})
