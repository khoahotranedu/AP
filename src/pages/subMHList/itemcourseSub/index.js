import classNames from 'classnames/bind';
import styles from '../subMHList.module.scss';
const cx = classNames.bind(styles);
function ItemListsub({
    stt,
    subjectId,
    subjectName,
    classId,
    maxStudents,
    credit,
    numberStudents,
    teacher,
    schedule,
    week,
    onclick,
}) {
    return (
        <tr className={cx('row')}>
            <td className={cx('ordinary-num')}>{stt}</td>
            <td className={cx('subject')}>
                {subjectId} <br /> {subjectName}
            </td>
            <td className={cx('classId')}>{classId} </td>
            <td className={cx('credit')}>{credit}</td>
            <td className={cx('num')}>
                {numberStudents && (
                    <span>
                        {numberStudents}/{maxStudents}
                    </span>
                )}
            </td>
            <td className={cx('teacher')}>{teacher}</td>
            <td className={cx('schedule')}>{schedule.string}</td>
            <td className={cx('week')}>{week}</td>
            <td className={cx('delete')} onClick={onclick}>
                <i className={cx('fa-solid', 'fa-trash')}></i>
            </td>
        </tr>
    );
}

export default ItemListsub;
