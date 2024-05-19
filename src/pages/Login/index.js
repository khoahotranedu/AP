import classNames from 'classnames/bind';
import styles from './Login.module.scss';

import nen from 'src/img/imgvan.png'; // with import
import logo from 'src/img/def.png'; // with import

import { Link, useNavigate } from 'react-router-dom';
import { UseStore } from '~/Store';
import { action } from '~/Store';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import { useRef, useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { getDatabase, ref, child, get } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js';
import App from '~/App';

const firebaseConfig = {
    apiKey: 'AIzaSyDVOS3lgpZ4gKS_XVuvhPJKZ1eqKxPuQVA',
    authDomain: 'login-bkel.firebaseapp.com',
    databaseURL: 'https://login-bkel-default-rtdb.firebaseio.com',
    projectId: 'login-bkel',
    storageBucket: 'login-bkel.appspot.com',
    messagingSenderId: '343764821189',
    appId: '1:343764821189:web:0ad1c5fda89b7366a1fcac',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);
const storage = getStorage(app);
const cx = classNames.bind(styles);
function Login() {
    // eslint-disable-next-line
    let [state, dispatch] = UseStore();
    let messerroref = useRef();
    let [show, setshow] = useState(false);
    const navigate = useNavigate();

    let handlelogin = (e) => {
        e.preventDefault();
        let email = document.getElementById('login_email').value;
        let password = document.getElementById('login_password').value;
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                const dbRef = ref(database);
                let standardizeEmail = email.replace(/[^\w\s]/gi, '');
                get(child(dbRef, `accounts/${standardizeEmail}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        var inforStudent;
                        if (snapshot.child('infor/job').val() !== 'admin') {
                            inforStudent = {
                                job: snapshot.child('infor/job').val(),
                                nameCard: snapshot.child('infor/nameCard').val(),
                                id: snapshot.child('infor/id').val(),
                                name: snapshot.child('infor/name').val(),
                                phone: snapshot.child('infor/phone').val(),
                                address: snapshot.child('infor/address').val(),
                                email: snapshot.child('infor/email').val(),
                                birthday: snapshot.child('infor/birthday').val(),
                                born: snapshot.child('infor/born').val(),
                                gender: snapshot.child('infor/gender').val(),
                                nameParent1: snapshot.child('infor/nameParent1').val(),
                                nameParent2: snapshot.child('infor/nameParent2').val(),
                                phoneParent1: snapshot.child('infor/phoneParent1').val(),
                                phoneParent2: snapshot.child('infor/phoneParent2').val(),
                                socialNetwork: snapshot.child('infor/socialNetwork').val(),
                                degree: snapshot.child('infor/degree').val(),
                            };
                        } else {
                            inforStudent = {
                                job: snapshot.child('infor/job').val(),
                            };
                        }

                        setshow(false);
                        dispatch(action.set_initstate(inforStudent));
                        localStorage.removeItem('studentInfor');
                        localStorage.setItem('studentInfor', JSON.stringify(inforStudent));
                        sessionStorage.setItem('standardizeEmail', standardizeEmail);
                        sessionStorage.setItem('login', true);
                        App();
                        navigate('/Home');
                        window.location.reload();
                        console.log(sessionStorage.getItem('standardizeEmail'))
                    }
                });
            })
            .catch(() => {
                setshow(true);
            });
    };
    return (
        <div
            style={{
                backgroundImage: `url(${nen})`,
            }}
            className={cx('modul')}
        >
            <form className={cx('login')}>
                <div className={cx('login__header')}>
                    <img className={cx('login__header-img')} src={logo} alt="" />
                </div>

                <div className={cx('login__body')}>
                    <div className={cx('login__title')}>Đăng Nhập</div>
                    <ul className={cx('login__body-list')}>
                        <li className={cx('login__body-list-item')}>
                            <div className={cx('icon__login')}>
                                <i className={cx('fa-solid', 'fa-user')}></i>
                            </div>
                            <input
                                type="text"
                                onChange={() => {
                                    setshow(false);
                                }}
                                onKeyUp={(e) => {
                                    if (e.which === 13) {
                                        handlelogin(e);
                                    }
                                }}
                                id="login_email"
                                className={cx('login__input')}
                                placeholder="Email trường"
                                required
                            />
                        </li>
                        <li className={cx('login__body-list-item')}>
                            <div className={cx('icon__login')}>
                                <i className={cx('fa-solid', 'fa-lock')}></i>
                            </div>
                            <input
                                type="password"
                                onChange={() => {
                                    setshow(false);
                                }}
                                onKeyUp={(e) => {
                                    if (e.which === 13) {
                                        handlelogin(e);
                                    }
                                }}
                                className={cx('login__input')}
                                placeholder="Mật khẩu"
                                required
                                id="login_password"
                            />
                        </li>
                    </ul>
                </div>
                {show && (
                    <p className={cx('err_message')} id="error" ref={messerroref}>
                        Sai tên đăng nhập hoặc mật khẩu.
                    </p>
                )}
                <Link to="/Home" className={cx('login__footer')} onClick={handlelogin}>
                    Đăng Nhập
                </Link>
            </form>
        </div>
    );
}

export default Login;
export { database, storage, auth };
export {
    getDatabase,
    ref,
    child,
    get,
    update,
    set,
    onValue,
    remove
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js';
export {
    ref as ref_firestore,
    uploadBytes,
    getDownloadURL,
    listAll,
    deleteObject,
} from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js';
export { signOut } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
