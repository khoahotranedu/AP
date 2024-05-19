import classNames from 'classnames/bind';
import styles from './contact.module.scss';
import ContactIteam from './item_mess';
import { useState, useEffect } from 'react';
import { UseStore } from '~/Store';
import { get, set, child, ref, database, onValue } from '~/pages/Login';

const cx = classNames.bind(styles);

function Contact({ name, index, email, onclickprev }) {
    let [contact, setContact] = useState([]);
    let [prevstate, setprevstate] = useState(0);
    let [load, setload] = useState(true);

    const dbRef = ref(database);
    const standardizeEmail = sessionStorage.getItem('standardizeEmail');
    let [state] = UseStore();
    let { todos } = state;
    let [myName] = useState(todos.name);

    let handleSend = () => {
        let element = document.querySelector(`.${cx('footer-input')}`);

        let nd = element.value;
        element.value = '';
        element.focus();

        if (nd.trim().length > 0) {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            // eslint-disable-next-line
            let h = hours;
            let m = minutes;
            if (hours < 10) {
                h = '0' + hours;
            }
            if (minutes < 10) {
                m = '0' + minutes;
            }

            let mess = {
                info: 'Bạn',
                content: nd,
                day: day + '/' + month + '/' + year,
                time: h + ':' + m,
                from: myName,
                to: email,
            };
            setContact([...contact, mess]);
            // set to me
            set(child(dbRef, `accounts/${standardizeEmail}/message/contact/${index}/${contact.length}`), mess);
            set(child(dbRef, `accounts/${standardizeEmail}/message/messageList/${index}/content`), 'Bạn: ' + nd);
            set(child(dbRef, `accounts/${standardizeEmail}/message/messageList/${index}/time`), mess.day);
            // set to receiver
            if (email !== '') {
                get(child(dbRef, `accounts/${email}/message/messageList`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        for (let i = 0; i < snapshot.size; i++) {
                            if (snapshot.child(`${i}/email`).val() === standardizeEmail) {
                                let messCp = mess;
                                messCp.info = mess.from;
                                set(child(dbRef, `accounts/${email}/message/contact/${i}/${contact.length}`), messCp);
                                set(child(dbRef, `accounts/${email}/message/messageList/${i}/name`), messCp.from);
                                set(
                                    child(dbRef, `accounts/${email}/message/messageList/${i}/content`),
                                    messCp.from + ': ' + nd,
                                );
                                set(child(dbRef, `accounts/${email}/message/messageList/${i}/time`), messCp.day);
                                set(child(dbRef, `accounts/${email}/message/messageList/${i}/email`), standardizeEmail);
                            }
                        }
                    }
                });
            }

            setTimeout(() => {
                let body = document.querySelector(`.${cx('body')}`);
                body.scrollTop = body.scrollHeight;
            }, 500);
        }
        // eslint-disable-next-line
    };
    useEffect(() => {
        onValue(child(dbRef, `accounts/${standardizeEmail}/message/contact/${index}`), (snapshot) => {
            if (snapshot.exists()) {
                let arr = [];
                for (let i = 0; i < snapshot.size; i++) {
                    arr.push({
                        info: snapshot.val()[i].info,
                        content: snapshot.val()[i].content,
                        day: snapshot.val()[i].day,
                        time: snapshot.val()[i].time,
                        from: snapshot.val()[i].from,
                        to: snapshot.val()[i].to,
                    });
                }
                setContact(arr);
                setload(false);
                setTimeout(() => {
                    let body = document.querySelector(`.${cx('body')}`);
                    if (body) {
                        body.scrollTop = body.scrollHeight;
                    }
                }, 500);
            }
        });
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (prevstate !== contact.length) {
            let body = document.querySelector(`.${cx('body')}`);
            if (body) {
                if (body.scrollTop > body.scrollHeight - 800) {
                    body.scrollTop = body.scrollHeight;
                }
            }

            setprevstate(contact.length);
        }
        // eslint-disable-next-line
    }, [contact]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <i className={cx('icon__prev', 'fa-solid', 'fa-chevron-left')} onClick={onclickprev}></i>
                <div className={cx('contact')}>
                    <img
                        src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                        alt="avatar"
                        className={cx('avatar')}
                    />
                    <div className={cx('name')}>{name}</div>
                </div>
                
            </div>
            <div className={cx('body')}>
                {!load &&
                    contact.map((item, index) => {
                        return (
                            <ContactIteam
                                key={`${item.info.name}-${index}`}
                                name={item.info}
                                content={item.content}
                                day={item.day}
                                time={item.time}
                            />
                        );
                    })}
                {load && (
                    <div>
                        {' '}
                        <div className={cx('loadding-icon')}>
                            <i className={cx('iconload', 'fa-solid', 'fa-spinner')}></i>
                        </div>
                    </div>
                )}
            </div>
            <div className={cx('footer')}>
                <textarea
                    type="text"
                    id="text_field"
                    className={cx('footer-input')}
                    placeholder="Nhập nội dung"
                    onKeyUp={(e) => {
                        if (e.which === 13) {
                            handleSend();
                        }
                    }}
                    spellCheck={false}
                ></textarea>

                <div className={cx('footer-icon')} onClick={handleSend}>
                    <i className={cx('send', 'fa-solid', 'fa-paper-plane')}></i>
                </div>
            </div>
        </div>
    );
}

export default Contact;
