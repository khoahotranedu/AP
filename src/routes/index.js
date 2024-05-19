import Home from '~/pages/Home';
import Pravate from '~/pages/Private';
import Course from '~/pages/Course';
import Login from '~/pages/Login';
import ContainerCourse from '~/pages/containerCourse';
import SubMH from '~/pages/subMH/SubMH';
import { UploadLayout } from '~/Components';
import SubMHList from '~/pages/subMHList';
import Calender from '~/pages/lich';
export const publicRoutes = [
    {
        name: 'login',
        path: '/',
        component: Login,
        layout: UploadLayout,
        Active: false,
        Private: false,
        Course: false,
    }
];
export const privateRoutes = [
    {
        name: 'onHome',
        path: '/Home',
        component: Home,
        Active: true,
        Private: false,
        Course: false,
    },
    {
        name: 'onPrivate',

        path: '/private',
        component: Pravate,
        Active: false,
        Private: true,
        Course: false,
    },
    {
        name: 'onCourse',

        path: '/course',
        component: Course,
        Active: false,
        Private: false,
        Course: true,
    },
    {
        name: 'xxx',
        path: '/course/content',
        component: ContainerCourse,
        Active: false,
        Private: false,
        Course: false,
    },
    {
        name: 'calender',

        path: '/calender',
        component: Calender,
        Active: false,
        Private: false,
        Course: false,
    },
    {
        name: 'addcourse',

        path: '/course/addcourse',
        component: SubMH,
        Active: false,
        Private: false,
        Course: false,
    },
    {
        name: 'addcourse',
        path: '/course/addcourse/list',

        component: SubMHList,
        Active: false,
        Private: false,
        Course: false,
    }
];
