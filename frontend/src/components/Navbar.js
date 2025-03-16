import React from "react";
import { IconButton, Toolbar, Typography, Divider, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Navbar({ action }) {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleClick = () => {
    if (action === "Login") {
      navigate("/login");
    } else if (action === "Logout") {
      localStorage.removeItem("token");
      toast.success("✅ Logged out successfully!");
      navigate("/");
    }
  };

  return (
    <>
      <Toolbar
        sx={{ display: "flex", backgroundColor: "#1976d2", paddingX: 3 }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "flex-start",
            fontWeight: "bold",
            color: "white",
          }}
          style={{ cursor: "pointer" }}
        >
          The Sales Studio
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton
            sx={{
              borderRadius: "20px",
              backgroundColor: action === "Logout" ? "#d32f2f" : "#FFBC2C", 
              color: "white",
              "&:hover": {
                backgroundColor: action === "Logout" ? "#b71c1c" : "#42a5f5", 
              },
            }}
            onClick={handleClick}
          >
            <Typography variant="subtitle1">
              {action === "Logout" ? action : "Admin login"}
            </Typography>
          </IconButton>
        </Box>
      </Toolbar>
      <Divider />
    </>
  );
}

export default Navbar;
