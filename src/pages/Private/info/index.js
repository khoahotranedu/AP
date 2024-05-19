import classNames from 'classnames/bind';
import styles from './info.module.scss';
import { UseStore } from '~/Store';
import { useState } from 'react';

const cx = classNames.bind(styles);
function Info({ onchange }) {
    let [state] = UseStore();
    let { todos } = state;
    let [type] = useState(todos.job);
    function typePerson(type) {
        if (type === 'student') return true;
        else if (type === 'teacher') return false;
    }

    return (
        <div className={cx('info-item', 'info', 'display__none', 'breadcrum__item-at-1')}>
            {typePerson(type) && <div className={cx('info__header')}>Thông tin cá nhân</div>}
            {!typePerson(type) && <div className={cx('info__header')}>Thông tin giảng viên</div>}

            <div className={cx('info__body')}>
                <div className={cx('info__blockInput')}>
                    <span className={cx('label-infor')}>Họ và tên</span>
                    <span className={cx('myInfor')}>{todos.name}</span>
                </div>

                {typePerson(type) && (
                    <div className={cx('info__blockInput')}>
                        <span className={cx('label-infor')}>Mã số sinh viên</span>
                        <span className={cx('myInfor')}>{todos.id}</span>
                    </div>
                )}

                {!typePerson(type) && (
                    <div className={cx('info__blockInput')}>
                        <span className={cx('label-infor')}>Mã số giảng viên</span>
                        <span className={cx('myInfor')}>{todos.id}</span>
                    </div>
                )}
                {!typePerson(type) && (
                    <div className={cx('info__blockInput')}>
                        <span className={cx('label-infor')}>Bằng cấp</span>
                        <span className={cx('myInfor')}>{todos.degree}</span>
                    </div>
                )}

                <div className={cx('info__blockInput')}>
                    <span className={cx('label-infor')}>Ngày sinh</span>
                    <span className={cx('myInfor')}>{todos.birthday}</span>
                </div>
                <div className={cx('info__blockInput')}>
                    <span className={cx('label-infor')}>Giới tính</span>
                    <span className={cx('myInfor')}>{todos.gender}</span>
                </div>
                <div className={cx('info__blockInput')}>
                    <span className={cx('label-infor')}>Nơi sinh</span>
                    <span className={cx('myInfor')}>{todos.born}</span>
                </div>
                <div className={cx('info__blockInput', 'info__blockInput-input')}>
                    <span className={cx('label-infor')}>Email cá nhân</span>
                    <span className={cx('myInfor')}>{todos.email}</span>
                </div>
                <div className={cx('info__blockInput', 'info__blockInput-input')}>
                    <span className={cx('label-infor')}>Số điện thoại</span>
                    <span className={cx('myInfor')}>{todos.phone}</span>
                </div>
                <div className={cx('info__blockInput', 'info__blockInput-input')}>
                    <span className={cx('label-infor')}> Mạng xã hội</span>
                    <a href={`${todos.socialNetwork}`} className={cx('myInfor', 'social')}>
                        {todos.socialNetwork}
                    </a>
                </div>
                <div className={cx('info__blockInput', 'info__blockInput-input')}>
                    <span className={cx('label-infor')}>Địa chỉ</span>
                    <span className={cx('myInfor')}>{todos.address}</span>
                </div>
                <div className={cx('info__header')}>Thông tin người thân </div>
                <div className={cx('info__blockInput', 'info__blockInput-input')}>
                    <span className={cx('label-infor')}>Tên người thân</span>
                    <span className={cx('myInfor')}>{todos.nameParent1}</span>
                </div>
                <div className={cx('info__blockInput', ' info__blockInput-input')}>
                    <span className={cx('label-infor')}>Số điện thoại người thân</span>
                    <span className={cx('myInfor')}>{todos.phoneParent1}</span>
                </div>
                <div className={cx('info__header')}>Thông tin người thân </div>
                <div className={cx('info__blockInput', 'info__blockInput-input')}>
                    <span className={cx('label-infor')}>Tên người thân</span>
                    <span className={cx('myInfor')}>{todos.nameParent2}</span>
                </div>
                <div className={cx('info__blockInput', 'info__blockInput-input')}>
                    <span className={cx('label-infor')}>Số điện thoại người thân</span>
                    <span className={cx('myInfor')}>{todos.phoneParent2}</span>
                </div>

                <div
                    className={cx('info__btn')}
                    onClick={() => {
                        onchange();
                    }}
                >
                    Cập nhật
                </div>
            </div>
        </div>
    );
}

export default Info;
