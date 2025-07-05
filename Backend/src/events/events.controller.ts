import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { eventsRoutes } from './events.contract';
import { EventsService } from './events.service';
import { initContract } from '@ts-rest/core';

const c = initContract();
const eventsContract = c.router(eventsRoutes);

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @TsRestHandler(eventsContract.crawlEvents)
  async crawlEvents() {
    return tsRestHandler(eventsContract.crawlEvents, async ({ body }) => {
      const result = await this.eventsService.crawlAndSaveEvents(
        body.url,
        body.instructions,
      );

      if (result.success) {
        return {
          status: 200,
          body: {
            success: result.success,
            message: result.message,
            eventsCount: result.eventsCount,
          },
        };
      } else {
        return {
          status: 500,
          body: {
            success: result.success,
            message: result.message,
            eventsCount: result.eventsCount,
          },
        };
      }
    });
  }

  @TsRestHandler(eventsContract.getEvents)
  async getEvents() {
    return tsRestHandler(eventsContract.getEvents, async () => {
      const events = await this.eventsService.getAllEvents();

      return {
        status: 200,
        body: events,
      };
    });
  }
}
