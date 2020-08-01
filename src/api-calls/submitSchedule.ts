import { ISubmitSchedule } from "../interfaces/ISubmitSchedule";

export async function submitSchedule(scheduleCode: string, scheduleData: ISubmitSchedule) {
    const url = (process.env.REACT_APP_SCHEDULES_API || "https://sfcdc0jj8d.execute-api.eu-central-1.amazonaws.com/dev/v1") + `/schedules/${scheduleCode}/appointments`
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(scheduleData),
        mode: "cors"
    });
    if (res.status === 200 || res.status === 201) {
        return res.json();
    } else {
        console.error("error while submitting schedule", res.json());
        throw new Error(String(res.status));
    }
}