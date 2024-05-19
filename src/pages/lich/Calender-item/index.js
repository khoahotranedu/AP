import classNames from 'classnames/bind';
import styles from '../lich.module.scss';
import { useState } from 'react';
const cx = classNames.bind(styles);
function Calender_item({ date, content = [{ name: '', time: '', class: '' }], active }) {
    const [show, setshow] = useState(false);
    return (
        <>
            <div
                className={cx('calender-item', { active })}
                onClick={() => {
                    // console.log('click');
                    setshow(true);
                }}
            >
                <div className={cx('calender-item-day')}>{date}</div>
                {content[0] && (
                    <div className={cx('wrap')}>
                        <div className={cx('calender-item-title')}>{content[0].name}</div>
                        <div className={cx('calender-item-time')}>{content[0].time}</div>
                        <div className={cx('calender-item-class')}>{content[0].class}</div>
                    </div>
                )}
                {content[1] && (
                    <div className={cx('wrap')}>
                        <div className={cx('calender-item-title')}>{content[1].name}</div>
                        <div className={cx('calender-item-time')}>{content[1].time}</div>
                        <div className={cx('calender-item-class')}>{content[1].class}</div>
                    </div>
                )}
                {content[2] && (
                    <div className={cx('wrap')}>
                        <div className={cx('calender-item-title')}>{content[2].name}</div>
                        <div className={cx('calender-item-time')}>{content[2].time}</div>
                        <div className={cx('calender-item-class')}>{content[2].class}</div>
                    </div>
                )}
                {content[3] && (
                    <div className={cx('wrap')}>
                        <div className={cx('calender-item-vv')}>...</div>
                    </div>
                )}
            </div>
            {show && (
                <div className={cx('modal')}>
                    <div className={cx('modal-content')}>
                        <div
                            className={cx('modal-content-icon')}
                            onClick={() => {
                                setshow(false);
                            }}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <div className={cx('modal-content-header')}>{date}</div>

                        {content.map((item, index) => {
                            return (
                                <div className={cx('wrap-modal')} key={index}>
                                    <div className={cx('calender-item-title')}>{item.name} : </div>
                                    <div className={cx('calender-item-time')}>{item.time}</div>
                                    <div className={cx('calender-item-class')}>{item.class}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
}

export default Calender_item;
