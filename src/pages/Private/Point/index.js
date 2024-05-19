import classNames from 'classnames/bind';
import styles from './Point.module.scss';
import PointItem from './point_item/pointItem';
const cx = classNames.bind(styles);
function ContentPoint(props) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>Bảng Điểm Sinh Viên</div>
            <PointItem />
        </div>
    );
}
export default ContentPoint;
