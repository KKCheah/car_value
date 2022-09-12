import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Session,
  UseGuards
} from '@nestjs/common';
import { createUserDto } from './dtos/createUser.dto';
import { updateUserDto } from './dtos/updateUser.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { userDto } from './dtos/userDto';
import { CurrentUser } from './decorators/current-user.decorator';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('auth')
@Serialize(userDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  /*
  @Get('/whoami')
  whoAmI(@Session() session: any) {
    if(!session.userId){
      throw new NotFoundException('there is no user in session')
    }
    return this.userService.findOne(session.userId);
  }
  */
  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }


  @Post('/signup')
  async createUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signinUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any){
    session.userId = null;
  }

  // before using decorator -> @UseInterceptors(new SerializerInterceptor(userDto))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running');
    const result = await this.userService.findOne(parseInt(id));

    if (!result) {
      throw new NotFoundException('user does not exist');
    }

    return result;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: updateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  /* cookie explanation
  @Get('/color/:color')
  setColor(@Param('color') color: string, @Session() session: any){
    session.color = color;
  }

  @Get('/color')
  getColor(@Session() session:any){
    return session.color;
  }
  */
}
