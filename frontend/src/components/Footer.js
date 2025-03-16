import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        textAlign: "center",
        bgcolor: "#333",
        color: "white",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2">
        © 2025 All Rights Reserved | Nilesh Gurav
      </Typography>
    </Box>
  );
};

export default Footer;
