import classNames from 'classnames/bind';
import styles from './subMHList.module.scss';
import ItemListsub from './itemcourseSub';
import IteamSearch from './itemsearch';
import Itemchoise from './itemsearch/itemchoise';
import { useState, useEffect } from 'react';
import { database, ref, child, get, set, onValue } from '~/pages/Login';
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
function SubMHList() {
    let [state] = UseStore();
    let { todos } = state;
    let [type] = useState(todos.job);
    const dbRef = ref(database);
    // Tất cả khóa học: k lay api
    let [listcoursedone, setlistcoursedone] = useState([]);
    //lay api
    let [listcoursecur, setlistcoursecur] = useState([]);
    //k lay api
    let [listcoursewill, setlistcoursewill] = useState([]);

    let [Input_value, setinput_value] = useState('');

    const [issearch, setIssearch] = useState(false);
    const [ischoice, setIschoice] = useState(false);
    const [indexItem, setindexItem] = useState(0);
    const [show, setshow] = useState(false);
    const [addclass, setaddclass] = useState(false);
    let [indexCourse, setIndexCourse] = useState([]);

    let sltin = listcoursecur.reduce((total, currentValue) => {
        return total + currentValue.credit;
    }, 0);
    
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');
    let [getIdx] = useState(localStorage.getItem('getIdx'));
    
    useEffect(() => {
        onValue(child(dbRef, `fullCourses`), (snapshot) => {
            if (snapshot.child('list').exists()) {
                setlistcoursedone(snapshot.child('list').val());
                setshow(true);
            }
        });
        get(child(dbRef, `accounts/${standardizeEmail}/courses/register`)).then((snapshot) => {
            if (snapshot.child(`cur/${getIdx}`).exists()) {
                setlistcoursecur(snapshot.child(`cur/${getIdx}`).val());
            }
            if (snapshot.child(`will/${getIdx}`).exists()) {
                setlistcoursewill(snapshot.child(`will/${getIdx}`).val());
            }
        });
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {show && (
                <div className={cx('wrapper')}>
                    <div className={cx('search')}>
                        {!ischoice && (
                            <div className={cx('box_search')}>
                                <div className={cx('search-content')}>
                                    <input
                                        value={Input_value}
                                        onChange={(e) => {
                                            setIssearch(true);
                                            setinput_value(e.target.value);
                                        }}
                                        className={cx('search__input')}
                                        type="text"
                                        placeholder="Tìm Kiếm"
                                        spellCheck={false}
                                    />
                                    <button
                                        className={cx('search__clear')}
                                        onClick={() => {
                                            setinput_value('');
                                            setIssearch(true);
                                        }}
                                    >
                                        <i className="fa-solid fa-circle-xmark"></i>
                                    </button>
                                    <button
                                        className={cx('search__icon')}
                                        onClick={() => {
                                            document.querySelector(`.${cx('search__input')}`).focus();
                                        }}
                                    >
                                        <i className="fa-solid fa-magnifying-glass "></i>
                                    </button>
                                </div>
                            </div>
                        )}
                        {ischoice && (
                            <div className={cx('search__list-header')}>
                                {' '}
                                Đăng ký lớp <br />
                                {listcoursedone[indexItem].name}
                                <div
                                    className={cx('search__list-prev')}
                                    onClick={() => {
                                        setIschoice(false);
                                    }}
                                >
                                    <i className={cx('search__list-prev-icon', 'fa-solid', 'fa-caret-left')}></i>Trở về
                                </div>
                                {type === 'admin' && (
                                    <div className={cx('create_content_container')}>
                                        <button
                                            className={cx('plus_btn')}
                                            id="create_content"
                                            onClick={() => {
                                                setaddclass(!addclass);
                                            }}
                                        ></button>
                                        <span style={{ display: 'block', marginLeft: '12px' }} onClick={() => { }}>
                                            Thêm khóa học
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                        {!ischoice && !issearch && (
                            <div className={cx('search__list')}>
                                {listcoursedone.map((item, index) => {
                                    return (
                                        <IteamSearch
                                            stt={index + 1}
                                            name={item.name}
                                            Id={item.Id}
                                            onclick={() => {
                                                setIschoice(true);
                                                setindexItem(index);
                                                setinput_value('');
                                            }}
                                            key={`search_${index}`}
                                            type={type}
                                            ondelete={() => {
                                                let newobj = [];
                                                for (let i = 0; i < listcoursedone.length; i++) {
                                                    if (item.Id !== listcoursedone[i].Id) {
                                                        newobj.push(listcoursedone[i]);
                                                    }
                                                }
                                                set(child(dbRef, `fullCourses/list`), [...newobj]);
                                                setlistcoursedone([...newobj]);
                                            }}
                                        ></IteamSearch>
                                    );
                                })}
                            </div>
                        )}
                        {!ischoice && issearch && (
                            <div className={cx('search__list')}>
                                {listcoursedone

                                    .filter((item) => {
                                        return (
                                            removeVietnameseTones(`${item.name}`)
                                                .toLowerCase()
                                                .includes(removeVietnameseTones(Input_value.toLowerCase())) ||
                                            item?.Id?.toLowerCase().includes(
                                                removeVietnameseTones(Input_value.toLowerCase()),
                                            )
                                        );
                                    })
                                    .map((item, index) => {
                                        return (
                                            <IteamSearch
                                                stt={index + 1}
                                                name={item.name}
                                                Id={item.Id}
                                                onclick={() => {
                                                    setIschoice(true);
                                                    setindexItem(
                                                        listcoursedone.findIndex((course) => {
                                                            return course.Id === item.Id;
                                                        }),
                                                    );
                                                    setinput_value('');
                                                }}
                                                key={`search_${index}`}
                                                type={type}
                                                ondelete={() => {
                                                    let newobj = [];
                                                    for (let i = 0; i < listcoursedone.length; i++) {
                                                        if (item.Id !== listcoursedone[i].Id) {
                                                            newobj.push(listcoursedone[i]);
                                                        }
                                                    }
                                                    set(child(dbRef, `fullCourses/list`), [...newobj]);
                                                    setlistcoursedone([...newobj]);
                                                }}
                                            ></IteamSearch>
                                        );
                                    })}
                            </div>
                        )}

                        {ischoice && (
                            <div className={cx('search__list')}>
                                {addclass && (
                                    <div className={cx('box-add-class')}>
                                        <input
                                            id="addClass__content--codeClass"
                                            type="text"
                                            placeholder="Mã lớp VD::L01"
                                            className={cx('add-class-item')}
                                        />
                                        <input
                                            id="addClass__content--credit"
                                            type="text"
                                            placeholder="Số tín chỉ"
                                            className={cx('add-class-item')}
                                        />
                                        <input
                                            id="addClass__content--maxStudents"
                                            type="text"
                                            placeholder="Số sinh viên tối đa"
                                            className={cx('add-class-item')}
                                        />
                                        <input
                                            id="addClass__content--teacher"
                                            type="text"
                                            placeholder="Giảng viên"
                                            className={cx('add-class-item')}
                                        />
                                        <input
                                            id="addClass__content--timeDay"
                                            type="text"
                                            placeholder="Thứ "
                                            className={cx('add-class-item')}
                                        />
                                        <input
                                            id="addClass__content--timeStart"
                                            type="text"
                                            placeholder="Giờ bắt đầu VD: 15:30"
                                            className={cx('add-class-item')}
                                        />
                                        <input
                                            id="addClass__content--timeEnd"
                                            type="text"
                                            placeholder="Giờ kết thúc VD: 17:30"
                                            className={cx('add-class-item')}
                                        />
                                        <input
                                            id="addClass__content--week"
                                            type="text"
                                            placeholder="Các tuần học VD: 1-2-3-5-6"
                                            className={cx('add-class-item')}
                                        />
                                        <button
                                            className={cx('btn-add-course-save')}
                                            onClick={() => {
                                                if (
                                                    document.getElementById('addClass__content--codeClass').value
                                                        .length > 0 &&
                                                    document.getElementById('addClass__content--credit').value.length >
                                                    0 &&
                                                    document.getElementById('addClass__content--maxStudents').value
                                                        .length > 0 &&
                                                    document.getElementById('addClass__content--teacher').value.length >
                                                    0 &&
                                                    document.getElementById('addClass__content--timeDay').value.length >
                                                    0 &&
                                                    document.getElementById('addClass__content--timeStart').value
                                                        .length > 0 &&
                                                    document.getElementById('addClass__content--timeEnd').value.length >
                                                    0 &&
                                                    document.getElementById('addClass__content--week').value.length > 0
                                                ) {
                                                    if (
                                                        listcoursedone[indexItem].subjectDetail == [] ||
                                                        listcoursedone[indexItem].subjectDetail.every((item, index) => {
                                                            return (
                                                                item.classId !==
                                                                document.getElementById('addClass__content--codeClass')
                                                                    .value
                                                            );
                                                        })
                                                    ) {
                                                        let newobj = [...listcoursedone];
                                                        let sjDetail = {
                                                            subjectId: listcoursedone[indexItem].Id,
                                                            subjectName: listcoursedone[indexItem].name,
                                                            classId:
                                                                document.getElementById('addClass__content--codeClass')
                                                                    .value,
                                                            credit: document.getElementById('addClass__content--credit')
                                                                .value,
                                                            numberStudents: 0,
                                                            maxStudents: document.getElementById(
                                                                'addClass__content--maxStudents',
                                                            ).value,
                                                            teacher:
                                                                document.getElementById('addClass__content--teacher')
                                                                    .value,

                                                            week: document.getElementById('addClass__content--week')
                                                                .value,
                                                            schedule: {
                                                                day: document.getElementById(
                                                                    'addClass__content--timeDay',
                                                                ).value,
                                                                end: document.getElementById(
                                                                    'addClass__content--timeEnd',
                                                                ).value,
                                                                start: document.getElementById(
                                                                    'addClass__content--timeStart',
                                                                ).value,
                                                                string: `Thứ ${document.getElementById(
                                                                    'addClass__content--timeDay',
                                                                ).value
                                                                    }: ${document.getElementById(
                                                                        'addClass__content--timeStart',
                                                                    ).value
                                                                    } - ${document.getElementById(
                                                                        'addClass__content--timeEnd',
                                                                    ).value
                                                                    }`,
                                                            },
                                                        };

                                                        set(
                                                            child(
                                                                dbRef,
                                                                `fullCourses/list/${indexItem}/subjectDetail/${newobj[indexItem].subjectDetail.length}`,
                                                            ),
                                                            sjDetail,
                                                        );
                                                        newobj[indexItem].subjectDetail.push(sjDetail);

                                                        setlistcoursedone([...newobj]);

                                                        setaddclass(false);
                                                    } else {
                                                        alert('Mã lớp đã tồn tại');
                                                    }
                                                } else {
                                                    alert('Chưa nhập đầy đủ thồng tin');
                                                }
                                            }}
                                        >
                                            Lưu{' '}
                                        </button>
                                        <button
                                            className={cx('btn-add-course-delete')}
                                            onClick={() => {
                                                setaddclass(false);
                                            }}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                )}

                                {listcoursedone[indexItem].subjectDetail != [] &&
                                    listcoursedone[indexItem].subjectDetail.map((item, index) => {
                                        return (
                                            <Itemchoise
                                                stt={index + 1}
                                                subjectId={item.subjectId}
                                                subjectName={item.subjectName}
                                                classId={item.classId}
                                                credit={item.credit}
                                                numberStudents={item.numberStudents}
                                                maxStudents={item.maxStudents}
                                                teacher={item.teacher}
                                                schedule={item.schedule}
                                                week={item.week}
                                                key={`choice_${index}`}
                                                onsave={() => {
                                                    let newCourse = {
                                                        subjectId: item.subjectId,
                                                        subjectName: item.subjectName,
                                                        classId: item.classId,
                                                        credit: item.credit,
                                                        numberStudents: item.numberStudents,
                                                        maxStudents: item.maxStudents,
                                                        teacher: item.teacher,
                                                        schedule: item.schedule,
                                                        week: item.week,
                                                    };
                                                    /* */
                                                    let conditionalCourse = true;
                                                    if (newCourse.numberStudents === newCourse.maxStudents) {
                                                        conditionalCourse = false;
                                                        alert('Lớp học đã đủ người');
                                                    }
                                                    for (
                                                        let i = 0;
                                                        i < listcoursecur.length && conditionalCourse !== false;
                                                        i++
                                                    ) {
                                                        if (listcoursecur[i].subjectId === newCourse.subjectId) {
                                                            conditionalCourse = false;
                                                            alert('Môn đã đăng ký');
                                                            break;
                                                        }
                                                        if (listcoursecur[i].schedule.day === newCourse.schedule.day) {
                                                            if (
                                                                (listcoursecur[i].schedule.start >=
                                                                    newCourse.schedule.start &&
                                                                    listcoursecur[i].schedule.start <
                                                                    newCourse.schedule.end) ||
                                                                (listcoursecur[i].schedule.end >
                                                                    newCourse.schedule.start &&
                                                                    listcoursecur[i].schedule.end <=
                                                                    newCourse.schedule.end)
                                                            ) {
                                                                conditionalCourse = false;
                                                                alert('Trùng giờ học đã đăng ký');
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    for (
                                                        let i = 0;
                                                        i < listcoursewill.length && conditionalCourse !== false;
                                                        i++
                                                    ) {
                                                        if (listcoursewill[i].subjectId === newCourse.subjectId) {
                                                            conditionalCourse = false;
                                                            alert('Môn đang đăng ký');
                                                            break;
                                                        }
                                                        if (listcoursewill[i].schedule.day === newCourse.schedule.day) {
                                                            if (
                                                                (listcoursewill[i].schedule.start >=
                                                                    newCourse.schedule.start &&
                                                                    listcoursewill[i].schedule.start <
                                                                    newCourse.schedule.end) ||
                                                                (listcoursewill[i].schedule.end >
                                                                    newCourse.schedule.start &&
                                                                    listcoursewill[i].schedule.end <=
                                                                    newCourse.schedule.end)
                                                            ) {
                                                                conditionalCourse = false;
                                                                alert('Trùng giờ học đang đăng ký');
                                                                break;
                                                            }
                                                        }
                                                    }
                                                    if (conditionalCourse === true) {
                                                        setlistcoursewill([...listcoursewill, newCourse]);
                                                        let newIndex = {
                                                            subjectIdx: indexItem,
                                                            detailIdx: index,
                                                        };
                                                        setIndexCourse([...indexCourse, newIndex]);
                                                        let standardizeEmail =
                                                            sessionStorage.getItem('standardizeEmail');
                                                        set(
                                                            child(
                                                                dbRef,
                                                                `accounts/${standardizeEmail}/courses/register/will/${getIdx}`,
                                                            ),
                                                            [...listcoursewill, newCourse],
                                                        );
                                                        setIschoice(false);
                                                    }
                                                    /* */
                                                }}
                                                type={type}
                                                ondelete={() => {
                                                    let newobj = [...listcoursedone];
                                                    let len = listcoursedone[indexItem].subjectDetail.length;
                                                    let arr = [];
                                                    for (let i = 0; i < len; i++) {
                                                        if (i !== index) {
                                                            arr.push(listcoursedone[indexItem].subjectDetail[i]);
                                                        }
                                                    }
                                                    set(
                                                        child(dbRef, `fullCourses/list/${indexItem}/subjectDetail`),
                                                        arr,
                                                    );
                                                    newobj[indexItem].subjectDetail = arr;
                                                    setlistcoursedone([...newobj]);
                                                }}
                                            ></Itemchoise>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                    <div className={cx('content')}>
                        {type !== 'admin' && (
                            <div className={cx('content')}>
                                <table className={cx('main-table')}>
                                    <tbody>
                                        <tr className={cx('row')}>
                                            <th className={cx('available-subject')}>Các môn đã đăng ký</th>
                                        </tr>
                                        <tr className={cx('row')}>
                                            <td className={cx('ordinary-num')}>STT</td>
                                            <td className={cx('subject')}>Mã môn/ Môn</td>
                                            <td className={cx('classId')}>Lớp</td>
                                            <td className={cx('credit')}>Tín chỉ</td>
                                            <td className={cx('num')}>Sỉ số</td>
                                            <td className={cx('teacher')}>Giảng viên</td>
                                            <td className={cx('schedule')}>Thời khóa biểu</td>
                                            <td className={cx('week')}>Tuần học</td>
                                            <td className={cx('delete')}></td>
                                        </tr>
                                        {listcoursecur.map((item, index) => {
                                            return (
                                                <ItemListsub
                                                    stt={index + 1}
                                                    subjectId={item.subjectId}
                                                    subjectName={item.subjectName}
                                                    classId={item.classId}
                                                    credit={item.credit}
                                                    numberStudents={item.numberStudents}
                                                    maxStudents={item.maxStudents}
                                                    teacher={item.teacher}
                                                    schedule={item.schedule}
                                                    week={item.week}
                                                    key={index}
                                                    onclick={() => {
                                                        for (let i = 0; i < listcoursedone.length; i++) {
                                                            if (item.subjectName === listcoursedone[i].name) {
                                                                for (
                                                                    let j = 0;
                                                                    j < listcoursedone[i].subjectDetail.length;
                                                                    j++
                                                                ) {
                                                                    if (
                                                                        item.classId ===
                                                                        listcoursedone[i].subjectDetail[j].classId
                                                                    ) {
                                                                        get(
                                                                            child(
                                                                                dbRef,
                                                                                `fullCourses/list/${i}/subjectDetail/${j}/numberStudents`,
                                                                            ),
                                                                        ).then((snapshot) => {
                                                                            if (snapshot.exists()) {
                                                                                set(
                                                                                    child(
                                                                                        dbRef,
                                                                                        `fullCourses/list/${i}/subjectDetail/${j}/numberStudents`,
                                                                                    ),
                                                                                    snapshot.val() - 1,
                                                                                );
                                                                                get(
                                                                                    child(dbRef, `fullCourses/list`),
                                                                                ).then((snapshot) => {
                                                                                    if (snapshot.exists()) {
                                                                                        setlistcoursedone(
                                                                                            snapshot.val(),
                                                                                        );
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        let newlist = listcoursecur;
                                                        newlist.splice(index, 1);
                                                        newlist.forEach((item, vt) => {
                                                            if (vt >= index) {
                                                                item.stt = item.stt - 1;
                                                            }
                                                        });
                                                        setlistcoursecur([...newlist]);
                                                        let standardizeEmail =
                                                            sessionStorage.getItem('standardizeEmail');
                                                        get(
                                                            child(
                                                                dbRef,
                                                                `accounts/${standardizeEmail}/courses/register/cur/${getIdx}`,
                                                            ),
                                                        ).then((snapshot) => {
                                                            if (snapshot.exists()) {
                                                                const currentList = snapshot.val();
                                                                currentList.splice(index, 1);
                                                                set(
                                                                    child(
                                                                        dbRef,
                                                                        `accounts/${standardizeEmail}/courses/register/cur/${getIdx}`,
                                                                    ),
                                                                    currentList,
                                                                );
                                                            }
                                                        });
                                                    }}
                                                ></ItemListsub>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {type !== 'admin' && (
                            <div className={cx('content')}>
                                <table className={cx('main-table')}>
                                    <tbody>
                                        <tr className={cx('row')}>
                                            <th className={cx('available-subject')}>Các môn đang đăng ký</th>
                                        </tr>

                                        <tr className={cx('row')}>
                                            <td className={cx('ordinary-num')}>STT</td>
                                            <td className={cx('subject')}>Mã môn/ Môn</td>
                                            <td className={cx('classId')}>Lớp</td>
                                            <td className={cx('credit')}>Tín chỉ</td>
                                            <td className={cx('num')}>Sỉ số</td>
                                            <td className={cx('teacher')}>Giảng viên</td>
                                            <td className={cx('schedule')}>Thời khóa biểu</td>
                                            <td className={cx('week')}>Tuần học</td>
                                            <td className={cx('delete')}></td>
                                        </tr>
                                        {listcoursewill.map((item, index) => {
                                            return (
                                                <ItemListsub
                                                    stt={index + 1}
                                                    subjectId={item.subjectId}
                                                    subjectName={item.subjectName}
                                                    classId={item.classId}
                                                    credit={item.credit}
                                                    numberStudents={item.numberStudents}
                                                    maxStudents={item.maxStudents}
                                                    teacher={item.teacher}
                                                    schedule={item.schedule}
                                                    week={item.week}
                                                    key={index}
                                                    onclick={() => {
                                                        let newlist = listcoursewill;
                                                        newlist.splice(index, 1);
                                                        newlist.forEach((item, vt) => {
                                                            if (vt >= index) {
                                                                item.stt = item.stt - 1;
                                                            }
                                                        });
                                                        setlistcoursewill([...newlist]);
                                                        let standardizeEmail =
                                                            sessionStorage.getItem('standardizeEmail');
                                                        get(
                                                            child(
                                                                dbRef,
                                                                `accounts/${standardizeEmail}/courses/register/will/${getIdx}`,
                                                            ),
                                                        ).then((snapshot) => {
                                                            if (snapshot.exists()) {
                                                                const currentList = snapshot.val();
                                                                currentList.splice(index, 1);
                                                                set(
                                                                    child(
                                                                        dbRef,
                                                                        `accounts/${standardizeEmail}/courses/register/will/${getIdx}`,
                                                                    ),
                                                                    currentList,
                                                                );
                                                            }
                                                        });
                                                    }}
                                                ></ItemListsub>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {type !== 'admin' && (
                        <div className={cx('footer')}>
                            <div className={cx('footer-slcourse')}> Tổng số môn học : {listcoursecur.length}</div>

                            <div className={cx('footer-sltin')}>Số tín đã đăng ký : {sltin}</div>
                            <div
                                className={cx('footer-btnsave')}
                                onClick={() => {
                                    alert('Bạn đã lưu thông tin đăng ký thành công');

                                    if (listcoursewill.length > 0) {
                                        let newarr = [...listcoursewill];
                                        newarr.forEach((item, index) => {
                                            item.numberStudents = item.numberStudents + 1;
                                        });
                                        for (let i = 0; i < listcoursecur.length; i++) {
                                            delete listcoursecur[i].stt;
                                        }

                                        for (let i = 0; i < listcoursewill.length; i++) {
                                            delete listcoursewill[i].stt;
                                        }

                                        for (let i = 0; i < listcoursewill.length; i++) {
                                            get(
                                                child(
                                                    dbRef,
                                                    `fullCourses/list/${indexCourse[i].subjectIdx}/subjectDetail/${indexCourse[i].detailIdx}/numberStudents`,
                                                ),
                                            ).then((snapshot) => {
                                                if (snapshot.exists()) {
                                                    set(
                                                        child(
                                                            dbRef,
                                                            `fullCourses/list/${indexCourse[i].subjectIdx}/subjectDetail/${indexCourse[i].detailIdx}/numberStudents`,
                                                        ),
                                                        snapshot.val() + 1,
                                                    );
                                                    get(child(dbRef, `fullCourses/list`)).then((snapshot) => {
                                                        if (snapshot.exists()) {
                                                            setlistcoursedone(snapshot.val());
                                                        }
                                                    });
                                                }
                                                if (i === listcoursewill.length - 1) {
                                                    setlistcoursecur([...listcoursecur, ...newarr]);
                                                    setlistcoursewill([]);
                                                    setIndexCourse([]);
                                                    let standardizeEmail = sessionStorage.getItem('standardizeEmail');

                                                    set(
                                                        child(
                                                            dbRef,
                                                            `accounts/${standardizeEmail}/courses/register/cur/${getIdx}`,
                                                        ),
                                                        [...listcoursecur, ...newarr],
                                                    );
                                                    set(
                                                        child(
                                                            dbRef,
                                                            `accounts/${standardizeEmail}/courses/register/will/${getIdx}`,
                                                        ),
                                                        [],
                                                    );
                                                }
                                            });
                                        }
                                    }
                                }}
                            >
                                {' '}
                                Lưu thay đổi{' '}
                            </div>
                        </div>
                    )}
                    {type === 'admin' && (
                        <div className={cx('box-add-course')}>
                            <div className={cx('title-add-course')}>Thêm môn học mới</div>
                            <div className={cx('body-add-course')}>
                                <div className={cx('item-add-course')}>
                                    <label className={cx('label-add-course')}>Mã môn</label>
                                    <input
                                        className={cx('input-add-course')}
                                        type="text"
                                        placeholder="Nhập mã môn"
                                        id="input-id"
                                    />
                                </div>
                                <div className={cx('item-add-course')}>
                                    <label className={cx('label-add-course')}>Tên môn</label>
                                    <input
                                        className={cx('input-add-course')}
                                        type="text"
                                        placeholder="Nhập tên môn"
                                        id="input-name"
                                    />
                                </div>
                            </div>
                            <div className={cx('submit-add-course')}>
                                <button
                                    className={cx('btn-add-course')}
                                    onClick={() => {
                                        let id = document.getElementById('input-id').value;
                                        let name = document.getElementById('input-name').value;
                                        if (id.length > 0 && name.length > 0) {
                                            if (
                                                listcoursedone.every((item, index) => {
                                                    return item.Id !== id;
                                                })
                                            ) {
                                                set(child(dbRef, `fullCourses/list/${listcoursedone.length}`), {
                                                    Id: id,
                                                    name: name,
                                                    subjectDetail: '',
                                                });
                                                setlistcoursedone([
                                                    ...listcoursedone,
                                                    { Id: id, name: name, subjectDetail: [] },
                                                ]);
                                                alert('Thêm thành công');

                                                document.getElementById('input-id').value = '';
                                                document.getElementById('input-name').value = '';
                                            } else {
                                                alert('Mã môn hoặc tên môn đã tồn tại');
                                            }
                                        } else {
                                            alert('Mã môn hoặc tên môn chưa điền đủ');
                                        }
                                    }}
                                >
                                    Lưu{' '}
                                </button>
                                <button
                                    className={cx('btn-add-course')}
                                    onClick={() => {
                                        document.getElementById('input-id').value = '';
                                        document.getElementById('input-name').value = '';
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    )}
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

export default SubMHList;
