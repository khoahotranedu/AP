import classNames from 'classnames/bind';
import styles from './Course.module.scss';
import ItemCourse from './item_course';
import { useState, useEffect, useRef } from 'react';
import DisplayList from './item_course/DisplayList';
import { database, get, set, child, ref, onValue } from '~/pages/Login';
import { UseStore } from '~/Store';
const cx = classNames.bind(styles);

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, ' ');
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    //str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
    return str;
}
function Course() {
    const dbRef = ref(database);
    // eslint-disable-next-line
    let [listgv, setlistgv] = useState([]);
    // eslint-disable-next-line
    let [listlop, setlistlop] = useState(['L01', 'L02', 'L03', 'L04', 'L05', 'L06']);
    // eslint-disable-next-line
    let [listmon, setlistmon] = useState([]);
    let [listCourseID, setListCourseID] = useState([]);
    let [maMH, setMaMH] = useState('');

    let monRef = useRef();
    let lopRef = useRef();
    let gvRef = useRef();
    const [Input_value, setInput_value] = useState('');

    const [sort, setSort] = useState(['List', 'Card']);
    let [listCourse, setListCourses] = useState([]);
    let [isCard, setIscard] = useState(false);
    let [issearch, setIsSearch] = useState(false);
    const [show, setShow] = useState(false);
    const [add, setadd] = useState(false);

    const [loadding, setloading] = useState(true);
    let [state] = UseStore();
    let { todos } = state;
    let [type, setType] = useState(todos.job);
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');
    useEffect(() => {
        onValue(child(dbRef, `accounts/${standardizeEmail}/courses/current/courseInfor`), (snapshot) => {
            if (snapshot.exists()) {
                const addCourses = [];
                for (let i = 0; i < snapshot.size; i++) {
                    let substrings = snapshot.val()[i].split(/_(?=[A-Z]+\d+_)/);
                    let nameCourse = substrings[0];
                    let courseID = substrings[1].split('_')[0];
                    let classCourse = substrings[2].split('_')[0];
                    let nameGV = substrings[2].split('_')[1];
                    addCourses.push({
                        nameCourse: nameCourse,
                        nameGv: nameGV,
                        classCourse: classCourse,
                        courseID: courseID,
                        idx: i,
                    });
                }
                setListCourses(addCourses);
                if (!type) {
                    //console.log(todos.job);
                    if (todos.job) {
                        setType(todos.job);
                    } else {
                        let standardizeEmail = sessionStorage.getItem('standardizeEmail');
                        get(child(dbRef, `accounts/${standardizeEmail}/infor/job`)).then((snapshot) => {
                            if (snapshot.exists()) {
                                setType(snapshot.val());
                            }
                        });
                    }
                }
                setloading(false);
            }
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (Input_value.trim().length > 0) {
            setIsSearch(true);
        } else {
            setIsSearch(false);
        }
    }, [Input_value]);

    useEffect(() => {
        get(child(dbRef, `accounts/${standardizeEmail}/courses/register/courseInfor`)).then((snapshot) => {
            if (snapshot.exists()) {
                let list = [];
                let list2 = [];
                for (let i = 0; i < snapshot.child('listCourse').size; i++) {
                    let substrings = snapshot.child('listCourse').val()[i].split('_');
                    list.push(substrings[0]);
                    list2.push(substrings[1]);
                }
                setlistmon(list);
                setListCourseID(list2);
            }
        });
    }, []);

    let handleSelectCourse = (e) => {
        for (let i = 0; i < listCourseID.length; i++) {
            if (listmon[i] === e.target.value) {
                get(
                    child(
                        dbRef,
                        `accounts/${standardizeEmail}/courses/register/courseInfor/listTeacher/${listCourseID[i]}`,
                    ),
                ).then((snapshot) => {
                    if (snapshot.exists()) {
                        let arr = [];
                        for (let j = 0; j < snapshot.size; j++) {
                            arr.push(snapshot.val()[j]);
                        }
                        setlistgv(arr);
                        setMaMH(listCourseID[i]);
                    }
                });
            }
        }
    };
    return (
        <div className={cx('backGround')}>
            <div className={cx('wraper')}>
                <div className={cx('header')}>Các môn học của tôi</div>
                {!loadding && (
                    <>
                        <div className={cx('control')}>
                            <div className={cx('search')}>
                                <input
                                    value={Input_value}
                                    onChange={(e) => {
                                        setInput_value(e.target.value);
                                    }}
                                    className={cx('search__input')}
                                    type="text"
                                    placeholder="Tìm Kiếm"
                                    spellCheck={false}
                                />
                                <button
                                    className={cx('search__clear')}
                                    onClick={() => {
                                        setInput_value('');
                                        document.querySelector(`.${cx('search__input')}`).focus();
                                    }}
                                >
                                    <i className="fa-solid fa-circle-xmark"></i>
                                </button>
                                <button className={cx('search__icon')}>
                                    <i className="fa-solid fa-magnifying-glass "></i>
                                </button>
                            </div>
                            <div className={cx('sort')}>
                                <div
                                    className={cx('sort_content')}
                                    onClick={() => {
                                        setShow(!show);
                                    }}
                                >
                                    {sort[0]} <i className={cx('fa-solid', 'fa-chevron-down', 'icon')}></i>
                                </div>

                                {show && type !== 'admin' && (
                                    <div className={cx('sort__list_selection')}>
                                        <div
                                            className={cx('sort__item')}
                                            value="list"
                                            onClick={() => {
                                                let newsort = [];
                                                newsort[0] = sort[1];
                                                newsort[1] = sort[0];
                                                setSort(newsort);
                                                setShow(!show);

                                                setIscard(!isCard);
                                            }}
                                        >
                                            {sort[1]}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {type === 'admin' && (
                                <div className={cx('create_content_container')}>
                                    <button
                                        className={cx('plus_btn')}
                                        id="create_content"
                                        onClick={() => {
                                            setadd(!add);
                                        }}
                                    ></button>
                                    <span style={{ display: 'block', marginLeft: '12px' }} onClick={() => {}}>
                                        Thêm khóa học
                                    </span>
                                </div>
                            )}
                        </div>

                        {type !== 'admin' && !issearch && isCard && (
                            <div className={cx('body')}>
                                {listCourse.map((item, index) => {
                                    return (
                                        <ItemCourse
                                            key={`item.nameCourse-${index}`}
                                            nameCourse={item.nameCourse}
                                            nameGv={item.nameGv}
                                            classCourse={item.classCourse}
                                            courseID={item.courseID}
                                            index={item.idx}
                                        />
                                    );
                                })}
                            </div>
                        )}
                        {type !== 'admin' && issearch && isCard && (
                            <div className={cx('body')}>
                                {listCourse
                                    .filter((item) => {
                                        return removeVietnameseTones(item.nameCourse)
                                            .toLowerCase()
                                            .includes(removeVietnameseTones(Input_value.toLowerCase()));
                                    })
                                    .map((item, index) => {
                                        return (
                                            <ItemCourse
                                                key={`item.nameCourse-${index}`}
                                                nameCourse={item.nameCourse}
                                                nameGv={item.nameGv}
                                                classCourse={item.classCourse}
                                                courseID={item.courseID}
                                                index={item.idx}
                                            />
                                        );
                                    })}
                            </div>
                        )}
                        {!issearch && !isCard && (
                            <div className={cx('body')}>
                                {add && type === 'admin' && (
                                    <div className={cx('addblock')}>
                                        <div className={cx('addblock-title')}>Thêm khóa học mới</div>
                                        <div className={cx('addblock-body')}>
                                            <div className={cx('addblock-item')}>
                                                <label className={cx('label-add')}>Môn học </label>
                                                <select ref={monRef} onChange={handleSelectCourse}>
                                                    <option value="" key="0">
                                                        Chọn môn học{' '}
                                                    </option>
                                                    {listmon.map((item, index) => {
                                                        return (
                                                            <option value={item} key={index + 1}>
                                                                {item}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                            <div className={cx('addblock-item')}>
                                                <label className={cx('label-add')}>Mã Lớp</label>
                                                <select ref={lopRef}>
                                                    <option value="" key="0">
                                                        Chọn lớp học{' '}
                                                    </option>
                                                    {listlop.map((item, index) => {
                                                        return (
                                                            <option value={item} key={index + 1}>
                                                                {item}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                            <div className={cx('addblock-item')}>
                                                <label className={cx('label-add')}>Giáo viên </label>
                                                <select ref={gvRef}>
                                                    <option value="" key="0">
                                                        Chọn giáo viên{' '}
                                                    </option>
                                                    {listgv.map((item, index) => {
                                                        return (
                                                            <option value={item} key={index + 1}>
                                                                {item}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                            <div className={cx('blockchange')}>
                                                <div
                                                    className={cx('btnchange')}
                                                    onClick={() => {
                                                        let mon =
                                                            monRef.current.options[monRef.current.selectedIndex].value;
                                                        let gv =
                                                            gvRef.current.options[gvRef.current.selectedIndex].value;
                                                        let lop =
                                                            lopRef.current.options[lopRef.current.selectedIndex].value;
                                                        if (mon.length > 0 && lop.length > 0 && gv.length > 0) {
                                                            let newlist = listCourse;
                                                            let idx = listCourse.length;
                                                            newlist.push({
                                                                nameCourse: mon,
                                                                nameGv: gv,
                                                                classCourse: lop,
                                                                idx: idx,
                                                            });
                                                            set(
                                                                child(
                                                                    dbRef,
                                                                    `accounts/${standardizeEmail}/courses/current/courseInfor/${
                                                                        newlist.length - 1
                                                                    }`,
                                                                ),
                                                                mon + '_' + maMH + '_' + lop + '_' + gv,
                                                            );
                                                            set(
                                                                child(
                                                                    dbRef,
                                                                    `accounts/${standardizeEmail}/courses/current/changeInfor/${maMH}`,
                                                                ),
                                                                listgv,
                                                            );
                                                            setListCourses([...newlist]);
                                                            window.location.reload();
                                                            setadd(false);
                                                        } else {
                                                            alert('Please select all option');
                                                        }
                                                    }}
                                                >
                                                    Lưu
                                                </div>
                                                <div
                                                    className={cx('btnchange')}
                                                    onClick={() => {
                                                        setadd(!add);
                                                    }}
                                                >
                                                    Hủy
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {listCourse.map((item, index) => {
                                    return (
                                        <DisplayList
                                            list={item}
                                            key={`list-${index}`}
                                            index={item.idx}
                                            delete={() => {
                                                for (let i = index; i < listCourse.length; i++) {
                                                    listCourse[i].idx--;
                                                }
                                                listCourse.splice(index, 1);
                                                setListCourses([...listCourse]);
                                            }}
                                            type={type}
                                        />
                                    );
                                })}
                            </div>
                        )}
                        {issearch && !isCard && (
                            <div className={cx('body')}>
                                {add && type === 'admin' && (
                                    <div className={cx('addblock')}>
                                        <div className={cx('addblock-title')}>Thêm khóa học mới</div>
                                        <div className={cx('addblock-body')}>
                                            <div className={cx('addblock-item')}>
                                                <label className={cx('label-add')}>Môn học </label>
                                                <select ref={monRef} onChange={handleSelectCourse}>
                                                    <option value="" key="0">
                                                        Chọn môn học{' '}
                                                    </option>
                                                    {listmon.map((item, index) => {
                                                        return (
                                                            <option value={item} key={index + 1}>
                                                                {item}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                            <div className={cx('addblock-item')}>
                                                <label className={cx('label-add')}>Mã Lớp</label>
                                                <select ref={lopRef}>
                                                    <option value="" key="0">
                                                        Chọn lớp học{' '}
                                                    </option>
                                                    {listlop.map((item, index) => {
                                                        return (
                                                            <option value={item} key={index + 1}>
                                                                {item}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                            <div className={cx('addblock-item')}>
                                                <label className={cx('label-add')}>Giáo viên </label>
                                                <select ref={gvRef}>
                                                    <option value="" key="0">
                                                        Chọn giáo viên{' '}
                                                    </option>
                                                    {listgv.map((item, index) => {
                                                        return (
                                                            <option value={item} key={index + 1}>
                                                                {item}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                            <div className={cx('blockchange')}>
                                                <div
                                                    className={cx('btnchange')}
                                                    onClick={() => {
                                                        let mon =
                                                            monRef.current.options[monRef.current.selectedIndex].value;
                                                        let gv =
                                                            gvRef.current.options[gvRef.current.selectedIndex].value;
                                                        let lop =
                                                            lopRef.current.options[lopRef.current.selectedIndex].value;
                                                        if (mon.length > 0 && lop.length > 0 && gv.length > 0) {
                                                            let newlist = listCourse;
                                                            let idx = listCourse.length;
                                                            newlist.push({
                                                                nameCourse: mon,
                                                                nameGv: gv,
                                                                classCourse: lop,
                                                                idx: idx,
                                                            });
                                                            set(
                                                                child(
                                                                    dbRef,
                                                                    `accounts/${standardizeEmail}/courses/current/courseInfor/${
                                                                        newlist.length - 1
                                                                    }`,
                                                                ),
                                                                mon + '_' + maMH + '_' + lop + '_' + gv,
                                                            );
                                                            set(
                                                                child(
                                                                    dbRef,
                                                                    `accounts/${standardizeEmail}/courses/current/changeInfor/${maMH}`,
                                                                ),
                                                                listgv,
                                                            );
                                                            setListCourses([...newlist]);
                                                            window.location.reload();
                                                            setadd(false);
                                                        } else {
                                                            alert('Please select all option');
                                                        }
                                                    }}
                                                >
                                                    Lưu
                                                </div>
                                                <div
                                                    className={cx('btnchange')}
                                                    onClick={() => {
                                                        setadd(!add);
                                                    }}
                                                >
                                                    Hủy
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {listCourse
                                    .filter((item) => {
                                        return removeVietnameseTones(item.nameCourse)
                                            .toLowerCase()
                                            .includes(removeVietnameseTones(Input_value.toLowerCase()));
                                    })
                                    .map((item, index) => {
                                        return (
                                            <DisplayList
                                                list={item}
                                                key={`list-${index}`}
                                                index={item.idx}
                                                type={type}
                                                delete={() => {
                                                    let newlist = [...listCourse];
                                                    newlist.splice(item.idx, 1);
                                                    setListCourses([...newlist]);
                                                }}
                                            />
                                        );
                                    })}
                            </div>
                        )}
                    </>
                )}
            </div>

            {loadding && (
                <div className={cx('loadding')}>
                    <div className={cx('loadding-icon')}>
                        <i className={cx('iconload', 'fa-solid', 'fa-spinner')}></i>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Course;
