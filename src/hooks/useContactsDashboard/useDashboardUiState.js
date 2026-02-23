import { useState } from "react";

export const useDashboardUiState = () => {
    const [openForm, setOpenForm] = useState(false);
    const [openLogout, setOpenLogout] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [importOpen, setImportOpen] = useState(false);

    const handleOpenLogout = () => setOpenLogout(true);
    const handleCloseLogout = () => setOpenLogout(false);
    const handleOpenDelete = () => setOpenDelete(true);
    const handleCloseDelete = () => setOpenDelete(false);
    const handleOpenForm = () => setOpenForm(true);
    const handleCloseForm = () => setOpenForm(false);
    const handleOpenImport = () => setImportOpen(true);
    const handleCloseImport = () => setImportOpen(false);

    return {
        openForm,
        setOpenForm,
        openLogout,
        setOpenLogout,
        openDelete,
        setOpenDelete,
        importOpen,
        setImportOpen,
        handleOpenLogout,
        handleCloseLogout,
        handleOpenDelete,
        handleCloseDelete,
        handleOpenForm,
        handleCloseForm,
        handleOpenImport,
        handleCloseImport,
    };
};
