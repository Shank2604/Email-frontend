import React, { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await axios.post("https://email-frontend-lyart.vercel.app/register", {
        email,
        password,
      });
      setSuccessMsg("✅ User registered successfully!");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Error registering user. Try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card
        style={{ maxWidth: "400px", width: "100%" }}
        className="shadow-sm p-4"
      >
        <h3 className="text-center mb-4">Register</h3>

        {successMsg && <Alert variant="success">{successMsg}</Alert>}
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Register
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Register;
