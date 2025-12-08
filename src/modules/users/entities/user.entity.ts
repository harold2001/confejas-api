import { BaseModel } from '@app/core/models/base.model';
import { Role } from '@app/modules/roles/entities/role.entity';
import { Stake } from '@app/modules/stakes/entities/stake.entity';
import { UserRoom } from '@app/modules/user-rooms/entities/user-room.entity';
import { Company } from '@app/modules/companies/entities/company.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  AfterLoad,
} from 'typeorm';
import { UserStatus } from '@app/core/enums/user-status';
import { Gender } from '@app/core/enums/gender';

@Entity({ name: 'users' })
export class User extends BaseModel {
  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column({ nullable: false })
  paternalLastName: string;

  @Column({ nullable: true })
  maternalLastName?: string;

  @Column({ nullable: true, unique: false })
  dni?: string;

  @Column({ type: 'varchar', nullable: true })
  birthDate?: string;

  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender?: Gender;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ default: false })
  hasArrived: boolean;

  @Column({ nullable: true, type: 'text' })
  medicalCondition?: string;

  @Column({ nullable: true, type: 'text' })
  medicalTreatment?: string;

  @Column({ nullable: true })
  keyCode?: string;

  @Column({ nullable: true })
  ward?: string;

  @ManyToOne(() => Stake, (stake) => stake.users)
  stake?: Stake;

  @ManyToOne(() => Company, (company) => company.users)
  company?: Company;

  @Column({ nullable: true })
  age?: string;

  @Column({ default: true })
  isMemberOfTheChurch?: boolean;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column({ nullable: true, type: 'enum', enum: UserStatus })
  status?: UserStatus;

  @Column({ nullable: true, type: 'varchar' })
  shirtSize?: string;

  @Column({ nullable: true, type: 'varchar' })
  bloodType?: string;

  @Column({ nullable: true, type: 'varchar' })
  healthInsurance?: string;

  @Column({ nullable: true, type: 'varchar' })
  emergencyContactName?: string;

  @Column({ nullable: true, type: 'varchar' })
  emergencyContactPhone?: string;

  @Column({ type: 'boolean', default: false })
  qrSent?: boolean;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => UserRoom, (userRoom) => userRoom.user)
  userRooms: UserRoom[];

  @ManyToOne(() => User, { nullable: true })
  replacedBy?: User;

  @AfterLoad()
  sortUserRooms() {
    if (this.userRooms && this.userRooms.length > 0) {
      this.userRooms.sort((a, b) => {
        // Primero las activas
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        // Luego por fecha de actualización (más reciente primero)
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async encryptPassword() {
    try {
      this.password = await hash(this.password, await genSalt(10));
    } catch (e) {
      throw new InternalServerErrorException('Error encrypting password');
    }
  }

  public async validatePassword(password: string): Promise<boolean> {
    try {
      return await compare(password, this.password);
    } catch (e) {
      throw new InternalServerErrorException('Error validating password');
    }
  }
}
