import knex from 'knex';
import path from 'path';

const connection = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')//__dirname retorna o caminho do arquivo no diretório em que é chamado
    },
    useNullAsDefault: true,//permite que o banco receba valores null por padrão
});

export default connection;