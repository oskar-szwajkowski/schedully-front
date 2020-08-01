import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { createFakeToolbarClass, createTopRoundBorder } from "../../utils/styles";
import calendarLogo from "../../assets/calendar.png";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import React, { ChangeEvent, MouseEventHandler, useState } from "react";
import useTheme from "@material-ui/core/styles/useTheme";
import "./MainPage.css";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    linkColor: {
        color: theme.palette.text.primary,
        "&:active": {
            color: theme.palette.text.secondary
        }
    },
    "linkColor:active": {
        color: theme.palette.text.secondary
    }
}));

function MainPage() {

    const history = useHistory();
    const theme = useTheme();
    const styles = useStyles(theme);

    const [scheduleCode, setScheduleCode] = useState("");

    const scheduleCodeChange = (event: ChangeEvent<HTMLInputElement>) => setScheduleCode(event.target.value);

    function goToCreate() {
        history.push("/create");
    }

    const focusCodeInput: MouseEventHandler = event => {
        event.preventDefault();
        const codeInput = document.getElementById("schedule-code");
        if (codeInput) {
            codeInput.focus();
        }
    }

    const createFormSubmitted: MouseEventHandler = event => {
        const valid = (event?.currentTarget as HTMLInputElement).form?.reportValidity();
        event.preventDefault();
        if (valid) {
        }
    }

    return (
        <React.Fragment>
            <Grid container item lg spacing={4} justify={"center"} alignContent={"center"}>
                <div style={createFakeToolbarClass(theme).fakeToolbar}/>
                <Grid container item md={12}>
                    <Paper elevation={2} style={{ ...createTopRoundBorder(theme.palette.divider), width: "100%" }}>
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
                                    <p>How many times have you tried to get bunch of people and drink <span role="img"
                                                                                                            aria-label="beer">🍺</span> or
                                        get some <span role="img" aria-label="pizza">🍕</span>?</p>
                                    <p>How many times, your schedules were so different, that you couldn't fit even 2
                                        hours
                                        of suitable time?</p>
                                    <br/>
                                    <p>Schedule.me works like reverse calendar</p>
                                    <div style={{ paddingLeft: "1.5em" }}>
                                        <ul className="checklist">
                                            <li>submit your free time</li>
                                            <li>send it to your
                                                friends
                                            </li>
                                            <li>schedule events at the right time.</li>
                                        </ul>
                                    </div>
                                    <br/>
                                    <p>In order to start, <Link className={styles.linkColor} to="/create">create new
                                        schedule</Link>, or <a href="/" className={styles.linkColor}
                                                               onClick={focusCodeInput}>provide
                                        code for existing one.</a></p>
                                </div>
                            </div>
                        </div>
                    </Paper>
                </Grid>
                <Grid container item md={12} spacing={0} justify={"space-between"}>
                    <Grid item md style={{ marginRight: "2em" }}>
                        <Paper elevation={2} style={createTopRoundBorder(theme.palette.divider)} className="h-100">
                            <div className="h-100 d-flex flex-column justify-content-between card-padding">
                                <p className="pt-2 pb-4">Use this box to create new schedule!</p>
                                <div className="d-flex justify-content-end button-right-container">
                                    <Button variant="outlined" color="inherit" onClick={goToCreate}>
                                        Create schedule
                                    </Button>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item md>
                        <Paper elevation={2} style={createTopRoundBorder(theme.palette.divider)}>
                            <div className="card-padding">
                                <p className="pt-2 pb-4">Use this box to view existing schedule!</p>
                                <div className="d-flex justify-content-between flex-column">
                                    <form>
                                        <div className="mb-3 w-100">
                                            <TextField
                                                id="schedule-code"
                                                label="Schedule code"
                                                variant={"filled"}
                                                required={true}
                                                fullWidth={true}
                                                onChange={scheduleCodeChange}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-end button-right-container">
                                            <Button
                                                variant="outlined"
                                                color="inherit"
                                                type={"submit"}
                                                onClick={createFormSubmitted}
                                            >View existing</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default MainPage;
