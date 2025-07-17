import { MODE } from "consts/mode.const";

export interface EarthquakeEvent {
    id?: string;
    name?: string;
    timeOpened?: Date;
    mode: MODE;
    earthquakeTime: Date;
    earthquakeMagnitude: number;
}
