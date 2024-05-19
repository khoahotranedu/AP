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

export const set_initstate = (payload) => {
    return { type: 'setInitstate', payload };
};
export const set_Birthday = (payload) => {
    return { type: Set_Birthday, payload };
};
export const set_Gender = (payload) => {
    return { type: Set_Gender, payload };
};
export const set_Born = (payload) => {
    return { type: Set_Born, payload };
};
export const set_Email = (payload) => {
    return { type: Set_Email, payload };
};
export const set_Phone = (payload) => {
    return { type: Set_Phone, payload };
};
export const set_Address = (payload) => {
    return { type: Set_Address, payload };
};
export const set_NameParent1 = (payload) => {
    return { type: Set_NameParent1, payload };
};
export const set_PhoneParent1 = (payload) => {
    return { type: Set_PhoneParent1, payload };
};
export const set_NameParent2 = (payload) => {
    return { type: Set_NameParent2, payload };
};
export const set_PhoneParent2 = (payload) => {
    return { type: Set_PhoneParent2, payload };
};
export const set_SocialNetwork = (payload) => {
    return { type: Set_SocialNetwork, payload };
};
