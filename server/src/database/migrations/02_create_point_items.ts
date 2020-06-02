import Knex from 'knex'; //Os tipos do ts geralmente começam com letra maiúscula

export async function up(knex: Knex) {
    //Criar tabela
    return knex.schema.createTable('point_item', table => {
        table.increments('id').primary();
        table.integer('point_id')
        .notNullable()
        .references('id')
        .inTable('point');
        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('item');
    });
}

export async function down(knex: Knex) {
    //Desfaz tabela
    return knex.schema.dropTable('point_item');
}