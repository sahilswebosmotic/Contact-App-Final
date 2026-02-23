import { Alert, Box, Snackbar } from "@mui/material";
import AddContact from "../components/AddContact";
import DashboardOverview from "../components/DashboardOverview";
import DashboardTopBar from "../components/DashboardHeader";
import ImportContact from "../components/ImportContact";
import TableContact from "../components/TableContact";
import useContactsDashboard from "../hooks/useContactsDashboard";

function Dashboard() {
    const {
        userName,
        openForm,
        userData,
        importOpen,
        formData,
        errors,
        previewUrl,
        fileInputRef,
        notification,
        isEditMode,
        openLogout,
        openDelete,
        handleOpenDelete,
        handleCloseDelete,
        handleOpenLogout,
        handleCloseLogout,
        handleCloseForm,
        handleOpenForm,
        handleCloseNotification,
        handleLogout,
        handleOpenImport,
        handleCloseImport,
        handleImportContacts,
        handleChange,
        handleFileChange,
        handleRemoveImage,
        handleSubmit,
        handleDeleteContact,
        handleEditContact,
        handleCancelEdit,
        handleExportContacts,
    } = useContactsDashboard();

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
            <DashboardTopBar
                userData={userData}
                onImportOpen={handleOpenImport}
                onLogout={handleLogout}
                handleExportContacts={handleExportContacts}
                openLogout={openLogout}
                handleCloseLogout={handleCloseLogout}
                handleOpenLogout={handleOpenLogout}
            />

            <DashboardOverview
                totalContacts={userData.length}
                onOpenForm={handleOpenForm}
                userName={userName}
            />

            <AddContact
                formData={formData}
                openForm={openForm}
                handleCloseForm={handleCloseForm}
                errors={errors}
                previewUrl={previewUrl}
                fileInputRef={fileInputRef}
                onChange={handleChange}
                onFileChange={handleFileChange}
                onRemoveImage={handleRemoveImage}
                onSubmit={handleSubmit}
                isEditMode={isEditMode}
                onCancelEdit={handleCancelEdit}
            />

            <TableContact
                userData={userData}
                onDeleteContact={handleDeleteContact}
                onEditContact={handleEditContact}
                openDelete={openDelete}
                handleCloseDelete={handleCloseDelete}
                handleOpenDelete={handleOpenDelete}
            />

            <ImportContact
                open={importOpen}
                onClose={handleCloseImport}
                onImport={handleImportContacts}
            />

            <Snackbar
                open={notification.open}
                autoHideDuration={1500}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Dashboard;
