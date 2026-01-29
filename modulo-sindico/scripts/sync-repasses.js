
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

// Configuração do Banco de Dados
const dbConfig = {
    host: 'show.e4sistemas.com.br',
    user: 'bi_00002',
    password: ':Bi107574#',
    database: 'e4_show',
    port: 5432,
    ssl: { rejectUnauthorized: false } // Tentativa com SSL
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../app/public/data');

// Garantir diretório
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Função para converter JSON array para CSV
function jsonToCsv(items) {
    if (!items || items.length === 0) return '';
    const replacer = (key, value) => value === null ? '' : value; // Handle nulls e.g. undefined
    const header = Object.keys(items[0]);
    const csv = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');
    return csv;
}

async function run() {
    const client = new Client(dbConfig);

    try {
        console.log('Conectando ao banco de dados...');
        await client.connect();
        console.log('Conectado!');

        // 1. Tabela Repasses
        console.log('Baixando tabela: repasses...');
        const resRepasses = await client.query('SELECT * FROM repasses');
        const csvRepasses = jsonToCsv(resRepasses.rows);
        fs.writeFileSync(path.join(DATA_DIR, 'repasse.csv'), csvRepasses);
        console.log(`Salvo repasse.csv com ${resRepasses.rowCount} registros.`);

        // 2. Tabela Repasses Registros (Detalhes)
        // console.log('Baixando tabela: repasses_registros...');
        // const resRegistros = await client.query('SELECT * FROM repasses_registros');
        // const csvRegistros = jsonToCsv(resRegistros.rows);
        // fs.writeFileSync(path.join(DATA_DIR, 'repasses_registros.csv'), csvRegistros);
        // console.log(`Salvo repasses_registros.csv com ${resRegistros.rowCount} registros.`);

        // Nota: Comentei repasses_registros por enquanto para validar primeiro a conexão com a tabela principal

    } catch (err) {
        console.error('Erro durante a sincronização:', err);
    } finally {
        await client.end();
    }
}

run();
