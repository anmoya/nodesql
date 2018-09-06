const express   = require('express');
const app       = express();
var fs = require('fs');
var pdf = require('html-pdf');
var html = null;
var options = { format: 'Letter', orientation: 'portrait' };
var ejs = require('ejs');

const mongoose  = require('mongoose');

mongoose.connect('mongodb://sphoidldoh:@ds245512.mlab.com:45512/shiloh');
var authorSchema = new mongoose.Schema({
    authorName: String,
    authorLastName : String,
    authorCountry : String,
    authorCity : String,
    authorBio : String,
    authorBornDate : { type: Date, default: Date.now }
});

var Author = mongoose.model('Author', authorSchema);

app.get('/', (req, res) => {
    Author.find({}, (err, allAuthors) => {
        if (err) console.log(err);
        else {
            ejs.renderFile('./views/reporteautores/index.ejs', { data : allAuthors }, (err, result) => {
                if (result) {
                    html = result;
                }
                else {
                    res.send('An error ocurred');
                    console.log(err);
                }
            });

            pdf.create(html, options).toBuffer( (err, buffer) => {
                if (err) return res.send(err);
                res.type('pdf');
                res.end(buffer, 'binary');
            });
            //res.render('reporteautores/index.ejs', { data : allAuthors });
        }
    });
    
});

app.listen(5001,'localhost', () => {
    console.log('Servidor corriendo...');
});