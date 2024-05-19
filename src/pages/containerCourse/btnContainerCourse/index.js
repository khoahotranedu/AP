import classNames from 'classnames/bind';
import styles from './btn.module.scss';
const cx = classNames.bind(styles);

function BtnContainerCourse({ title, active, onClick }) {
    const classes = cx('grid_btn', {
        active,
    });
    return (
        <button className={classes} onClick={onClick}>
            {title}
        </button>
    );
}

export default BtnContainerCourse;
