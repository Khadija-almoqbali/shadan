import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Rating from './Rating';


const product = ({product}) => {
  return (
<Card
  style={{
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
    background: '#fff',
  }}
  className="my-4"
>
  <Link to={`/product/${product._id}`}>
    <img
  src={product.image}
  alt={product.name}
  style={{
    width: '100%',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    display: 'block',
  }}
    />
  </Link>

  <Card.Body className="p-3">
    <Link
      to={`/product/${product._id}`}
      className='product-title'
    >
      <h5 className="mb-2 fw-bold">{product.name}</h5>
    </Link>

    <Card.Text as='div'>
        <Rating value={product.rating}
        text={`${product.numReviews} reviews`}/>
    </Card.Text>

    <Card.Text as='h3' className="fw-bold text-success">
        OMR {product.price.toFixed(2)} 
    </Card.Text>
  </Card.Body>
</Card>
  )
}

export default product
