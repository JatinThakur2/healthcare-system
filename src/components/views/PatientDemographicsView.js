import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
const PatientDemographicsView = ({ patient }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Personal Information" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">IPD/OPD Number</Typography>
                <Typography variant="body1">
                  {patient.ipd_opd_no || "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Age</Typography>
                <Typography variant="body1">
                  {patient.age || "Not provided"} years
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Gender</Typography>
                <Typography variant="body1">
                  {patient.gender || "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Contact Number</Typography>
                <Typography variant="body1">
                  {patient.contactNo || "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Address</Typography>
                <Typography variant="body1">
                  {patient.address || "Not provided"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Social Information" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Marital Status</Typography>
                <Typography variant="body1">
                  {patient.maritalStatus
                    ? patient.maritalStatus.charAt(0).toUpperCase() +
                      patient.maritalStatus.slice(1)
                    : "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Employment Status</Typography>
                <Typography variant="body1">
                  {patient.employmentStatus
                    ? patient.employmentStatus.charAt(0).toUpperCase() +
                      patient.employmentStatus.slice(1)
                    : "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Economic Status</Typography>
                <Typography variant="body1">
                  {patient.economicStatus
                    ? patient.economicStatus.charAt(0).toUpperCase() +
                      patient.economicStatus.slice(1)
                    : "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Consent Obtained</Typography>
                <Typography variant="body1">
                  {patient.consentObtained === true
                    ? "Yes"
                    : patient.consentObtained === false
                      ? "No"
                      : "Not provided"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title="Diagnosis Information" />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">
                  Provisional Diagnosis
                </Typography>
                <Typography variant="body1">
                  {patient.provisionalDiagnosis || "Not provided"}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Final Diagnosis</Typography>
                <Typography variant="body1">
                  {patient.finalDiagnosis || "Not provided"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader title="Patient Complaints" />
          <Divider />
          <CardContent>
            {!patient.complaints || patient.complaints.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No complaints recorded
              </Typography>
            ) : (
              <List>
                {patient.complaints.map((complaint, index) => (
                  <ListItem
                    key={index}
                    divider={index < patient.complaints.length - 1}
                  >
                    <ListItemText
                      primary={complaint.symptom}
                      secondary={`Severity: ${complaint.severity}, Duration: ${complaint.duration}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PatientDemographicsView;
