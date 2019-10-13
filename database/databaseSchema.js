/*
*  DataBase Schema
*
*/

exports.migration = function(knex) {

// Users Table
knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
     knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name', 256);
      table.string('bussiness_email', 256);
      table.string('email', 256);
      table.string('password', 256);
      table.string('gstno', 256);
      table.string('logo', 256);
      table.string('address', 256);
      table.string('mobile', 256);
      table.string('remember_token', 256);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    }).then(function(){
      knex
      .insert({
        name:"ARS Technologies Alwar-Rajasthan",
        bussiness_email:"contact@arsdevelopers.com",
        email:"contact@arsdevelopers.com",
        address:"Alwar-Rajasthan",
        mobile:"9509249443",
      })
      .into('users')
      .then( function (result) { });   
    });
    
  }
  return;
});

// Expance Table
knex.schema.hasTable('expance').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('expance', function(table) {
      table.increments('id').primary();
      table.string('title', 256);
      table.string('amount', 256);
      table.string('comment', 256);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
});


// Invoice Table
knex.schema.hasTable('invoice').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('invoice', function(table) {
      table.increments('id').primary();
      table.integer('stock_id', 11);
      table.string('customer_name', 256);
      table.string('customer_address', 256);
      table.string('customer_mobile', 256);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
});

// Product
knex.schema.hasTable('products').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('products', function(table) {
      table.increments('id').primary();
      table.string('company', 256);
      table.string('model', 256);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
});


// Product Stock
knex.schema.hasTable('productstock').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('productstock', function(table) {
      table.increments('id').primary();
      table.integer('vendor_id', 11);
      table.integer('product_id', 11);
      table.string('purchase_rate', 256);
      table.string('sale_rate', 256);
      table.string('imei_or_serial1', 256);
      table.string('imei_or_serial2', 256);
      table.string('imei_or_serial3', 256);
      table.integer('product_status', 11).defaultTo(1);
      table.timestamp('sale_at', 6);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
});

// Vendors
knex.schema.hasTable('vendors').then(function(exists) {
  if (!exists) {
    return knex.schema.createTable('vendors', function(table) {
      table.increments('id').primary();
      table.string('name', 256);
      table.string('city', 256);
      table.string('address', 256);
      table.string('email', 256);
      table.string('mobile', 256);
      table.string('gstno', 256);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  }
});

}

