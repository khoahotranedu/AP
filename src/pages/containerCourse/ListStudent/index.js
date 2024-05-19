import classNames from 'classnames/bind';
import styles from './ListStudent.module.scss';
import ItemStudent from './ItemStudent';

import { useEffect, useState } from 'react';
import { database, set, child, ref, onValue } from '~/pages/Login';
import { UseStore } from '~/Store';
const cx = classNames.bind(styles);
function ListStudent() {
    const [state, setState] = useState([]);
    let courseID = localStorage.getItem('courseID');
    let classCourse = localStorage.getItem('classCourse');
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');
    const dbRef = ref(database);
    let [x] = UseStore();
    let { todos } = x;
    let [type] = useState(todos.job);
    function typePerson(type) {
        if (type === 'student') return true;
        else if (type === 'teacher') return false;
    }

    // useEffect(() => {
    //     if (!type) {
    //         get(child(dbRef, `accounts/${standardizeEmail}/type`)).then((snapshot) => {
    //             if (snapshot.exists()) {
    //                 setType(snapshot.val());
    //             }
    //         });
    //     }
    //     let x = setTimeout(() => {
    //         setshow(true);
    //     }, 2000);
    //     return () => {
    //         clearTimeout(x);
    //     };
    // }, []);
    // const [show, setshow] = useState(false);
    useEffect(() => {
        onValue(child(dbRef, `courses/current/score/${courseID}_${classCourse}`), (snapshot) => {
            if (snapshot.exists()) {
                let arr = [];
                for (let i = 0; i < snapshot.size; i++) {
                    arr.push({
                        Name: snapshot.val()[i].Name,
                        Diem: snapshot.val()[i].Diem,
                        MSSV: snapshot.val()[i].MSSV,
                        Chinhsua: snapshot.val()[i].Chinhsua,
                        index: i,
                    });
                    if (snapshot.val()[i].email !== '') {
                        let email = snapshot.val()[i].email;
                        let arrStu = [
                            {
                                Name: 'Họ và tên',
                                Diem: 'Điểm',
                                MSSV: 'MSSV',
                            },
                        ];
                        arrStu.push({
                            Name: snapshot.val()[i].Name,
                            Diem: snapshot.val()[i].Diem,
                            MSSV: snapshot.val()[i].MSSV,
                        });
                        set(child(dbRef, `accounts/${email}/courses/current/score/${courseID}_${classCourse}`), arrStu);
                    }
                }
                if (type === 'teacher') {
                    setState(arr);
                } else if (type === 'student') {
                    onValue(
                        child(dbRef, `accounts/${standardizeEmail}/courses/current/score/${courseID}_${classCourse}`),
                        (dataStudent) => {
                            if (dataStudent.exists()) {
                                setState(dataStudent.val());
                            }
                        },
                    );
                }
            }
        });
        // eslint-disable-next-line
    }, []);
    return (
        <table className={cx('score_table')}>
            <tbody>
                {state.map((item, index) => {
                    return (
                        <ItemStudent
                            key={index}
                            MSSV={item.MSSV}
                            Name={item.Name}
                            Diem={item.Diem}
                            type={!typePerson(type)}
                            Chinhsua={item.Chinhsua}
                            index={item.index}
                            courseID={courseID}
                            classCourse={classCourse}
                            xoa={() => {
                                let newstate = [];
                                for (let i = 0; i < state.length; i++) {
                                    if (i !== index) {
                                        newstate.push(state[i]);
                                    }
                                }
                                setState(newstate);
                            }}
                        />
                    );
                })}
            </tbody>
        </table>
    );
}

export default ListStudent;
