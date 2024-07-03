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
    getProducts()
      .then(data => {
        
        //If the data contains products categorized by category, set the products state.
        if (Array.isArray(data.filtered_products)) {
          setFilteredProducts(data.filtered_products)
        } 
        //If the data contains filtered products, set the filteredProducts State
        else if (data.products_by_category) {
          setProducts(data.products_by_category)
          //combines all products from different categories in to a single list
          const allProducts = Object.values(data.products_by_category).flat()

          //extracts unique locations from this list
          const locationData = [...new Set(allProducts.map(product => product.location))]
          
          //creates an array of objects where each object represents a unique location
          const locationObjects = locationData.map(location => ({

            id: location,
            name: location,
          }))

          setIsLoading(false)
          setLocations(locationObjects)
        }
      })
      .catch(err => {
        setLoadingMessage(`Unable to retrieve products. Status code ${err.message} on response.`)
      })
  }, [])
  const searchProducts = query => {
    getProducts(query)
      .then(productsData => {
        if (productsData) {
          setFilteredProducts(productsData.filtered_products)
        }
      })
      .catch(err => {
        setLoadingMessage(`Unable to retrieve products. Status code ${err.message} on response.`)
      })
  }
  
  //Displays loading message while fetching products
  if (isLoading) return <p className="has-text-centered has-text-danger">{loadingMessage}</p>

  return (
    <>
      <Filter
        productCount={filteredProducts ? filteredProducts.length : Object.values(products).flat().length}
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
  )
}


