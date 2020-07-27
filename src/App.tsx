import React, { useState } from 'react';
import './App.css';
import calendarLogo from './assets/calendar.png';
import { Container, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { createTopRoundBorder } from "./utils/styles";
import Button from "@material-ui/core/Button";

function App() {

    const [isDarkMode, setIsDarkMode] = useState((localStorage.getItem("darkMode") || "false") === "true");

    const theme = React.useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: isDarkMode ? 'dark' : 'light',
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
                <AppBar position="static" color={"inherit"} dir={"rtl"} elevation={3}>
                    <Toolbar>
                        {console.log(theme)}
                        <IconButton onClick={toggleTheme}>
                            {theme.palette.type === "dark" ? <Brightness5Icon/> : <Brightness7Icon/>}
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container maxWidth="md" className="banner-container">
                    <Paper elevation={2} style={createTopRoundBorder(theme)}>
                        <div className="main-card">
                            <div className="banner">
                                <div className="banner-image">
                                    <img src={calendarLogo}
                                         alt="App logo"
                                         width="200px" height="200px"
                                         style={{
                                             filter: theme.palette.type === "dark" ? "invert(1)" : ""
                                         }}/>
                                    <img src={calendarLogo}
                                         alt="App logo"
                                         width="200px" height="200px"
                                         style={{
                                             filter: "invert(0.7) hue-rotate(90deg)",
                                             backgroundColor: "yellow",
                                             position: "absolute",
                                             top: 0,
                                             left: 0,
                                             animation: "calendar-day-pick 6s steps(1) infinite",
                                         }}/>
                                </div>
                                <div className="banner-text">
                                    <h1 style={{
                                        paddingBottom: "1em"
                                    }}>Welcome to Schedule.me!</h1>
                                    <p>With Schedule.me, planning events at the right time is a breeze.</p>
                                    <p>In order to start, create new schedule, or provide code for existing one.</p>
                                </div>
                            </div>
                            <div style={{
                                paddingTop: "2em",
                                display: "flex",
                                alignItems: "flex-end",
                                flexDirection: "column"
                            }}>

                                <Container maxWidth="xs" style={{
                                    display: "flex",
                                    justifyContent: "space-around"
                                }}>
                                    <Button variant="outlined" color="inherit">Create schedule</Button>
                                    <Button variant="outlined" color="inherit">View existing</Button>
                                </Container>
                            </div>
                        </div>
                    </Paper>
                </Container>
            </Container>
        </ThemeProvider>
    );
}

export default App;
