import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";
import { IsEmailAlreadyExist } from "../modules/user/register/isEmailAlreadyExist";
import { InstaUser } from "./instagram/instaUser";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", { unique: true })
  @IsEmailAlreadyExist()
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  @Column("bool", { default: false })
  confirmed: boolean;

  // @Column("simple-array", { nullable: true })
  // instagramUsers: string[];

  @OneToMany(() => InstaUser, instagramUser => instagramUser.user)
  instagramUsers: InstaUser[];
}
