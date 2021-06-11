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
      tab: 'all',
    };
  }

  getTodos = async () => {
    const { location } = this.props;
    const search = location.search;
    const res = await TodosApi.getAllTodos(search);
    this.setState({ todos: res });
  };

  componentDidMount() {
    // const { location } = this.props;
    // // handle url search here
    // // console.log('thisisisisisisisi', this.props);
    // const search = location.search;
    // console.log('searrrccchhh', search);
    // const res = await TodosApi.getAllTodos(search);
    // this.setState({ todos: res });
    return this.getTodos();
  }

  componentDidUpdate(prevProps) {
    // console.log('didUpdatePrevProps', prevProps);
    // console.log('didUpdate thisProps', this.props);

    if (prevProps.location.search !== this.props.location.search)
      return this.getTodos();
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

  deleteAllCompleted = async (completedTodos) => {
    const { todos } = this.state;

    const reqBody = {
      todos: completedTodos,
    };

    const res = await TodosApi.deleteAllCompleted(reqBody);

    const updateTodos = todos.filter((todo) => {
      const found = res.find((t) => t.data.id === todo.id);

      if (!found) {
        return todo;
      }
    });

    this.setState({
      todos: updateTodos,
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
  };

  filterTodos = (tab) => {
    const { history } = this.props;

    switch (tab) {
      case 'all':
        history.push('/');
        this.setState({ tab: 'all' });
        break;

      case 'active':
        history.push('/?isDone=false');
        this.setState({ tab: 'active' });
        break;

      case 'completed':
        history.push('/?isDone=true');
        this.setState({ tab: 'completed' });
        break;

      default:
        break;
    }
  };

  render() {
    const { todos, todo, tab } = this.state;
    const {
      handleChange,
      handleKeyPress,
      toggleComplete,
      deleteTodo,
      toggleCompleteAll,
      filterTodos,
      deleteAllCompleted,
    } = this;

    // perhaps should be added to state;
    let allCompleted = true;
    const completedTodos = [];

    for (const t of todos) {
      if (t.isDone) {
        completedTodos.push(t);
      } else if (allCompleted === false) {
        continue;
      } else {
        allCompleted = false;
      }
    }

    const itemsLeft = todos.reduce((acc, todo) => {
      if (!todo.isDone) ++acc;
      return acc;
    }, 0);

    /**
     * Could be own component
     *
     */
    const ButtonTab = (tabName, key) => (
      <>
        {key === tab ? (
          <button
            type="button"
            className="content__tab content__tab--active"
            onClick={() => filterTodos(key)}
          >
            {tabName}
          </button>
        ) : (
          <button
            type="button"
            className="content__tab"
            onClick={() => filterTodos(key)}
          >
            {tabName}
          </button>
        )}
      </>
    );

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

          <ul
            className={`content__todos ${
              todos?.length > 0 ? 'content__todos--show' : ''
            }`}
          >
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

            <div className="content__footer">
              <div className="content__itemCount">{`${itemsLeft} ${
                itemsLeft === 1 ? 'item' : 'items'
              } left`}</div>

              <div className="content__tabs">
                {ButtonTab('all', 'all')}
                {ButtonTab('active', 'active')}
                {ButtonTab('completed', 'completed')}
              </div>

              <button
                onClick={() => deleteAllCompleted(completedTodos)}
                type="button"
                className={`content__clearCompleted ${
                  completedTodos.length > 0
                    ? 'content__clearCompleted--show'
                    : ''
                }`}
              >
                clear Completed
              </button>
            </div>
          </ul>
        </div>
      </div>
    );
  }
}

export default Todos;
