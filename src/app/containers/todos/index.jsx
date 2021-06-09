import React, { Component } from 'react';
import TodosApi from '../../../api/todosApi';

import './styles.scss';
import { ReactComponent as Arrow } from './assets/arrow.svg';
import { ReactComponent as Checkmark } from './assets/check-mark.svg';

class Todos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
      todo: '',
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

  render() {
    const { todos, todo } = this.state;
    const { handleChange, handleKeyPress } = this;

    console.log('todos', todos);
    /**
     * @enterbutton
     * @should clear input field
     * @should create a new todo, @POST method
     * @should add created todo to @todos
     */

    return (
      <div className="container">
        <h1 className="heading-primary u-margin-bottom-medium">todos</h1>

        <div className="content">
          <div className="content__input">
            <button
              className={`content__button ${
                todos?.length > 0 ? 'content__button--show' : ''
              }`}
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
                <li key={todo.id} className="content__todo">
                  <div className="content__checkbox">{/* <Checkmark /> */}</div>

                  {todo.content}
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
