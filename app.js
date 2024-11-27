const express = require('express');
const api = require('./api');
const middleware = require('./middleware');
const bodyParser = require('body-parser');

// Set the port
const port = process.env.PORT || 3000;

// Boot the app
const app = express();

// Register the public directory
app.use(express.static(__dirname + '/public'));

// Register the middleware and routes
app.use(bodyParser.json());
app.use(middleware.cors);
app.get('/', api.handleRoot);
app.get('/products', api.listProducts);
app.get('/products/:id', api.getProduct);
app.put('/products/:id', api.editProduct);
app.delete('/products/:id', api.deleteProduct);  // Register DELETE route
app.post('/products', api.createProduct);

app.get('/orders', api.listOrders);
app.post('/orders', api.createOrder);
app.put('/orders/:id', api.editOrder);  // Add PUT route for editing an order
app.delete('/orders/:id', api.deleteOrder);  // Add DELETE route for deleting an order

// Boot the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
