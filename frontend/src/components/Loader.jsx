import {Spinner} from 'react-bootstrap';

const Loader = () => {
    return (
        <Spinner animation="border" role="status" style={{
            width:'200px',
            height:'200px',
            margin:'auto',
            display:'block',
            color: '#3A1F1A'
        }}>
        </Spinner>
    );
};

export default Loader;