import React from 'react';
import styles from './SinhVien.module.scss';
import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import ItemList from '../item-list';
import { get, set, child, database, ref } from '~/pages/Login'

const SinhVien = () => {
    const dbRef = ref(database);
    const standardizeEmail = sessionStorage.getItem('standardizeEmail');
    const cx = classNames.bind(styles);
    const [list_student, setList_student] = useState([]);
    const [show, setshow] = useState(false);
    const [search, setsearch] = useState(false);
    const [search_input, setsearch_input] = useState('');
    useEffect(() => {
        if (search_input.length > 0) {
            setsearch(true);
        } else {
            setsearch(false);
        }
    }, [search_input]);
    useEffect(() => {
        get(child(dbRef, `accounts/${standardizeEmail}/listStudent`)).then((snapshot) => {
            if (snapshot.exists()) {
                let arr = []
                for (let i = 0; i < snapshot.size; i++) {
                    arr.push({
                        MSSV: snapshot.val()[i].MSSV,
                        name: snapshot.val()[i].name,
                        faculty: snapshot.val()[i].faculty
                    })
                }
                setList_student(arr);
            }
        })
    }, []);
    return (
        <div className={cx('list_student')}>
            <div className={cx('table')}>
                <div className={cx('table_header')}>
                    <p>DANH SÁCH SINH VIÊN</p>
                    <div>
                        <input
                            type="text"
                            id="search_Input"
                            placeholder="Tìm kiếm theo mã sinh viên"
                            onChange={() => {
                                setsearch_input(document.getElementById('search_Input').value);
                            }}
                        />
                        <button
                            className={cx('add_student')}
                            onClick={() => {
                                setshow(!show);
                            }}
                        >
                            {' '}
                            Thêm Sinh Viên{' '}
                        </button>
                    </div>
                </div>
            </div>
            <div className={cx('add_info_student')}>
                {show && (
                    <form action="" id="add_data" className={cx('form-add-sv')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="MSSV">MSSV</label> <br />
                            <input type="number" id="id" placeholder="Nhập mã số sinh viên" required /> <br />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="Name">Họ và Tên</label> <br />
                            <input type="text" id="name" placeholder="Nhập tên" required /> <br />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="Faculty">Khoa</label>
                            <br />
                            <input type="text" id="fac" placeholder="Nhập khoa" required />
                        </div>
                        <br />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (
                                    document.getElementById('name').value.length > 0 &&
                                    document.getElementById('id').value.length > 0 &&
                                    document.getElementById('fac').value.length > 0
                                ) {
                                    if (
                                        list_student.every((student) => {
                                            return student.MSSV !== document.getElementById('id').value;
                                        })
                                    ) {
                                        let mssv = document.getElementById('id').value;

                                        let name = document.getElementById('name').value;

                                        let faculty = document.getElementById('fac').value;
                                        setList_student([
                                            ...list_student,
                                            {
                                                MSSV: mssv,
                                                name: name,
                                                faculty: faculty,
                                            },
                                        ]);
                                        set(child(dbRef, `accounts/${standardizeEmail}/listStudent/${list_student.length}`), {
                                            MSSV: mssv,
                                            name: name,
                                            faculty: faculty,
                                        });
                                        document.getElementById('id').value = '';

                                        document.getElementById('name').value = '';
                                        document.getElementById('fac').value = '';
                                    } else {
                                        alert('Mã sinh viên đã tồn tại');
                                    }
                                }
                            }}
                        >
                            Xác nhận
                        </button>
                    </form>
                )}
            </div>
            <div className={cx('table_section')}>
                <table id="dataTable">
                    <thead>
                        <tr>
                            <th className={cx('stt')}> STT</th>
                            <th className={cx('mssv')}>MSSV</th>
                            <th className={cx('name')}>Họ và Tên</th>
                            <th className={cx('faculty')}>Khoa</th>
                            <th className={cx('delete')}>Xóa</th>
                            <th className={cx('delete')}>Sửa</th>
                        </tr>
                    </thead>
                    {!search && (
                        <tbody>
                            {list_student.map((student, index) => {
                                return (
                                    <ItemList
                                        key={index}
                                        index={index + 1}
                                        MSSV={student.MSSV}
                                        name={student.name}
                                        faculty={student.faculty}
                                        ondelete={() => {
                                            let newarr = [];
                                            for (let i = 0; i < list_student.length; i++) {
                                                if (i !== index) {
                                                    newarr.push(list_student[i]);
                                                }
                                            }
                                            set(child(dbRef, `accounts/${standardizeEmail}/listStudent`), [...newarr]);
                                            setList_student([...newarr]);
                                        }}
                                        onchange={(id, name, fac) => {
                                            let newarr = [];
                                            for (let i = 0; i < list_student.length; i++) {
                                                if (i !== index) {
                                                    newarr.push(list_student[i]);
                                                } else {
                                                    newarr.push({ MSSV: id, name: name, faculty: fac });
                                                }
                                            }
                                            set(child(dbRef, `accounts/${standardizeEmail}/listStudent/${index}`), { MSSV: id, name: name, faculty: fac });
                                            setList_student([...newarr]);
                                        }}
                                    ></ItemList>
                                );
                            })}
                        </tbody>
                    )}
                    {search && (
                        <tbody>
                            {
                                // eslint-disable-next-line
                                list_student.map((student, index) => {
                                    if (student.MSSV.includes(document.getElementById('search_Input').value)) {
                                        return (
                                            <ItemList
                                                key={index}
                                                index={index + 1}
                                                MSSV={student.MSSV}
                                                name={student.name}
                                                faculty={student.faculty}
                                                ondelete={() => {
                                                    let newarr = [];
                                                    for (let i = 0; i < list_student.length; i++) {
                                                        if (list_student[i].MSSV !== student.MSSV) {
                                                            newarr.push(list_student[i]);
                                                        }
                                                    }
                                                    set(child(dbRef, `accounts/${standardizeEmail}/listStudent`), [...newarr]);
                                                    setList_student([...newarr]);
                                                }}
                                                onchange={(id, name, fac) => {
                                                    let newarr = [];
                                                    for (let i = 0; i < list_student.length; i++) {
                                                        if (list_student[i].MSSV !== student.MSSV) {
                                                            newarr.push(list_student[i]);
                                                        } else {
                                                            newarr.push({ MSSV: id, name: name, faculty: fac });
                                                        }
                                                    }
                                                    set(child(dbRef, `accounts/${standardizeEmail}/listStudent/${index}`), { MSSV: id, name: name, faculty: fac });
                                                    setList_student([...newarr]);
                                                }}
                                            ></ItemList>
                                        );
                                    }
                                })
                            }
                        </tbody>
                    )}
                </table>
            </div>
        </div >
    );
};

export default SinhVien;
