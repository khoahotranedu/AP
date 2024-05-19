import classNames from 'classnames/bind';
import styles from './item_course.module.scss';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
function ItemCourse({ nameCourse, nameGv, classCourse, courseID, index, semester = false }) {
    const linkimg = [
        'https://i.pinimg.com/originals/2f/60/6a/2f606ad14bf9171e5f41b42a01b4441f.jpg',
        'https://inngochuong.com/uploads/images/mau-san-pham/mau-backgroud-dep-don-gian/them/backgroud-dep-phong-nen-mau-go-sang.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr3STMDTl5_mrX6BeS-dGCKrd9J_-qrZar-Q&usqp=CAU',
        'https://intoroigiare.vn/wp-content/uploads/2023/11/background-mau-trang.jpg',
        'https://ngoisaogiadinh.vn/wp-content/uploads/Background-bau-troi-ve-bang-mau-nuoc-dep-1024x683.jpg',
        'https://gcs.tripi.vn/public-tripi/tripi-feed/img/474112oiJ/background-hoa-la-dep_024122907.jpg',
        'https://images.fpt.shop/unsafe/filters:quality(5)/fptshop.com.vn/uploads/images/tin-tuc/176406/Originals/glenn-carstens-peters-IMRuLuNnFw4-unsplash.jpg',
        'https://intoroigiare.vn/wp-content/uploads/2023/11/powerpoint-background-dep.jpg',
        'https://getdrive.net/wp-content/uploads/2020/03/Powerpoint-la-mot-cong-cu-thuyet-trinh-tien-loi-hieu-qua.jpg',
        'https://img4.thuthuatphanmem.vn/uploads/2020/07/30/background-may-xanh-khai-giang-cuc-dep_024037540.jpg',
    ];
    let Index = index % linkimg.length;
    let content = `${nameCourse} (${classCourse})__${nameGv}`;
    // if (semester) {
    //     content;
    // }

    return (
        <Link
            to="/course/content"
            className={cx('wraper')}
            onClick={() => {
                localStorage.setItem('nameCourse', nameCourse);
                localStorage.setItem('classCourse', classCourse);
                localStorage.setItem('nameGv', nameGv);
                localStorage.setItem('courseID', courseID);
            }}
        >
            {!semester && (
                <div className={cx('img')}>
                    <img src={linkimg[Index]} alt="loi anh" className={cx('background_img')} />
                    <div className={cx('content__img')}>{nameCourse}</div>
                </div>
            )}

            {!semester && <div className={cx('body')}>{content} </div>}
        </Link>
    );
}

export default memo(ItemCourse);
