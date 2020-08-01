import { IScheduleDefinition } from "../interfaces/IScheduleDefinition";

export async function createSchedule(title: string, nickname: string, description?: string): Promise<IScheduleDefinition> {
    const url = (process.env.REACT_APP_SCHEDULES_API || "https://sfcdc0jj8d.execute-api.eu-central-1.amazonaws.com/dev/v1") + "/schedules"
    const body: any = {
        title,
        nickname
    }
    if (description) {
        body.description = description;
    }
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        mode: "cors"
    })
    if (res.status === 200) {
        return res.json();
    } else {
        console.error("error while creating schedule", res.json());
        throw new Error(String(res.status));
    }
}