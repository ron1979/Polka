import UserService from '../services/UserService.js';

const USER_MUTATIONS = {
  SET_LOGGED_IN_USER: 'setLoggedInUser'
};
const USER_ACTIONS = {
  ADD_USER: 'addUser',
  CHECK_LOGIN: 'checkLogin'
};
Object.freeze(USER_MUTATIONS);
Object.freeze(USER_ACTIONS);

export { USER_MUTATIONS, USER_ACTIONS };

export default {
  state: {
    loggedInUser: {
      _id: '',
      name: '',
      email: '',
      products: [{ id: 1, img: '' }, { id: 2, img: '' }]
    },
    selectedUser: {
      _id: '2',
      name: 'yosi',
      img: '../imgs/selectedUser.jpg',
      desc: ' Hello , I am a nice person who likes to travel',
      email: 'yosi@gmail.com',
      products: [{ id: 4, img: '' }, { id: 5, img: '' }]
    }
  },
  getters: {
    getCurrUser(state) {
      return state.loggedInUser;
    },

    getUserSelected(state) {
      return state.selectedUser;
    }
  },
  mutations: {
    [USER_MUTATIONS.SET_LOGGED_IN_USER](state, { user }) {
      state.loggedInUser = user;
    }
  },
  actions: {
    [USER_ACTIONS.ADD_USER](store, { userData }) {
      return UserService.add(userData).then(addedUser => {
        store.commit({ type: MUTATIONS.SET_LOGGED_IN_USER, addedUser });
        return addedUser;
      });
    },
    [USER_ACTIONS.CHECK_LOGIN](store, { loginData }) {
      return UserService.checkLogin(loginData)
        .then(loggedInUser => {
          store.commit({ type: USER_MUTATIONS.SET_LOGGED_IN_USER, user: loggedInUser });
          return loggedInUser;
        })
        .catch(err => {
          console.error(err);
        })
    }
  }
};