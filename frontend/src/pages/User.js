import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, CircularProgress, Alert, Button } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "https://nilesh-n-g-coupon-management-system.onrender.com/coupons"; // Change for deployment

const columns = [
  { field: "id", headerName: "Sl No", width: 70 },
  { field: "coupon_code", headerName: "Coupon Code", width: 350 },
  { field: "create_date", headerName: "Created At", width: 250 },
  { field: "expiry_date", headerName: "Expires On", width: 250 },
  { field: "status", headerName: "Status", width: 250 },
  {
    field: "redeem",
    headerName: "Action",
    width: 250,
    renderCell: (params) => <RedeemButton coupon={params.row} />,
  },
];

function RedeemButton({ coupon, onRedeem }) {
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/redeem/${coupon.coupon_code}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("🎉 Coupon Redeemed Successfully!");
        onRedeem(); // Refresh data without reloading
      } else {
        toast.error("❌ Failed to redeem coupon");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={handleRedeem}
      disabled={coupon.status !== "Available" || loading}
    >
      {loading ? "Processing..." : "Redeem"}
    </Button>
  );
}

function User() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;
  
      // Filter only available coupons
      const availableCoupons = data.filter((coupon) => coupon.status === "Available");
  
      // Format and reverse the available coupons
      const formattedData = availableCoupons
        .map((coupon) => ({
          coupon_code: coupon.coupon_code,
          create_date: new Date(coupon.create_date).toLocaleDateString(),
          expiry_date: new Date(coupon.expiry_date).toLocaleDateString(),
          status: coupon.status,
        }))
        .reverse(); // Reverse the array after mapping
  
      // Assign reversed index
      const reversedData = formattedData.map((coupon, index) => ({
        ...coupon,
        id: index + 1, // Start the index from 1 for the reversed list
      }));
  
      setRows(reversedData); // Set the reversed and formatted coupons with correct indexing
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchCoupons();
    const interval = setInterval(fetchCoupons, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar action={"Login"}/>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          mt: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingX: { xs: 1, sm: 1, md: 5 },
          }}
        >
          <Paper sx={{ height: 500, width: "100%" }}>
            {loading ? (
              <CircularProgress
                sx={{ margin: "20px auto", display: "block" }}
              />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <DataGrid
                rows={rows}
                columns={columns.map((col) =>
                  col.field === "redeem"
                    ? {
                        ...col,
                        renderCell: (params) => (
                          <RedeemButton
                            coupon={params.row}
                            onRedeem={fetchCoupons}
                          />
                        ),
                      }
                    : col
                )}
                pageSizeOptions={[10, 20]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                disableRowSelectionOnClick
                sx={{ border: 0 }}
              />
            )}
          </Paper>
        </Box>
      </Box>
      <Footer/>
    </>
  );
}

export default User;
