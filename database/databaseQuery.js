/*
************************************************
*  Auther           : Er. Ashok Devatwal
*  File Description : Database Queries   
************************************************
*/

// Retrive User
exports.user = function(knex) {
    return knex.from('users').first();
}

// Retrive User Password
exports.userPassword = function(knex) {
    return knex.where('id',1).select('password').into('users').first();
}

// Update User By Welcome
exports.userUpdate = function(knex,data) {
    return knex.where('id',1).update(data).into('users');
}

// Retrive Expance By Id 
exports.expanceById = function(knex,id) {
    return knex.from('expance').where('id',id).first();
}

// Retirve Expance 
exports.expance = function(knex) {
    return knex.from('expance');
}

// Retrive Expance By Filter Dates
exports.expanceByFilterDates = function(knex,filterDates) {
    return knex.from('expance')
    .where('created_at','>=',filterDates.startDate)
    .where('created_at','<=',filterDates.endDate);
}

// Retrive Vendor By Id
exports.vendorById = function(knex,id) {
    return knex.from('vendors').where('id',id).first();
}

// Retrive Vendors
exports.vendors = function(knex) {
    return knex.from('vendors');
}

// Retrive Product By Id
exports.productById = function(knex,id) {
    return knex.from('products').where('id',id).first();
}

// Retrive Products
exports.products = function(knex) {
    return knex.from('products');
}

// Retrive Purchase By Id
exports.purchaseById = function(knex,id) {
    return knex.from('productstock').where('id',id).first();
}

// Retrive In-Stock Products
exports.inStockProductsName = function(knex) {
    return knex.from('productstock')
    .where('product_status',1)
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .select(
        'productstock.id', 
        'imei_or_serial1',
        knex.raw('products.company AS product_name'),
        'products.model'
    );
}

// Retrive Sold Product Full Name By Id
exports.soldProductNameById = function(knex,id) {
    return  knex.from('productstock')
    .where('productstock.id',id)
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .select(
        'productstock.id', 
        'imei_or_serial1',
        knex.raw('products.company AS product_name'),
        'products.model'
    )
    .first();
}

// Retrive Sold Product By Id
exports.soldProductById = function(knex,id) {
    return knex.table('productstock')
     .where('productstock.id',id)
     .innerJoin('invoice', 'productstock.id', '=', 'invoice.stock_id')
     .select(
       'productstock.id',
       'sale_at',
       'sale_rate',
       'product_id',
       'invoice.customer_name',
       'invoice.customer_address',
       'invoice.customer_mobile'
       )
     .first();
}

// Retrive Sold Products Count By Filter Dates
exports.soldProductsCountByFilterDates = function(knex,filterDates) {
    return knex.table('productstock')
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .where('product_status',0)
    .where('productstock.sale_at','>=',filterDates.startDate)
    .where('productstock.sale_at','<=',filterDates.endDate)
    .select( knex.raw('products.company AS product,products.model , Count(*) as sales') )
    .groupBy('product_id');
}

// Retrive Stock Prodcuts Count 
exports.stockProductsCount = function(knex) {
    return knex.table('productstock')
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .where('product_status',1)
    .select( knex.raw('products.company AS product,products.model , Count(*) as sales') )
    .groupBy('product_id');
}

// Retrive Stock Products 
exports.stockProducts = function(knex) {
    return knex.from('productstock')
    .where('product_status',1)
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .select(
        'productstock.id',
        knex.raw('products.company AS product_name'),
        'products.model',
        'imei_or_serial1',
        'imei_or_serial2',
        'imei_or_serial3',
        'purchase_rate',
        'productstock.created_at'
    );  
}

// Retrive Sold Products by Filter Dates 
exports.soldProductsByFilterDates = function(knex,filterDates) {
    return knex.table('productstock')
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .where('product_status',0)
    .where('productstock.sale_at','>=',filterDates.startDate)
    .where('productstock.sale_at','<=',filterDates.endDate)
    .select(
        'productstock.id',
        'imei_or_serial1',
        'sale_rate',
        'purchase_rate',
        knex.raw('products.company AS product'),
        'products.model'
    );
}

// Retrive Sold Product Revanue
exports.soldProductRevanueByFilterDates = function(knex,filterDates) {
    return  knex.from('productstock')
    .where('product_status',0)
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .where('productstock.sale_at','>=',filterDates.startDate)
    .where('productstock.sale_at','<=',filterDates.endDate)
    .select(
        'productstock.id',
        knex.raw('products.company AS product'),
        'products.model',
        'imei_or_serial1',
        'purchase_rate',
        'sale_rate',
        knex.raw('sale_rate-purchase_rate AS revanue')
    );
}

// Retrive Sold Products With Invoice Details by filter dates
exports.soldProductsWithInvoiceByFilterDates = function(knex,filterDates) {
    return knex.from('productstock')
    .where('product_status',0)
    .innerJoin('invoice', 'productstock.product_id', '=', 'invoice.stock_id')
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .where('sale_at','>=',filterDates.startDate)
    .where('sale_at','<=',filterDates.endDate)
    .select(
        'productstock.id',
        knex.raw('products.company AS product_name'),
        'products.model',
        'imei_or_serial1',
        'imei_or_serial2',
        'imei_or_serial3',
        'customer_name',
        'customer_address',
        'sale_rate',
        'purchase_rate',
        'sale_at'
    );    
}

// Retrive Purchase Products By Filter Dates 
exports.stockProductsByFilterDates = function(knex,filterDates) {
    return knex.from('productstock')
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .where('productstock.created_at','>=',filterDates.startDate)
    .where('productstock.created_at','<=',filterDates.endDate)
    .select(
        'productstock.id',
        knex.raw('products.company AS product_name'),
        'products.model',
        'imei_or_serial1',
        'imei_or_serial2',
        'imei_or_serial3',
        'purchase_rate',
        'productstock.created_at'
    );
}

// Retrive Purchse Product 
exports.purchase = function(knex) {
    return knex.table('productstock')
    .innerJoin('vendors', 'productstock.vendor_id', '=', 'vendors.id')
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .select(
        'productstock.id',
        'product_status',
        'purchase_rate',
        'imei_or_serial1',
        knex.raw('vendors.name AS vendor_name'),
        knex.raw('products.company AS product_name'),
        'products.model'
    );
}

// Retrive Sales 
exports.sales = function(knex) {
    return knex.table('productstock')
    .innerJoin('invoice', 'productstock.id', '=', 'invoice.stock_id')
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .select(
      'productstock.id',
      'sale_at',
      'sale_rate',
       knex.raw('products.company AS product_name'),
       'products.model',
      'invoice.customer_name',
      'invoice.customer_address'
      );
}

// Retrive InvoiceData By Id 
exports.invoiceDataById = function(knex,id) {
    return knex.from('productstock')
    .where('productstock.id',id)
    .innerJoin('invoice', 'productstock.id', '=', 'invoice.stock_id')
    .innerJoin('products', 'productstock.product_id', '=', 'products.id')
    .select(
            'productstock.id',
            'sale_rate',
            'imei_or_serial1',
            'imei_or_serial2',
            'imei_or_serial3',
            knex.raw('products.company AS product_name'),
            'products.model',
            'invoice.customer_name',
            'invoice.customer_address',
            'invoice.customer_mobile',
            'sale_at'
            )
    .first();
}

// Delete invoice by id 
exports.deleteInvoiceById = function(knex,id) {
    return knex('invoice').where('stock_id',id).del();
}

// Update Invoice By Id 
exports.updateInvoice = function(knex,id,invoiceData) {
    return knex.where('stock_id',id).update(invoiceData).into('invoice');
}

// Update Stock Product By Id 
exports.updateStockProdcutById = function(knex,id,updateData) {
    return knex('productstock').where('id',id).update(updateData);
}

// Insert Invoice Data 
exports.insertInvoice = function(knex,invoiceData) {
    return knex.insert(invoiceData).into('invoice');
}

// Delete Stock Prodcut By ID 
exports.deleteStockProductById = function(knex,id) {
    return knex('productstock').where('id',id).del();
}

// Insert Stock Product 
exports.insertStockProduct = function(knex,insertData) {
    return knex.insert(insertData).into('productstock');
}

// Delete Expance By Id 
exports.deleteExpance = function(knex,id) {
    return knex('expance').where('id',id).del();
}

// Insert Expance 
exports.insertExpance = function(knex,insertData) {
    return  knex.insert(insertData).into('expance');  
}

// Update Expance 
exports.updateExpance = function(knex,id,updateData) {
    return knex.where('id',id).update(updateData).into('expance');
}

// Insert Vendor 
exports.insertVendor = function(knex,insertData) {
    return knex.insert(insertData).into('vendors');   
}

// Update Vendor 
exports.updateVenodr = function(knex,id,updateData) {
    return knex.where('id',id).update(updateData).into('vendors');
}

// insert Product 
exports.insertProduct = function(knex,insertData) {
    return knex.insert(insertData).into('products');
}

// update Product 
exports.updateProduct = function(knex,id,updateData) {
    return knex.where('id',payLoad.productid).update(updateData).into('products');  
}

// Sale Data 
exports.saleData = function(knex) {
    return knex.select('purchase_rate','sale_rate','created_at','sale_at')
    .from('productstock').where('product_status',0);  
}

// Sale Amount 
exports.saleAmount = function(knex,data) {
    return knex.sum(data).from('productstock').where('product_status',0);
}

// Sale Count 
exports.salesCount = function(knex,data) { 
    return knex.count(data).from('productstock').where('product_status',0);
}

// Stock Amount 
exports.stockAmount = function(knex,data) {
    return knex.sum(data).from('productstock').where('product_status',1);
}

// inStockProductCount
exports.inStockProductCount = function(knex,data) {
    return knex.count(data).from('productstock').where('product_status',1);
}
