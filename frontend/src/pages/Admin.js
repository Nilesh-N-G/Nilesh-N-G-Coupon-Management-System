import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom"; 
import {
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  Modal,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5000/coupons";

function Admin() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  }); 
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    coupon_code: "",
    expiry_date: "",
    status: "Available",
  });

  const handleAddCoupon = async () => {
    try {
      const response = await axios.post(`${API_URL}/create`, newCoupon);

      if (response.data.success) {
        toast.success("✅ Coupon added successfully!");
        fetchCoupons();
        setOpenAddModal(false);
        setNewCoupon({ coupon_code: "", expiry_date: "", status: "Available" });
      } else {
        toast.error(`❌ ${response.data.message}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(`❌ ${error.response.data.message}`); // Handle duplicate coupon case
      } else {
        toast.error("❌ Failed to add coupon. Please try again.");
      }
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;

      const formattedData = data.map((coupon, index) => ({
        id: index + 1,
        coupon_code: coupon.coupon_code,
        create_date: new Date(coupon.create_date).toLocaleDateString(),
        expiry_date: new Date(coupon.expiry_date).toISOString().split("T")[0],
        status: coupon.status,
        claimed_by: coupon.claimed_by || "Not Claimed", // Include claimed_by
      }));

      setRows(formattedData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token"); 
    console.log(token);

    if (!token) {
      toast.error("❌ Unauthorized! Redirecting to login...");
      navigate("/login"); // 
      return;
    }

    fetchCoupons();
    const interval = setInterval(fetchCoupons, 5000);
    return () => clearInterval(interval);
  }, [navigate]); // ✅ Dependency on navigate

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar action={"Logout"} />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", m: 2, px: 3 }}
      >
        <Typography variant="h5">Manage Coupons</Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenAddModal(true)}
        >
          Add Coupon
        </Button>
      </Box>

      <Box sx={{ display: "flex", mt: 1 }}>
        <Box sx={{ width: "100%", paddingX: { xs: 1, sm: 1, md: 5 } }}>
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
                  col.field === "actions"
                    ? {
                        ...col,
                        renderCell: (params) => (
                          <ActionButtons
                            coupon={params.row}
                            fetchCoupons={fetchCoupons}
                          />
                        ),
                      }
                    : col
                )}
                pageSizeOptions={[10, 20]} // ✅ Rows per Page options
                paginationModel={paginationModel} // ✅ Tracks pagination state
                onPaginationModelChange={setPaginationModel} // ✅ Updates state on change
                disableRowSelectionOnClick
                sx={{ border: 0 }}
              />
            )}
          </Paper>
        </Box>
      </Box>
      <Footer/>

      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Add Coupon</Typography>
          <TextField
            fullWidth
            label="Coupon Code"
            name="coupon_code"
            value={newCoupon.coupon_code}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, coupon_code: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            type="date"
            name="expiry_date"
            value={newCoupon.expiry_date}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, expiry_date: e.target.value })
            }
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={newCoupon.status}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, status: e.target.value })
            }
            margin="normal"
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Availed">Availed</MenuItem>
            <MenuItem value="Disabled">Disabled</MenuItem>
          </TextField>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCoupon}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

const columns = [
  { field: "id", headerName: "Sl No", width: 70 },
  { field: "coupon_code", headerName: "Coupon Code", width: 250 },
  { field: "create_date", headerName: "Created At", width: 200 },
  { field: "expiry_date", headerName: "Expires On", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "claimed_by", headerName: "Claimed By (IP)", width: 200 },
  {
    field: "actions",
    headerName: "Actions",
    width: 300,
    renderCell: (params) => <ActionButtons coupon={params.row} />,
  },
];

function ActionButtons({ coupon, fetchCoupons }) {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {" "}
      {/* ✅ Centered */}
      <EditButton coupon={coupon} fetchCoupons={fetchCoupons} />
      <ToggleDisableButton coupon={coupon} fetchCoupons={fetchCoupons} />
      <DeleteButton coupon={coupon} fetchCoupons={fetchCoupons} />
    </Box>
  );
}

// ✅ Edit Coupon Modal
function EditButton({ coupon, fetchCoupons }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    coupon_code: coupon.coupon_code,
    expiry_date: coupon.expiry_date,
    status: coupon.status,
  });

  const handleOpen = () => {
    setFormData({
      coupon_code: coupon.coupon_code,
      expiry_date: coupon.expiry_date,
      status: coupon.status,
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "expiry_date" && coupon.status === "Expired") {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate > today) {
        setFormData({ ...formData, [name]: value, status: "Available" });
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    console.log("Handling save");
    try {
      const response = await axios.put(
        `${API_URL}/update/${coupon.coupon_code}`,
        formData
      );

      if (response.status === 400) {
        toast.error(
          "�� Coupon code already exists! Please use a different code."
        );
        return;
      }
      if (response.status === 200) {
        toast.success("✅ Coupon updated successfully!");
        fetchCoupons();
        handleClose();
      } else {
        toast.error("❌ Unexpected error. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error(
            "❌ Coupon code already exists! Please use a different code."
          );
        } else {
          toast.error(
            `❌ ${error.response.data.message || "Failed to update coupon"}`
          );
        }
      } else {
        toast.error("❌ Network error. Please check your connection.");
      }
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleOpen}
      >
        Edit
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Edit Coupon</Typography>
          <TextField
            fullWidth
            label="Coupon Code"
            name="coupon_code"
            value={formData.coupon_code}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Availed">Availed</MenuItem>
            <MenuItem value="Disabled">Disabled</MenuItem>
          </TextField>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
function DeleteButton({ coupon, fetchCoupons }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/delete/${coupon.coupon_code}`);
      toast.success("✅ Coupon deleted!");
      fetchCoupons();
    } catch (error) {
      toast.error("❌ Failed to delete coupon");
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      size="small"
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
}

function ToggleDisableButton({ coupon, fetchCoupons }) {
  if (coupon.status === "Expired") {
    return (
      <Button
        variant="contained"
        color="secondary"
        size="small"
        sx={{
          minWidth: 100,
          cursor: "not-allowed",
          opacity: 1,
          pointerEvents: "none",
        }}
        disabled
      >
        Expired
      </Button>
    );
  }

  const newStatus = coupon.status === "Disabled" ? "Available" : "Disabled";

  return (
    <Button
      variant="contained"
      color={coupon.status === "Disabled" ? "success" : "warning"}
      size="small"
      sx={{ minWidth: 100 }}
      onClick={async () => {
        try {
          await axios.put(`${API_URL}/update/${coupon.coupon_code}`, {
            status: newStatus,
          });
          toast.success(`✅ Coupon ${newStatus}!`);
          fetchCoupons();
        } catch (error) {
          toast.error("❌ Failed to update status");
        }
      }}
    >
      {coupon.status === "Disabled" ? "Enable" : "Disable"}
    </Button>
  );
}

export default Admin;
