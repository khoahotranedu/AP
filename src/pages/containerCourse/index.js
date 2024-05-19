import classNames from 'classnames/bind';
import styles from './containerCourse.module.scss';
import { useState } from 'react';
import BtnContainerCourse from './btnContainerCourse';
import ItemChapter from './list_chapter';

import ListStudent from './ListStudent';
const cx = classNames.bind(styles);

function ContainerCourse() {
    const [list, setList] = useState([
        {
            title: 'Khóa Học',
            active: true,
            Component: ItemChapter,
        },
        {
            title: 'Điểm số',
            active: false,
            Component: ListStudent,
        },
    ]);
    let [nameCourse] = useState(localStorage.getItem('nameCourse'));
    const [indexCmp, setIndexCmp] = useState(0);
    let Component = list[indexCmp].Component;
    const [classCourse] = useState(localStorage.getItem('classCourse'));
    const [nameGv] = useState(localStorage.getItem('nameGv'));
    const [courseID] = useState(localStorage.getItem('courseID'));

    return (
        <div className={cx('wrapper')}>
            <div className={cx('course_title')}>
                <h1>
                    {nameCourse}_{nameGv} (CQ_HK232) [{classCourse}]
                </h1>
            </div>
            <div className={cx('grid_container')}>
                {list.map((item, index) => {
                    return (
                        <BtnContainerCourse
                            key={`item.title-${index}`}
                            title={item.title}
                            active={item.active}
                            Component={item.Component}
                            onClick={() => {
                                if (!item.active) {
                                    setIndexCmp(index);
                                    let list_control = [...list];
                                    list_control.forEach((control, vt) => {
                                        if (vt !== index) {
                                            control.active = false;
                                        } else {
                                            control.active = true;
                                        }
                                    });

                                    setList(list_control);
                                }
                            }}
                        />
                    );
                })}
            </div>
            <div className={cx('container')}>
                <Component
                    list={[{ name: 'Thông báo chung', type: false, content: '', file: '', index: 0 }]}
                    courseID={courseID}
                    classCourse={classCourse}
                ></Component>
            </div>
        </div>
    );
}

export default ContainerCourse;
