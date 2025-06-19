import { MODE } from "consts/mode.const";

export interface EarthquakeEvent {
    name?: string;
    timeOpened?: Date;
    mode: MODE;
    earthquakeTime: Date;
    earthquakeMagnitude: number;
}
