import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
import { DefaultLayout, UploadLayout } from './Components';

function App() {
    let isLoggedIn = !!sessionStorage.getItem('login');
    return (
        <Router>
            <div className="app">
                <Routes>
                {publicRoutes.map((route, index) => {
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = UploadLayout;
                        } else {
                            Layout = DefaultLayout;
                        }
                        const Page = route.component;
                        let Active = route.Active;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout Active={Active}>
                                        <Page />
                                    </Layout>
                                }

                            />
                        );
                    })
                    }

                    {isLoggedIn && privateRoutes.map((route, index) => {
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = UploadLayout;
                        } else {
                            Layout = DefaultLayout;
                        }
                        const Page = route.component;
                        let Active = route.Active;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout Active={Active}>
                                        <Page />
                                    </Layout>
                                }

                            />
                        );
                    })
                    }
                </Routes>
                {!isLoggedIn && (<Navigate to = "/"/>)}
            </div>
        </Router >
    );
}

export default App;
