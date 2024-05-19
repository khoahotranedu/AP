import classNames from 'classnames/bind';
import styles from './notify.module.scss';
import NotifyItem from './index';
import { useState, useEffect } from 'react';
import { database, get, set, child, ref, onValue } from '~/pages/Login';

const cx = classNames.bind(styles);
function Notify({ list, courseID, classCourse }) {
    const [notify_list, setNotify_list] = useState(list);
    const dbRef = ref(database);
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');

    useEffect(() => {
        onValue(child(dbRef, `notification/courses/${courseID}_${classCourse}`), (snapshot) => {
            if (snapshot.exists()) {
                get(child(dbRef, `notification/students`)).then((students) => {
                    for (let i = 0; i < students.size; i++) {
                        if (students.child(`${i}/${courseID}_${classCourse}`).val() === true) {
                            let email = students.child(`${i}/email`).val();
                            get(child(dbRef, `accounts/${email}/notification`)).then((noti) => {
                                if (noti.size < snapshot.size) {
                                    set(child(dbRef, `accounts/${email}/notification/${snapshot.size - 1}`), {
                                        title: snapshot.val()[snapshot.size - 1].title,
                                        time: snapshot.val()[snapshot.size - 1].time,
                                        active: snapshot.val()[snapshot.size - 1].active,
                                    });
                                }
                            });
                        }
                    }
                });
            }
            onValue(child(dbRef, `accounts/${standardizeEmail}/notification`), (snapshot) => {
                if (snapshot.exists()) {
                    const addNoti = [];
                    for (let j = snapshot.size - 1; j >= 0; j--) {
                        addNoti.push({
                            title: snapshot.val()[j].title,
                            time: snapshot.val()[j].time,
                            active: snapshot.val()[j].active,
                        });
                    }
                    setNotify_list(addNoti);
                }
            });
        });
        // eslint-disable-next-line
    }, []);

    return (
        <div className={cx('menu-notify')}>
            <div className={cx('arrow')}></div>
            <div className={cx('header')}>Thông báo</div>
            <div className={cx('item_notifylist')}>
                {notify_list.map((item, index) => {
                    return (
                        <NotifyItem
                            key={`item.title-${index}`}
                            title={item.title}
                            time={item.time}
                            active={item.active}
                        />
                    );
                })}
            </div>
            <div className={cx('footer')}>
                <span className={cx('footer_content')}>SEE ALL</span>
            </div>
        </div>
    );
}

export default Notify;
