// import { useEffect } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import AddContact from "../Components/AddContact";
import DashboardOverview from "../Components/DashboardOverview";
import DashboardTopBar from "../Components/DashboardTopBar";
import ImportContact from "../Components/ImportContact";
import TableContact from "../Components/TableContact";
import ContactsDashboardOpt  from "../utils/useContactsDashboard";



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
        handleCloseForm,
        handleOpenForm,
        handleCloseNotification,
        handleLogout,
        handleOpenImport,
        handleCloseImport,
        handleImportContacts,
        handleAddContactClick,
        handleChange,
        handleFileChange,
        handleRemoveImage,
        handleSubmit,
        handleDeleteContact,
        handleEditContact,
        handleCancelEdit,
    } = ContactsDashboardOpt();


    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
            <DashboardTopBar
                userData={userData}
                onImportOpen={handleOpenImport}
                onLogout={handleLogout}
            />


            <DashboardOverview
                userName={userName}
                totalContacts={userData.length}
                onOpenForm={handleOpenForm}
            />

            <AddContact
                onAddContact={handleAddContactClick}
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
            />


            <ImportContact
                open={importOpen}
                onClose={handleCloseImport}
                onImport={handleImportContacts}
            />

            <Snackbar
                open={notification.open}
                autoHideDuration={2600}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={handleCloseNotification}
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
