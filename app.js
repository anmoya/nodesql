const sql = require('mssql');
const fs = require('fs');
const base64 = require('base64topdf');

var obtenerBase64 = async (codi_emex, codi_empr, tipo_docu, foli_docu, foli_docu2) => {
    
    try {
        sql.close();
        const pool = await sql.connect('mssql://prod:facture@10.1.1.107/prod');
        let query = `select clob_docu from dte_docu_lob_hold with(nolock) where codi_emex = '${codi_emex}' and codi_empr = ${codi_empr} and tipo_docu = ${tipo_docu} and foli_docu between ${foli_docu} and ${foli_docu2} and tipo_Arch='XML';`;
        console.log(`Haré esta query: ${query}`);
        let result = await pool.request().query(query);
        //console.log(result);
        try {
            let contador = foli_docu;
            
            result.recordset.forEach( (item) => {
                let base64clob = item.clob_docu;
                let decodedBase64 = base64.base64Decode(base64clob, contador+'clob.xml');
                contador++;
                console.log('realizado folio: ' + contador);
            });
        } catch (error) {
            console.log('No pude, sigo con el otro folio');
        }
        sql.close();
    } catch (err) {
        sql.close();
        return console.log(err);
    }
};


obtenerBase64('PROD_0121', '1', '33', 101, 110);






/*

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
        var empr = obtenerEmpresa(req.params.rut, request);

        //var empr = request.query(`select * from empr_hold where rutt_empr = ${req.params.rut}`);
        console.log(empr);
        request.query(`select tipo_docu,foli_docu,esta_docu,count(*) from dte_enca_docu_hold where rutt_emis = ${req.params.rut}`, (err, recordset) => {
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

var obtenerEmpresa = (rut, request) => {
    request.query(`select * from empr_hold where rutt_empr = ${rut}`).then( (response) => {
        return response;
    });
};
*/