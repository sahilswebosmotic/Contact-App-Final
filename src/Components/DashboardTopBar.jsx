import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useCSVDownloader } from "react-papaparse";

const DashboardTopBar = ({ userData, onImportOpen, onLogout }) => {
    const { CSVDownloader, Type } = useCSVDownloader();

    return (
        <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: "divider",
                backdropFilter: "blur(10px)",
                bgcolor: "rgba(248, 250, 252, 0.92)",
            }}
        >
            <Toolbar
                sx={{
                    px: { xs: 1.5, sm: 2, md: 8 },
                    py: 1,
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 1.2,
                    flexWrap: "wrap",
                }}
            >
                <Box sx={{ pr: { xs: 1, sm: 0 } }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: "primary.dark",
                            fontSize: { xs: "1.45rem", sm: "1.85rem" },
                        }}
                    >
                        Contact App
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        A calm space to manage your network
                    </Typography>
                </Box>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.2}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                    <CSVDownloader
                        type={Type.Button}
                        filename="Contacts_2026"
                        bom
                        config={{ delimiter: ";" }}
                        data={userData}
                        style={{
                            border: "none",
                            borderRadius: "8px",
                            padding: "11px 14px",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            background: "#3f51b5",
                            color: "#fff",
                            transition: "0.2s ease",
                        }}
                        onMouseOver={(e) =>
                            (e.target.style.background = "#303f9f")
                        }
                        onMouseOut={(e) =>
                            (e.target.style.background = "#3f51b5")
                        }
                    >
                        Export
                    </CSVDownloader>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 2,
                        }}
                        onClick={onImportOpen}
                    >
                        Import
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 2,
                        }}
                        onClick={onLogout}
                    >
                        Logout
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default DashboardTopBar;

// import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
// import { useCSVDownloader } from "react-papaparse";

// const DashboardTopBar = ({ userData, onImportOpen, onLogout }) => {
//     const { CSVDownloader, Type } = useCSVDownloader();

//     return (
//         <AppBar
//             position="sticky"
//             elevation={0}
//             sx={{
//                 borderBottom: "1px solid",
//                 borderColor: "divider",
//                 backdropFilter: "blur(12px)",
//                 bgcolor: "rgba(255,255,255,0.75)",
//                 color: "text.primary",
//             }}
//         >
//             <Toolbar
//                 sx={{
//                     px: { xs: 2, md: 6 },
//                     py: 1.2,
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     gap: 2,
//                 }}
//             >
//                 {/* Left Section */}
//                 <Box>
//                     <Typography
//                         variant="h5"
//                         sx={{
//                             fontWeight: 700,
//                             letterSpacing: 0.3,
//                         }}
//                     >
//                         Contact App
//                     </Typography>
//                     <Typography
//                         variant="caption"
//                         sx={{
//                             color: "text.secondary",
//                             fontSize: 12,
//                         }}
//                     >
//                         Manage your network without chaos
//                     </Typography>
//                 </Box>

//                 {/* Right Section */}
//                 <Stack
//                     direction="row"
//                     spacing={1}
//                     sx={{
//                         alignItems: "center",
//                     }}
//                 >
//                     <CSVDownloader
//                         type={Type.Button}
//                         filename="Contacts_2026"
//                         bom
//                         config={{ delimiter: ";" }}
//                         data={userData}
//                         style={{
//                             border: "none",
//                             borderRadius: "8px",
//                             padding: "11px 14px",
//                             fontSize: "0.85rem",
//                             fontWeight: 600,
//                             cursor: "pointer",
//                             background: "#3f51b5",
//                             color: "#fff",
//                             transition: "0.2s ease",
//                         }}
//                         onMouseOver={(e) =>
//                             (e.target.style.background = "#303f9f")
//                         }
//                         onMouseOut={(e) =>
//                             (e.target.style.background = "#3f51b5")
//                         }
//                     >
//                         Export
//                     </CSVDownloader>

//                     <Button
//                         variant="contained"
//                         color="secondary"
//                         sx={{
//                             borderRadius: "8px",
//                             textTransform: "none",
//                             fontWeight: 600,
//                             px: 2,
//                         }}
//                         onClick={onImportOpen}
//                     >
//                         Import
//                     </Button>

//                     <Button
//                         variant="contained"
//                         color="error"
//                         sx={{
//                             borderRadius: "8px",
//                             textTransform: "none",
//                             fontWeight: 600,
//                             px: 2,
//                         }}
//                         onClick={onLogout}
//                     >
//                         Logout
//                     </Button>
//                 </Stack>
//             </Toolbar>
//         </AppBar>
//     );
// };

// export default DashboardTopBar;
