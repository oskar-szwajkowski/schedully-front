import {
    AppointmentForm,
    Appointments,
    DateNavigator,
    DayView,
    DragDropProvider,
    EditRecurrenceMenu,
    MonthView,
    Resources,
    Scheduler,
    TodayButton,
    Toolbar,
    ViewSwitcher,
    WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';
import {
    AppointmentModel, Appointments as AppointmentsBase,
    ChangeSet,
    EditingState,
    FormatterFn,
    Resource,
    ViewState,
} from '@devexpress/dx-react-scheduler';
import React, { ChangeEvent, useState } from "react";
import { Container, Drawer, Grid, IconButton, Paper, useTheme, Toolbar as MaterialToolbar } from '@material-ui/core';
import "./ViewSchedule.css";
import TextField from "@material-ui/core/TextField";
import { createTopRoundBorder } from "../../utils/styles";
import { VisibilityOffSharp, VisibilitySharp } from '@material-ui/icons';
import { makeStyles } from "@material-ui/core/styles";

const recurrenceAppointments = [{
    title: 'Website Re-Design Plan',
    startDate: new Date(new Date().setHours(14)),
    endDate: new Date(new Date().setHours(16)),
    id: 0,
    userId: "bzyku",
    nickname: "bzyku"
}, {
    title: 'Website Re-Design Plan',
    startDate: new Date(new Date().setHours(12)),
    endDate: new Date(new Date().setHours(14)),
    id: 1,
    nickname: "Mathejson",
    userId: "Mathejson",
}, {
    title: 'Website Re-Design Plan',
    startDate: new Date(new Date().setHours(10)),
    endDate: new Date(new Date().setHours(12)),
    id: 2,
    nickname: "Czachaa",
    userId: "Czachaa",
}, {
    title: 'Website Re-Design Plan',
    startDate: new Date(new Date().setHours(8)),
    endDate: new Date(new Date().setHours(10)),
    id: 3,
    nickname: "Kondi",
    userId: "Kondi",
}];

const resources: Resource[] = [{
    fieldName: "userId",
    title: "Submitter",
    instances: [
        { id: "bzyku", text: "bzyku", color: "#64b5f6" },
        { id: "Mathejson", text: "Mathejson", color: "#ffff00" },
        { id: "Czachaa", text: "Czachaa", color: "#00ff00" },
        { id: "Kondi", text: "Kondi", color: "#ff0000" },
    ],
}];

interface IUserSubmittedSchedule {
    userId: string;
    nickname: string;
    appointments: AppointmentModel[]
}

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
}));

function ViewSchedule() {

    const theme = useTheme();
    const classes = useStyles(theme);
    const [scheduleData, setScheduleData] = useState<AppointmentModel[]>(recurrenceAppointments)
    const [visibleScheduleData, setVisibleScheduleData] = useState(scheduleData);
    const [currentDate] = useState(new Date());
    const [userColors, setUserColors] = useState()
    const [submitters, setSubmitters] = useState("");
    const [userSchedules] = useState<IUserSubmittedSchedule[]>([{
        appointments: [...recurrenceAppointments.map(r => ({
            ...r,
            userId: "Mathejson",
            nickname: "Mathejson",
        }))],
        userId: "Mathejson",
        nickname: "Mathejson",
    }, {
        appointments: [...recurrenceAppointments.map(r => ({
            ...r,
            userId: "Czachaa",
            nickname: "Czachaa",
        }))],
        userId: "Czachaa",
        nickname: "Czachaa",
    }, {
        appointments: [...recurrenceAppointments.map(r => ({
            ...r,
            userId: "Kondi",
            nickname: "Kondi",
        }))],
        userId: "Kondi",
        nickname: "Kondi",
    }]);
    const [visibleUserSchedules, setVisibleUserSchedules] = useState<string[]>([
        "Mathejson",
        "Czachaa",
        "Kondi"
    ]);

    const [nickname, setNickname] = useState("bzyku");

    const nicknameChange = (event: ChangeEvent<HTMLInputElement>) => setNickname(event.target.value);

    function commitChanges(changes: ChangeSet) {
        console.log("CHANGE", changes);
        if (changes) {
            if (changes.added) {
                const startingAddedId = scheduleData.length > 0 ? Number((scheduleData[scheduleData.length - 1] && scheduleData[scheduleData.length - 1]).id) + 1 : 0;
                setScheduleData([...scheduleData, { id: startingAddedId, ...changes.added as AppointmentModel }]);
            }
            if (changes.changed) {
                setScheduleData(scheduleData.map(appointment => (
                        (changes.changed || {})[appointment.id as number] ?
                            { ...appointment, ...((changes.changed || {})[appointment.id || 0] || {}) } :
                            appointment)
                    )
                );
            }
            if (changes.deleted !== undefined) {
                setScheduleData(scheduleData.filter(appointment => appointment.id !== changes.deleted));
            }
        }
    }

    function addAppointment(appointmentData: AppointmentModel) {
        console.log(appointmentData, scheduleData);
        if (appointmentData) {
            if (appointmentData.id) {
                setScheduleData(scheduleData.filter(d => d.id !== appointmentData.id));
            } else {
                const newId = Number(scheduleData.length && scheduleData[scheduleData.length - 1].id) + 1;
                setScheduleData([...scheduleData, { ...appointmentData, id: newId, title: "Free time" }]);
            }
        }
    }

    function timeScaleComponent(props: { time?: Date, formatDate: FormatterFn }) {
        if (!props || !props.time || !props.formatDate) {
            return (<React.Fragment/>);
        }
        return (
            <div className="d-flex justify-content-center align-items-center"
                 style={{ height: "48px" }}>
                <span style={{ color: theme.palette.text.primary }}>
                    {props.formatDate(props.time, {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: false
                    })}</span>
            </div>
        )
    }

    function toggleUserScheduleVisibility(userId: string) {
        const isOn = !!visibleUserSchedules.find(s => s === userId);
        const newVisibleSchedules = isOn ? visibleUserSchedules.filter(u => u !== userId) : [...visibleUserSchedules, userId];
        setVisibleUserSchedules(newVisibleSchedules);

        setVisibleScheduleData([...scheduleData.filter(schedule => schedule.userId === nickname || newVisibleSchedules.includes(schedule.userId))]);
    }

    const appointmentComponent = (props: AppointmentsBase.AppointmentContentProps) => {
        console.log(props);
        return (<React.Fragment>{props.children}</React.Fragment>)
    };

    function appointmentContent2(props: AppointmentsBase.AppointmentContentProps) {
        console.log(props);
        return (<div className="h-100" style={{ backgroundColor: props.data.backgroundColor || "#64b5f6" }}>
            <div style={{
                overflow: "hidden",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
            }}>{props.data.nickname !== nickname ? props.data.nickname : props.data.title}</div>
            <div style={{
                overflow: "hidden",
                lineHeight: 1,
                whiteSpace: "pre-wrap",
                textOverflow: "ellipsis"
            }}>
                <div style={{
                    display: "inline-block",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}>
                    {props.formatDate(props.data.startDate, { hour: "numeric", minute: "numeric" })}
                </div>
                <div style={{
                    display: "inline-block",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}>
                    &nbsp;-&nbsp;
                </div>
                <div style={{
                    display: "inline-block",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}>
                    {props.formatDate(props.data.endDate, { hour: "numeric", minute: "numeric" })}
                </div>
            </div>
        </div>);
    }

    return (
        <div id={"schedule-view-container"} className="w-100 px-3">
            <React.Fragment>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <MaterialToolbar/>
                    <div style={{ overflow: "auto" }} className="h-100">
                        DUUUPA
                    </div>
                </Drawer>
            </React.Fragment>
            <Grid container>
                <Grid item md={2} xs={12}>
                    <Paper style={createTopRoundBorder(theme.palette.background.paper)} elevation={2} className="h-100">
                        <h3 className="card-padding" style={{ backgroundColor: theme.palette.divider }}>User
                            submissions</h3>
                        <div className="w-100 h-100">
                            {userSchedules.map(u => (
                                <div className="py-2 d-flex justify-content-between align-items-center card-padding"
                                     key={u.userId} style={{ backgroundColor: theme.palette.grey["700"] }}>
                                    <span style={{
                                        color: String(resources[0].instances.find(i => i.id === u.userId)?.color) || theme.palette.text.disabled
                                    }}>{u.userId}</span>
                                    <IconButton onClick={() => toggleUserScheduleVisibility(u.userId)}>
                                        {visibleUserSchedules?.find(s => s === u.userId) ?
                                            <VisibilitySharp/> :
                                            <VisibilityOffSharp/>}
                                    </IconButton>
                                </div>
                            ))}
                        </div>
                    </Paper>
                </Grid>
                <Grid item md={8} xs={12}>
                    <Container id={"scheduler-container"}>
                        <Paper elevation={2} className="h-100" style={createTopRoundBorder(theme.palette.background.paper)}>
                            <Scheduler
                                data={visibleScheduleData}
                                height={"auto"}
                            >
                                <ViewState
                                    defaultCurrentDate={currentDate}
                                />
                                <Toolbar/>
                                <DateNavigator/>
                                <TodayButton/>
                                <EditingState
                                    onCommitChanges={commitChanges}
                                />
                                <EditRecurrenceMenu/>
                                <WeekView
                                    timeScaleLabelComponent={timeScaleComponent}
                                    startDayHour={0}
                                    endDayHour={24}
                                />
                                <DayView/>
                                <MonthView/>
                                <ViewSwitcher/>
                                <Appointments
                                    // appointmentContentComponent={appointmentComponent}
                                />
                                <Resources data={resources}/>
                                <AppointmentForm onAppointmentDataChange={addAppointment}
                                                 visible={false}
                                />
                                <DragDropProvider
                                />
                            </Scheduler>
                        </Paper>
                    </Container>
                </Grid>
                <Grid item md={2} xs={12}>
                    <Paper>
                        <div className="w-100">
                            <TextField
                                id="nickname"
                                label="Nickname"
                                variant={"filled"}
                                fullWidth={true}
                                required={true}
                                onChange={nicknameChange}
                            />
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default ViewSchedule;
