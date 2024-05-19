import classNames from 'classnames/bind';
import styles from './point_item.module.scss';
import Semester__body from '../semester_container';
import Footer_Semester_Point from './footer_semester_item';
import { useState, useEffect } from 'react';
import { database, ref, child, get } from '~/pages/Login';

const cx = classNames.bind(styles);
function PointItem() {
    const [show, setshow] = useState(false);
    const dbRef = ref(database);
    const [courses, setCourses] = useState([]);
    const [time, setTime] = useState([]);
    useEffect(() => {
        const fetchData = () => {
            let standardizeEmail = sessionStorage.getItem('standardizeEmail');
            get(child(dbRef, `accounts/${standardizeEmail}/score/semester`)).then((snapshot) => {
                if (snapshot.exists()) {
                    let semesterArray = [];
                    let timeOfSemester = [];
                    for (let i = 0; i < snapshot.size; i++) {
                        const newCourses = [];
                        for (let j = 0; j < snapshot.child(`${i}/Ten_MH`).size; j++) {
                            newCourses.push({
                                Ma_MH: snapshot.child(`${i}/Ma_MH`).val()[j],
                                Ten_MH: snapshot.child(`${i}/Ten_MH`).val()[j],
                                Nhom_MH: snapshot.child(`${i}/Nhom_MH`).val()[j],
                                TinChi_MH: snapshot.child(`${i}/Tinchi_MH`).val()[j],
                                Diem_MH: snapshot.child(`${i}/Diem_MH`).val()[j],
                                DiemCK_MH: snapshot.child(`${i}/DiemCK_MH`).val()[j],
                                DiemTk_MH: snapshot.child(`${i}/DiemTK_MH`).val()[j]
                            });
                        }
                        semesterArray.push(newCourses);
                        timeOfSemester.push(snapshot.child(`${i}/time`).val())
                    }
                    
                    setCourses(semesterArray);
                    setTime(timeOfSemester);
                    setshow(true);
                }
            });
        };

        fetchData();
    }, []);
    let fullnumber = 0;
    let fulldiemtb = 0;
    return (
        <>
            {courses.map((semester, index) => {
                let newfull = fullnumber * fulldiemtb;
                fullnumber = semester.reduce((result, course) => {
                    return result + Number(course.TinChi_MH);
                }, fullnumber);
                let semesternumber = semester.reduce((result, course) => {
                    return result + Number(course.TinChi_MH);
                }, 0);
                let diemtbhk = (
                    parseFloat(
                        semester.reduce((result, course) => {
                            return result + Number(course.TinChi_MH) * Number(course.DiemTk_MH);
                        }, 0),
                    ) / parseFloat(semesternumber)
                ).toFixed(1);
                fulldiemtb = (parseFloat(newfull + diemtbhk * semesternumber) / fullnumber).toFixed(1);
                return (
                    <div key={index}>
                        <div className={cx('point__body')}>
                            {show && (
                                <div className={cx('block__semester')}>
                                    <div className={cx('semester__header')}>
                                        <h3>Học kỳ {index + 1}</h3>
                                        <span className={cx('time-Upload')}>
                                            Ngày cập nhật điểm các môn học: {time[index]}
                                        </span>
                                    </div>
                                    {
                                        <>
                                            {
                                                // eslint-disable-next-line
                                                <Semester__body list={semester} />
                                            }
                                            {
                                                // eslint-disable-next-line
                                                <Footer_Semester_Point
                                                    fullnumber={fullnumber}
                                                    semesternumber={semesternumber}
                                                    diemtbhk={diemtbhk}
                                                    fulldiemtb={fulldiemtb}
                                                />
                                            }
                                        </>
                                    }
                                </div>
                            )}
                            {!show && (
                                <div className={cx('loadding')}>
                                    <div className={cx('loadding-icon')}>
                                        <i className={cx('iconload', 'fa-solid', 'fa-spinner')}></i>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
}
export default PointItem;
