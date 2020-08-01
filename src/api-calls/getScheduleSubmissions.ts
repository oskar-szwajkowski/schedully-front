import { IScheduleAppointments } from "../interfaces/IScheduleAppointments";

export async function getScheduleSubmissions(scheduleCode: string): Promise<IScheduleAppointments> {
    const url = (process.env.REACT_APP_SCHEDULES_API || "https://sfcdc0jj8d.execute-api.eu-central-1.amazonaws.com/dev/v1") + `/schedules/${scheduleCode}/appointments`
    const res = await fetch(url, {
        method: "GET",
        mode: "cors"
    });
    if (res.status === 200) {
        return res.json();
    } else {
        console.error("error while creating schedule", res.json());
        throw new Error(String(res.status));
    }
}