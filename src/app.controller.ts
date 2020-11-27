import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers, Logger,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Todo } from './Todo';
import { JwtService } from './jwt.service';

@Controller('/api/todos')
export class AppController {
  private readonly logger = new Logger(AppController.name)
  constructor(private readonly appService: AppService, private readonly jwtService: JwtService) {
  }

  @Get()
  getTodos() {
    return this.appService.getAllTodos();
  }

  @Get('/:id')
  getTodo(@Param('id') id: string): Todo {

    return this.appService.getTodo(id);
  }

  @Post()
  createTodo(@Body() todo: Todo, @Headers('Authorization') bearer: string): Todo {
    const principal = this.authorize(bearer);
    this.logger.log(`${principal} Created a Todo`);
    return this.appService.addTodo(todo);
  }

  @Put(':id')
  updateTodo(@Param('id') id: string, @Body() todo: Todo) {
    if (id != todo.id) {
      return new BadRequestException();
    }
    return this.appService.updateTodo(todo);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    this.appService.deleteTodo(id);
  }

  private authorize(bearer: string): string {
    if (!bearer || bearer == '') {
      throw new UnauthorizedException();
    }

    const credentials = bearer.split(' ');

    if (credentials[0] != 'Bearer') {
      throw new BadRequestException();
    }

    const token = credentials[1];

    try {
      const payload = this.jwtService.verify(token, 'The secret ingredient is... nothing!') as Object;
      return payload['name'];
    } catch (e) {
      throw new UnauthorizedException();
    }


  }
}
