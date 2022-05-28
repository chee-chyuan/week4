import {
  Box,
  Button,
  createTheme,
  FormLabel,
  styled,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";

const theme = createTheme({
  components: {
    // Name of the component
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
  },
});

const CssTextField = styled(TextField)({
  "& .MuiInputBase-input": {
    WebkitTextFillColor: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "yellow",
    },
  },
});

const MaterialForm = () => {
  // const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      age: Yup.number()
        .moreThan(5, "Must be greater than 5yo.")
        .required("Required"),
      address: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <div>
              <FormLabel>Name</FormLabel>
            </div>
            <div>
              <CssTextField
                variant="outlined"
                id="name"
                name="name"
                label="Name"
                color="secondary"
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </div>
            <div>
              <CssTextField
                variant="outlined"
                type="number"
                id="age"
                name="age"
                label="Age"
                onChange={formik.handleChange}
                error={formik.touched.age && Boolean(formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
              />
            </div>
            <div>
              <CssTextField
                variant="outlined"
                id="address"
                name="address"
                label="Address"
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </div>
            <Button color="primary" variant="contained" fullWidth type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default MaterialForm;
