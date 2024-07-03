import { useEffect, useState } from 'react'
import Filter from '../../components/filter'
import Layout from '../../components/layout'
import Navbar from '../../components/navbar'
import { ProductCard } from '../../components/product/card'
import { getProducts } from '../../data/products'

export default function Products() {
  const [products, setProducts] = useState({})
  const [filteredProducts, setFilteredProducts] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Loading products...')
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()

        if (Array.isArray(data)) {
          setFilteredProducts(data);
        } else if (data && data.products_by_category) {
          setProducts(data.products_by_category)

          const allProducts = Object.values(data.products_by_category).flat()
          const uniqueLocations = [...new Set(allProducts.map(product => product.location))]
          const locationObjects = uniqueLocations.map(location => ({
            id: location,
            name: location,
          }));

          setLocations(locationObjects)
        } else {
          throw new Error("Unexpected data structure")
        }
      } catch (err) {
        setLoadingMessage(`Unable to retrieve products. Status code ${err.message} on response.`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts();
  }, [])

  const searchProducts = async query => {
    try {
      const productsData = await getProducts(query)
      setFilteredProducts(Array.isArray(productsData) ? productsData : [])
    } catch (err) {
      setLoadingMessage(`Unable to retrieve products. Status code ${err.message} on response.`)
    }
  };

  if (isLoading) return <p className="has-text-centered has-text-danger">{loadingMessage}</p>

  const productCount = filteredProducts ? filteredProducts.length : Object.values(products).flat().length

  return (
    <>
      <div className="level">
        <div className="level-left">
          <p className="subtitle is-5">
            <strong>{productCount}</strong> Products
          </p>
        </div>
        <div className="level-right">
          
        </div>
      </div>

      <Filter
        productCount={productCount}
        onSearch={searchProducts}
        locations={locations}
      />

      <div className="columns is-multiline">
        {filteredProducts ? (
          <>
            <h2 className="subtitle column is-12">Products matching filters</h2>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </>
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
  )
}

Products.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  );
};




