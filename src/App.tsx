import React, { useState } from 'react';
import './App.css';
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import MainPage from "./components/main-page/MainPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CreateSchedule from "./components/create-schedule/CreateSchedule";
import Grid from "@material-ui/core/Grid";
import ViewSchedule from "./components/view-schedule/ViewSchedule";

function App() {

    const [isDarkMode, setIsDarkMode] = useState((localStorage.getItem("darkMode") || "false") === "true");

    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: isDarkMode ? 'dark' : 'light',
                    primary: {
                        main: isDarkMode ? "#fff" : "#000"
                    },
                    secondary: {
                        main: isDarkMode ? "#bbb" : "#444"
                    },
                    text: {
                        primary: isDarkMode ? "#fff" : "#000",
                        secondary: isDarkMode ? "#bbb" : "#444",
                        disabled: isDarkMode ? "#888" : "#666",
                        hint: isDarkMode ? "#ddd" : "#222"
                    }
                },
            }),
        [isDarkMode],
    );

    function toggleTheme() {
        const newMode = !isDarkMode;
        localStorage.setItem("darkMode", newMode + "");
        setIsDarkMode(newMode);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container fixed className="main-container" style={{
                backgroundColor: theme.palette.background.default
            }}>
                <AppBar position="fixed" color={"inherit"} dir={"rtl"} elevation={3} style={{ zIndex: theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        {console.log(theme)}
                        <IconButton onClick={toggleTheme}>
                            {theme.palette.type === "dark" ? <Brightness5Icon/> : <Brightness7Icon/>}
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Router>
                    <Switch>
                        <Route path="/view/:code">
                            <Grid container spacing={0} justify={"center"} className="pt-4 content-container">
                                <Grid className="ml-auto mr-auto content-container-inner" container item
                                      md={12}>
                                    <ViewSchedule/>
                                </Grid>
                            </Grid>
                        </Route>
                        <Route path="/create">
                            <Grid container spacing={0} justify={"center"} className="pt-4 content-container">
                                <Grid className="ml-auto mr-auto content-container-inner" container spacing={4} item
                                      md={9}>
                                    <CreateSchedule/>
                                </Grid>
                            </Grid>
                        </Route>
                        <Route path="/">
                            <Grid container spacing={0} justify={"center"} alignItems={"flex-start"} className="pt-4 content-container">
                                <Grid className="content-container-inner" container item
                                      md={9}>
                                    <MainPage/>
                                </Grid>
                            </Grid>
                        </Route>
                    </Switch>
                </Router>
            </Container>
        </ThemeProvider>
    );
}

export default App;
