import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert(){
    console.log('Inserted User with ID: ', this.id);
  }

  @AfterUpdate()
  logUpdate(){
    console.log('Updated User with ID: ', this.id);
  }

  @AfterRemove()
  logRemove(){
    console.log('Removed User with ID: ', this.id);
  }
}