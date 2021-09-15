import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * TypeORM entity about an user
 */
@Entity()
export class User {
  /** The ID (uuid) of the user
   * @type {string}
   */
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  /** The email address of the user
   * @type {string}
   */
  @Column({ unique: true })
  public email: string;

  /** The username of the user
   * @type {string}
   */
  @Column({ unique: true })
  public name: string;

  /** The email address of the user
   * @type {boolean}
   * @default false
   */
  @Column({ type: 'boolean', default: false })
  public isAdmin: boolean;

  /** The hashed refresh token of the user
   * It is excluded from the Http responses
   * @type {string | null}
   */
  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  /** The hashed password of the user
   * It is excluded from the Http responses
   * @type {string | null}
   */
  @Column()
  @Exclude()
  public password: string;
}
