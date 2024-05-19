import classNames from 'classnames/bind';
import styles from './list_charter.module.scss';
import ChapterItem from '../chapterItem';
import { useEffect, useState } from 'react';
import { database, get, child, set, ref } from '~/pages/Login';
import { UseStore } from '~/Store';
const cx = classNames.bind(styles);
function ItemChapter({ list, courseID, classCourse }) {
    let [listchapter, setListChapter] = useState(list);
    const dbRef = ref(database);
    let [state] = UseStore();
    let { todos } = state;
    let [type, setType] = useState(todos.job);
    function typePerson(type) {
        if (type === 'student') return true;
        else if (type === 'teacher') return false;
    }
    const [show, setshow] = useState(false);
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');

    if (!type) {
        get(child(dbRef, `accounts/${standardizeEmail}/infor/job`)).then((snapshot) => {
            if (snapshot.exists()) {
                setType(snapshot.val());
            }
        });
        setTimeout(() => {
            setshow(true);
        }, 2500);
    } else {
        if (show === false) setshow(true);
    }

    useEffect(() => {
        setTimeout(() => {
            get(child(dbRef, `courses/current/courseContent/${courseID}_${classCourse}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    if (listchapter !== list) {
                        set(child(dbRef, `courses/current/courseContent/${courseID}_${classCourse}`), listchapter);
                    }
                } else {
                    set(child(dbRef, `courses/current/courseContent/${courseID}_${classCourse}`), listchapter);
                }
            });
        }, 100);
        // eslint-disable-next-line
    }, [listchapter]);

    useEffect(() => {
        setTimeout(() => {
            get(child(dbRef, `courses/current/courseContent/${courseID}_${classCourse}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    let newList = [];
                    for (let i = 0; i < snapshot.size; i++) {
                        newList.push({
                            name: snapshot.val()[i].name,
                            content: snapshot.val()[i].content,
                            type: snapshot.val()[i].type,
                            file: snapshot.val()[i].file,
                            index: i,
                        });
                    }
                    setListChapter(newList);
                }
            });
        }, 100);
        // eslint-disable-next-line
    }, []);

    return (
        <>
            {show && (
                <div className={cx('wrapper')}>
                    {listchapter.map((chapter, index) => {
                        return (
                            <div key={index + 'cccc'}>
                                <ChapterItem
                                    key={chapter.name}
                                    name={chapter.name}
                                    type={chapter.type}
                                    content={chapter.content}
                                    courseID={courseID}
                                    classCourse={classCourse}
                                    idx={chapter.index}
                                    job={!typePerson(type)}
                                    ondelete={() => {
                                        setListChapter(
                                            listchapter.filter(function (item) {
                                                return item.name !== chapter.name;
                                            }),
                                        );
                                    }}
                                    onchange={() => {
                                        document
                                            .querySelector(`#change-${index}`)
                                            .classList.remove(cx('display__none'));
                                    }}
                                />
                                {!typePerson(type) && (
                                    <div className={cx('create_content_container')}>
                                        <button
                                            className={cx('plus_btn')}
                                            id="create_content"
                                            onClick={() => {
                                                document
                                                    .querySelector(`#add-${index}`)
                                                    .classList.remove(cx('display__none'));
                                            }}
                                        ></button>
                                        <span style={{ display: 'block', marginLeft: '12px' }} onClick={() => {}}>
                                            Thêm chương mới
                                        </span>
                                    </div>
                                )}
                                <div className={cx('content_container', 'display__none')} id={`change-${index}`}>
                                    <textarea
                                        type="text"
                                        id={`text_field-change-name${index}`}
                                        className={cx('textarea')}
                                        placeholder="Nhập tên mới"
                                    ></textarea>
                                    <textarea
                                        type="text"
                                        id={`text_field-change-mt${index}`}
                                        className={cx('textarea')}
                                        placeholder="Nhập mô tả mới"
                                    ></textarea>

                                    <button
                                        className={cx('submit_btn')}
                                        id="submit_btn"
                                        onClick={() => {
                                            let namechapter = document.querySelector(`#text_field-change-name${index}`);
                                            let mtchappter = document.querySelector(`#text_field-change-mt${index}`);
                                            if (
                                                namechapter.value.trim().length > 0 ||
                                                mtchappter.value.trim().length > 0
                                            ) {
                                                let newobj = listchapter;
                                                newobj[index].type = true;
                                                newobj[index].index = index;
                                                if (namechapter.value.trim().length === 0) {
                                                    get(
                                                        child(
                                                            dbRef,
                                                            `courses/current/courseContent/${courseID}_${classCourse}/${index}/name`,
                                                        ),
                                                    ).then((snapshot) => {
                                                        if (snapshot.exists()) {
                                                            newobj[index].name = snapshot.val();
                                                        }
                                                    });
                                                } else {
                                                    newobj[index].name = namechapter.value;
                                                }

                                                if (mtchappter.value.trim().length === 0) {
                                                    get(
                                                        child(
                                                            dbRef,
                                                            `courses/current/courseContent/${courseID}_${classCourse}/${index}/content`,
                                                        ),
                                                    ).then((snapshot) => {
                                                        if (snapshot.exists()) {
                                                            newobj[index].content = snapshot.val();
                                                        }
                                                    });
                                                } else {
                                                    newobj[index].content = mtchappter.value;
                                                }
                                                get(
                                                    child(
                                                        dbRef,
                                                        `courses/current/courseContent/${courseID}_${classCourse}/${index}/file`,
                                                    ),
                                                ).then((snapshot) => {
                                                    if (snapshot.exists()) {
                                                        newobj[index].file = snapshot.val();
                                                    } else {
                                                        newobj[index].file = '';
                                                    }
                                                });
                                                mtchappter.value = '';
                                                namechapter.value = '';
                                                setListChapter([...newobj]);
                                                document
                                                    .querySelector(`#change-${index}`)
                                                    .classList.add(cx('display__none'));
                                            }
                                        }}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className={cx('submit_btn')}
                                        id="cancel_btn"
                                        onClick={() => {
                                            let namechapter = document.querySelector(`#text_field-change-name${index}`);
                                            let mtchappter = document.querySelector(`#text_field-change-mt${index}`);
                                            mtchappter.value = '';
                                            namechapter.value = '';
                                            document
                                                .querySelector(`#change-${index}`)
                                                .classList.add(cx('display__none'));
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                                <div className={cx('content_container', 'display__none')} id={`add-${index}`}>
                                    <textarea
                                        type="text"
                                        id={`text_field-name${index}`}
                                        className={cx('textarea')}
                                        placeholder="Nhập tên chương"
                                    ></textarea>
                                    <textarea
                                        type="text"
                                        id={'text_field-mt' + index}
                                        className={cx('textarea')}
                                        placeholder="Nhập mô tả chương"
                                    ></textarea>

                                    <button
                                        className={cx('submit_btn')}
                                        id="submit_btn"
                                        onClick={() => {
                                            let namechapter = document.querySelector(`#text_field-name${index}`);
                                            let mtchappter = document.querySelector(`#text_field-mt${index}`);
                                            if (namechapter.value.trim().length > 0) {
                                                let newobj = [];
                                                let i = 0;
                                                let j = 0;
                                                while (i < listchapter.length + 1) {
                                                    if (i <= index) {
                                                        newobj[i] = listchapter[j];
                                                        j++;
                                                        i++;
                                                    } else if (i === index + 1) {
                                                        newobj[i] = {
                                                            name: namechapter.value,
                                                            content: mtchappter.value,
                                                            type: true,
                                                            file: '',
                                                            index: i,
                                                        };
                                                        i++;
                                                    } else {
                                                        newobj[i] = listchapter[j];
                                                        j++;
                                                        i++;
                                                    }
                                                }

                                                get(
                                                    child(dbRef, `notification/courses/${courseID}_${classCourse}`),
                                                ).then((ss) => {
                                                    if (ss.exists) {
                                                        const currentDate = new Date();
                                                        const year = currentDate.getFullYear();
                                                        const month = currentDate.getMonth() + 1;
                                                        const day = currentDate.getDate();

                                                        set(
                                                            child(
                                                                dbRef,
                                                                `notification/courses/${courseID}_${classCourse}/` +
                                                                    ss.size.toString(),
                                                            ),
                                                            {
                                                                title:
                                                                    'Khóa học ' +
                                                                    courseID +
                                                                    '_' +
                                                                    classCourse +
                                                                    ' vừa cập nhật nội dung mới: ' +
                                                                    namechapter.value,
                                                                time: day + '/' + month + '/' + year,
                                                                active: true,
                                                            },
                                                        );
                                                        mtchappter.value = '';
                                                        namechapter.value = '';
                                                    }
                                                });

                                                document
                                                    .querySelector(`#add-${index}`)
                                                    .classList.add(cx('display__none'));

                                                setListChapter([...newobj]);
                                            }
                                        }}
                                    >
                                        Thêm
                                    </button>
                                    <button
                                        className={cx('submit_btn')}
                                        id="cancel_btn"
                                        onClick={() => {
                                            let namechapter = document.querySelector(`#text_field-name${index}`);
                                            let mtchappter = document.querySelector(`#text_field-mt${index}`);
                                            mtchappter.value = '';
                                            namechapter.value = '';
                                            document.querySelector(`#add-${index}`).classList.add(cx('display__none'));
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        );
                    })}
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

export default ItemChapter;
