import Knex from 'knex'; //Os tipos do ts geralmente começam com letra maiúscula

export async function up(knex: Knex) {
    //Criar tabela
    return knex.schema.createTable('item', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    });
}

export async function down(knex: Knex) {
    //Desfaz tabela
    return knex.schema.dropTable('item');
}