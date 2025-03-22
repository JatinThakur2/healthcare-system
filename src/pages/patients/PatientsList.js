import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  FileDownload as FileDownloadIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { exportToCSV } from "../../utils/export";

const PatientsList = () => {
  const navigate = useNavigate();
  const { user, isMainHead } = useAuth();

  // Pagination and filtering states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  // Export menu state
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);

  // Fetch patients based on user role
  const allPatients =
    useQuery(
      isMainHead
        ? api.patients.getAllPatients
        : api.patients.getPatientsByDoctor,
      isMainHead ? {} : { doctorId: user?._id }
    ) || [];

  // Fetch doctors for displaying doctor names
  const doctors = useQuery(api.auth.getAllDoctors) || [];

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => d._id === doctorId);
    return doctor ? doctor.name : "Unknown";
  };

  // Handle search and filtering
  const filteredPatients = allPatients.filter((patient) => {
    // Search filter
    const searchMatches =
      patient.ipd_opd_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.provisionalDiagnosis &&
        patient.provisionalDiagnosis
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (patient.finalDiagnosis &&
        patient.finalDiagnosis
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    // Incomplete filter
    const incompleteMatches = !showIncompleteOnly || isIncomplete(patient);

    // Today's patients filter
    const todayMatches = !showTodayOnly || isFromToday(patient);

    return searchMatches && incompleteMatches && todayMatches;
  });

  // Helper functions for filtering
  const isIncomplete = (patient) => {
    const essentialFields = [
      patient.ipd_opd_no,
      patient.age || patient.dob,
      patient.gender,
      patient.contactNo,
      patient.provisionalDiagnosis,
    ];

    return essentialFields.some((field) => !field);
  };

  const isFromToday = (patient) => {
    const today = new Date();
    const patientDate = new Date(patient.date);
    return (
      patientDate.getDate() === today.getDate() &&
      patientDate.getMonth() === today.getMonth() &&
      patientDate.getFullYear() === today.getFullYear()
    );
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Selection handlers
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredPatients.map((p) => p._id);
      setSelectedPatients(newSelected);
      return;
    }
    setSelectedPatients([]);
  };

  const handleSelectClick = (id) => {
    const selectedIndex = selectedPatients.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedPatients, id];
    } else {
      newSelected = selectedPatients.filter((patientId) => patientId !== id);
    }

    setSelectedPatients(newSelected);
  };

  const isSelected = (id) => selectedPatients.indexOf(id) !== -1;

  // Filter menu handlers
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  // Export handlers
  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportSelected = () => {
    const patientsToExport = filteredPatients.filter((p) =>
      selectedPatients.includes(p._id)
    );
    exportToCSV(patientsToExport, "patients_export");
    handleExportMenuClose();
  };

  const handleExportAll = () => {
    exportToCSV(filteredPatients, "all_patients_export");
    handleExportMenuClose();
  };

  // Loading state
  if (!allPatients || !doctors) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Patients
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/patients/new")}
        >
          Add New Patient
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <TextField
          placeholder="Search patients..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterMenuOpen}
            sx={{ mr: 1 }}
          >
            Filter
          </Button>

          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportMenuOpen}
            disabled={filteredPatients.length === 0}
          >
            Export
          </Button>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={handleFilterMenuClose}
          >
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showIncompleteOnly}
                    onChange={(e) => setShowIncompleteOnly(e.target.checked)}
                  />
                }
                label="Show incomplete forms only"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showTodayOnly}
                    onChange={(e) => setShowTodayOnly(e.target.checked)}
                  />
                }
                label="Show today's patients only"
              />
            </MenuItem>
          </Menu>

          {/* Export Menu */}
          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={handleExportMenuClose}
          >
            <MenuItem
              onClick={handleExportSelected}
              disabled={selectedPatients.length === 0}
            >
              Export Selected ({selectedPatients.length})
            </MenuItem>
            <MenuItem onClick={handleExportAll}>
              Export All ({filteredPatients.length})
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {filteredPatients.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm || showIncompleteOnly || showTodayOnly
              ? "No patients found matching your filters."
              : "No patients found. Add your first patient to get started."}
          </Typography>
          {!searchTerm && !showIncompleteOnly && !showTodayOnly && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate("/patients/new")}
            >
              Add New Patient
            </Button>
          )}
        </Paper>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedPatients.length > 0 &&
                        selectedPatients.length < filteredPatients.length
                      }
                      checked={
                        selectedPatients.length > 0 &&
                        selectedPatients.length === filteredPatients.length
                      }
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  <TableCell>IPD/OPD No.</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Gender/Age</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  {isMainHead && <TableCell>Doctor</TableCell>}
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPatients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((patient) => {
                    const isItemSelected = isSelected(patient._id);
                    const incomplete = isIncomplete(patient);

                    return (
                      <TableRow
                        key={patient._id}
                        hover
                        role="checkbox"
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            onClick={() => handleSelectClick(patient._id)}
                          />
                        </TableCell>
                        <TableCell>
                          {patient.ipd_opd_no || (
                            <Typography color="error">Missing</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(patient.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {patient.gender || "?"}, {patient.age || "?"} years
                        </TableCell>
                        <TableCell>
                          {patient.provisionalDiagnosis || (
                            <Typography color="error">Missing</Typography>
                          )}
                        </TableCell>
                        {isMainHead && (
                          <TableCell>
                            {patient.doctorId
                              ? getDoctorName(patient.doctorId)
                              : "Not assigned"}
                          </TableCell>
                        )}
                        <TableCell>
                          <Chip
                            label={incomplete ? "Incomplete" : "Complete"}
                            color={incomplete ? "error" : "success"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/patients/${patient._id}`)
                              }
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() =>
                                navigate(`/patients/${patient._id}/edit`)
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredPatients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default PatientsList;
