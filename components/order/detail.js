import Table from "../table"

export default function CartDetail({ cart, removeProduct }) {
  const headers = ['Product', 'Price', '']
  const footers = ['Total', cart.total, '']

  return (
    <Table headers={headers} footers={footers}>
      {
        cart.lineitems?.map(lineitem => {
          return (
            <tr key={lineitem.product.id}>
              <td>{lineitem.product.name}</td>
              <td>{lineitem.product.price}</td>
              <td>
                <span className="icon is-clickable" onClick={() => removeProduct(product.id)}>
                  <i className="fas fa-trash"></i>
                </span>
              </td>
            </tr>
          )
        })
      }
    </Table>
  )
}
