import { useState } from 'react';

import classNames from 'classnames/bind';
import styles from './Private.module.scss';
import BreadcrumbIteam from './btn__breadcrum';
import ContentPoint from './Point';
import Info from './info';
import Change from './change';
import { UseStore } from '~/Store';
import { get, child, ref, database } from '~/pages/Login';
import SinhVien from './SinhVien/SinhVien';
import GV from './GiangVien/GV';
const cx = classNames.bind(styles);
function Pravate() {
    let [state] = UseStore();
    let { todos } = state;
    let [type, setType] = useState(todos.job);
    let [nameCard] = useState(todos.nameCard);
    
    function typePerson(type) {
        if (type === 'student') return true;
        else if (type === 'teacher') return false;
    }
    const dbRef = ref(database);
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');
    const [show, setshow] = useState(false);

    if (!type) {
        get(child(dbRef, `accounts/${standardizeEmail}/infor/job`)).then((snapshot) => {
            if (snapshot.exists()) {
                setType(snapshot.val());
                
                setBreadlist([
                    {
                        name: `Thông tin ${nameCard}`,
                        active: true,
                        component: Info,
                    },
                    {
                        name: 'Thay đổi thông tin',
                        active: false,
                        component: Change,
                    },
                    {
                        // eslint-disable-next-line
                        name: 'Kết quả học tập',
                        active: false,
                        component: ContentPoint,
                    },
                ]);
            }
        });
        setTimeout(() => {
            setshow(true);
        }, 2000);
    } else {
        if (show === false) {
            setshow(true);
        }
    }
    const [DS, setDS] = useState([
        {
            name: `Danh sách sinh viên`,
            active: true,
            component: SinhVien,
        },
        {
            name: 'Danh sách giảng viên',
            active: false,
            component: GV,
        },
    ]);
    let x = DS.findIndex((item, index) => {
        return item.active === true;
    });
    let ComponentAdmin = DS[x].component;
    const [content, setContent] = useState(0);
    const [breadlist, setBreadlist] = useState([
        {
            name: `Thông tin ${nameCard}`,
            active: true,
            component: Info,
        },
        {
            name: 'Thay đổi thông tin',
            active: false,
            component: Change,
        },
        {
            // eslint-disable-next-line
            name: 'Kết quả học tập',
            active: false,
            component: ContentPoint,
        },
    ]);
    let Component = breadlist[2].component;
    if (breadlist[content].component) {
        Component = breadlist[content].component;
    }

    let onsave = () => {
        setContent(0);
        setBreadlist(
            breadlist.map((bread, zIndex) => {
                if (zIndex === 0) {
                    return {
                        ...bread,
                        active: true,
                    };
                } else {
                    return {
                        ...bread,
                        active: false,
                    };
                }
            }),
        );
    };
    let onchange = () => {
        setContent(1);
        setBreadlist(
            breadlist.map((bread, zIndex) => {
                if (zIndex === 1) {
                    return {
                        ...bread,
                        active: true,
                    };
                } else {
                    return {
                        ...bread,
                        active: false,
                    };
                }
            }),
        );
    };
    return (
        <>
            {show && type !== 'admin' && (
                <div className={cx('wrapper')}>
                    <div className={cx('breadcrum')}>
                        {
                            // eslint-disable-next-line
                            breadlist.map((item, index) => {
                                if (!typePerson(type)) {
                                    if (index !== 2) {
                                        return (
                                            <BreadcrumbIteam
                                                key={`item.name-${index}`}
                                                icon={item.icon}
                                                active={item.active}
                                                onClick={() => {
                                                    setContent(index);
                                                    setBreadlist(
                                                        breadlist.map((bread, zIndex) => {
                                                            if (zIndex === index) {
                                                                return {
                                                                    ...bread,
                                                                    active: true,
                                                                };
                                                            } else {
                                                                return {
                                                                    ...bread,
                                                                    active: false,
                                                                };
                                                            }
                                                        }),
                                                    );
                                                }}
                                            >
                                                {item.name}
                                            </BreadcrumbIteam>
                                        );
                                    }
                                } else {
                                    return (
                                        <BreadcrumbIteam
                                            key={`item.name-${index}`}
                                            icon={item.icon}
                                            active={item.active}
                                            onClick={() => {
                                                setContent(index);
                                                setBreadlist(
                                                    breadlist.map((bread, zIndex) => {
                                                        if (zIndex === index) {
                                                            return {
                                                                ...bread,
                                                                active: true,
                                                            };
                                                        } else {
                                                            return {
                                                                ...bread,
                                                                active: false,
                                                            };
                                                        }
                                                    }),
                                                );
                                            }}
                                        >
                                            {item.name}
                                        </BreadcrumbIteam>
                                    );
                                }
                            })
                        }
                    </div>
                    <Component onsave={onsave} onchange={onchange} />
                </div>
            )}

            {show && type === 'admin' && (
                <div className={cx('admin-wrapper')}>
                    <div className={cx('breadcrum')}>
                        {DS.map((item, index) => {
                            return (
                                <BreadcrumbIteam
                                    key={`item.name-${index}`}
                                    icon={item.icon}
                                    active={item.active}
                                    onClick={() => {
                                        setDS(
                                            DS.map((bread, zIndex) => {
                                                if (zIndex === index) {
                                                    return {
                                                        ...bread,
                                                        active: true,
                                                    };
                                                } else {
                                                    return {
                                                        ...bread,
                                                        active: false,
                                                    };
                                                }
                                            }),
                                        );
                                    }}
                                >
                                    {item.name}
                                </BreadcrumbIteam>
                            );
                        })}
                    </div>
                    <ComponentAdmin></ComponentAdmin>
                </div>
            )}

            {!show && (
                <div className={cx('loadding')}>
                    <div className={cx('loadding-icon')}>
                        <i className={cx('iconload', 'fa-solid', 'fa-spinner')}></i>
                    </div>
                </div>
            )}
        </>
    );
}
export default Pravate;
