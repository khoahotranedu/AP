import classNames from 'classnames/bind';
import styles from './item_mess.module.scss';
const cx = classNames.bind(styles);
function ContactIteam({ name, content, day, time }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>{day}</div>
            <div className={cx('body')}>
                <div className={cx('contact')}>
                    <img
                        src="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                        alt="avatar"
                        className={cx('avatar')}
                    />
                    <div className={cx('name')}>{name}</div>
                    <div className={cx('time')}>{time}</div>
                </div>
                <div className={cx('content')}>{content}</div>
                <div className={cx('arrow_left')}></div>
            </div>
        </div>
    );
}

export default ContactIteam;
