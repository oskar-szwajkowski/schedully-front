import {
    AllDayPanel,
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
} from "@devexpress/dx-react-scheduler-material-ui";
import {
    AppointmentModel,
    ChangeSet,
    EditingState,
    FormatterFn,
    Resource,
    ResourceInstance,
    ViewState,
} from "@devexpress/dx-react-scheduler";
import React, { ChangeEvent, MouseEventHandler, useEffect, useRef, useState } from "react";
import {
    Backdrop,
    CircularProgress,
    Container,
    Drawer,
    Grid,
    Hidden,
    IconButton,
    Paper,
    Toolbar as MaterialToolbar,
    useTheme
} from "@material-ui/core";
import "./ViewSchedule.css";
import TextField from "@material-ui/core/TextField";
import { createFakeToolbarClass, createTopRoundBorder } from "../../utils/styles";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import UserSubmissions from "../user-submissions/UsersSubmissions";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import { getScheduleSubmissions } from "../../api-calls/getScheduleSubmissions";
import { ISubmitSchedule } from "../../interfaces/ISubmitSchedule";
import { IAppointment } from "../../interfaces/IAppointment";
import { generateRandomName } from "../../utils/utilFunctions";
import { submitSchedule } from "../../api-calls/submitSchedule";

const yourColor = '#42d4f4';
const availableColors = [
    '#e6194B', '#3cb44b',
    '#4363d8', '#f58231', '#f032e6',
    '#fabed4', '#469990', '#dcbeff',
    '#9A6324', '#fffac8', '#800000',
    '#aaffc3', '#000075', '#a9a9a9'
];

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        width: drawerWidth / 2,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.background.paper,
    },
    ...createFakeToolbarClass(theme)
}));


function getVisibleSchedules(data: AppointmentModel[], visibleSchedules: string[], nickname: string) {
    return [...data.filter(schedule => schedule.userId === nickname || visibleSchedules.includes(schedule.userId))]
}

function convertSubmissions(submissions: ISubmitSchedule[]) {
    return submissions.flatMap(submission =>
        submission.appointments.map<AppointmentModel>((appointment: IAppointment, index) => ({
            id: index,
            userId: submission.userId || submission.nickname,
            nickname: submission.nickname,
            startDate: Number(appointment.startDate),
            endDate: Number(appointment.endDate),
            title: submission.userId || submission.nickname
        }))
    )
}

const defaultTitle = "Free time";

const randomName = generateRandomName();
const initialName = localStorage.getItem("nickname") || randomName;
console.log("LOADED INITIAL NICKNAME", initialName);
let nickname = initialName;

function ViewSchedule() {

    const { scheduleCode } = useParams();
    const currentDate = new Date();

    const [scheduleData, setScheduleData] = useState<AppointmentModel[]>([])
    const [visibleScheduleData, setVisibleScheduleData] = useState(scheduleData);
    const [resources, setResources] = useState<Resource[]>([{
        fieldName: "userId",
        title: "Submitter",
        instances: []
    }]);
    const [visibleUserSchedules, setVisibleUserSchedules] = useState<string[]>([initialName]);

    // Pure visual state
    const theme = useTheme();
    const classes = useStyles(theme);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const codeInputRef = useRef(null);
    const [apiCallInProgress, setApiCallInProgress] = useState(true);

    useEffect(() => {
        getScheduleSubmissions(scheduleCode)
            .then(submissions => {
                const instances = convertSubmissionsToInstances(submissions.submissions);
                setResources(r => [{
                    ...r[0],
                    instances: convertSubmissionsToInstances(submissions.submissions)
                }]);
                setScheduleData(convertSubmissions(submissions.submissions));
                setVisibleUserSchedules(v => [...v, ...instances.map(i => String(i.id))]);
            }).then(() => setApiCallInProgress(false));
    }, [scheduleCode])

    const nicknameChange = (event: ChangeEvent<HTMLInputElement>) => {
        nickname = event.target.value;
    }

    useEffect(() => {
            setVisibleScheduleData(getVisibleSchedules(scheduleData, visibleUserSchedules, initialName));
        },
        [visibleUserSchedules, scheduleData]
    );

    function convertSubmissionsToInstances(submissions: ISubmitSchedule[]): ResourceInstance[] {
        return submissions.map((submission, index) => ({
            id: submission.userId || submission.nickname,
            text: submission.userId || submission.nickname,
            color: submission.nickname === initialName ? yourColor : (availableColors[index] || "#a9a9a9")
        }));
    }

    function commitChanges(changes: ChangeSet) {
        console.log(changes);
        if (changes) {
            if (changes.added) {
                const startingAddedId = scheduleData.length > 0 ? Number((scheduleData[scheduleData.length - 1] && scheduleData[scheduleData.length - 1]).id) + 1 : 0;
                setScheduleData([...scheduleData, { id: startingAddedId, ...changes.added as AppointmentModel }]);
            }
            if (changes.changed) {
                const changedAppointmentId = Number(Object.keys(changes.changed)[0]);
                const changedAppointment = scheduleData.find(s => s.id === changedAppointmentId);
                if (changedAppointment && changedAppointment.userId === initialName) {
                    const newScheduleData = scheduleData.map(appointment => (
                        (changes.changed || {})[appointment.id as number] ?
                            { ...appointment, ...((changes.changed || {})[appointment.id || 0] || {}) } :
                            appointment)
                    )
                    setScheduleData(newScheduleData);
                }
            }
            if (changes.deleted !== undefined) {
                setScheduleData(scheduleData.filter(appointment => appointment.id !== changes.deleted));
            }
        }
    }

    function getNewAppointmentId(): number {
        return Number(scheduleData.length && scheduleData[scheduleData.length - 1].id) + 1;
    }

    function addOrDeleteAppointment(appointmentData: AppointmentModel) {
        console.log(appointmentData);
        if (appointmentData) {
            let newScheduleData: AppointmentModel[];
            if ((appointmentData.id || appointmentData.id === 0) && appointmentData.userId === initialName) {
                newScheduleData = scheduleData.filter(d => d.id !== appointmentData.id)
            } else {
                newScheduleData = [...scheduleData, {
                    ...appointmentData,
                    id: getNewAppointmentId(),
                    title: defaultTitle,
                    userId: initialName,
                    nickname: initialName
                }];
            }
            setScheduleData(newScheduleData);
        }
    }

    function addAllDayAppointment({ startDate, endDate}: { startDate: Date, endDate: Date }) {
        const newAppointment: AppointmentModel = {
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            allDay: true,
            id: getNewAppointmentId(),
            title: defaultTitle,
            userId: initialName,
            nickname: initialName
        };
        setScheduleData([...scheduleData, newAppointment]);
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
    }

    const submitScheduleHandler: MouseEventHandler = event => {
        event.preventDefault();
        // @ts-ignore
        const isValid = event.currentTarget.form.reportValidity();
        if (isValid) {
            const currentUserAppointments = scheduleData.filter(s => s.nickname === initialName)
                .map(s => ({ startDate: Number(s.startDate), endDate: Number(s.endDate), allDay: s.allDay || false}));
            const scheduleSubmission: ISubmitSchedule = {
                nickname: nickname,
                userId: nickname,
                appointments: currentUserAppointments
            }
            setApiCallInProgress(true);
            submitSchedule(scheduleCode, scheduleSubmission)
                .then(() => {
                    localStorage.setItem("nickname", nickname);
                    setApiCallInProgress(false);
                });
        }
    }

    function handleDrawerToggle() {
        setDrawerOpen(!drawerOpen);
    }

    const Appointment = (props: any) => (
        <Appointments.Appointment
            {...props}
            style={{
                ...props.style,
                textShadow: "0px 0px 2px black",
            }}
        >
            {props.children}
        </Appointments.Appointment>
    );

    const DraftAppointmentComponent = (props: any) => (
        <DragDropProvider.DraftAppointment {...props} style={{
            ...props.style,
            textShadow: "0px 0px 2px black",
        }}>
            {props.children}
        </DragDropProvider.DraftAppointment>
    )

    const AllDayCell = (props: any) => (
        <AllDayPanel.Cell {...props} style={{
            ...props.style,
            textShadow: "0px 0px 2px black",
        }} onDoubleClick={() => addAllDayAppointment(props)}>
            {props.children}
        </AllDayPanel.Cell>
    )

    const AllDayAppointmentLayer = (props: any) => (
        <AllDayPanel.AppointmentLayer {...props} style={{
            ...props.style,
            textShadow: "0px 0px 2px black",
        }}>
            {console.log(props)}
            {props.children}
        </AllDayPanel.AppointmentLayer>
    )

    return (
        <div id={"schedule-view-container"} className="w-100 pt-2">
            <Hidden xsDown>
                <Drawer
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: drawerOpen,
                        [classes.drawerClose]: !drawerOpen
                    })}
                    variant="permanent"
                    classes={{
                        paper: clsx(classes.drawer, {
                            [classes.drawerOpen]: drawerOpen,
                            [classes.drawerClose]: !drawerOpen
                        })
                    }}
                >
                    <MaterialToolbar/>
                    <UserSubmissions
                        currentUser={initialName}
                        instances={resources[0].instances}
                        visibleUserSchedules={visibleUserSchedules}
                        toggleUserScheduleVisibility={toggleUserScheduleVisibility}
                        minified={!drawerOpen}
                        child={
                            <IconButton onClick={handleDrawerToggle}>
                                {drawerOpen ? <ChevronLeft/> : <ChevronRight/>}
                            </IconButton>
                        }
                    />
                </Drawer>
            </Hidden>
            <Grid container id={"view-container"} direction={"column"}>
                <div className={classes.fakeToolbar}/>
                <Grid container direction={"row"}>
                    <Hidden smUp>
                        <Grid item xs={12} className="xs-mb-2 px-16-mobile">
                            <UserSubmissions
                                currentUser={initialName}
                                instances={resources[0].instances}
                                visibleUserSchedules={visibleUserSchedules}
                                toggleUserScheduleVisibility={toggleUserScheduleVisibility}
                                minified={false}
                            />
                        </Grid>
                    </Hidden>
                    <Grid item md={10} xs={12} className="xs-mb-2">
                        <Container maxWidth={"xl"} id={"scheduler-container"}>
                            <Paper elevation={2} className="h-100"
                                   style={createTopRoundBorder(theme.palette.background.paper)}>
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
                                    <AllDayPanel
                                        cellComponent={AllDayCell}
                                        appointmentLayerComponent={AllDayAppointmentLayer}
                                    />
                                    <Appointments
                                        appointmentComponent={Appointment}
                                    />
                                    <Resources data={resources}/>
                                    <AppointmentForm onAppointmentDataChange={addOrDeleteAppointment}
                                                     visible={false}
                                    />
                                    <DragDropProvider
                                        draftAppointmentComponent={DraftAppointmentComponent}
                                    />
                                </Scheduler>
                            </Paper>
                        </Container>
                    </Grid>
                    <Grid item md={2} xs={12} className="px-16-mobile">
                        <Paper className="mb-2">
                            <div className="w-100 card-padding">
                                <TextField
                                    fullWidth={true}
                                    label="Schedule code"
                                    id="schedule-code-input"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                    onClick={() => {
                                        // @ts-ignore
                                        codeInputRef.current?.select();
                                        document.execCommand("copy");
                                    }}
                                    inputRef={codeInputRef}
                                    value={scheduleCode}
                                    variant="filled"
                                />
                            </div>
                        </Paper>
                        <Paper className="mb-2">
                            <div className="w-100 card-padding">
                                <p className="mb-3">Double click on empty cell to generate new free time.</p>
                                <p className="mb-3">Double click on existing free time, to delete it.</p>
                                <form>
                                    <TextField
                                        id="nickname"
                                        label="Nickname"
                                        variant={"filled"}
                                        fullWidth={true}
                                        required={true}
                                        defaultValue={initialName}
                                        onChange={nicknameChange}
                                        className="mb-3"
                                    />
                                    <div className="d-flex justify-content-end">
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            type={"submit"}
                                            onClick={submitScheduleHandler}>Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={apiCallInProgress}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        </div>
    );
}

export default ViewSchedule;
