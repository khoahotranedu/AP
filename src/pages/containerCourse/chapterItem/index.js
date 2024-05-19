import classNames from 'classnames/bind';
import styles from './chaoterItem.module.scss';
import ChapterFile from './chapterFile';
import { useState, useRef, useEffect } from 'react';
import { database, get, set, child, ref, storage } from '~/pages/Login';
import { ref_firestore, uploadBytes, getDownloadURL, listAll, deleteObject } from '~/pages/Login';

const cx = classNames.bind(styles);

function ChapterItem({
    type = true,
    name,
    content,
    listChapter = [],
    courseID,
    classCourse,
    idx,
    ondelete,
    onchange,
    job,
}) {
    let [listOption] = useState([
        {
            value: 'fa-file-pdf',
            type: '.pdf',
            name: 'Pdf',
        },
        {
            value: 'fa-file-word',
            type: '.docx',
            name: 'Word',
        },
        {
            value: 'fa-file-image',
            type: '.png',
            name: 'Image',
        },
        {
            value: 'fa-file-video',
            type: '.mkv',
            name: 'Video',
        },
        {
            value: 'fa-file-powerpoint',
            type: '.pptx',
            name: 'Powerpoint',
        },
    ]);
    let [linkfile, setLinkfile] = useState([]);
    let [more, setMore] = useState(false);
    let [listChaper, setListChapter] = useState([...listChapter]);

    let [show, setShow] = useState(false);
    let [increase, setIncrease] = useState(false);
    let [typefile, setType] = useState('');

    let [selectFile, setSelectFile] = useState(null);

    let fileref = useRef();
    let wrapperref = useRef();
    let selectref = useRef();
    let addelementref = useRef();
    // eslint-disable-next-line
    const filesListRef = ref_firestore(storage, `files/${courseID}_${classCourse}/${idx}`);
    let dbRef = ref(database);
    // eslint-disable-next-line

    useEffect(() => {
        get(child(dbRef, `courses/current/courseContent/${courseID}_${classCourse}/${idx}/file`)).then((snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.val() !== '') {
                    let nameFiles = [];
                    let listFiles = [];
                    for (let i = 0; i < snapshot.child('linkFile').size; i++) {
                        listFiles.push(snapshot.child('linkFile').val()[i]);
                        nameFiles.push({
                            type: snapshot.child('nameFile').val()[i].type,
                            name: snapshot.child('nameFile').val()[i].name,
                        });
                    }
                    setLinkfile(listFiles);
                    setListChapter(nameFiles);
                }
            }
        });
        // eslint-disable-next-line
    }, []);

    return (
        <div className={cx('wrapper')} ref={wrapperref}>
            <div className={cx('title-group')}>
                <button
                    className={cx('expand_content', 'expand_content_btn')}
                    onClick={() => {
                        if (more === true) {
                            setMore(false);
                            setShow(false);
                            setIncrease(false);
                        } else {
                            setMore(true);

                            setShow(true);
                            setIncrease(false);
                        }
                    }}
                >
                    {more && <i className={cx('icon', 'fa-solid', 'fa-chevron-down')} />}
                    {!more && <i className={cx('icon', 'fa-solid', 'fa-chevron-right')} />}
                </button>
                <h3 className={cx('topic')}>{name}</h3>
                {type && job && (
                    <button className={cx('modify_btn', 'modify_content_btn')} onClick={onchange}>
                        Chỉnh sửa
                    </button>
                )}
                {type && job && (
                    <button
                        className={cx('modify_btn', 'delete_content_btn')}
                        onClick={() => {
                            // eslint-disable-next-line
                            setListChapter([]);
                            ondelete();
                            listAll(filesListRef).then((response) => {
                                response.items.forEach((item) => {
                                    deleteObject(item);
                                });
                            });
                        }}
                    >
                        Xóa
                    </button>
                )}
            </div>
            {show && (
                <div className={cx('container')} ref={addelementref}>
                    <div>
                        {type && content && <p className={cx('content')}>{content}</p>}
                        {job && (
                            <div className={cx('create_content_container')}>
                                <button
                                    className={cx('plus_btn')}
                                    id="create_content"
                                    onClick={() => {
                                        setIncrease(!increase);
                                    }}
                                ></button>
                                <span style={{ display: 'block', marginLeft: '12px' }} onClick={() => {}}>
                                    Thêm nội dung
                                </span>
                            </div>
                        )}

                        {increase && (
                            <div className={cx('content_container')}>
                                <textarea
                                    type="text"
                                    id="text_field"
                                    className={cx('textarea')}
                                    placeholder="Nhập nội dung"
                                ></textarea>
                                <select
                                    className={cx('type_file')}
                                    id="selection"
                                    onChange={() => {
                                        setType(selectref.current.options[selectref.current.selectedIndex].id);
                                    }}
                                    ref={selectref}
                                >
                                    <option value="" key="0">
                                        Chọn định dạng file
                                    </option>
                                    {listOption.map((item, index) => {
                                        return (
                                            <option value={item.value} key={index} id={item.type}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                                </select>
                                <div className={cx('inputfile')}>
                                    <input
                                        type="file"
                                        id="upload_btn"
                                        className={cx('title')}
                                        accept={typefile}
                                        ref={fileref}
                                        onClick={(e) => {
                                            if (
                                                selectref.current.options[selectref.current.selectedIndex].value
                                                    .length <= 0
                                            ) {
                                                console.log('Please select');
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => {
                                            if (
                                                selectref.current.options[selectref.current.selectedIndex].value
                                                    .length > 0
                                            ) {
                                                let file = fileref.current.files[0];
                                                setSelectFile(file);
                                            }
                                        }}
                                    />
                                </div>
                                <button
                                    className={cx('submit_btn')}
                                    id="submit_btn"
                                    onClick={() => {
                                        let type = selectref.current.options[selectref.current.selectedIndex].value;
                                        let name = document.querySelector(`.${cx('textarea')}`).value;
                                        if (name.trim().length > 0 && type.trim().length > 0 && selectFile !== null) {
                                            document.querySelector(`.${cx('textarea')}`).value = '';
                                            selectref.current.selectedIndex = 0;

                                            setIncrease(false);
                                            setListChapter([...listChaper, { type: type, name: name }]);

                                            let fileRef = ref_firestore(
                                                storage,
                                                `files/${courseID}_${classCourse}/${idx}/${name}`,
                                            );
                                            uploadBytes(fileRef, selectFile)
                                                .then(() => {
                                                    return getDownloadURL(fileRef);
                                                })
                                                .then((url) => {
                                                    setLinkfile([...linkfile, url]);
                                                    set(
                                                        child(
                                                            dbRef,
                                                            `courses/current/courseContent/${courseID}_${classCourse}/${idx}/file/linkFile`,
                                                        ),
                                                        [...linkfile, url],
                                                    );
                                                    set(
                                                        child(
                                                            dbRef,
                                                            `courses/current/courseContent/${courseID}_${classCourse}/${idx}/file/nameFile`,
                                                        ),
                                                        [...listChaper, { type: type, name: name }],
                                                    );
                                                });
                                        }
                                    }}
                                >
                                    Thêm
                                </button>
                                <button
                                    className={cx('submit_btn')}
                                    id="cancel_btn"
                                    onClick={() => {
                                        document.querySelector(`.${cx('textarea')}`).value = '';
                                        selectref.current.selectedIndex = 0;
                                        setIncrease(false);

                                        setSelectFile(null);
                                        setLinkfile([...linkfile]);
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        )}
                        <div className={cx('listchapter')}>
                            {listChaper.map((itemChapter, index) => {
                                return (
                                    <ChapterFile
                                        key={`${itemChapter + '_' + index}`}
                                        name={itemChapter.name}
                                        type={itemChapter.type}
                                        linkfile={linkfile[index]}
                                        onclick={() => {
                                            let file = ref_firestore(
                                                storage,
                                                `files/${courseID}_${classCourse}/${idx}/${itemChapter.name}`,
                                            );
                                            deleteObject(file);

                                            listChaper.splice(index, 1);
                                            linkfile.splice(index, 1);

                                            setListChapter([...listChaper]);
                                            setLinkfile([...linkfile]);
                                            set(
                                                child(
                                                    dbRef,
                                                    `courses/current/courseContent/${courseID}_${classCourse}/${idx}/file/linkFile`,
                                                ),
                                                [...linkfile],
                                            );
                                            set(
                                                child(
                                                    dbRef,
                                                    `courses/current/courseContent/${courseID}_${classCourse}/${idx}/file/nameFile`,
                                                ),
                                                [...listChaper],
                                            );
                                            if (linkfile.length === 0) {
                                                set(
                                                    child(
                                                        dbRef,
                                                        `courses/current/courseContent/${courseID}_${classCourse}/${idx}/file`,
                                                    ),
                                                    '',
                                                );
                                            }
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChapterItem;
