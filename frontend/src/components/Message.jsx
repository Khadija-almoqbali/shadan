import {Alert} from 'react-bootstrap';

const Message = ({variant, children}) => {
  return (
    <div>
        <Alert variant={variant}>
            {children}
        </Alert>
    </div>
  )
}

Message.defultProps = {
    variant: 'info',
}

export default Message;
