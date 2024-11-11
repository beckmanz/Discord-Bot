const mongoose = require('mongoose');
const {ConnectionString} = require("../appsettings.json")
require('colors')

class Database {
    constructor() {
        this.connection = null;
    }

    connect() {
        console.log('⏳ Tentando conexão com banco de dados...'.blue);
        mongoose.connect(ConnectionString, {
        }).then(() => {
            console.log('✔️ Conectado com o banco de dados.'.white);
            this.connect = mongoose.connection;
        }).catch(err => {
            console.error(err);
        });
    }
}

module.exports = Database;