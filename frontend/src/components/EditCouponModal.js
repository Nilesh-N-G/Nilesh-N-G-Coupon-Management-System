import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "https://nilesh-n-g-coupon-management-system.onrender.com/coupons";

function EditCouponModal({ open, onClose, coupon, onUpdate }) {
  const [expiryDate, setExpiryDate] = useState(dayjs(coupon.expiry_date));
  const [status, setStatus] = useState(coupon.status);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/update/${coupon.coupon_code}`, {
        expiry_date: expiryDate.toISOString(),
        status,
      });

      if (response.status === 200) {
        toast.success("✅ Coupon updated successfully!");
        onUpdate(); // Refresh data
        onClose();
      }
    } catch (error) {
      toast.error("❌ Failed to update coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", color: "#1976d2" }}>
        ✏️ Edit Coupon
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Coupon Code"
          value={coupon.coupon_code}
          fullWidth
          disabled
          sx={{ marginBottom: 2 }}
        />

        <DatePicker
          label="Expiry Date"
          value={expiryDate}
          onChange={(newValue) => setExpiryDate(newValue)}
          sx={{ width: "100%", marginBottom: 2 }}
        />

        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
        >
          <MenuItem value="Available">Available</MenuItem>
          <MenuItem value="Availed">Availed</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", padding: "10px 20px" }}>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCouponModal;
