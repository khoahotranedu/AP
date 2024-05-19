import classNames from 'classnames/bind';
import styles from './notify.module.scss';
const cx = classNames.bind(styles);
function NotifyItem({ title, time, active }) {
    return (
        <div className={cx('body-item', { active })}>
            <div className={cx('content')}>{title}</div>
            <div className={cx('viewer')}>
                <div className={cx('viewer-time')}>{time}</div>
            </div>
        </div>
    );
}

export default NotifyItem;
