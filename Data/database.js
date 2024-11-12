const mongoose = require('mongoose');
const {ConnectionString} = require("../appsettings.json")
const Models = require("./Models");
require('colors')

class Database {
    constructor() {
        this.db = null;
    }

   async connect() {
        console.log('⏳ Tentando conexão com banco de dados...'.blue);
        await mongoose.connect(ConnectionString, {})
        console.log('✔️ Conectado com o banco de dados.'.white);
        this.db = { ...Models };
        return this.db;
    }
}

module.exports = Database;