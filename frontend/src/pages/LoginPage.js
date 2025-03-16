import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to handle error message
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar visibility state
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin"); // If token exists, redirect to admin page
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin");
    } catch (error) {
      setErrorMessage("Invalid Credentials");
      setOpenSnackbar(true); // Show the error message Snackbar
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Hide the Snackbar when closed
  };

  // Navigate to home page
  const handleBackToHome = () => {
    navigate("/"); // Redirect to the home page
  };

  // Handle Enter key press to trigger login
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 10, textAlign: "center" }}>
        <Typography variant="h4" color="primary" gutterBottom>Login</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown} // Detect Enter key
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown} // Detect Enter key
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for error message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000} // Snackbar will disappear after 4 seconds
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{
            width: "100%",
            fontSize: "1.2rem", // Larger text size
            padding: "16px", // Increased padding
            borderRadius: "8px", // Rounded corners for a softer look
            boxShadow: 3, // Optional: Adding a shadow for prominence
          }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Back to Home Button outside Snackbar */}
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large" 
          onClick={handleBackToHome}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
