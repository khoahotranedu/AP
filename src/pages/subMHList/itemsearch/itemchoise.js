import classNames from 'classnames/bind';
import styles from '../subMHList.module.scss';

const cx = classNames.bind(styles);
function Itemchoise({ classId, credit, numberStudents, maxStudents, teacher, schedule, week, onsave, ondelete, type }) {
    return (
        <div className={cx('search__item-hidden')}>
            <ul className={cx('search__item-hidden-detail')}>
                <li className={cx('search__item-hidden-detail-classId')}>{classId}</li>
                <li className={cx('search__item-hidden-detail-credit')}>{credit}</li>

                <li className={cx('search__item-hidden-detail-num')}>
                    {numberStudents}/{maxStudents}
                </li>
                <li className={cx('search__item-hidden-detail-teacher')}>{teacher}</li>
                <li className={cx('search__item-hidden-detail-time')}>{schedule.string}</li>
                <li className={cx('search__item-hidden-detail-week')}>{week}</li>
                <li className={cx('search__item-hidden-detail-select')}>
                    {type !== 'admin' && (
                        <div className={cx('search__item-hidden-btn')} onClick={onsave}>
                            Chọn
                        </div>
                    )}
                    {type === 'admin' && (
                        <div className={cx('search__item-hidden-btn')} onClick={ondelete}>
                            Xóa
                        </div>
                    )}
                </li>
            </ul>
        </div>
    );
}

export default Itemchoise;
