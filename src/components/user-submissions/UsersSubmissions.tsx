import { createTopRoundBorder } from "../../utils/styles";
import { IconButton, Paper, useTheme } from "@material-ui/core";
import { VisibilityOffSharp, VisibilitySharp } from "@material-ui/icons";
import React from "react";
import { ResourceInstance } from "@devexpress/dx-react-scheduler";

interface IUserSubmissionsProps {
    instances: ResourceInstance[];
    visibleUserSchedules: string[];
    toggleUserScheduleVisibility: (userId: string) => void;
    minified: boolean;
    currentUser: string;
    child?: React.ReactNode;
}

function UserSubmissions(props: IUserSubmissionsProps) {

    const theme = useTheme();

    function renderUserSubmissions(userSubmission: ResourceInstance) {
        return (
            <div className="py-2 d-flex justify-content-between align-items-center card-padding"
                 key={userSubmission.id} style={{ backgroundColor: theme.palette.type === "dark" ? theme.palette.grey["700"] : theme.palette.grey["500"] }}>
                        <span style={{
                            color: String(userSubmission?.color) || theme.palette.text.disabled
                        }}>{userSubmission.id}</span>
                <IconButton onClick={() => props.toggleUserScheduleVisibility(String(userSubmission.id))}>
                    {props.visibleUserSchedules?.find(s => s === userSubmission.id) ?
                        <VisibilitySharp/> :
                        <VisibilityOffSharp/>}
                </IconButton>
            </div>
        )
    }

    function renderUserSubmissionsMinified(userSubmission: ResourceInstance) {
        return (
            <div className="py-2 d-flex justify-content-between align-items-center card-padding"
                 key={userSubmission.id} style={{ backgroundColor: theme.palette.type === "dark" ? theme.palette.grey["700"] : theme.palette.grey["500"] }}>
                <div style={{
                    backgroundColor: String(userSubmission?.color) || theme.palette.text.disabled,
                    height: "25px",
                    width: "25px",
                    borderRadius: "50%",
                    display: "inline-block"
                }}/>
                <IconButton onClick={() => props.toggleUserScheduleVisibility(String(userSubmission.id))}>
                    {props.visibleUserSchedules?.find(s => s === userSubmission.id) ?
                        <VisibilitySharp/> :
                        <VisibilityOffSharp/>}
                </IconButton>
            </div>
        )
    }

    function withoutCurrentUser(resource: ResourceInstance): boolean {
        return resource.id !== props.currentUser;
    }

    return (
        <Paper style={{ ...createTopRoundBorder(theme.palette.background.paper), overflow: "auto" }}
               className="h-100 pt-2" elevation={2}>
            <div className="card-padding d-flex align-items-center" style={{ backgroundColor: theme.palette.divider }}>
                {!props.minified && <h4>User submissions</h4>}
                {props.child}
            </div>
            <div className="w-100">
                {!props.minified && props.instances.filter(withoutCurrentUser).map(renderUserSubmissions)}
                {props.minified && props.instances.filter(withoutCurrentUser).map(renderUserSubmissionsMinified)}
            </div>
        </Paper>
    )
}

export default UserSubmissions;
