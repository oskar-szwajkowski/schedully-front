import React, { ChangeEvent, MouseEventHandler, useState } from 'react';
import Grid from "@material-ui/core/Grid";
import { Backdrop, CircularProgress, Container, Paper, TextField, useTheme } from "@material-ui/core";
import { createFakeToolbarClass, createTopRoundBorder } from "../../utils/styles";
import Button from "@material-ui/core/Button";
import { generateRandomName } from "../../utils/utilFunctions";
import { makeStyles } from "@material-ui/core/styles";
import { createSchedule } from "../../api-calls/createSchedule";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.background.paper,
    },
}));
const initialNickname = localStorage.getItem("nickname") || generateRandomName();

function CreateSchedule() {

    const theme = useTheme();
    const classes = useStyles(theme);
    const history = useHistory();

    const [title, setTitle] = useState("");
    const [nickname, setNickname] = useState(initialNickname);
    const [description, setDescription] = useState("");

    const [apiCallInProgress, setApiCallInProgress] = useState(false);

    const createScheduleHandler: MouseEventHandler = event => {
        event.preventDefault();
        // @ts-ignore
        const isValid = event.currentTarget.form.reportValidity()
        if (isValid) {
            setApiCallInProgress(true);
            createSchedule(title, nickname, description)
                .then(schedule => {
                    localStorage.setItem("nickname", nickname);
                    setApiCallInProgress(false);
                    return Promise.resolve(schedule);
                })
                .then(schedule => {
                    history.push(`/view/${schedule.scheduleCode}`, {
                        schedule
                    });
                });
        }
    }
    const titleChange = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
    const nicknameChange = (event: ChangeEvent<HTMLInputElement>) => setNickname(event.target.value);
    const descriptionChange = (event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value);

    return (
        <Grid item lg={12} className="w-100">
            <div style={createFakeToolbarClass(theme).fakeToolbar}/>
            <Paper elevation={2} style={createTopRoundBorder(theme.palette.divider)}>
                <Container className="card-padding d-flex flex-column">
                    <Grid item container direction={"column"} alignItems={"center"}>
                        <Grid>
                            <h2>Create new schedule</h2>
                            <br/>
                        </Grid>
                        <Grid container item direction={"column"} alignContent={"center"} md={5}>
                            <form style={{ width: "300px" }}>
                                <TextField
                                    fullWidth={true}
                                    required={true}
                                    id="title-required"
                                    label="Title"
                                    variant="filled"
                                    onChange={titleChange}
                                    className="mb-3"
                                />
                                <TextField
                                    fullWidth={true}
                                    required={true}
                                    id="nickname-required"
                                    label="Nickname"
                                    variant="filled"
                                    defaultValue={nickname}
                                    onChange={nicknameChange}
                                    className="mb-3"
                                />
                                <TextField
                                    fullWidth={true}
                                    id="description"
                                    label="Description"
                                    variant="filled"
                                    multiline={true}
                                    onChange={descriptionChange}
                                    className="mb-3"
                                />
                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        type={"submit"}
                                        onClick={createScheduleHandler}>Create schedule
                                    </Button>
                                </div>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
            <Backdrop className={classes.backdrop} open={apiCallInProgress}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Grid>
    )
}

export default CreateSchedule;
