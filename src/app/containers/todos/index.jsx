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
      updateTodo: '',
      editable: false,
    };
  }

  getTodos = async () => {
    const { location } = this.props;
    const search = location.search;
    const res = await TodosApi.getAllTodos(search);
    this.setState({ todos: res });
  };

  componentDidMount() {
    return this.getTodos();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search)
      return this.getTodos();
  }

  handleChange = (e) => {
    console.log('handle change EEEEE', e);
    this.setState({ [e.target.name]: e.target.value });
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

  editTodo = async ({ todo, toggleComplete }) => {
    const { todos, editTodo } = this.state;

    const reqBody = {
      id: todo.id,
      data: {},
    };

    if (toggleComplete) {
      reqBody.data.isDone = !todo.isDone;
    } else {
      reqBody.data.content = editTodo;
    }

    const res = await TodosApi.editTodo(reqBody);

    /**
     * find todo in current todos that match res todo
     * update that object
     * then setState of todos with current positioning
     * updates todo in place
     */
    const todoIndex = todos.findIndex((todo) => todo.id === res.id);

    if (todoIndex > -1) {
      todos.splice(todoIndex, 1, res);
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

  handleDoubleClick = (e) => {
    // console.log('eeeeeee', e);
    const { editable } = this.state;
    this.setState({ editable: !editable });
  };

  render() {
    const { todos, todo, tab, updateTodo, editable } = this.state;

    const {
      handleChange,
      handleKeyPress,
      editTodo,
      deleteTodo,
      toggleCompleteAll,
      filterTodos,
      deleteAllCompleted,
      handleDoubleClick,
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

    // items left counter
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

    return (
      <div className="container">
        <h1 className="heading-primary u-margin-bottom-medium">todos</h1>

        <div className="content">
          <div className="content__input">
            <button
              onClick={() => toggleCompleteAll(allCompleted)}
              className={`content__arrow ${
                todos?.length > 0 ? 'content__arrow--show' : ''
              } ${allCompleted ? 'content__arrow--done' : ''}`}
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
                    onClick={() =>
                      editTodo({
                        todo,
                        toggleComplete: true,
                      })
                    }
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

                  {/* {editable ? (
                    <div onDoubleClick={handleDoubleClick}>{todo.content}</div>
                  ) : (
                    <input
                      key={todo.id}
                      onChange={handleChange}
                      // contentEditable={false}
                      className="content__todoText"
                      name="updateTodo"
                      type="text"
                      id="updateTodo"
                      value={updateTodo}
                    />
                  )} */}
                  <div className="content__todoText">{todo.content}</div>

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
