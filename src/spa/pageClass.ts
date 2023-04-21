import { AbstractPage } from "./abstractPage";

export interface PageClass {
    new(...args: any[]): AbstractPage;
};