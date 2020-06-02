import Knex from 'knex'; //Os tipos do ts geralmente começam com letra maiúscula

export async function up(knex: Knex) {
    //Criar tabela
    return knex.schema.createTable('point', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
    });
}

export async function down(knex: Knex) {
    //Desfaz tabela
    return knex.schema.dropTable('point');
}