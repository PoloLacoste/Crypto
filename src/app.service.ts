import { Injectable } from '@nestjs/common';
import { Todo } from './Todo';
import { Guid } from 'guid-typescript';

@Injectable()
export class AppService {

  private todos: Array<Todo> = [
    new Todo('test1', 'content1',"e58870be-402b-4fa0-8ac3-c26b7b0063cc"),
    new Todo('test2', 'content2',"30060182-5e57-4231-bfac-bf4fbadaed31"),
    new Todo('test3', 'content3',"cce0e0b9-e663-4295-8e53-b25640f913ca"),
    new Todo('test4', 'content4',"46791e51-149f-4b15-9762-95a3293bbe76"),
  ];

  getAllTodos(): Array<Todo> {
    return [...this.todos];
  }

  getTodo(id: string): Todo {
    return this.todos.filter(todo => todo.id == id)[0]
  }

  addTodo(todo: Todo): Todo {
    const newTodo = new Todo(todo.title, todo.content,Guid.create().toString());
    this.todos.push(newTodo);
    return newTodo;
  }

  deleteTodo(id: string){
    this.todos = this.todos.filter(todo => todo.id != id);
  }

  updateTodo(todo: Todo){
    this.deleteTodo(todo.id);
    this.todos.push(todo);
  }

}
