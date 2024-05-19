import classNames from 'classnames/bind';
import styles from './semester_container.module.scss';
const cx = classNames.bind(styles);
function Point_course({ Ma_MH, Ten_MH, Nhom_MH, TinChi_MH, Diem_MH, DiemCK_MH, DiemTk_MH }) {
    return (
        <ul className={cx('header')}>
            <li className={cx('Ma_MH', 'MH_item')}>{Ma_MH}</li>
            <li className={cx('Ten_MH', 'MH_item')}>{Ten_MH}</li>
            <li className={cx('Nhom_MH', 'MH_item')}>{Nhom_MH}</li>
            <li className={cx('TinChi_MH', 'MH_item')}>{TinChi_MH}</li>
            <li className={cx('Diem_MH', 'MH_item')}>{Diem_MH}</li>
            <li className={cx('DiemCK_MH', 'MH_item')}>{DiemCK_MH}</li>
            <li className={cx('DiemTk_MH', 'MH_item')}>{DiemTk_MH}</li>
        </ul>
    );
}

export default Point_course;
