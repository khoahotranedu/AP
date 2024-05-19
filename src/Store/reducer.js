import {
    Set_Birthday,
    Set_Gender,
    Set_Born,
    Set_Email,
    Set_Phone,
    Set_Address,
    Set_NameParent1,
    Set_PhoneParent1,
    Set_NameParent2,
    Set_PhoneParent2,
    Set_SocialNetwork,
} from './contant';
const initstate = {
    todos: {
        job: '',
        nameCard: '',
        id: '',
        degree: '',
        name: '',
        birthday: '',
        gender: '',
        born: '',
        email: '',
        phone: '',
        address: '',
        nameParent1: '',
        phoneParent1: '',
        nameParent2: '',
        phoneParent2: '',
        socialNetwork: '',
    },
    todoInput: '',
};
const reducer = (state, action) => {
    switch (action.type) {
        case 'setInitstate': {
            const newtodos = { ...action.payload };

            return { ...state, todos: newtodos };
        }
        case Set_Birthday: {
            const newtodos = { ...state.todos };
            newtodos.birthday = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_Gender: {
            const newtodos = { ...state.todos };
            newtodos.gender = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_Born: {
            const newtodos = { ...state.todos };
            newtodos.born = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_Email: {
            const newtodos = { ...state.todos };
            newtodos.email = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_Phone: {
            const newtodos = { ...state.todos };
            newtodos.phone = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_Address: {
            const newtodos = { ...state.todos };
            newtodos.address = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_NameParent1: {
            const newtodos = { ...state.todos };
            newtodos.nameParent1 = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_NameParent2: {
            const newtodos = { ...state.todos };
            newtodos.nameParent2 = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_PhoneParent1: {
            const newtodos = { ...state.todos };
            newtodos.phoneParent1 = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_PhoneParent2: {
            const newtodos = { ...state.todos };
            newtodos.phoneParent2 = action.payload;
            return { ...state, todos: newtodos };
        }
        case Set_SocialNetwork: {
            const newtodos = { ...state.todos };
            newtodos.socialNetwork = action.payload;
            return { ...state, todos: newtodos };
        }

        default:
            console.error('loi');
            throw new Error(`Invalid action`);
    }
};
export { initstate };
export default reducer;
