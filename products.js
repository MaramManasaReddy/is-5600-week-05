const fs = require('fs').promises
const path = require('path')
const cuid = require('cuid')
const db = require('./db')
const productsFile = path.join(__dirname, 'data/full-products.json')

// Define our Product Model

const Product = db.model('Product', {
  _id: { type: String, default: cuid },
  description: { type: String },
  alt_description: { type: String },
  likes: { type: Number, required: true },
  urls: {
    regular: { type: String, required: true },
    small: { type: String, required: true },
    thumb: { type: String, required: true },
  },
  links: {
    self: { type: String, required: true },
    html: { type: String, required: true },
  },
  user: {
    id: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    portfolio_url: { type: String },
    username: { type: String, required: true },
  },
  tags: [{
    title: { type: String, required: true },
  }], 
})
/**
 * List products
 * @param {*} options 
 * @returns 
 */
async function list(options = {}) {

  const { offset = 0, limit = 25, tag } = options;

  const query = tag ? {
    tags: {
      $elemMatch: {
        title: tag
      }
    }
  } : {}
  const products = await Product.find(query)
    .sort({ _id: 1 })
    .skip(offset)
    .limit(limit)
    
  return products

}

/**
 * Get a single product
 * @param {string} id
 * @returns {Promise<object>}
 */
async function get(_id) {
  return await Product.findById(_id);
}

  // Loop through the products and return the product with the matching id
  // for (let i = 0; i < products.length; i++) {
  //   if (products[i].id === id) {
  //     return products[i]
  //   }
  // }

  // If no product is found, return null
  // return null;

async function create (fields) {
  const product = await new Product(fields).save()
  return product
}

async function edit (_id, change) {
  const product = await get(_id)

  // { title: "text", description: "test"}

  // ["title", "description"]
  Object.keys(change).forEach(function(key){
    product[key] = change[key]
  })

  //Object.assign (product, { ...change});

  await product.save()

  return product
  
}

// async function destroy (_id) {
//   return await product.deleteOne({_id});

// }
// 

async function destroy(_id) {
  try {
    // Check if the product exists before trying to delete
    const product = await Product.findById(_id);
    if (!product) {
      throw new Error('Product not found');
    }

    // If the product exists, delete it
    await Product.deleteOne({ _id });
    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    console.error('Error in delete function:', error.message); // Detailed error message
    throw error; // Rethrow the error for the API to handle
  }
}

module.exports = {
  list,
  get,
  create,
  edit,
  destroy,
}
