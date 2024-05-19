import classNames from 'classnames/bind';
import styles from './account.module.scss';
const cx = classNames.bind(styles);
function Account({ link, name, username }) {
    return (
        <div className={cx('wrapper')}>
            <img src={link} alt="" className={cx('avatar')} />
            <div className={cx('info')}>
                <h4 className={cx('name')}>{name}</h4>
                <span className={cx('username')}>{username}</span>
            </div>
        </div>
    );
}

export default Account;
