import { SkipApiTransform } from '@common/api/decorator';
import { Controller, Get } from '@nestjs/common';

@SkipApiTransform()
@Controller('health')
export class HealthController {
  @Get('live')
  live() {
    return { status: 'ok' };
  }
}
