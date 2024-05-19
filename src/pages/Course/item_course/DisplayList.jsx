import React, { useEffect } from 'react';
import './DisplayList.css';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { get, child, database, ref, set, remove, onValue } from '~/pages/Login';
// nameCourse: 'Lập trình nâng cao',
// nameGv: 'Nguyen Thi Lan',
// classCourse: 'L08',
const DisplayList = (props) => {
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
    let index = props.index % linkimg.length;
    let dbRef = ref(database);
    // eslint-disable-next-line
    let [listgv, setlistgv] = useState();
    let standardizeEmail = sessionStorage.getItem('standardizeEmail');
    useEffect(() => {
        onValue(
            child(dbRef, `accounts/${standardizeEmail}/courses/current/changeInfor/${props.list.courseID}`),
            (snapshot) => {
                if (snapshot.exists()) {
                    setlistgv(snapshot.val());
                }
            },
        );
    }, []);
    // eslint-disable-next-line
    let [show, setshow] = useState(false);
    let selectref = useRef();

    return (
        <>
            <Link
                to="/course/content"
                className="display"
                onClick={() => {
                    localStorage.setItem('nameCourse', props.list.nameCourse);
                    localStorage.setItem('classCourse', props.list.classCourse);
                    localStorage.setItem('nameGv', props.list.nameGv);
                    localStorage.setItem('courseID', props.list.courseID);
                }}
            >
                <div className="display-content">
                    <div className="divimgcontent">
                        <img src={linkimg[index]} className="display-img" alt="" />
                        <div className="imgcontent">{props.list.nameCourse}</div>
                    </div>

                    <div className="display-content-detail">
                        <h3>{props.list.nameCourse}</h3>
                        <p style={{ marginTop: '20px' }}>{props.list.nameGv}</p>
                        <p style={{ marginTop: '20px', fontWeight: 'bolder', color: 'blue' }}>
                            {props.list.classCourse}
                        </p>
                    </div>
                </div>
                {props.type === 'admin' && (
                    <div
                        className="blockchange"
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <div
                            className="btnchange"
                            onClick={() => {
                                setshow(!show);
                            }}
                        >
                            Sửa
                        </div>
                        <div
                            className="btnchange"
                            onClick={() => {
                                get(child(dbRef, `accounts/${standardizeEmail}/courses/current/courseInfor`)).then(
                                    (snapshot) => {
                                        if (snapshot.exists()) {
                                            let newCourseInfor = [];
                                            let deleteInfor = '';
                                            for (let i = 0; i < snapshot.size; i++) {
                                                if (i !== props.list.idx) {
                                                    newCourseInfor.push(snapshot.val()[i]);
                                                } else {
                                                    let substrings = snapshot.val()[i].split(/_(?=[A-Z]+\d+_)/);
                                                    deleteInfor = substrings[1].split('_')[0];
                                                }
                                            }
                                            set(
                                                child(
                                                    dbRef,
                                                    `accounts/${standardizeEmail}/courses/current/courseInfor`,
                                                ),
                                                newCourseInfor,
                                            );
                                            try {
                                                remove(
                                                    child(
                                                        dbRef,
                                                        `accounts/${standardizeEmail}/courses/current/changeInfor/${deleteInfor}`,
                                                    ),
                                                );
                                            } catch {
                                                console.log("can't remove");
                                            }
                                            //props.delete();
                                        }
                                    },
                                );
                            }}
                        >
                            Xóa
                        </div>
                    </div>
                )}
            </Link>
            {props.type === 'admin' && show && (
                <div className="change">
                    <div className="change-content">
                        <span className="title-content">Môn học</span>: {props.list.nameCourse}
                    </div>
                    <div className="change-content">
                        <span className="title-content">Mã lớp</span>: {props.list.classCourse}
                    </div>
                    <div className="change-content">
                        <span className="title-content">Giáo viên</span>
                        <span>: </span>
                        <select ref={selectref}>
                            <option value="" key="0">
                                Chọn tên giáo viên khác
                            </option>
                            {listgv.map((item, index) => {
                                return (
                                    <option value={item} key={index + 1}>
                                        {item}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="blockchange blockchange-control ">
                        <div
                            className="btnchange"
                            onClick={() => {
                                let name = selectref.current.options[selectref.current.selectedIndex].value;
                                if (name.length > 0) {
                                    set(
                                        child(
                                            dbRef,
                                            `accounts/${standardizeEmail}/courses/current/courseInfor/${props.list.idx}`,
                                        ),
                                        props.list.nameCourse +
                                            '_' +
                                            props.list.courseID +
                                            '_' +
                                            props.list.classCourse +
                                            '_' +
                                            name,
                                    );
                                    setshow(!show);
                                } else {
                                    alert('Please select option');
                                }
                            }}
                        >
                            Save
                        </div>
                        <div
                            className="btnchange"
                            onClick={() => {
                                selectref.current.selectedIndex = 0;
                                setshow(!show);
                            }}
                        >
                            Hủy
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default memo(DisplayList);
