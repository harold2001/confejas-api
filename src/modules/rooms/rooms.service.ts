import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomRepository } from './repositories/rooms.repository';
import { Room } from '@app/modules/rooms/entities/room.entity';
import { FloorRepository } from '@app/modules/floors/repositories/floors.repository';
import { RoomTypeRepository } from '@app/modules/room-types/repositories/room-types.repository';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly floorRepository: FloorRepository,
    private readonly roomTypeRepository: RoomTypeRepository,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const { floorId, roomTypeId, ...roomData } = createRoomDto;

    const floor = await this.floorRepository.findById(floorId);
    if (!floor) {
      throw new NotFoundException(`Floor with ID ${floorId} not found`);
    }

    const roomType = await this.roomTypeRepository.findById(roomTypeId);
    if (!roomType) {
      throw new NotFoundException(`Room type with ID ${roomTypeId} not found`);
    }

    const room = await this.roomRepository.create({
      ...roomData,
      floor,
      roomType,
    });
    return room;
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.findAll();
  }

  async findOne(id: string): Promise<Room> {
    return this.roomRepository.findById(id);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const { floorId, roomTypeId, ...roomData } = updateRoomDto;

    const updateData: any = { ...roomData };

    if (floorId) {
      const floor = await this.floorRepository.findById(floorId);
      if (!floor) {
        throw new NotFoundException(`Floor with ID ${floorId} not found`);
      }
      updateData.floor = floor;
    }

    if (roomTypeId) {
      const roomType = await this.roomTypeRepository.findById(roomTypeId);
      if (!roomType) {
        throw new NotFoundException(
          `Room type with ID ${roomTypeId} not found`,
        );
      }
      updateData.roomType = roomType;
    }

    return this.roomRepository.update(id, updateData);
  }

  async remove(id: string): Promise<Room> {
    return this.roomRepository.delete(id);
  }

  async findAllWithDetails() {
    const rooms = await this.roomRepository.findAll();

    // Agrupar por edificio y piso
    const grouped = rooms.reduce((acc, room) => {
      if (!room.floor?.building) return acc;

      const buildingId = room.floor.building.id;
      const buildingName = room.floor.building.name;
      const floorId = room.floor.id;
      const floorNumber = room.floor.number;

      if (!acc[buildingId]) {
        acc[buildingId] = {
          id: buildingId,
          name: buildingName,
          floors: {},
        };
      }

      if (!acc[buildingId].floors[floorId]) {
        acc[buildingId].floors[floorId] = {
          id: floorId,
          floorNumber,
          rooms: [],
        };
      }

      // Contar ocupantes activos
      const activeUserRooms =
        room.userRooms?.filter(
          (ur) =>
            ur.isActive && (ur.user.hasArrived || ur.user.hasOneRole('Staff')),
        ) || [];

      const occupiedBeds = activeUserRooms?.length || 0;

      acc[buildingId].floors[floorId].rooms.push({
        id: room.id,
        roomNumber: room.roomNumber,
        totalBeds: room.totalBeds || 0,
        occupiedBeds,
        roomType: room.roomType
          ? {
              id: room.roomType.id,
              name: room.roomType.name,
            }
          : null,
        occupants: activeUserRooms?.map((ur) => ({
          id: ur.user.id,
          firstName: ur.user.firstName,
          lastName: `${ur.user.paternalLastName}${ur.user.maternalLastName ? ' ' + ur.user.maternalLastName : ''}`,
          email: ur.user.email,
          hasArrived: ur.user.hasArrived,
        })),
      });

      return acc;
    }, {});

    // Convertir a array y ordenar
    const buildings = Object.values(grouped).map((building: any) => ({
      id: building.id,
      name: building.name,
      floors: Object.values(building.floors)
        .sort((a: any, b: any) => a.floorNumber - b.floorNumber)
        .map((floor: any) => ({
          ...floor,
          rooms: floor.rooms.sort((a: any, b: any) =>
            a.roomNumber.localeCompare(b.roomNumber, undefined, {
              numeric: true,
              sensitivity: 'base',
            }),
          ),
        })),
    }));

    return buildings;
  }

  async findAllWithUserCount(): Promise<Array<Room & { userCount: number }>> {
    return this.roomRepository.findAllWithUserCount();
  }
}
