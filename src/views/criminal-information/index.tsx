import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CriminalInformationTable from "./components/criminal-information-table";

const CriminalInformationView = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <CriminalInformationTable></CriminalInformationTable>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CriminalInformationView;
