import classNames from 'classnames/bind';
import styles from './item.module.scss';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
function ItemMenu({ content, onClick }) {
    if (content === 'Đăng xuất') {
        return (
            <Link
                className={cx('wrapper')}
                to="/"
                onClick={() => {
                    localStorage.removeItem('studentInfor');
                }}
            >
                <span className={cx('content')}>{content}</span>
            </Link>
        );
    }
    if (content === 'Đăng ký môn') {
        return (
            <Link className={cx('wrapper')} to="/course/addcourse">
                <span className={cx('content')}>{content}</span>
            </Link>
        );
    } else {
        return (
            <Link className={cx('wrapper')} to="/calender">
                <span className={cx('content')}>{content}</span>
            </Link>
        );
    }
}

export default ItemMenu;
