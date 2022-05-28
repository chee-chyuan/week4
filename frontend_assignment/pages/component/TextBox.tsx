import { Box, TextField } from "@mui/material";
import React from "react";

export interface CustomTextBoxProp {
  value: string;
}

const TextBox = (prop: CustomTextBoxProp) => {
  return (
    <Box>
      <TextField
        id="outlined-multiline-static"
        multiline
        rows={4}
        disabled
        defaultValue={prop.value}
        sx={{
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "white",
          },
          "& .MuiOutlinedInput-root.Mui-disabled": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "yellow",
            },
          },
        }}
      />
    </Box>
  );
};

export default TextBox;
