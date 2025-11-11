import React, { useState } from "react";
import {Box, Paper, Typography, TextField, Button, Stack} from "@mui/material";

const Settings: React.FC = () => {
  const [shopName, setShopName] = useState("My Store");
  const [currency, setCurrency] = useState("PKR");
  const [tax, setTax] = useState(10);
  const [footerMsg, setFooterMsg] = useState("Thank you for your purchase!");

  const handleSave = () => {
    console.log({
      shopName,
      currency,
      tax,
      footerMsg,
    });
    alert("Settings saved successfully (local state only for now).");
  };

  const handleReset = () => {
    setShopName("My Store");
    setCurrency("PKR");
    setTax(10);
    setFooterMsg("Thank you for your purchase!");
  };

  return (
    <Box sx={{ color: "white", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>

      <Stack spacing={2}>
        {/* Shop Name */}
        <Paper sx={{ p: 2, backgroundColor: "#2A2A3B" }}>
          <Typography variant="subtitle1" gutterBottom>
            Shop Name
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00BFA6" },
                "&:hover fieldset": { borderColor: "#00BFA6" },
              },
            }}
          />
        </Paper>

        {/* Currency */}
        <Paper sx={{ p: 2, backgroundColor: "#2A2A3B" }}>
          <Typography variant="subtitle1" gutterBottom>
            Currency
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00BFA6" },
                "&:hover fieldset": { borderColor: "#00BFA6" },
              },
            }}
          />
        </Paper>

        {/* Tax */}
        <Paper sx={{ p: 2, backgroundColor: "#2A2A3B" }}>
          <Typography variant="subtitle1" gutterBottom>
            Tax Percentage (%)
          </Typography>
          <TextField
            fullWidth
            type="number"
            variant="outlined"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00BFA6" },
                "&:hover fieldset": { borderColor: "#00BFA6" },
              },
            }}
          />
        </Paper>

        {/* Footer Message */}
        <Paper sx={{ p: 2, backgroundColor: "#2A2A3B" }}>
          <Typography variant="subtitle1" gutterBottom>
            Footer Message
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={footerMsg}
            onChange={(e) => setFooterMsg(e.target.value)}
            InputProps={{
              style: { color: "white" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#00BFA6" },
                "&:hover fieldset": { borderColor: "#00BFA6" },
              },
            }}
          />
        </Paper>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#00BFA6",
              "&:hover": { backgroundColor: "#009E8E" },
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              borderColor: "#00BFA6",
              color: "#00BFA6",
              "&:hover": { borderColor: "#009E8E", color: "#009E8E" },
            }}
          >
            Reset
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default Settings;
