import React, { Component } from 'react';
import TodosApi from '../../../api/todosApi';

import './styles.scss';
import { ReactComponent as Arrow } from './assets/arrow.svg';
import { ReactComponent as Checkmark } from './assets/check-mark.svg';
import { ReactComponent as X } from './assets/x.svg';

class Todos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      todo: '',
      // allCompleted: this.state.todos?.reduce((acc, todo) => {
      //   if ( todo.isDone)
      // }, true)
    };
  }

  async componentDidMount() {
    // const { todos } = this.state;
    const res = await TodosApi.getAllTodos();

    this.setState({ todos: res });
  }

  handleChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  handleKeyPress = async (e) => {
    const { todo, todos } = this.state;

    const reqBody = {
      content: todo,
      isDone: false,
    };

    if (e.key === 'Enter') {
      const res = await TodosApi.createTodo(reqBody);

      this.setState({
        todo: '',
        todos: [...todos, res],
      });
    }
  };

  toggleComplete = async (todo) => {
    const { todos } = this.state;

    const reqBody = {
      id: todo.id,
      data: {
        isDone: !todo.isDone,
      },
    };
    const res = await TodosApi.toggleComplete(reqBody);

    /**
     * find todo in current todos that match res todo
     * update that object
     * then setState of todos with current positioning
     * updates todo in place
     */
    const todoIndex = todos.findIndex((todo) => todo.id === res.id);

    if (todoIndex > -1) {
      todos.splice(todoIndex, 1, res);
    } else {
      console.log('todo to be updated not found');
    }

    this.setState({
      todos: todos,
    });
  };

  deleteTodo = async (id) => {
    const { todos } = this.state;

    const res = await TodosApi.deleteTodo(id);

    const todoIndex = todos.findIndex((todo) => todo.id === res.id);

    if (todoIndex > -1) {
      todos.splice(todoIndex, 1);
    } else {
      console.log('todo to be deleted not found');
    }

    this.setState({
      todos: todos,
    });
  };

  toggleCompleteAll = async (allCompleted) => {
    const { todos } = this.state;

    let res;
    const reqBody = {
      todos,
      data: {
        isDone: false,
      },
    };

    /**
     * If all are isDone: true(allCompleted)
     * Send all todos and make them false
     *
     * Else, filter isDone: false todos
     * Send all incompleted todos and make them true
     *
     * Once response is received, change all this.state.todos in place
     */
    if (allCompleted) {
      res = await TodosApi.toggleCompleteAll(reqBody);
    } else {
      const falseTodos = todos.filter((todo) => todo.isDone === false);

      reqBody.todos = falseTodos;
      reqBody.data.isDone = true;
      res = await TodosApi.toggleCompleteAll(reqBody);
    }

    const updateTodos = todos.map((todo) => {
      const found = res.find((t) => t.data.id === todo.id);

      if (found) {
        todo.isDone = found.data.isDone;
      }

      return todo;
    });

    this.setState({
      todos: updateTodos,
    });

    console.log('frontend response', res);
  };

  render() {
    const { todos, todo } = this.state;
    const {
      handleChange,
      handleKeyPress,
      toggleComplete,
      deleteTodo,
      toggleCompleteAll,
    } = this;

    let allCompleted = true;

    for (const t of todos) {
      if (t.isDone === false) {
        allCompleted = false;
        break;
      }
    }

    console.log('todos', todos);

    return (
      <div className="container">
        <h1 className="heading-primary u-margin-bottom-medium">todos</h1>

        <div className="content">
          <div className="content__input">
            <button
              onClick={() => toggleCompleteAll(allCompleted)}
              className={`content__button ${
                todos?.length > 0 ? 'content__button--show' : ''
              } ${allCompleted ? 'content__button--done' : ''}`}
            >
              <Arrow />
            </button>

            <input
              type="text"
              placeholder="What needs to be done?"
              name="todo"
              id="todo"
              value={todo}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
          </div>

          <ul className="content__todos">
            {todos?.map((todo) => {
              return (
                <li
                  key={todo.id}
                  className={`content__todo ${
                    todo.isDone ? 'content__todo--done' : ''
                  }`}
                >
                  <div
                    onClick={() => toggleComplete(todo)}
                    className={`content__checkbox ${
                      todo.isDone ? 'content__checkbox--done' : ''
                    }`}
                  >
                    {todo.isDone && (
                      <span className="content__checkmark">
                        <Checkmark />
                      </span>
                    )}
                  </div>

                  {todo.content}

                  <span
                    onClick={() => deleteTodo(todo.id)}
                    className="content__delete"
                  >
                    <X />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Todos;
