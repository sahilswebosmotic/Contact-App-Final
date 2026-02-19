// import { useEffect } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import AddContact from "../Components/AddContact";
import DashboardOverview from "../Components/DashboardOverview";
import DashboardTopBar from "../Components/DashboardHeader";
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
        openLogout,
        openDelete,
        handleOpenDelete,
        handleCloseDelete ,
        handleOpenLogout,
        handleCloseLogout,
        handleCloseForm,
        handleOpenForm,
        handleCloseNotification,
        handleLogout,
        handleOpenImport,
        handleCloseImport,
        handleImportContacts,
        handleAddContact,
        handleChange,
        handleFileChange,
        handleRemoveImage,
        handleSubmit,
        handleDeleteContact,
        handleEditContact,
        handleCancelEdit,
        handleExportContacts,
    } = ContactsDashboardOpt();


    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "grey.100" }}>
            <DashboardTopBar
                userData={userData}
                onImportOpen={handleOpenImport}
                onLogout={handleLogout}
                handleExportContacts = {handleExportContacts}
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
                onAddContact={handleAddContact}
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



