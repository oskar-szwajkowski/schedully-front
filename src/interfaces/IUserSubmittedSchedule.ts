import { AppointmentModel } from "@devexpress/dx-react-scheduler";

export interface IUserSubmittedSchedule {
    userId: string;
    nickname: string;
    appointments: AppointmentModel[]
}