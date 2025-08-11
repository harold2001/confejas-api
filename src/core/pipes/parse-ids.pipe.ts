import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIdsPipe implements PipeTransform<string, number[]> {
  transform(value: string): number[] {
    if (!value) {
      throw new BadRequestException('El parámetro IDs es obligatorio');
    }
    const ids = value.split(',').map((id) => {
      const parsed = Number(id);
      if (isNaN(parsed)) {
        throw new BadRequestException(`ID inválido: ${id}`);
      }
      return parsed;
    });
    return ids;
  }
}
