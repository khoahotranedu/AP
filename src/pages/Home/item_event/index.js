import classNames from 'classnames/bind';
import styles from './item_event.module.scss';
const cx = classNames.bind(styles);
function CardItem({ linkimg, title, time, summary, linkto }) {
    return (
        <div className={cx('card')}>
            <img className={cx('card-img')} src={linkimg} alt="anh sự kiện" />
            <div className={cx('info')}>
                <div className={cx('maininfo')}>
                    <h3 className={cx('maininfo_title')}>{title}</h3>
                    <span className={cx('maininfo_time')}>{time}</span>
                    <div className={cx('maininfo_content')}>{summary}</div>
                    <div className={cx('footer')}>
                        <a href={linkto} className={cx('button')}>
                            Thông tin
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardItem;
