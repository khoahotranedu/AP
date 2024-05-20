import classNames from 'classnames/bind';
import styles from './lich.module.scss';
import Calender_item from './Calender-item';
import { useState, useEffect } from 'react';
import { database, get, child, ref } from '~/pages/Login';

const cx = classNames.bind(styles);
function Calender() {
    let [calender, setcalender] = useState([['null']]);
    const [month, setmonth] = useState(0);
    const [show, setshow] = useState(false);

    let monthpre = month - 1;
    if (monthpre === -1) {
        monthpre = 12;
    }
    const dbRef = ref(database);
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');
    useEffect(() => {
        if (calender[0][0] === 'null') {
            get(child(dbRef, `accounts/${standardizeEmail}/courses/current/calendar`)).then((snapshot) => {
                if (snapshot.exists()) {
                    let arr = [];
                    let mySchedule = [];
                    for (let i = 0; i < 12; i++) {
                        let monthArray = [];
                        let date = new Date(2024, i, 1);
                        let firstDay = date.getDay();
                        let daysInMonth = new Date(2024, i + 1, 0).getDate();

                        let offset = (firstDay + 6) % 7;
                        for (let j = 0; j < offset; j++) {
                            monthArray.push({ day: null, month: i + 1, content: [] });
                        }

                        for (let j = 1; j <= daysInMonth; j++) {
                            monthArray.push({ day: j, month: i + 1, content: [] });
                        }

                        arr.push(monthArray);
                    }

                    for (let k = 0; k < snapshot.size; k++) {
                        mySchedule.push(snapshot.val()[k]);
                        for (let i = 0; i < 12; i++) {
                            let daysInMonth = new Date(2024, i + 1, 0).getDate();
                            /**/
                            let date = new Date(2024, i, 1);
                            let firstDay = date.getDay();

                            let offset = (firstDay + 6) % 7;
                            /* */
                            for (
                                let j = 0;
                                j < daysInMonth;
                                /**/
                                offset++,
                                    /* */
                                    j++
                            ) {
                                if (mySchedule[k][i][j] !== 'null') {
                                    const regex = /^(.*?):\s*(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})_(.*)$/;
                                    const matches = regex.exec(mySchedule[k][i][j]);
                                    /**/ arr[i][offset].content.push({
                                        name: matches[1].trim(),
                                        time: matches[2].trim(),
                                        class: matches[3].trim()
                                    });
                                }
                            }
                        }
                    }

                    setTimeout(() => {
                        let x = new Date();
                        setmonth(x.getMonth());
                        setcalender(arr);
                        setshow(true);
                    }, 50);
                }
            });
        }
        // eslint-disable-next-line
    }, []);
    return (
        <>
            {show && (
                <div className={cx('body')}>
                    <div className={cx('header')}>
                        <div className={cx('title')}>Thời khoá biểu</div>
                    </div>
                    <div className={cx('control')}>
                        <button
                            className={cx('control-btn-prev')}
                            onClick={() => {
                                if (month === 0) {
                                    setmonth(11);
                                } else {
                                    setmonth(month - 1);
                                }
                            }}
                        >
                            <i className={cx('icon-month', 'fa-solid', 'fa-caret-left')}></i>
                            Tháng {monthpre === 12 ? 12 : monthpre + 1}
                        </button>

                        <button
                            className={cx('control-btn-next')}
                            onClick={() => {
                                if (month === 11) {
                                    setmonth(0);
                                } else {
                                    setmonth(month + 1);
                                }
                            }}
                        >
                            <div style={{ width: '120px' }}>Tháng {month === 11 ? 1 : month + 2}</div>
                            <i className={cx('icon-month', 'fa-solid', 'fa-caret-right')}></i>
                        </button>
                    </div>
                    <div className={cx('title')}> Tháng {month + 1} (2024) </div>

                    <div className={cx('calender-number')}>
                        <div className={cx('day')}>T2</div>
                        <div className={cx('day')}>T3</div>
                        <div className={cx('day')}>T4</div>
                        <div className={cx('day')}>T5</div>
                        <div className={cx('day')}>T6</div>
                        <div className={cx('day')}>T7</div>
                        <div className={cx('day')}>CN</div>
                    </div>

                    <div className={cx('calender')}>
                        {calender[month].map((item, index) => {
                            // eslint-disable-next-line
                            let x = new Date();
                            let date = new Date(2024, month, 1);
                            let firstDay = date.getDay();
                            let offset = (firstDay + 6) % 7;
                            return (
                                // eslint-disable-next-line
                                <Calender_item
                                    key={`item.day-${index}`}
                                    date={item.day}
                                    content={item.content}

                                    active={index - offset === x.getDate() - 1 && month === x.getMonth()}
                                />
                            );
                        })}
                    </div>
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

export default Calender;
