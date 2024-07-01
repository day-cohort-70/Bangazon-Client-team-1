// pages/products/index.js
import { useEffect, useState } from 'react';
import Filter from '../../components/filter';
import Layout from '../../components/layout';
import Navbar from '../../components/navbar';
import { ProductCard } from '../../components/product/card';
import { getProducts } from '../../data/products';

export default function Products() {
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading products...');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getProducts()
      .then(data => {
        console.log('Fetched products data:', data);

        if (Array.isArray(data.filtered_products)) {
          setFilteredProducts(data.filtered_products);
        } else if (data.products_by_category) {
          setProducts(data.products_by_category);
          const allProducts = Object.values(data.products_by_category).flat();
          const locationData = [...new Set(allProducts.map(product => product.location))];
          const locationObjects = locationData.map(location => ({
            id: location,
            name: location,
          }));

          setIsLoading(false);
          setLocations(locationObjects);
        }
      })
      .catch(err => {
        setLoadingMessage(`Unable to retrieve products. Status code ${err.message} on response.`);
      });
  }, []);

  const searchProducts = query => {
    getProducts(query)
      .then(productsData => {
        if (productsData) {
          setFilteredProducts(productsData.filtered_products);
        }
      })
      .catch(err => {
        setLoadingMessage(`Unable to retrieve products. Status code ${err.message} on response.`);
      });
  };

  if (isLoading) return <p className="has-text-centered has-text-danger">{loadingMessage}</p>;

  return (
    <>
      <Filter
        productCount={filteredProducts ? filteredProducts.length : Object.values(products).flat().length}
        onSearch={searchProducts}
        locations={locations}
      />

      <div className="columns is-multiline">
        {filteredProducts ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          Object.keys(products).map(category => (
            <div key={category} className="column is-12">
              <h2 className="subtitle">{category}</h2>
              <div className="columns is-multiline">
                {Array.isArray(products[category]) ? (
                  products[category].map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <p className="has-text-centered has-text-grey">No products found for this category.</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

Products.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  );
};


