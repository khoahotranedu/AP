import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './subitem.module.scss';
import OnTime from '../OnTime/OnTime';
import { UseStore } from '~/Store';

const cx = classNames.bind(styles);

const SubItem = ({id, title, starttime, starttime2, endtime, endtime2, ondelete, STT }) => {
    let [state] = UseStore();
    let { todos } = state;
    let [type] = useState(todos.job);

    const startParts = starttime.split('-');
    const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);
    const startTimeParts = starttime2.split(':');
    startDate.setHours(parseInt(startTimeParts[0], 10));
    startDate.setMinutes(parseInt(startTimeParts[1], 10));

    const endParts = endtime.split('-');
    const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2]);
    const endTimeParts = endtime2.split(':');
    endDate.setHours(parseInt(endTimeParts[0], 10));
    endDate.setMinutes(parseInt(endTimeParts[1], 10));

    useEffect(() => {
        if (startDate >= endDate) {
            ondelete();
        }
    });
    
    const now = new Date();
    const registrationOver = now >= endDate;
    const registrationNotYetDue = now <= startDate;

    return (
        <div>
            <ul className={cx('content__row', 'content__row_item')}>
                <li className={cx('content-item', 'STT')}>{STT}</li>
                <li className={cx('content-item', 'desc')}>{title}</li>
                <li className={cx('content-item', 'time')}>
                    <div className={cx('content-item--first')}>
                        {startParts[2] + '-' + startParts[1] + '-' + startParts[0]}
                        <br />
                        {starttime2}
                    </div>
                    <div className={cx('content-item--second')}>
                        {endParts[2] + '-' + endParts[1] + '-' + endParts[0]} <br />
                        {endtime2}
                    </div>
                </li>
                <li className={cx('content-item', 'regis')}>
                    {registrationOver ? (
                        <div className={cx('overtime')}>Hết thời gian đăng ký</div>
                    ) : registrationNotYetDue ? (
                        <div className={cx('not-due')}>Chưa tới hạn đăng ký</div>
                    ) : (
                        <OnTime id={id}/>
                    )}
                </li>
                {type === 'admin' && (<li className={cx('delete')} onClick={ondelete}>
                    <i className={cx('icon-delete', 'fa-regular', 'fa-trash-can')}></i>
                </li>)}
            </ul>
        </div>
    );
}

export default SubItem;