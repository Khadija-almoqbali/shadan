import { useState , useEffect} from "react"
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {Form, Button, Row, Col} from "react-bootstrap"
import FormContainer from "../components/FormContainer"
import Loader from "../components/Loader"
import {useRegisterMutation} from "../slices/usersApiSlice"
import {setCredentials} from "../slices/authSlice"
import {toast} from "react-toastify"


const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register , {isLoading}] = useRegisterMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get("redirect") || "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }else{
                try {
            const res = await register({ name, email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect);

        } catch (error) {
            toast.error(error?.data?.message || error.message);
        }
    }
}

  return (
    
   <FormContainer>
  <div className="text-center mb-4">
    <h1 style={{ fontWeight: "600", letterSpacing: "1px" }}>
      Sign Up
    </h1>
    <p style={{ color: "#888" }}>
      Sign in to continue your luxury experience
    </p>
  </div>

  <Form onSubmit={submitHandler}>

    <Form.Group controlId="name" className="my-3">
      <Form.Label style={{ fontWeight: "500" }}>
        Name
      </Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          borderRadius: "10px",
          padding: "12px",
          border: "1px solid #ddd",
        }}
      />
    </Form.Group>


    <Form.Group controlId="email" className="my-3">
      <Form.Label style={{ fontWeight: "500" }}>
        Email Address
      </Form.Label>
      <Form.Control
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          borderRadius: "10px",
          padding: "12px",
          border: "1px solid #ddd",
        }}
      />
    </Form.Group>

    <Form.Group controlId="password" className="my-3">
      <Form.Label style={{ fontWeight: "500" }}>
        Password
      </Form.Label>
      <Form.Control
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          borderRadius: "10px",
          padding: "12px",
          border: "1px solid #ddd",
        }}
      />
    </Form.Group>

    <Form.Group controlId="confirmPassword" className="my-3">
      <Form.Label style={{ fontWeight: "500" }}>
        Confirm Password
      </Form.Label>
      <Form.Control
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{
          borderRadius: "10px",
          padding: "12px",
          border: "1px solid #ddd",
        }}
      />
    </Form.Group>

    <Button
      type="submit"
      style={{
        width: "100%",
        backgroundColor: "#2F5D62",
        border: "none",
        padding: "12px",
        borderRadius: "10px",
        fontWeight: "500",
        letterSpacing: "1px",
      }}
      disabled={isLoading}
    >
      Register
    </Button>
    {isLoading && <Loader />}
  </Form>

  <Row className="py-3 text-center">
    <Col>
      <span style={{ color: "#666" }}>
        Already have an account{" "}
      </span>
      <Link
        to={redirect ? `/login?redirect=${redirect}` : "/login"}
        style={{
          color: "#240803ff",
          fontWeight: "600",
          textDecoration: "none",
        }}
      >
        Login
      </Link>
    </Col>
  </Row>
</FormContainer>
   
  )
}

export default RegisterScreen;
