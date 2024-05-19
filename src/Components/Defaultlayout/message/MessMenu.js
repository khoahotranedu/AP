import classNames from 'classnames/bind';
import styles from './message.module.scss';
import MessItem from './index';
import { useState, useEffect } from 'react';
import Contact from './contact';
import { child, ref, database, onValue } from '~/pages/Login';

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
function Message({ onClick }) {
    let [messageList, setMessageList] = useState([]);
    const [Input_value, setInput_value] = useState('');
    const [isSearch, setIssearch] = useState(false);
    const [contact, setContact] = useState(false);
    const [contact_name, setContact_name] = useState('');
    const [contact_index, setContact_index] = useState(0);
    const [contact_email, setContact_email] = useState('');
    const dbRef = ref(database);
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');
    useEffect(() => {
        if (Input_value.length > 0) {
            setIssearch(true);
        } else {
            setIssearch(false);
        }
    }, [Input_value]);

    // useEffect(() => {
    //     get(child(dbRef, `accounts/${standardizeEmail}/message`)).then((snapshot) => {
    //         if (snapshot.exists()) {
    //             let arr = [];
    //             for (let i = snapshot.child('messageList').size - 1; i >= 0; i--) {
    //                 arr.push({
    //                     name: snapshot.child('messageList').val()[i].name,
    //                     time: snapshot.child('messageList').val()[i].time,
    //                     content: snapshot.child('messageList').val()[i].content,
    //                     index: i,
    //                 });
    //             }
    //             setMessageList(arr);
    //         }
    //     });
    //     // eslint-disable-next-line
    // }, []);

    useEffect(() => {
        onValue(child(dbRef, `accounts/${standardizeEmail}/message/messageList`), (snapshot) => {
            if (snapshot.exists()) {
                let arr = [];
                for (let i = snapshot.size - 1; i >= 0; i--) {
                    arr.push({
                        name: snapshot.val()[i].name,
                        time: snapshot.val()[i].time,
                        content: snapshot.val()[i].content,
                        email: snapshot.val()[i].email,
                        index: i,
                    });
                }
                setMessageList(arr);
            }
        });
        // eslint-disable-next-line
    }, []);
    return (
        <div className={cx('message')}>
            <div className={cx('clear')} onClick={onClick}>
                <i className={cx('fa-solid', 'fa-xmark')}></i>
            </div>
            <div className={cx('header')}>Tin nhắn cá nhân</div>
            {!contact && (
                <div className={cx('box_search')}>
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
                                setIssearch(false);

                                setInput_value('');
                                document.querySelector(`.${cx('search__input')}`).focus();
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
            {!contact && !isSearch && (
                <div className={cx('mess_body')}>
                    {messageList.map((item, index) => {
                        return (
                            <MessItem
                                key={index}
                                name={item.name}
                                time={item.time}
                                content={item.content}
                                onClick={() => {
                                    setContact(true);
                                    setContact_name(item.name);
                                    setContact_index(item.index);
                                    setContact_email(item.email);
                                }}
                            ></MessItem>
                        );
                    })}
                </div>
            )}
            {!contact && isSearch && (
                <div className={cx('mess_body')}>
                    {messageList
                        .filter((item) => {
                            return removeVietnameseTones(item.name)
                                .toLowerCase()
                                .includes(removeVietnameseTones(Input_value.toLowerCase()));
                        })
                        .map((item, index) => {
                            return (
                                <MessItem
                                    key={index}
                                    name={item.name}
                                    time={item.time}
                                    content={item.content}
                                    onClick={() => {
                                        setContact(true);
                                        setContact_name(item.name);
                                        setContact_email(item.email);
                                    }}
                                ></MessItem>
                            );
                        })}
                </div>
            )}
            {contact && (
                <Contact
                    name={contact_name}
                    index={contact_index}
                    email={contact_email}
                    onclickprev={() => {
                        setContact(false);
                    }}
                />
            )}
        </div>
    );
}

export default Message;
