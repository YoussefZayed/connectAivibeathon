import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type eventsData = {
    id: Generated<number>;
    createdAt: Generated<Timestamp>;
    event_name: string;
    event_description: string;
    event_date: Timestamp;
    image_url: string;
};
export type health = {
    id: Generated<number>;
    createdAt: Generated<Timestamp>;
};
export type user = {
    id: Generated<number>;
    createdAt: Generated<Timestamp>;
    username: string;
    password: string;
};
export type user_contacts = {
    id: Generated<number>;
    createdAt: Generated<Timestamp>;
    user_id: number;
    contact_id: number;
};
export type DB = {
    eventsData: eventsData;
    health: health;
    user: user;
    user_contacts: user_contacts;
};
