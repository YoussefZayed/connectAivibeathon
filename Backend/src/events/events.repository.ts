import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../core/db/db.service';

export interface EventData {
    event_name: string;
    event_description: string;
    event_date: Date;
    image_url: string;
}

@Injectable()
export class EventsRepository {
    constructor(private readonly databaseService: DatabaseService) {}

    async createEvent(eventData: EventData) {
        return await this.databaseService.db
            .insertInto('eventsData')
            .values(eventData)
            .returning(['id', 'createdAt', 'event_name', 'event_description', 'event_date', 'image_url'])
            .executeTakeFirstOrThrow();
    }

    async createManyEvents(eventsData: EventData[]) {
        return await this.databaseService.db
            .insertInto('eventsData')
            .values(eventsData)
            .execute();
    }

    async getAllEvents() {
        return await this.databaseService.db
            .selectFrom('eventsData')
            .selectAll()
            .orderBy('event_date', 'asc')
            .execute();
    }
} 