var express = require('express');
var app     = express();
const sql = require('mssql');

app.get('/', (req, res) => {

    var config = {
        user: 'prod',
        password: 'facture',
        server: '10.1.1.107',
        database: 'prod'
    }

    sql.connect(config, (err) => {
        if (err) console.log(err);

        var request = new sql.Request();

        request.query('select * from empr_hold', (err, recordset) => {
            if (err) console.log(err);

            res.send(recordset);
            sql.close();
        });
    });

});

app.get('/rechazados/:rut', (req, res) => {
    

    var config = {
        user: 'prod',
        password: 'facture',
        server: '10.1.1.107',
        database: 'prod'
    }

    sql.connect(config, (err) => {
        if (err) console.log(err);

        var request = new sql.Request();

        request.query(`select top 10 * from dte_enca_docu_hold where esta_docu = 'RCH' and rutt_emis = ${req.params.rut}`, (err, recordset) => {
            if (err) console.log(err);
            var texto = '';
            
            res.render('rechazados/index.ejs', { documentos : recordset });
            sql.close();
        });
    }); 

});

app.get('/aceptados/:rut', (req, res) => {
    

    var config = {
        user: 'prod',
        password: 'facture',
        server: '10.1.1.107',
        database: 'prod'
    }

    sql.connect(config, (err) => {
        if (err) console.log(err);

        var request = new sql.Request();

        request.query(`select top 10 * from dte_enca_docu_hold where esta_docu = 'DOK' and rutt_emis = ${req.params.rut}`, (err, recordset) => {
            if (err) console.log(err);
            var texto = '';
            
            res.render('rechazados/index.ejs', { documentos : recordset });
            sql.close();
        });
    }); 

});

app.listen(5002,'localhost', () => {
    console.log('Corriendo...');
});