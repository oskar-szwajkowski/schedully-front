import React, { ChangeEvent, MouseEventHandler, useState } from 'react';
import Grid from "@material-ui/core/Grid";
import { Container, Paper, TextField, useTheme } from "@material-ui/core";
import { createTopRoundBorder } from "../../utils/styles";
import Button from "@material-ui/core/Button";

function CreateSchedule() {

    const theme = useTheme();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const createSchedule: MouseEventHandler = event => {
        event.preventDefault();
        // @ts-ignore
        console.log(event.currentTarget.form.reportValidity())
        console.log(title);
    }
    const titleChange = (event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
    const descriptionChange = (event: ChangeEvent<HTMLInputElement>) => setDescription(event.target.value);

    return (
        <Grid item lg={12}>
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
                                        onClick={createSchedule}>Create schedule
                                    </Button>
                                </div>
                            </form>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
        </Grid>
    )
}

export default CreateSchedule;
